# Capte Technologies — Centralized Email Signature Architecture & Implementation Plan

**Document Reference**: `CAPTE-OPS-2026-SIG-002`  
**Author**: John Hansen, Lead Web/Print Designer & Web Operations ([john@capte.co](mailto:john@capte.co))  
**Target Domain**: `sig.capte.co` (Cloudflare Workers) + `capte.co` (Webflow CMS)  
**Related Documents**: [`docs/proposals/email-signature-system-proposal.md`](email-signature-system-proposal.md), [`tools/email-signature/`](../../tools/email-signature/)  
**Status**: Architecture Feasibility & Execution Blueprint  
**Date**: October 29, 2026  

---

## 1. Feasibility Confirmation & Technical Reality Check

### Can we build a centralized custom system that controls everything and uses variables?
**Yes, absolutely.** However, understanding the exact boundaries of what email client rendering engines permit versus what server infrastructure must handle is crucial to choosing the right technical architecture.

### The Fundamental Technical Constraint of Email Clients
Unlike modern web applications:
1. **Email clients do NOT allow live HTML fetching at render time**: Outlook (Windows Word engine, Mac, Web), Apple Mail, and Gmail strictly forbid `<script>`, `<iframe>`, `<object>`, and external `<link rel="stylesheet">`.
2. **Text inside an installed signature is frozen in the client**: If an employee pastes HTML containing `"Lead Systems Engineer"`, that text resides in their local Outlook profile. Outlook will not make a network call to fetch updated text unless triggered by an Outlook Add-in or rewritten in flight.
3. **Remote Images and Hyperlinks ARE 100% Dynamic**: Email clients *do* fetch external images (`<img src="...">`) and execute HTTP requests when links are clicked (`<a href="...">`).

### How Third-Party Services (CodeTwo / Exclaimer) Achieve "Zero-Touch" Centralization
Third-party vendors use two distinct architectural patterns:
- **Pattern A: SMTP Relay / Server-Side Stamping**: All outbound corporate email is routed through an external cloud proxy in Azure. As the MIME message passes through, the proxy injects the HTML signature using Azure Active Directory (Entra ID) variables.
  - *Limitation for in-house custom build*: Writing, maintaining, and certifying a high-availability, zero-latency SMTP mail relay with 99.999% uptime, GDPR compliance across France/Netherlands, and DKIM/SPF resigners is cost-prohibitive and risky for a 3-day internal project.
- **Pattern B: Microsoft 365 Modern Outlook Add-in (Client-Side Injection)**: Deployed tenant-wide by IT via M365 Admin Center (`Integrated Apps`). The add-in executes on `OnNewMessageCompose`, queries a central API, merges sender attributes, and inserts the signature directly into the compose window via `Office.context.mailbox.item.body.setSignatureAsync()`.

---

## 2. Proposed Architecture: The Dual-Track Custom System

To achieve maximum central control for $0/month in 3 days, we propose a two-phase architecture:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CAPTE CENTRALIZED SIGNATURE SYSTEM                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Webflow CMS (Marketing)             Cloudflare Worker (sig.capte.co)      │
│   ┌──────────────────────────┐        ┌──────────────────────────────────┐  │
│   │ "Email Campaigns"        │ ─────► │ • /api/banner.png?office=la      │  │
│   │ • Banner Asset (@2x)     │ Webhook│ • /r/banner?office=la (302 UTM)  │  │
│   │ • Target URL             │ or KV  │ • /api/signature?user=johnhansen │  │
│   │ • Start / End Dates      │        │ • /setup?user=johnhansen (UI)    │  │
│   │ • Office Targeting       │        └──────────────────────────────────┘  │
│   └──────────────────────────┘                          ▲                   │
│                                                         │                   │
│         ┌───────────────────────────────────────────────┴─────────────┐     │
│         │                                                             │     │
│   PHASE 1: Dynamic Asset Embed (Immediate)      PHASE 2: M365 Add-in (Zero-Touch)
│   ┌────────────────────────────────────┐        ┌─────────────────────────┐ │
│   │ • Staff install signature ONCE     │        │ • IT deploys manifest   │ │
│   │ • Identity text: Static in Outlook │        │ • Auto-injects in New   │ │
│   │ • Banners & Links: 100% Dynamic    │        │   Outlook / Web / Mac   │ │
│   │ • Real-time marketing campaigns    │        │ • Name/title syncs live │ │
│   └────────────────────────────────────┘        └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Phase 1: Dynamic Smart Assets & Campaign Redirector (Immediate 3-Day Build)
- **Employee Workflow**: Employees install their signature **once** from a personalized URL (`https://sig.capte.co/setup?user=s.chen`). The form is pre-filled from a central team roster (no manual typos in job titles or office addresses).
- **Centralized Marketing Control**:
  - The signature embeds dynamic asset endpoints:
    - Dynamic Campaign Banner: `https://sig.capte.co/api/banner.png?office=la&v=2`
    - Dynamic Click Redirect: `https://sig.capte.co/r/banner?office=la`
  - When Marketing launches a campaign (e.g. APTA Expo in US, InnoTrans in Europe, or a new product launch):
    1. Marketing updates the Webflow CMS collection (`Email Signature Campaigns`).
    2. Cloudflare Worker instantly serves the new banner image and redirects clicks to the campaign landing page with full UTM tracking.
    3. **Zero staff reinstallation required**: All past and future emails instantly display the active campaign.
    4. If no campaign is active, the worker seamlessly falls back to a clean 1×1 spacer or default brand message without layout breakage.

