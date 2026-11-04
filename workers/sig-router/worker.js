/**
 * sig.capte.co — email signature banner router (Cloudflare Worker)
 *
 * Every Capte email signature requests the same two fixed URLs:
 *   GET /banner.png?o={la|fr|nl}  -> 302 to the active banner image (Webflow CDN)
 *   GET /go?o={la|fr|nl}          -> 302 to the active campaign link, with UTM tags
 *
 * Content comes from the published (live) items of the Webflow CMS collection
 * "Signature Campaigns". Publishing an item in Webflow is the approval step.
 *
 * Also available for QA:
 *   GET /status?o={code}          -> JSON describing what each URL would return now
 *
 * Setup (Cloudflare dashboard > this Worker > Settings > Variables and Secrets):
 *   WEBFLOW_TOKEN  (Secret, required)   Webflow site API token, scope "CMS: Read-only"
 *   BANNERS_MODE   (Text, optional)     "off" = rollback: transparent banner, links go to capte.co
 *
 * Privacy: this Worker never logs or stores IP addresses, user agents or any
 * per-recipient data. Clicks are measured only with UTM tags.
 */

// ---------------------------------------------------------------------------
// Configuration. These IDs come from the Webflow collection "Signature
// Campaigns" (checked 2026-11-04). Update them only if the collection changes.
// ---------------------------------------------------------------------------
const CONFIG = {
  collectionId: "6ae3d41f97ff9b75333f6dfa",

  // Office code used in the signature URL -> Webflow "Target Office" option ID.
  offices: {
    la: "037d99e414133da1aa46ad93c666d80c", // Los Angeles (US)
    fr: "317372782c4c8652929541cacccac261", // Versailles (FR)
    nl: "82901895adad04d1c6ab18052b921120", // Amsterdam (NL)
  },
  allOfficesOptionId: "d29a9e4f2adc4a8d35be002ac81a9fe8", // All Offices

  // Webflow field slugs.
  fields: {
    image: "banner-image-2x-retina",
    link: "destination-url",
    office: "target-office",
    campaign: "utm-campaign-slug",
    start: "start-date",
    end: "end-date",
    active: "is-active",
    evergreen: "is-evergreen-fallback",
  },

  // /go only redirects to these hosts. Anything else falls back to the home page.
  allowedLinkHosts: ["capte.co", "www.capte.co"],
  homeUrl: "https://www.capte.co/",

  bannerMaxAge: 300, // seconds a client or mail proxy may cache the /banner.png redirect
  cmsCacheSeconds: 300, // how long a Webflow API response is reused before refreshing
  cmsStaleSeconds: 86400, // how long the last good response is kept if Webflow is unreachable
  retryAfterFailureSeconds: 30, // back-off after a failed Webflow call
  webflowTimeoutMs: 4000,
};

const WEBFLOW_API = "https://api.webflow.com/v2";

// 1x1 transparent GIF, served when there is no banner to show.
const TRANSPARENT_GIF = Uint8Array.from(
  atob("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"),
  (c) => c.charCodeAt(0)
);

// In-memory copy of the last good CMS response, per Worker instance.
let memoryCache = null; // { fetchedAt: ms, items: [...] }
let lastFailureAt = 0; // after a failed Webflow call, wait before trying again

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const code = normalizeOffice(url.searchParams.get("o"));
    const off = String(env.BANNERS_MODE || "").toLowerCase() === "off";

    if (path === "/banner.png") return handleBanner(code, env, ctx, off);
    if (path === "/go") return handleGo(code, env, ctx, off);
    if (path === "/status") return handleStatus(code, env, ctx, off);
    if (path === "/") return redirect(CONFIG.homeUrl, "no-store");
    return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  },
};

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

async function handleBanner(code, env, ctx, off) {
  const cacheControl = `public, max-age=${CONFIG.bannerMaxAge}`;
  if (off) return transparentGif(cacheControl);

  const pick = await pickBanner(code, env, ctx);
  const imageUrl = pick && safeImageUrl(pick.fieldData[CONFIG.fields.image]?.url);
  if (!imageUrl) return transparentGif(cacheControl);
  return redirect(imageUrl, cacheControl);
}

