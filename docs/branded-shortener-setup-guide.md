# Capte Technologies — Branded Shortener Setup Guide (`go.capte.co`)
## SOP: Connecting TinyURL Pro & Cloudflare DNS for Custom Branded Deep Links

**Document Owner**: John Hansen ([john@capte.co](mailto:john@capte.co)) — Digital Design & Web Operations  
**Entity**: Capte Technologies Inc. (Los Angeles, CA)  
**System Target**: [capte.co](https://capte.co) & [Blog Section-Anchor Extractor](file:///Users/johnhansen/Desktop/1-capte/design-and-web-operations/web-components/tools/blog-section-anchors/README.md)  
**Repository**: [`john-l-hansen/capte-web-operations`](https://github.com/john-l-hansen/capte-web-operations)  
**Version**: `v1.2.0` (Production Ready)  

---

### 1. Objective

Enable Capte's marketing and operations team to generate 1-click **branded shortlinks** (e.g. `https://go.capte.co/canbus-telematics`) that:
1. Shorten URLs from 170+ characters down to ~20 characters.
2. Maintain 100% Capte brand equity on social media (LinkedIn, X, technical newsletters).
3. Automatically jump the reader to the specific article heading (`#heading-id`).
4. Track link clicks, referrers, and geo-data in TinyURL’s analytics dashboard.

---

### 2. DNS Architecture Overview

```text
       ┌────────────────────────┐
       │   LinkedIn / X Post    │
       │ https://go.capte.co/xyz│
       └───────────┬────────────┘
                   │
                   ▼ (CNAME Resolution)
       ┌────────────────────────┐
       │  Cloudflare DNS        │
       │  go.capte.co           │ ──► CNAME: custom.tinyurl.com (DNS Only / Grey Cloud)
       └───────────┬────────────┘
                   │
                   ▼ (HTTP 301 Redirect with Location Header)
       ┌────────────────────────┐
       │  TinyURL Pro Engine    │ ──► Location: https://capte.co/blog/post#section-anchor
       └───────────┬────────────┘
                   │
                   ▼ (Browser Native Anchor Jump)
       ┌────────────────────────┐
       │  capte.co Blog Post    │
       │  (Webflow Production)  │ ──► Smooth scrolls viewport directly to heading
       └────────────────────────┘
```

---

### 3. Step-by-Step Configuration SOP

#### Step 1: Add Custom Domain in TinyURL Pro
1. Log into your team's [TinyURL Dashboard](https://tinyurl.com/app/login) (must be on **TinyURL Pro** or higher).
2. In the left navigation, click **Branded Domains** (or go to [tinyurl.com/app/domains](https://tinyurl.com/app/domains)).
3. Click the **Add Domain** button.
4. Enter `go.capte.co` (or `links.capte.co`).
5. TinyURL will display the required DNS validation records:
   * **Record Type**: `CNAME`
   * **Host / Name**: `go`
   * **Target / Value**: `custom.tinyurl.com`

#### Step 2: Configure Cloudflare DNS
1. Log into the **Cloudflare Dashboard** managing `capte.co`.
2. Navigate to **DNS &rarr; Records**.
3. Click **Add Record**:
   * **Type**: `CNAME`
   * **Name**: `go`
   * **Target**: `custom.tinyurl.com`
   * **Proxy status**: **DNS Only** (Grey cloud — *do not proxy through Cloudflare CDN, as TinyURL provisions its own SSL certificate*).
   * **TTL**: `Auto`
4. Click **Save**.

#### Step 3: Verify Domain & Issue SSL in TinyURL
1. Return to the TinyURL **Branded Domains** page.
2. Click **Verify Domain**.
3. TinyURL will automatically detect the CNAME and provision a free, automated Let's Encrypt SSL certificate (usually takes 2–10 minutes).
4. Once verified, the status indicator turns **Active (Green)**.

#### Step 4: Generate Team API Bearer Token
1. In TinyURL, click your **profile icon** in the top right &rarr; select **API / Developer** (or visit [tinyurl.com/app/dev](https://tinyurl.com/app/dev)).
2. Click **Create API Token**.
3. Label it: `Capte Blog Section Shortener`.
4. Copy the secret Bearer token.

#### Step 5: Connect to Capte Extractor Bookmarklet
1. Open [`tools/blog-section-anchors/bookmarklet.html`](file:///Users/johnhansen/Desktop/1-capte/design-and-web-operations/web-components/tools/blog-section-anchors/bookmarklet.html).
2. In **Step 2 (TinyURL Configuration)**:
   * Paste the Bearer token into the **TinyURL API Bearer Token** field.
   * Ensure **Branded Short Domain** is set to `go.capte.co`.
   * Click **Save Configuration**.
3. Click **⚡ Test Connection** to verify that a test link generates successfully (`https://go.capte.co/...`).

---

### 4. Marketing Team Daily Workflow

1. Navigate to any published blog post on [capte.co/blog](https://www.capte.co/blog).
2. Click the **`🔗 Capte Section Shortlinks`** bookmarklet in your bookmarks bar.
3. The bookmarklet scans the article, queries the TinyURL API with `domain: "go.capte.co"`, and copies the formatted links directly to your clipboard:
   ```text
   1. Telematics Gateway Architecture — https://go.capte.co/cpt-telematics
   1.1 High-Speed CAN Bus Decoding — https://go.capte.co/cpt-canbus
   1.2 Dual-Frequency RTK Precision Positioning — https://go.capte.co/cpt-rtk
   2. Hardware Power & Cellular Redundancy — https://go.capte.co/cpt-power
   ```
4. Paste directly into LinkedIn, X, or email post schedules!

---

### 5. Fallback Protection
If TinyURL's API is temporarily unreachable or an operator uses a browser without the token saved, the tool **automatically falls back to our zero-config engine (`is.gd`)** or raw anchor links so campaign creation is never interrupted.