### Phase 2: M365 Centralized Outlook Add-in (Future Zero-Touch Upgrade)
- A lightweight, official Microsoft Office.js Add-in manifest pointing to `https://sig.capte.co/addin/manifest.xml`.
- When authorized by IT in Microsoft 365 Admin Center, Outlook automatically injects and updates the signature every time an email is composed, pulling both identity text and marketing banners dynamically.

---

## 3. System Architecture & Component Specification

### Component 1: Webflow CMS Collection Schema
Collection Name: `Signature Campaigns` (Internal)

| Field Name | Slug | Type | Description |
| :--- | :--- | :--- | :--- |
| **Campaign Name** | `name` | Plain Text | e.g. `APTA Expo 2026 - LA Showcase` |
| **Target Office** | `office` | Option / Multi-Ref | `All`, `Los Angeles`, `Versailles`, `Amsterdam` |
| **Status** | `status` | Option | `Draft`, `Active`, `Scheduled`, `Archived` |
| **Start Date** | `start-date` | Date/Time | Automated scheduling kickoff |
| **End Date** | `end-date` | Date/Time | Automated expiration fallback |
| **Banner Image (2x Retina)**| `banner-image` | Image | Exactly 600×160px PNG/JPG (displays at 300×80px) |
| **Destination URL** | `destination-url` | Link | e.g. `https://www.capte.co/solutions/transit` |
| **UTM Campaign Tag** | `utm-campaign` | Plain Text | e.g. `apta-expo-2026` |
| **Alt Text** | `alt-text` | Plain Text | Screen reader description |
| **Active Fallback?** | `is-default` | Switch | Default evergreen fallback when no event is live |

### Component 2: Cloudflare Worker (`sig.capte.co`)
Hosted on Cloudflare's free edge tier (100,000 requests/day, $0/month cost).

#### Endpoints:
1. `GET /api/banner.png`
   - **Query Parameters**: `?office={la|fr|nl}&lang={en|fr|nl}`
   - **Behavior**:
     - Evaluates active campaigns for the specified office from Webflow CMS / Cloudflare KV cache.
     - Fetches and pipes the active campaign image buffer with `Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=600`.
     - Supports cache-purging on Webflow publish via webhook (`POST /webhook/webflow-publish`).
     - **Fail-Closed Strategy**: If no campaign is active or image fetch fails, returns a 1×1 transparent PNG or pre-cached default brand banner, preventing broken image icons in inboxes.
2. `GET /r/banner`
   - **Query Parameters**: `?office={la|fr|nl}&user={email}`
   - **Behavior**:
     - Looks up active destination URL for that office.
     - Appends standardized UTM tracking:
       `?utm_source=email-signature&utm_medium=email&utm_campaign={slug}&utm_content=office-{office}`
     - Returns HTTP `302 Found` with `Location` header.
3. `GET /setup` (Centralized Generator)
   - Serves an enhanced version of [`tools/email-signature/email-signature-generator.html`](../../tools/email-signature/email-signature-generator.html).
   - Accepts `?user=s.chen` or `?email=s.chen@capte.co`:
     - Reads pre-configured employee directory from JSON/KV.
     - Locks immutable fields (official title, office address, postal standards).
     - Allows employee to review, choose New vs. Reply variant, and 1-click copy to clipboard.

---

## 4. Outlook & Email Client Engineering Safeguards

