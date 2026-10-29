/**
 * Capte Technologies — Centralized Email Signature Edge Router
 * Domain: sig.capte.co
 * 
 * Powered by Cloudflare Workers.
 * Features:
 * - /api/banner.png : Dynamic marketing banner router with office targeting & fail-closed fallback
 * - /r/banner       : 302 click redirector with automated GA4 UTM attribution
 * - /setup          : Pre-filled employee generator entry point
 * - /api/signature  : Clean HTML/JSON signature payload endpoint (M365 Add-in ready)
 * - /webhook/webflow: Cache invalidation webhook on Webflow CMS campaign publish
 */

import { CampaignConfig, EmployeeProfile, Env, OfficeCode } from './types';
import rosterData from './roster.json';

// Transparent 1x1 PNG binary buffer for fail-closed fallback
// Ensures no broken image icons appear in inboxes when no campaign is active
const TRANSPARENT_1X1_PNG = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
  0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
  0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
  0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
]);

// Default baseline campaigns fallback (when KV is not yet populated)
const DEFAULT_CAMPAIGNS: CampaignConfig[] = [
  {
    id: 'apta-expo-2026',
    name: 'APTA TRANSform Expo 2026',
    office: 'la',
    imageUrl: 'https://cdn.prod.website-files.com/64f08f1a9f74ffb5762d6891/6ad2663ae87bb73bcf0f350e_capte-email-signature-logo.png',
    destinationUrl: 'https://www.capte.co/solutions/transit',
    utmCampaign: 'apta-expo-2026',
    altText: 'Capte Technologies at APTA TRANSform Expo',
    isActive: true
  },
  {
    id: 'innotrans-2026',
    name: 'InnoTrans Berlin Showcase',
    office: 'all',
    imageUrl: 'https://cdn.prod.website-files.com/64f08f1a9f74ffb5762d6891/6ad2663ae87bb73bcf0f350e_capte-email-signature-logo.png',
    destinationUrl: 'https://www.capte.co/solutions/rail',
    utmCampaign: 'innotrans-2026',
    altText: 'Capte Precision Telemetry & Positioning',
    isActive: true
  }
];

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    // 1. Dynamic Banner Image Endpoint: /api/banner.png or /banner.png
    if (pathname === '/api/banner.png' || pathname === '/banner.png') {
      return handleBannerImage(request, env, ctx);
    }

    // 2. Tracked Click Redirector Endpoint: /r/banner or /click
    if (pathname === '/r/banner' || pathname === '/click') {
      return handleBannerClick(request, env);
    }

    // 3. Centralized Employee Setup Link: /setup
    if (pathname === '/setup') {
      return handleSetupRedirect(request, env);
    }

    // 4. API Signature Payload: /api/signature
    if (pathname === '/api/signature') {
      return handleSignaturePayload(request, env);
    }

    // 5. Webflow CMS Publish Webhook: /webhook/webflow
    if (pathname === '/webhook/webflow' && request.method === 'POST') {
      return handleWebflowWebhook(request, env);
    }

    // 6. Root & Health Check: /
    return new Response(
      JSON.stringify({
        status: 'online',
        service: 'Capte Centralized Signature Edge Router',
        domain: 'sig.capte.co',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      }, null, 2),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

/**
 * Handle dynamic banner delivery with office targeting and fail-closed fallback
 */
async function handleBannerImage(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const office = (url.searchParams.get('office') || 'all') as OfficeCode | 'all';

  try {
    const campaign = await getActiveCampaign(office, env);

    if (!campaign || !campaign.imageUrl) {
      // Fail closed: return 1x1 transparent image so inboxes don't show broken image boxes
      return new Response(TRANSPARENT_1X1_PNG, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=300, s-maxage=600',
          'X-Capte-Banner-Status': 'fallback-empty'
        }
      });
    }

    // Fetch the actual campaign banner from Webflow CDN
    const imageResponse = await fetch(campaign.imageUrl, {
      cf: {
        cacheTtl: 86400,
        cacheEverything: true
      }
    });

    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch source banner: ${imageResponse.status}`);
    }

    const contentType = imageResponse.headers.get('content-type') || 'image/png';
    const imageBuffer = await imageResponse.arrayBuffer();

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=600',
        'X-Capte-Campaign-ID': campaign.id,
        'X-Capte-Office': office
      }
    });
  } catch (err) {
    // Fail closed on error: transparent 1x1
    return new Response(TRANSPARENT_1X1_PNG, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache',
        'X-Capte-Banner-Status': 'error-fallback'
      }
    });
  }
}

/**
 * Handle banner click and 302 redirect with automated GA4 UTM tracking
 */
async function handleBannerClick(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const office = (url.searchParams.get('office') || 'la') as OfficeCode;
  const user = url.searchParams.get('user') || 'team';

  const campaign = await getActiveCampaign(office, env);
  const baseUrl = campaign?.destinationUrl || env.DEFAULT_SITE_URL || 'https://www.capte.co';
  const utmCampaign = campaign?.utmCampaign || 'employee-signature-general';

  // Construct target URL with standardized UTM parameters
  const targetUrl = new URL(baseUrl);
  targetUrl.searchParams.set('utm_source', 'email-signature');
  targetUrl.searchParams.set('utm_medium', 'email');
  targetUrl.searchParams.set('utm_campaign', utmCampaign);
  targetUrl.searchParams.set('utm_content', `office-${office}`);
  if (user) {
    targetUrl.searchParams.set('utm_term', user);
  }

  return Response.redirect(targetUrl.toString(), 302);
}

/**
 * Handle personal setup link redirect pre-filling the generator
 */
async function handleSetupRedirect(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const userQuery = url.searchParams.get('user') || url.searchParams.get('email');

  const employees: EmployeeProfile[] = rosterData.employees as EmployeeProfile[];
  const profile = employees.find(
    e => e.id.toLowerCase() === userQuery?.toLowerCase() || e.email.toLowerCase() === userQuery?.toLowerCase()
  );

  const generatorUrl = new URL('https://www.capte.co/internal/email-signature');
  if (profile) {
    generatorUrl.searchParams.set('name', profile.fullName);
    generatorUrl.searchParams.set('title', profile.jobTitle);
    generatorUrl.searchParams.set('email', profile.email);
    generatorUrl.searchParams.set('office', profile.office);
    generatorUrl.searchParams.set('mobile', profile.mobile);
    if (profile.pronouns) generatorUrl.searchParams.set('pronouns', profile.pronouns);
    if (profile.officePhone) generatorUrl.searchParams.set('officePhone', profile.officePhone);
  }

  return Response.redirect(generatorUrl.toString(), 302);
}

/**
 * Return employee signature profile data in JSON for programmatic use
 */
async function handleSignaturePayload(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const userQuery = url.searchParams.get('user') || url.searchParams.get('email');

  const employees: EmployeeProfile[] = rosterData.employees as EmployeeProfile[];
  const profile = employees.find(
    e => e.id.toLowerCase() === userQuery?.toLowerCase() || e.email.toLowerCase() === userQuery?.toLowerCase()
  );

  if (!profile) {
    return new Response(JSON.stringify({ error: 'Employee not found in roster' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const campaign = await getActiveCampaign(profile.office, env);

  return new Response(
    JSON.stringify({
      profile,
      activeCampaign: campaign || null,
      bannerUrl: `https://sig.capte.co/api/banner.png?office=${profile.office}&user=${profile.id}`,
      bannerClickUrl: `https://sig.capte.co/r/banner?office=${profile.office}&user=${profile.id}`
    }, null, 2),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
}

