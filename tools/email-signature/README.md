# Capte Email Signature System & Dynamic Banners

> **Tool**: `tools/email-signature/`  
> **Service Domain**: `sig.capte.co` (Cloudflare Worker)  
> **Status**: Production Deployed (v1.1.0 generator + dynamic banner row)  
> **Lead Authority**: John Hansen ([john@capte.co](mailto:john@capte.co)) — Lead Web/Print Designer & Web Operations  

This tool suite provides cross-platform email signatures and dynamic, Webflow-controlled marketing banners for Capte's offices in Los Angeles, Versailles, and Amsterdam.

---

## 1. System Components

1. **Email Signature Generator (`email-signature-generator.html`)**:
   - Generates Word-engine-compliant HTML tables for Outlook (Windows/Mac/Web) and Apple Mail.
   - Provides two standard variants:
     - **New Email**: Full identity block (Name, Title, Department, Office Phone, Mobile, Address) with optional dynamic banner row.
     - **Reply / Forward**: Compact identity block without marketing banner to minimize vertical clutter in email threads.
2. **Dynamic Signature Banner Router (`sig.capte.co`)**:
   - Cloudflare Worker (`workers/sig-router/`) serving dynamic images via `/banner.png?o={office}` and click redirects via `/go?o={office}`.
   - Managed directly through Webflow CMS collection "Signature Campaigns".
3. **Banner Snippet & Test Harness**:
   - `signature-banner-row.html`: HTML table row template with placeholders for office code and localized alt text.
   - `signature-banner-test-la.html`: One-click copy harness for QA and manual installation into Outlook.

---

## 2. Dynamic Banner Implementation

The banner row sits directly beneath the contact block in the **New email** template:

```html
<!-- Capte Dynamic Signature Banner Row -->
<tr>
  <td style="padding:16px 0 0 0;">
    <a href="https://sig.capte.co/go?o={{OFFICE}}" target="_blank">
      <img src="https://sig.capte.co/banner.png?o={{OFFICE}}" width="300" height="80"
           alt="{{BANNER_ALT}}" style="display:block;border:0;width:300px;height:80px;">
    </a>
  </td>
</tr>
```

### Office Codes & Fixed Alt Text

| Office Code (`{{OFFICE}}`) | Office Location | Fixed Alt Text (`{{BANNER_ALT}}`) |
| :--- | :--- | :--- |
| `la` | Los Angeles (US) | `Capte Technologies: latest news and events` |
| `fr` | Versailles (FR) | `Capte Technologies : actualités et événements` |
| `nl` | Amsterdam (NL) | `Capte Technologies: nieuws en evenementen` |

*Note: Alt text is baked into the signature HTML so it displays immediately if image loading is blocked by an email client.*

---

## 3. How Marketing Creates & Targets Campaigns

Campaigns are managed in Webflow CMS without code changes or staff re-installations.

1. In Webflow Designer/Editor, navigate to CMS Collection **Signature Campaigns** (`6ae3d41f97ff9b75333f6dfa`).
2. Click **+ New Signature Campaign** and populate the fields:
   - **Name**: Internal descriptive campaign title (e.g. `APTA TRANSform Expo 2026`).
   - **Banner Image (2x Retina)**: Exactly **600 × 160 px** (rendered at 300 × 80 px). Max 60 KB, PNG or JPG, solid opaque background.
   - **Destination URL**: Target page on `https://www.capte.co/` or `https://capte.co/`. **Do not include UTM tags**—the Worker injects them automatically.
   - **Target Office**: Select `All Offices`, `Los Angeles (US)`, `Versailles (FR)`, or `Amsterdam (NL)`.
   - **UTM Campaign Slug**: Clean hyphenated slug (e.g. `apta-expo-2026`). Injected as `utm_campaign`.
   - **Start Date / End Date**: Optional date window. If Start Date is empty, the banner activates upon publishing. If End Date is empty, it runs until superseded.
   - **Is Active?**: Turn **ON** to enable.
   - **Is Evergreen Fallback?**: Turn **ON** only if creating a default fallback banner for an office or all offices.
3. **Publish the site**: Publishing in Webflow is the official approval step. New opens will resolve the updated banner within ~5–10 minutes.

---

## 4. Email Client Installation Rules

1. **Rendered HTML Only**: Always install signatures by copying rendered HTML from the generator and pasting it into the email client's signature preferences.
2. **Never Use "Insert Picture"**: Inserting an image file locally in Outlook/Apple Mail embeds the asset directly into the email body (`cid:` attachment), which permanently freezes the banner and breaks dynamic edge updates.
3. **Email Client Quirks**:
   - Classic Outlook for Windows uses the Microsoft Word HTML rendering engine (`mso-`). All layouts must use strict table grids with inline styles.
   - Flexbox, CSS Grid, external CSS files, `<script>`, SVG images, and base64 images are strictly prohibited in email signatures.

---

## 5. Testing & Verification

- **Direct Endpoint Health Check**:
  ```bash
  curl -s "https://sig.capte.co/status?o=la"
  ```
- **Image Redirect Check**:
  ```bash
  curl -I "https://sig.capte.co/banner.png?o=la"
  ```
- **Click Attribution Check**:
  ```bash
  curl -I "https://sig.capte.co/go?o=la"
  ```
- **Local Test Harness**: Open `tools/email-signature/signature-banner-test-la.html` in a web browser to test clipboard formatting and visual alignment.
