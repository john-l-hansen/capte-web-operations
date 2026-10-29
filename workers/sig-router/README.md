# Capte Technologies — Centralized Signature Edge Router (`sig.capte.co`)

This Cloudflare Worker provides the edge routing backbone for Capte's centralized email signatures. It delivers dynamically scheduled marketing banners, automated GA4 campaign attribution tracking, fail-closed error handling, and pre-filled employee generator redirects.

---

## Architecture Overview

```text
       ┌────────────────────────┐
       │   Webflow CMS          │ (Campaign Banners, Dates, Target URLs)
       └──────────┬─────────────┘
                  │ Webhook Purge / API Sync
                  ▼
       ┌────────────────────────┐
       │ Cloudflare Worker      │ (sig.capte.co)
       │ - /api/banner.png      │ -> Serves active 2x banner image with office targeting
       │ - /r/banner            │ -> 302 redirect with automated GA4 UTM tagging
       │ - /setup?user=...      │ -> Pre-filled 1-click employee onboarding
       │ - /api/signature       │ -> JSON/HTML payload for M365 Add-in (Phase 2)
       └──────────┬─────────────┘
                  │
                  ▼
       ┌────────────────────────┐
       │ Client Outlook Inboxes │ (All sent emails update dynamically)
       └────────────────────────┘
```

---

## Endpoints

| Endpoint | Method | Parameters | Description |
| :--- | :--- | :--- | :--- |
| `/api/banner.png` | `GET` | `?office=la\|fr\|nl` | Streams active campaign banner. Returns transparent 1×1 PNG if no campaign is active (fail-closed). |
| `/r/banner` | `GET` | `?office=la\|fr\|nl&user=...` | Redirects (`302`) to the active campaign landing page with standardized UTM parameters. |
| `/setup` | `GET` | `?user=johnhansen` or `?email=...` | Pre-fills generator inputs from verified staff roster (`src/roster.json`). |
| `/api/signature` | `GET` | `?user=...` | Returns JSON payload with profile, active campaign, and banner URLs. |
| `/webhook/webflow`| `POST` | Header auth | Webflow CMS publish webhook to invalidate edge cache. |

---

## Local Development & Testing

1. Navigate to worker directory:
   ```bash
   cd workers/sig-router
   ```

2. Run local development server:
   ```bash
   npx wrangler dev
   ```

3. Test endpoints:
   - Dynamic banner: `http://localhost:8787/api/banner.png?office=la`
   - Redirect: `http://localhost:8787/r/banner?office=la`
   - Health check: `http://localhost:8787/`

---

## Production Deployment to `sig.capte.co`

### Step 1: DNS Setup (IT / DNS Administrator)
Add a CNAME record in the domain DNS:
- **Type**: `CNAME`
- **Name**: `sig` (for `sig.capte.co`)
- **Target**: Cloudflare Worker domain / zone proxy

### Step 2: Cloudflare KV Setup (Optional for Live CMS Sync)
Create a KV namespace for edge-caching Webflow CMS items:
```bash
npx wrangler kv:namespace create CAMPAIGNS_KV
```
Paste the returned namespace ID into `wrangler.toml`.

### Step 3: Deploy Worker
```bash
npx wrangler deploy
```

---

## Fail-Closed Principles & In-Inbox Resilience

1. **Zero Broken Image Placeholders**: When no marketing campaign is live, the worker returns a binary 1×1 transparent PNG rather than a `404 Not Found`. Outlook inboxes render clean whitespace with no broken "X" icon.
2. **Fixed Display Dimensions**: The signature template declares `<img width="300" height="80" style="display:block;width:300px;height:80px;border:0;">`, preserving layout alignment regardless of image delivery.
3. **MIME & Spam Compliance**: Avoids base64 strings; all images are hosted on secure HTTPS with valid MIME types and `Cache-Control` headers.