| Email Client Challenge | Root Cause | Engineering Solution in Custom Build |
| :--- | :--- | :--- |
| **Image Caching in Gmail** | Google Image Proxy caches image URLs aggressively. | Cloudflare Worker sets `ETag` and short `max-age=3600` with Webhook purge. Banner URL uses query cache-buster versioning (e.g. `?v=20261029`). |
| **Images Blocked by Default** | Outlook desktop blocks remote images until user clicks "Download Pictures". | 1. Core signature text (name, title, contacts) remains **pure HTML table text**, never baked into an image.<br>2. Banner `<td>` has fixed explicit width/height and descriptive `alt` text so layout does not collapse if images are blocked. |
| **Retina / HiDPI Scaling** | High-DPI screens blur 1x raster images; Outlook Word engine ignores CSS `max-width`. | Banner is authored at `600 × 160px` (2x) but coded strictly with HTML attributes: `width="300" height="80"` and inline `style="width:300px;height:80px;display:block;border:0;"`. |
| **Dark Mode Inversion** | Modern Outlook and Apple Mail invert white backgrounds and dark text. | Use brand-compliant `#001384` and `#0F0F11` which retain 6.0:1+ contrast against inverted backgrounds; transparent PNGs with clean anti-aliasing. |

---

## 5. Step-by-Step Implementation Plan (3-Day Execution)

### Day 1: Cloudflare Edge & Webflow CMS Foundation
- [ ] **DNS & Subdomain**: Add CNAME record for `sig.capte.co` pointing to Cloudflare.
- [ ] **Worker Project Initialization**: Create `workers/capte-sig-router` in repository with TypeScript and Wrangler.
- [ ] **Webflow CMS Setup**: Create `Signature Campaigns` collection with schemas defined above.
- [ ] **Roster Sync**: Export staff roster into `data/team-roster.json` (Name, Title, Office, Email, Mobile).

### Day 2: Dynamic Banner Engine & Redirection Logic
- [ ] **Worker Router Implementation**:
  - Implement `/api/banner.png` with edge KV caching.
  - Implement `/r/banner` with automatic GA4 UTM injection.
  - Implement fail-closed transparent placeholder fallback.
- [ ] **Webflow Webhook Integration**: Configure Webflow webhook `collection_item_changed` to auto-invalidate Cloudflare KV cache on campaign publish.
- [ ] **Dynamic HTML Signature Template**: Update signature template in `tools/email-signature/` to embed the dynamic banner and tracked link slots.

### Day 3: Testing, QA Matrix & Employee Rollout
- [ ] **Multi-Client QA Testing**:
  - Test banner swapping live across Outlook Windows (Classic), Outlook Windows (New), Outlook Mac, Outlook Web, and Gmail.
  - Verify UTM tracking captures properly in Google Analytics 4.
  - Verify layout integrity when images are blocked.
- [ ] **Rollout Packaging**:
  - Deploy generator to `sig.capte.co/setup`.
  - Send internal announcement email with personal setup links.
  - Document rollback and marketing operating procedures.

---

## 6. Comparison Matrix: Custom Build vs. SaaS Vendors

| Feature / Requirement | SaaS (CodeTwo / Exclaimer) | Option 2: Custom Build (Recommended) |
| :--- | :--- | :--- |
| **Monthly Subscription** | \$1.22 – \$1.45 / user / mo (\$250–\$450+/yr ongoing) | **\$0.00 / mo** (Free tiers of Cloudflare & Webflow) |
| **IT Tenant Permissions** | Requires high-privilege M365 Global Admin & Mail Flow connector | **Zero mail flow risk**; only 1 DNS CNAME record needed |
| **Privacy / Legal Compliance** | Requires vendor DPA & GDPR review (transfers EU emails through vendor proxy) | **100% internal**; zero email body data touches external servers |
| **Marketing Banner Swapping** | Centrally managed in vendor web dashboard | **Centrally managed in Webflow CMS** (tools marketing already uses) |
| **Campaign Scheduling & Office Targeting** | Supported | Supported via Webflow CMS dates & office filters |
| **Staff Effort** | Zero installation (server-side) | One-time 30-second generator setup from personal link |
| **Title / Identity Mutation** | Live sync from Azure AD | Static on client until promotion (re-copy or Phase 2 Add-in) |

---

## 7. Recommendation & Immediate Action Items

1. **Proceed with Option 2 (Custom Build)**: It completely eliminates recurring SaaS subscription costs, requires zero intrusive M365 mail routing permissions, and gives marketing full control over campaigns through Webflow CMS.
2. **Action Item for IT**: Request CNAME record `sig.capte.co` -> Cloudflare Worker.
3. **Action Item for Marketing**: Approve the `Signature Campaigns` Webflow CMS structure and create the first banner asset (e.g. APTA Expo 2026 or brand default).
