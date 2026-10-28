# Blog Section-Anchor Link Tool & Shortener

A lightweight marketing operations browser utility that extracts section-specific deep links from published Capte blog posts ([capte.co/blog/*](https://www.capte.co)) and automatically generates compact, branded shortened links for social sharing.

> **Scope**: Personal browser utility (Bookmarklet & DevTools Console script). Does not alter Webflow templates or runtime code; only inspects the live rendered DOM in the user's browser.  
> **Version**: `v1.2.0` (TinyURL Pro Branded Domain Integration & Zero-Config Fallback)  
> **SOP Guide**: [`docs/branded-shortener-setup-guide.md`](../../docs/branded-shortener-setup-guide.md)

---

## 🎯 Purpose & Marketing Strategy

Capte's long-form technical articles (transit telematics, precision positioning, IoT gateway architecture) contain multiple discrete value points. Raw section URLs with UTMs often exceed 170+ characters, which look unwieldy in social copy.

By combining DOM heading extraction with an automated URL shortener, marketing can:

1. **Multiply Post Reach (3x–5x Content Extension)**: Turn a single 2,500-word article into 3–5 tailored social posts (LinkedIn, X, technical newsletters), each highlighting a specific section with a clean, branded shortlink.
2. **Deep-Link Intent Matching**: Readers who click a section shortlink jump directly to the exact paragraph or architecture breakdown, lowering bounce rates and accelerating time-to-value.
3. **100% Brand Equity**: With TinyURL Pro connected, links appear as `https://go.capte.co/xyz` rather than generic third-party domains.
4. **Automate One-Click Extraction**: Eliminate manual "Inspect Element" copying and third-party link generator hopping.

---

## 🚀 How to Install & Use

### Option A: 1-Click Bookmarklet (Recommended for Marketing)

1. Open [`tools/blog-section-anchors/bookmarklet.html`](bookmarklet.html) in your web browser.
2. Configure your TinyURL Token and Branded Domain (`go.capte.co`) under **Step 2** (if available).
3. Drag the **`🔗 Capte Section Shortlinks`** button up into your browser's **Bookmarks Bar**.
4. Visit any published post on [capte.co/blog](https://www.capte.co).
5. Click **`🔗 Capte Section Shortlinks`** in your bookmarks bar.
6. In under a second, all section links are extracted, shortened, and copied directly to your clipboard!

*(A classic **`🔗 Capte Raw Section Links`** bookmarklet is also available if unshortened `capte.co/blog/slug#anchor` URLs are needed for internal documentation.)*

### Option B: DevTools Console (For Technical / Ad-hoc Workflows)

1. Open the published blog post in your browser.
2. Right-click anywhere &rarr; select **Inspect** &rarr; open the **Console** tab.
3. Paste and run the code from [`extractor.js`](extractor.js).
4. View the formatted output in the console and paste from your clipboard.

---

## 📋 Sample Output Format

```text
1. Telematics Gateway Architecture — https://go.capte.co/uOO6fv
1.1 High-Speed CAN Bus Decoding — https://go.capte.co/eM0Vk6
1.2 Dual-Frequency RTK Precision Positioning — https://go.capte.co/kP7w2z
2. Hardware Power & Cellular Redundancy — https://go.capte.co/m9X1qa
```

When clicked by a reader on LinkedIn or X, the shortlink resolves to `https://capte.co/blog/precision-transit-telematics#dual-frequency-rtk-precision` and automatically scrolls the browser directly to the heading.

---

## ⚙️ Multi-Engine Architecture

1. **TinyURL Pro Branded Engine (Primary)**: Uses TinyURL v2 API (`api.tinyurl.com/create`) with `domain: "go.capte.co"`. Yields fully branded shortlinks with click tracking and analytics.
2. **Zero-Setup Fallback Engine**: If no TinyURL token is saved, the tool automatically uses `is.gd` / `v.gd` JSON API with native CORS (`Access-Control-Allow-Origin: *`) enabled. Requires zero configuration, API keys, or backend servers.
3. **Preserves Hash Fragments**: Encodes `#` as `%23` during API transmission, guaranteeing that destination browsers execute the smooth-scroll anchor jump.
4. **Fail-Safe Fallback**: If all network requests fail, the tool automatically falls back to clean raw anchor URLs so marketing is never left with broken text.

---

## ⚠️ Known Limitations & Best Practices

| Limitation | Impact | Best Practice |
| :--- | :--- | :--- |
| **Heading Stability** | IDs are generated dynamically from heading text on page load. If an article's heading copy is edited in Webflow CMS post-publication, existing social links will fall back gracefully to the top of the article. | Only pull and schedule section links once an article's headings are **final**. |
| **Duplicate Headings** | Identical headings (e.g. repeated "Overview" or "Benefits" sections) produce identical IDs. The browser will only jump to the first occurrence. | The tool automatically detects and prepends `⚠️ DUPLICATE ID` to alert the user. |
| **Non-ASCII / International Characters** | Slugs strip non-alphanumeric characters. Headings in French or Dutch with extensive accents may reduce to empty IDs. | The tool detects and flags `[No ID assigned]` headings for manual review. |
| **View Source vs Inspect** | Because IDs are added by JavaScript on page load, standard "View Source" will not display them. | Always use the bookmarklet or DevTools "Inspect". |
