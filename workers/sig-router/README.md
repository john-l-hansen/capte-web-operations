# Dynamic Email Signature Banner Router (`sig.capte.co`)

> **Domain**: `sig.capte.co`  
> **Infrastructure**: Cloudflare Workers (`sig-capte`) + Webflow CMS (`Signature Campaigns`)  
> **Status**: Deployed & Live  
> **Lead Authority**: John Hansen ([john@capte.co](mailto:john@capte.co)) — Lead Web/Print Designer & Web Operations  

`sig.capte.co` is a lightweight, edge-cached Cloudflare Worker serving dynamic marketing banners and click-through attribution for Capte email signatures. Every company email signature links to two static URLs on `sig.capte.co`. Marketing schedules and updates banners by publishing directly in Webflow CMS—no employee needs to reinstall or update their email signature.

---

## 1. System Architecture & Request Lifecycle

```text
Email Signature (Installed in Outlook / Apple Mail)
  │
  ├── 1. Image Request: <img src="https://sig.capte.co/banner.png?o={office}">
  │      └── sig.capte.co Worker (In-memory / Cloudflare Cache)
  │             ├── Active Campaign ──(302 Redirect)──> Webflow CDN Asset (600×160)
  │             └── No Active Item  ──(200 OK)────────> 1×1 Transparent GIF
  │
  └── 2. Click Request: <a href="https://sig.capte.co/go?o={office}">
         └── sig.capte.co Worker
                └── Injects UTM tags ──(302 Redirect)──> https://capte.co/...
```

---

## 2. Live Endpoints

| Endpoint | Method | Response / Behavior | Cache-Control |
| :--- | :--- | :--- | :--- |
| **`/banner.png`** | `GET`, `HEAD` | `302` redirect to selected campaign banner on Webflow CDN. If no banner is active, returns `200` with a 1×1 transparent GIF. | `public, max-age=300` |
| **`/go`** | `GET`, `HEAD` | `302` redirect to selected item's destination URL with injected UTM parameters. Defaults to `https://www.capte.co/`. | `no-store` |
| **`/status`** | `GET`, `HEAD` | Diagnostic JSON describing currently selected banner, CMS cache state, and mode. (No secrets exposed). | `no-store` |
| **`/`** | `GET`, `HEAD` | `302` redirect to `https://www.capte.co/`. | `no-store` |
| Anything else | Any | `404 Not Found` (non-GET/HEAD methods return `405 Method Not Allowed`). | `no-store` |

### Office Codes (`?o=...`)
Supported office query codes (case-insensitive):
- `la` — Los Angeles (US)
- `fr` — Versailles (FR)
- `nl` — Amsterdam (NL)

*Note: Missing or unrecognized office codes automatically fall back to the All Offices evergreen banner.*

### Security & Redirect Safeguards
- **Open-Redirect Protection**: Destination URLs are strictly validated against `capte.co` and `www.capte.co`. Any external or untrusted URL defaults safely to `https://www.capte.co/`.
- **Cache Invalidation**: Redirects use HTTP `302 Found` (never `301 Moved Permanently`) so mail proxies and browser caches do not lock onto outdated banners.
- **UTM Injection**: The `/go` endpoint appends:
  - `utm_source=email-signature`
  - `utm_medium=email`
  - `utm_campaign={utm-campaign-slug}` (or `evergreen` / `default`)
  - `utm_content=office-{code}`

---

## 3. Banner Selection Logic

The Worker queries the live items of the Webflow CMS collection "Signature Campaigns":

1. **Active Campaigns**:
   - Filter: `is-active == true`, `is-evergreen-fallback == false`, within date window (`start-date` passed or empty, `end-date` future or empty).
   - Target: Matching the requested office or **All Offices**.
   - Precedence: Latest `start-date` wins. On a tie, office-specific items take priority over All Offices.
2. **Evergreen Fallback**:
   - If no campaign is active, selects the active evergreen item for that office.
   - If none, selects the All Offices active evergreen item.
3. **Fail-Closed Default**:
   - If no valid items exist, returns the 1×1 transparent GIF (200) and links to `capte.co`.

*Publishing an item in Webflow is the official approval step. Draft items are never queried.*

---

## 4. Webflow CMS Schema: "Signature Campaigns"

- **Collection ID**: `6ae3d41f97ff9b75333f6dfa`
- **Site ID**: `64f08f1a9f74ffb5762d6891`