/**
 * Handle Webflow publish webhook to invalidate cached campaigns in KV
 */
async function handleWebflowWebhook(request: Request, env: Env): Promise<Response> {
  if (env.CAMPAIGNS_KV) {
    // Delete cached keys
    await env.CAMPAIGNS_KV.delete('campaigns_cache');
  }

  return new Response(JSON.stringify({ success: true, message: 'Campaign cache invalidated' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Query active campaign based on office and schedule
 */
async function getActiveCampaign(office: OfficeCode | 'all', env: Env): Promise<CampaignConfig | null> {
  let campaigns: CampaignConfig[] = DEFAULT_CAMPAIGNS;

  // Attempt to read from KV cache if configured
  if (env.CAMPAIGNS_KV) {
    try {
      const cached = await env.CAMPAIGNS_KV.get('campaigns_cache', 'json');
      if (cached && Array.isArray(cached)) {
        campaigns = cached as CampaignConfig[];
      }
    } catch {
      // Fall back to default
    }
  }

  const now = new Date().toISOString();

  // Find first active campaign matching office or 'all' within date bounds
  const match = campaigns.find(c => {
    if (!c.isActive) return false;
    if (c.office !== 'all' && office !== 'all' && c.office !== office) return false;
    if (c.startDate && c.startDate > now) return false;
    if (c.endDate && c.endDate < now) return false;
    return true;
  });

  return match || null;
}