async function handleGo(code, env, ctx, off) {
  if (off) return redirect(CONFIG.homeUrl, "no-store");
  const pick = await pickBanner(code, env, ctx);
  return redirect(buildLink(pick, code), "no-store");
}

async function handleStatus(code, env, ctx, off) {
  const pick = off ? null : await pickBanner(code, env, ctx);
  const body = {
    office: code || "(unknown or missing: default only)",
    mode: off ? "off (rollback)" : "on",
    cms: memoryCache ? { itemsLive: memoryCache.items.length, fetchedAt: new Date(memoryCache.fetchedAt).toISOString() } : "unavailable",
    banner: pick
      ? {
          item: pick.fieldData.name,
          reason: pick._reason,
          image: safeImageUrl(pick.fieldData[CONFIG.fields.image]?.url) || "(no valid image: transparent pixel)",
          link: buildLink(pick, code),
        }
      : { item: null, image: "(transparent pixel)", link: off ? CONFIG.homeUrl : buildLink(null, code) },
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

// ---------------------------------------------------------------------------
// Selection
//
// 1. Campaigns: live items with "Is Active?" on, not marked evergreen, whose
//    Start date has passed (or is empty) and End date has not (or is empty),
//    targeted at this office or All Offices. The latest Start date wins; on a
//    tie, an office-specific item beats an All Offices item.
// 2. Otherwise the evergreen fallback: active evergreen item for this office,
//    then one for All Offices.
// 3. Otherwise nothing (transparent pixel, link to capte.co).
//
// An unknown or missing office code only ever gets the All Offices evergreen.
// ---------------------------------------------------------------------------

async function pickBanner(code, env, ctx) {
  const items = await getLiveItems(env, ctx);
  if (!items) return null;
  return selectBanner(items, code, Date.now());
}

function selectBanner(items, code, now) {
  const f = CONFIG.fields;
  const officeId = code ? CONFIG.offices[code] : null;
  const allId = CONFIG.allOfficesOptionId;

  const active = items.filter((it) => it && it.fieldData && it.fieldData[f.active] === true && !it.isArchived);
  const targets = (it, id) => id && it.fieldData[f.office] === id;

  if (officeId) {
    const campaigns = active
      .filter((it) => it.fieldData[f.evergreen] !== true)
      .filter((it) => targets(it, officeId) || targets(it, allId))
      .filter((it) => inWindow(it, now));
    campaigns.sort((a, b) => {
      const d = startMs(b) - startMs(a);
      if (d !== 0) return d;
      return (targets(b, officeId) ? 1 : 0) - (targets(a, officeId) ? 1 : 0);
    });
    if (campaigns[0]) return tag(campaigns[0], "campaign");
  }

  const evergreen = active.filter((it) => it.fieldData[f.evergreen] === true);
  const own = officeId && evergreen.find((it) => targets(it, officeId));
  if (own) return tag(own, "evergreen (office)");
  const shared = evergreen.find((it) => targets(it, allId));
  if (shared) return tag(shared, "evergreen (all offices)");
  return null;
}

function inWindow(it, now) {
  const start = parseDate(it.fieldData[CONFIG.fields.start]);
  const end = parseDate(it.fieldData[CONFIG.fields.end]);
  if (start !== null && start > now) return false;
  if (end !== null && end <= now) return false;
  return true;
}

function startMs(it) {
  return parseDate(it.fieldData[CONFIG.fields.start]) ?? 0;
}

function parseDate(v) {
  if (!v) return null;
  const t = Date.parse(v);
  return Number.isNaN(t) ? null : t;
}

function tag(item, reason) {
  return { ...item, _reason: reason };
}

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

function buildLink(pick, code) {
  let target;
  try {
    const raw = pick && pick.fieldData[CONFIG.fields.link];
    target = new URL(raw);
    if (target.protocol !== "https:" || !CONFIG.allowedLinkHosts.includes(target.hostname)) target = null;
  } catch {
    target = null;
  }
  if (!target) target = new URL(CONFIG.homeUrl);

  const campaign = slugify(pick && pick.fieldData[CONFIG.fields.campaign]) || (pick ? "evergreen" : "default");
  target.searchParams.set("utm_source", "email-signature");
  target.searchParams.set("utm_medium", "email");
  target.searchParams.set("utm_campaign", campaign);
  target.searchParams.set("utm_content", `office-${code || "unknown"}`);
  return target.toString();
}

function slugify(v) {
  if (!v) return "";
  return String(v).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function safeImageUrl(v) {
  try {
    const u = new URL(v);
    return u.protocol === "https:" ? u.toString() : null;
  } catch {
    return null;
  }
}

function normalizeOffice(v) {
  const c = String(v || "").toLowerCase().trim();
  return Object.prototype.hasOwnProperty.call(CONFIG.offices, c) ? c : null;
}

// ---------------------------------------------------------------------------
// Webflow CMS (live items only), cached in memory and in Cloudflare's cache
// ---------------------------------------------------------------------------

async function getLiveItems(env, ctx) {
  const now = Date.now();
  const freshFor = CONFIG.cmsCacheSeconds * 1000;
  const staleFor = CONFIG.cmsStaleSeconds * 1000;

  if (memoryCache && now - memoryCache.fetchedAt < freshFor) return memoryCache.items;

  const cacheKey = new Request(`https://sig-cache.internal/cms/${CONFIG.collectionId}`);
  const edge = typeof caches !== "undefined" ? caches.default : null;

  if (edge) {
    try {
      const hit = await edge.match(cacheKey);
      if (hit) {
        const cached = await hit.json();
        if (now - cached.fetchedAt < freshFor) {
          memoryCache = cached;
          return cached.items;
        }
        if (!memoryCache || cached.fetchedAt > memoryCache.fetchedAt) memoryCache = cached;
      }
    } catch {
      // Cache read problems are not fatal.
    }
  }

  const useStale = () => (memoryCache && now - memoryCache.fetchedAt < staleFor ? memoryCache.items : null);
  if (now - lastFailureAt < CONFIG.retryAfterFailureSeconds * 1000) return useStale();

  try {
    const items = await fetchLiveItems(env);
    memoryCache = { fetchedAt: now, items };
    if (edge) {
      const res = new Response(JSON.stringify(memoryCache), {
        headers: { "Content-Type": "application/json", "Cache-Control": `max-age=${CONFIG.cmsStaleSeconds}` },
      });
      const put = edge.put(cacheKey, res).catch(() => {});
      if (ctx && typeof ctx.waitUntil === "function") ctx.waitUntil(put);
    }
    return items;
  } catch (err) {
    lastFailureAt = now;
    console.error(`Webflow CMS fetch failed: ${err && err.message}`);
    return useStale();
  }
}

async function fetchLiveItems(env) {
  if (!env.WEBFLOW_TOKEN) throw new Error("WEBFLOW_TOKEN secret is not set");
  const items = [];
  let offset = 0;
  for (let page = 0; page < 10; page++) {
    const res = await fetchWithTimeout(
      `${WEBFLOW_API}/collections/${CONFIG.collectionId}/items/live?limit=100&offset=${offset}`,
      { headers: { Authorization: `Bearer ${env.WEBFLOW_TOKEN}`, Accept: "application/json" } },
      CONFIG.webflowTimeoutMs
    );
    if (!res.ok) throw new Error(`Webflow API responded ${res.status}`);
    const data = await res.json();
    const batch = Array.isArray(data.items) ? data.items : [];
    items.push(...batch);
    const total = data.pagination && typeof data.pagination.total === "number" ? data.pagination.total : items.length;
    offset += batch.length;
    if (batch.length === 0 || offset >= total) break;
  }
  return items;
}

async function fetchWithTimeout(url, init, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Responses
// ---------------------------------------------------------------------------

function redirect(location, cacheControl) {
  // Always a temporary (302) redirect, so mail proxies don't keep an old banner.
  return new Response(null, { status: 302, headers: { Location: location, "Cache-Control": cacheControl } });
}

function transparentGif(cacheControl) {
  return new Response(TRANSPARENT_GIF, {
    status: 200,
    headers: { "Content-Type": "image/gif", "Cache-Control": cacheControl },
  });
}