| Field Slug | Type | Description |
| :--- | :--- | :--- |
| `name` | Plain text | Campaign title (internal reference) |
| `banner-image-2x-retina` | Image | Exactly 600 × 160 px (rendered at 300 × 80 px in email). Max 60 KB, solid background. |
| `destination-url` | Link | Target page on `capte.co`. Do not add UTM parameters manually (the Worker injects them). |
| `target-office` | Option | - All Offices: `d29a9e4f2adc4a8d35be002ac81a9fe8`<br>- Los Angeles (US): `037d99e414133da1aa46ad93c666d80c`<br>- Versailles (FR): `317372782c4c8652929541cacccac261`<br>- Amsterdam (NL): `82901895adad04d1c6ab18052b921120` |
| `utm-campaign-slug` | Plain text | URL slug (e.g. `apta-2026`). Appended as `utm_campaign`. |
| `image-alt-text` | Plain text | Editorial reference. (Client-side alt text is fixed per office in the signature template). |
| `start-date` | Date/time | Campaign start. Empty = starts immediately upon publishing. |
| `end-date` | Date/time | Campaign expiration. Empty = runs until replaced. |
| `is-active` | Switch | Master activation toggle. |
| `is-evergreen-fallback` | Switch | Designates item as an evergreen fallback when no scheduled campaign is live. |

---

## 5. Cloudflare Worker Setup & Environment

The Worker is deployed as `sig-capte` under the Cloudflare account managing `capte.co`.

### Variables & Secrets
- **`WEBFLOW_TOKEN`** (*Secret, Required*): Webflow Site API token with **CMS: Read-only** permissions.
- **`BANNERS_MODE`** (*Text, Optional*): Set to `off` to trigger the master rollback switch. In rollback mode, `/banner.png` returns the transparent GIF and `/go` links directly to `capte.co`.

### Caching & Reliability Architecture
- **Multi-Tier Cache**: Webflow CMS responses are cached in Worker memory and the Cloudflare Edge Cache API (`caches.default`) for 5 minutes (`cmsCacheSeconds: 300`).
- **Graceful Stale Fallback**: If Webflow's API is unreachable, the Worker serves the last good CMS response for up to 24 hours (`cmsStaleSeconds: 86400`).
- **Failure Back-Off**: If a call to Webflow fails, subsequent requests serve stale cache for 30 seconds before re-attempting (`retryAfterFailureSeconds: 30`).
- **Proxy Caching**: Client/proxy caching on `/banner.png` is limited to 5 minutes (`bannerMaxAge: 300`), ensuring rapid propagation of campaign swaps.

### WAF & Security Settings
- **Hotlink Protection (Crucial Fix)**: Cloudflare's zone-level **Hotlink Protection** (under *Scrape Shield*) blocks any HTTP request for `.png` files that sends an external or local `Referer` (such as opening the generator via `file://`, `localhost`, or webmail like `outlook.office.com`), returning an HTTP **`403 (Error 1011)`**.  
  **Action for Cloudflare Admin**: Go to **Rules** → **Configuration Rules** in the Cloudflare dashboard and create a rule for `Hostname eq "sig.capte.co"` setting **Hotlink Protection: Off**. In HTML payloads, `referrerpolicy="no-referrer"` is also set on the `<img>` tag and page `<head>` to prevent browsers from sending referrers.
- **Bot Fight Mode & WAF**: Gmail and Outlook image proxies fetch signature banners via automated crawlers. Ensure Cloudflare **Bot Fight Mode** or WAF Managed Rules do not challenge requests on `sig.capte.co` (add a WAF Skip rule for hostname `sig.capte.co` if needed).
- **Observability**: Under Worker **Observability**, keep **Workers Logs off** to preserve recipient privacy.

---

## 6. Operational Procedures & Rollback

### Emergency Rollback
To immediately deactivate banners company-wide:
1. Open Cloudflare Dashboard → **Workers & Pages** → `sig-capte` → **Settings** → **Variables and Secrets**.
2. Add variable `BANNERS_MODE` = `off` and select **Deploy**.
3. All email signatures will instantly render invisible 1×1 pixels with links defaulting to `https://www.capte.co/`.
4. Delete the variable or set to `on` to restore normal operation.

### Swapping or Expiring a Campaign
- Unpublishing an item in Webflow CMS removes it from the live collection.
- Because of edge caching, new email opens will reflect changes within ~10 minutes. (Mail proxies like Gmail or Outlook.com may cache images for up to 24 hours).
