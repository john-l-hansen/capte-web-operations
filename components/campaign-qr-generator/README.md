# Campaign Link & QR Generator — Marketing & Web Operations

> **Location**: `components/campaign-qr-generator/` & `tools/campaign-qr-generator/`  
> **Component**: `<campaign-qr-generator>` (Zero-dependency Web Component & Harness)  
> **Deployment Target**: `capte.co` Operations Portal & Custom Webflow Embeds  
> **Version**: `v1.0.0`

---

## 1. Objective & Marketing Context

When marketing and sales teams deploy physical print collateral (trade show booth backdrops, pull-up banners, flyers, badge lanyards, vehicle fleet wraps, and conference handouts), two catastrophic operational failures frequently occur:

1. **"Dead Prints" (Static URL 404s)**: Printing a static page URL (e.g. `https://capte.co/events/2026/apta-transform-expo`) means that if the page slug changes, the event concludes, or the CMS collection structure is updated, all printed physical collateral permanently breaks with a 404 error.
2. **Attribution Loss (Direct / None Traffic)**: Smartphone camera scans default to `Direct / None` traffic in Google Analytics 4 unless explicit UTM parameters are appended.

The **Campaign Link & QR Generator** eliminates both issues by:
- Enforcing **301 Dynamic Vanity Shortlinks** (`https://capte.co/go/[slug]`), allowing operations to repoint destination URLs in Webflow at any time without reprinting physical collateral.
- Automatically constructing and enforcing **GA4 UTM parameters** (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`).
- Adhering to strict **Print Physics & ISO/IEC 18004 standards** (Level Q/H error correction, ISO 4-module quiet zones, high-contrast brand tokens, and infinite-resolution Vector SVG / 300-DPI PNG exports).

---

## 2. Architectural Guardrails & Print Physics

```text
 ┌──────────────────────────────────────────────────────────────────┐
 │                        PRINT COLLATERAL                          │
 │         (Trade Show Booth, Badge Lanyard, A5 Handout)            │
 └────────────────────────────────┬─────────────────────────────────┘
                                  │ Smartphone Camera Scan
                                  ▼
 ┌──────────────────────────────────────────────────────────────────┐
 │                  WEBFLOW 301 VANITY SHORTLINK                    │
 │               https://capte.co/go/apta-expo-2026                 │
 └────────────────────────────────┬─────────────────────────────────┘
                                  │ Instant 301 Permanent Redirect
                                  │ (Repointable in Webflow anytime)
                                  ▼
 ┌──────────────────────────────────────────────────────────────────┐
 │                     DESTINATION LANDING PAGE                     │
 │  https://capte.co/events/2026/apta-transform-expo                │
 │    ?utm_source=live_event                                        │
 │    &utm_medium=qr_print                                          │
 │    &utm_campaign=apta_expo_2026                                  │
 │    &utm_content=booth_banner_main                                │
 └──────────────────────────────────────────────────────────────────┘
```

### A. Dynamic Redirect Pattern (Anti-Dead-Print Helper)
- Printed QR codes encode a vanity route: `https://capte.co/go/[event-slug]`.
- Destination target: `/events/...?[UTMs]`.
- The Webflow 301 redirect rule is displayed right in the UI for instant copy-pasting into Webflow Project Settings.

### B. Forced UTM Schema
| Parameter | Purpose | Default / Example Values |
| :--- | :--- | :--- |
| `utm_source` | Traffic source / event type | `live_event`, `conference`, `trade_show`, `print_flyer`, `vehicle_fleet` |
| `utm_medium` | Channel & physical mechanism | `qr_print` (default), `qr_badge`, `qr_signage`, `qr_flyer`, `qr_swag` |
| `utm_campaign` | Unified campaign or event slug | `apta_expo_2026`, `smart_transit_summit`, `innotrans_2026` |
| `utm_content` | Specific collateral placement | `booth_banner_main`, `badge_lanyard`, `table_tent`, `handout_a5` |
| `utm_term` | Optional booth # or identifier | `booth_412`, `hall_c` |

### C. Print Physics & Optical Scannability
- **Error Correction Level (ECC)**: Enforces **Level Q (25% damage recovery)** or **Level H (30% damage recovery)** so codes remain scannable when creased, smudged, folded, or occluded.
- **Quiet Zone Margin**: ISO 4-module padding enforced around matrix perimeter.
- **High-Contrast Brand Tokens**: 
  - Primary Blue: `#001384` on Clean White `#FFFFFF` (14.7:1 contrast ratio)
  - Industrial Ink: `#111215` on Mineral White `#FAFAF8` (17.8:1 contrast ratio)
  - Pure Monochrome: `#000000` on `#FFFFFF` (21.0:1 contrast ratio)
- **Vector & High-DPI Output**:
  - **Vector SVG (`.svg`)**: Infinite resolution for Adobe Illustrator, InDesign, Figma, and large-format print shops.
  - **Raster 300-DPI PNG (`.png`)**: $1024 \times 1024\text{px}$ rasterization with subpixel crisp module rendering.

---

## 3. Physical Print Size & Distance Matrix

| Collateral Application | Expected Scan Distance | Minimum QR Size | Recommended ECC |
| :--- | :--- | :--- | :--- |
| **Business Card / Badge Lanyard** | 0.3 m – 0.5 m (12–20 in) | **20 × 20 mm** (0.8 × 0.8 in) | Level H (30%) |
| **Table Tent / Desk Display** | 0.5 m – 1.0 m (20–40 in) | **35 × 35 mm** (1.4 × 1.4 in) | Level Q (25%) |
| **A5 / A4 Print Handout** | 0.5 m – 1.0 m (20–40 in) | **30 × 30 mm** (1.2 × 1.2 in) | Level Q (25%) |
| **Pull-Up Booth Banner** | 1.5 m – 2.5 m (5–8 ft) | **100 × 100 mm** (4.0 × 4.0 in) | Level Q (25%) |
| **Overhead Backdrop Signage** | 3.0 m – 6.0 m (10–20 ft) | **250 × 250 mm+** (10 × 10 in+) | Level Q (25%) |
| **Vehicle Fleet Wrap** | 2.0 m – 4.0 m (6–13 ft) | **150 × 150 mm** (6.0 × 6.0 in) | Level H (30%) |

---

## 4. Web Component API Reference

The custom element `<campaign-qr-generator>` is 100% zero-dependency vanilla JavaScript.

```html
<script src="campaign-qr-generator.js"></script>

<campaign-qr-generator
  id="my-qr"
  value="https://capte.co/go/apta-expo-2026"
  ecc="Q"
  size="280"
  color="#001384"
  bg-color="#FFFFFF"
  margin="4">
</campaign-qr-generator>
```

### Attributes & Observed Properties
| Attribute | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `String` | `'https://capte.co'` | Text or URL payload to encode |
| `ecc` | `String` | `'Q'` | Error correction level (`'L'`, `'M'`, `'Q'`, `'H'`) |
| `margin` | `Number` | `4` | ISO standard quiet zone module border |
| `color` | `String` | `'#111215'` | Dark module hex color |
| `bg-color` | `String` | `'#FAFAF8'` | Light background hex color |
| `size` | `Number` | `280` | Preview container width/height in pixels |

### Public Methods
```javascript
const el = document.getElementById('my-qr');

// 1. Get raw SVG markup string
const svgString = el.getSvgString();

// 2. Download vector SVG file
el.downloadSvg('event-qr.svg');

// 3. Download high-DPI 300 DPI PNG
el.downloadPng('event-qr-300dpi.png', 1024);

// 4. Copy SVG code or URL to clipboard
await el.copySvg();
await el.copyUrl();
```

---

## 5. Webflow Embedding & 301 Configuration

### Step 1: Add Vanity Redirect to Webflow
1. Open **Webflow Designer** &rarr; Project Settings (`Cmd+K` &rarr; Project Settings).
2. Navigate to **Hosting** &rarr; **301 Redirects**.
3. In **Old Path**, enter: `/go/[your-slug]` (e.g. `/go/apta-expo-2026`).
4. In **Redirect To**, enter the full destination URL with UTMs (e.g. `/events/2026/apta-transform-expo?utm_source=live_event&utm_medium=qr_print&utm_campaign=apta_expo_2026&utm_content=booth_banner`).
5. Click **Add Redirect** and publish the project.

### Step 2: Embed the Interactive Generator in Webflow Operations Portal
To host the full generator UI directly inside a password-protected internal Webflow page:
1. Create an internal page in Webflow (e.g. `/internal/campaign-qr-generator`).
2. Add a **Custom Code Embed** element.
3. Paste the contents of [`campaign-qr-generator.html`](campaign-qr-generator.html) into the embed block.
4. Publish the page.
