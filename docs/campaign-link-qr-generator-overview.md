# Capte Technologies — Campaign Link & QR Generator System
## Executive Overview, Architecture & Standard Operating Procedure (SOP)

**Document Owner**: John Hansen ([john@capte.co](mailto:john@capte.co)) — Digital Design & Web Operations  
**Entity**: Capte Technologies Inc. (Los Angeles, CA)  
**System Target**: [capte.co](https://capte.co) & Webflow Operations Portal  
**Repository**: [`john-l-hansen/capte-web-operations`](https://github.com/john-l-hansen/capte-web-operations)  
**Tool Path**: `tools/campaign-qr-generator/` & `components/campaign-qr-generator/`  
**Version**: `v1.1.0` (Production Deployed)  

---

### 1. Executive Summary & Business Objective

When deploying physical marketing and event collateral (trade show booth backdrops, pull-up banners, badges/lanyards, fleet vehicle wraps, flyers, and executive handouts), marketing teams face two severe failure modes:

1. **"Dead Prints" (Static 404 Outages)**: Hardcoding destination URLs directly into printed QR codes permanently breaks collateral if slugs change, CMS structures shift, or campaigns conclude post-print.
2. **Attribution Loss ("Direct / None" Blindness)**: Smartphone camera scans default to unsegmented `Direct / None` traffic in Google Analytics 4 (GA4) and CRM systems unless structured UTM parameters are enforced.

The **Campaign Link & QR Generator** is an internal web operations utility built to standardize how Capte connects live physical events to digital properties without creating operational, print, or analytics debt.

---

### 2. End-to-End System Architecture

```text
 1. PHYSICAL PRINT                      2. WEBFLOW 301 REDIRECT
 ┌───────────────────────────┐          ┌────────────────────────────────────────────────────────┐
 │ QR Code on Badge / Banner │ ───────► │ Old Path: /go/telematics-guide                         │
 │ https://capte.co/go/…     │          │ Redirect To: /guides/30-questions-…?[UTMs]             │
 └───────────────────────────┘          └───────────────────────────┬────────────────────────────┘
                                                                    │
                                                                    ▼
 4. INSTANT VALUE DELIVERY              3. WEBFLOW LANDING PAGE & FORM
 ┌───────────────────────────┐          ┌────────────────────────────────────────────────────────┐
 │ Auto-opens PDF Guide      │ ◄─────── │ Real Page: /guides/30-questions-to-ask-your-provider   │
 │ in new mobile tab         │ Form     │ Lean 2-Field Form (Work Email + First Name)            │
 └───────────────────────────┘ Submit   │ Hidden UTM fields auto-passed to CRM                   │
                                        └────────────────────────────────────────────────────────┘
```

---

### 3. Critical Engineering Guardrails

#### A. Anti-Dead-Print Engine (Dynamic 301 Helper)
* **Principle**: Never print deep destination URLs on physical collateral.
* **Mechanism**: Encodes short, memorizable vanity routes (e.g., `https://capte.co/go/[slug]`).
* **Operational Agility**: Marketing can repoint destination URLs in Webflow Project Settings at any time (e.g., post-event redirecting a guide to a product demo) without discarding expensive print runs.

#### B. Forced UTM Attribution Schema
* **Principle**: Zero un-attributed traffic from physical collateral.
* **Standard UTM Hierarchy**:
  * `utm_source`: Traffic origin (`live_event`, `trade_show`, `conference`, `print_flyer`, `vehicle_fleet`).
  * `utm_medium`: Channel / mechanism (default: `qr_print`, `qr_badge`, `qr_signage`, `qr_brochure`).
  * `utm_campaign`: Campaign identifier (e.g., `telematics_buyer_guide_2026`, `apta_expo_2026`).
  * `utm_content`: Physical placement (e.g., `booth_banner_main`, `badge_lanyard`, `table_tent`).
  * `utm_term`: Optional booth # or identifier (e.g., `booth_412`).

#### C. Print Physics & Optical Scannability (ISO/IEC 18004 Standard)
* **Zero Dependencies**: Native Reed-Solomon polynomial division in $\text{GF}(2^8)$ built directly in vanilla JS.
* **Error Correction Level (ECC)**: Enforces **Level Q (25% damage recovery)** or **Level H (30% damage recovery)** so codes remain scannable when creased, smudged, folded, or occluded.
* **Quiet Zone**: Enforces ISO standard 4-module border.
* **High Contrast**: Pre-calibrated brand tokens with minimum 14:1 optical contrast ratio:
  * *Capte Deep Blue*: `#001384` on `#FFFFFF` (14.7:1)
  * *Industrial Ink*: `#111215` on `#FAFAF8` (17.9:1)
  * *Monochrome Black*: `#000000` on `#FFFFFF` (21.0:1)
* **Export Standards**:
  * **Vector SVG (`.svg`)**: Infinite resolution for Adobe Illustrator, InDesign, and print shops.
  * **Raster PNG (`.png`)**: High-DPI $1024 \times 1024\text{px}$ rendering (300 DPI metadata).

---

### 4. Physical Print Distance & Dimension Matrix

| Collateral Application | Expected Scan Distance | Minimum QR Size | Recommended ECC |
| :--- | :--- | :--- | :--- |
| **Business Cards / Badge Lanyards** | 0.3 m – 0.5 m (12–20 in) | **20 × 20 mm** (0.8 × 0.8 in) | Level H (30%) |
| **Table Tents / Desk Displays** | 0.5 m – 1.0 m (20–40 in) | **35 × 35 mm** (1.4 × 1.4 in) | Level Q (25%) |
| **A5 / A4 Print Handouts & Flyers** | 0.5 m – 1.0 m (20–40 in) | **30 × 30 mm** (1.2 × 1.2 in) | Level Q (25%) |
| **Pull-Up Booth Banners** | 1.5 m – 2.5 m (5–8 ft) | **100 × 100 mm** (4.0 × 4.0 in) | Level Q (25%) |
| **Overhead Backdrop Signage** | 3.0 m – 6.0 m (10–20 ft) | **250 × 250 mm+** (10 × 10 in+) | Level Q (25%) |
| **Vehicle Fleet Wraps** | 2.0 m – 4.0 m (6–13 ft) | **150 × 150 mm** (6.0 × 6.0 in) | Level H (30%) |

---

### 5. Standard Operating Procedure (SOP) — 4-Step Campaign Launch

#### Step 1: Generate Link & QR Asset
1. Open the [Campaign Link & QR Generator](https://github.com/john-l-hansen/capte-web-operations/blob/main/tools/campaign-qr-generator/campaign-qr-generator.html).
2. Enter the **Event Short Slug** (e.g., `telematics-guide`).
3. Enter the **Target Landing Page** (e.g., `https://capte.co/guides/30-questions-to-ask-your-telematics-provider`).
4. Select UTM presets (`live_event`, `qr_print`, campaign name, placement).
5. Click **Download Vector SVG** for print production and **Save to Campaign Ledger**.

#### Step 2: Configure Webflow 301 Redirect
1. Open **Webflow Designer** &rarr; **Project Settings** &rarr; **Hosting** &rarr; **301 Redirects**.
2. Click **Copy Rule** in the generator tool and paste:
   * **Old Path**: `/go/[slug]` (e.g., `/go/telematics-guide`)
   * **Redirect To**: `/[target-path]?[full-utm-query-string]`
3. Click **Add Redirect** and publish the site.

#### Step 3: Configure Landing Page Form & Auto-Download
In the target Webflow landing page settings (Custom Code *Before `</body>`*):
```html
<script>
  // 1. Capture incoming UTMs into hidden form fields
  document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach(function(k) {
      const field = document.querySelector('input[name="' + k + '"]');
      if (field && params.get(k)) field.value = params.get(k);
    });
  });

  // 2. Auto-trigger guide download in new tab upon submission
  const PDF_URL = 'https://assets.capte.co/guides/30-questions-telematics-provider.pdf';
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function() {
      setTimeout(function() { window.open(PDF_URL, '_blank'); }, 250);
    });
  }
</script>
```

#### Step 4: Webflow Form Success State
* Style the form **Success State** with an explicit CTA button: `[ 📄 Download Guide (PDF) ]` linking directly to the asset as an immediate fallback.

---

### 6. Repository File Ledger

```text
web-components/
├── index.html                                        # Central Operations Portal
├── tools/
│   └── campaign-qr-generator/
│       ├── campaign-qr-generator.html                # Standalone Generator App & Ledger UI
│       ├── campaign-qr-generator.js                  # Zero-dependency QR Engine Web Component
│       ├── campaigns.md                              # Version-controlled campaign audit ledger
│       ├── README.md                                 # Technical documentation
│       └── CHANGELOG.md                              # Mechanism version history (v1.1.0)
└── components/
    └── campaign-qr-generator/                        # Webflow Component dual-delivery mirror
```

---

### 7. Governance & Support

* **Owner & Final Authority**: John Hansen ([john@capte.co](mailto:john@capte.co))
* **Organization**: Capte Technologies Inc. (Los Angeles, CA)
* **Auditing**: Review `campaigns.md` quarterly to archive completed event redirects.
