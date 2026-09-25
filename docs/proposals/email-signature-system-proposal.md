# Capte Technologies — Internal Email Signature Generator & Standardization Proposal

**Document Reference**: `CAPTE-OPS-2026-SIG-001`  
**Author**: John Hansen, Lead Web/Print Designer & Web Operations ([john@capte.co](mailto:john@capte.co))  
**Target Deployment**: Capte Web Operations Portal & `capte.co` Internal Tooling  
**Scope**: All Employees across Los Angeles, Versailles, and Amsterdam  
**Status**: Proposal for Review & Deployment Authorization  
**Date**: September 25, 2026  

---

## 1. Executive Summary

As Capte Technologies scales industrial IoT and precision telemetry deployments across North American and European transit agencies, our daily outbound correspondence represents thousands of brand touchpoints per week. 

Currently, employees across our three primary offices (**Los Angeles**, **Versailles**, and **Amsterdam**) manually construct or adapt their email signatures. This practice produces visual inconsistencies, broken layouts in Microsoft Outlook on Windows, unreadable color contrast ratios, missing marketing tracking, and deliverability flags caused by embedded base64 image files.

To resolve these issues, Web Operations has engineered a zero-friction, internal **Email Signature Generator**. Employees enter their details into a lightweight web form, preview their signature in real time, and copy a battle-tested, Outlook Word-engine-compliant signature directly to their clipboard with a single click.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CAPTE EMAIL SIGNATURE WORKFLOW                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   1. Employee Input        2. Real-Time Preview      3. 1-Click Clipboard   │
│   ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐     │
│   │ • Name & Title  │ ───► │ • Word-Engine   │ ───► │ • Dual HTML /   │     │
│   │ • Office/Lang   │      │   Nested Tables │      │   Plain Text    │     │
│   │ • Mobile/Phone  │      │ • Local Postal  │      │ • 30-Sec Setup  │     │
│   └─────────────────┘      └─────────────────┘      └─────────────────┘     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Business Problem & Operational Risks

| Current Pain Point | Technical / Operational Risk | Business Impact |
| :--- | :--- | :--- |
| **Drift in Brand Typography & Color** | Employees use arbitrary colors, decorative fonts, or outdated logos. | Dilutes enterprise credibility with transit authorities and fleet operators. |
| **Outlook Desktop Word-Engine Layout Breakage** | Modern CSS (flexbox, grid, `<div>` margins) collapses in Outlook Windows. | Distorted line spacing, overlapping text, and unformatted contact rows. |
| **Spam Flags & Base64 Attachments** | Copy-pasting images directly creates base64 payload strings or inline attachments. | Increases spam filtering rates; creates cluttered `.png` attachments on every email. |
| **Lost Marketing Attribution** | Plain links to `capte.co` default to `Direct / None` traffic in analytics. | Marketing cannot track inbound engagement or lead discovery driven by sales outreach. |
| **Accessibility Failures** | Default gray text colors (e.g. `#7B8491` at 3.8:1) fail WCAG contrast standards. | Reduced readability on varying display calibrations, mobile devices, and dark mode. |

---

## 3. The Proposed Solution

The **Capte Email Signature System** is composed of three interconnected parts:

### A. The Self-Service Web Generator (`tools/email-signature/`)
A responsive internal web application adhering to the Capte Design System:
- **Instant Live Preview**: Shows exact rendering against a simulated white email background with Dark Mode and Images-Blocked QA inspection toggles.
- **Dynamic Office Configuration**: Selecting an office automatically sets that country's default language, formats the postal address, and pre-fills the international dialing code (`+1`, `+33`, `+31`).
- **1-Click Dual Clipboard Export**: Uses `navigator.clipboard.write([new ClipboardItem(...)])` to place both `text/html` and `text/plain` on the clipboard simultaneously, falling back seamlessly for legacy browsers.
- **Embedded Setup Manuals**: Step-by-step installation tabs for New Outlook/Web, Classic Outlook Windows, Outlook for Mac, and iOS/Android.

### B. Bulletproof Email HTML Architecture
- **Pure Nested `<table>` Markup**: Built strictly with `cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;"`.
- **Zero CSS Classes or External Styles**: 100% inline CSS to survive aggressive email client sanitizers.
- **Ultra-Lightweight Payload**: Entire signature payload is **under 3.5 KB** (far below the 15 KB Outlook budget).
- **Retina Logo Tile (`189 × 92px`)**: References a hosted `@2x` PNG with the brand's official **22px clear space** built in (aligning the text indent to the logo mark).

### C. European Postal & Linguistic Localization
- **United States (LA)**: `500 S Grand Ave, Suite 2060`, `Los Angeles, CA 90071, United States`.
- **France (Versailles)**: `7 rue des Chantiers`, `78000 Versailles, France` (La Poste standard: lowercase street type, postcode before city with no comma).
- **Netherlands (Amsterdam)**: `Kabelweg 57`, `1014 BA Amsterdam, Nederland` (PostNL standard: street before number, strictly 4-digit space 2-letter uppercase postcode).
- **Screen Reader Tagging**: Outer table sets `lang="en"`, `lang="fr"`, or `lang="nl"` so assistive tech uses correct phonetic pronunciation.
- **Dual-Signature Policy**: Guidance provided for European staff to configure both a domestic-language signature and an international English signature.

### D. Automated GA4 Attribution
Every web link (`capte.co`) automatically constructs standardized UTM tracking parameters:
```text
https://www.capte.co/?utm_source=email-signature&utm_medium=email&utm_campaign=employee-signature&utm_content=office-{la|fr|nl}
```

---

## 4. Visual Layout Specifications

### Variant 1: New Email Signature (Standard)
```text
┌─────────────────────────────────────────────────────────────┐
│  [ CAPTE LOGO TILE — 189×92px with 22px clearspace ]        │
│                                                             │
│  Sarah Chen (she/her)                                       │  <- Arial Bold 15/20 #001384
│  Lead Systems Engineer                                      │  <- Arial Regular 13/18 #0F0F11
│                                                             │
│  Mobile   +1 858 231 2916                                   │  <- Labels: Arial 13/20 #5C6470 (64px fixed)
│  Office   +1 213 555 0100                                   │  <- Values: Arial 13/20 #0F0F11
│  Email    s.chen@capte.co                                   │
│  Web      capte.co                                          │  <- Link: Underlined #001384
│                                                             │
│  500 S Grand Ave, Suite 2060                                │  <- Address: Arial 13/18 #5C6470
│  Los Angeles, CA 90071, United States                       │
└─────────────────────────────────────────────────────────────┘
```

### Variant 2: Replies & Forwards (Compact)
* Designed to prevent email thread clutter:
* **No logo row**, **0px left indent**, **Title includes company name**, and **Mobile row only**.
```text
Sarah Chen
Lead Systems Engineer, Capte Technologies
Mobile: +1 858 231 2916
```

### Variant 3: Mobile Plain Text
* Clean text layout for Outlook iOS and Android mobile apps.

---

## 5. Technical Deliverables Summary

All code and assets are version-controlled in the repository (`capte-web-operations`):

1. **Interactive Generator Application**: [`tools/email-signature/email-signature-generator.html`](../../tools/email-signature/email-signature-generator.html)
2. **Centralized Configuration File**: [`tools/email-signature/office-config.js`](../../tools/email-signature/office-config.js) *(Adding new offices requires 1 line of configuration)*
3. **Webflow Designer Code Component**: [`components/email-signature/EmailSignature.tsx`](../../components/email-signature/EmailSignature.tsx) & `.webflow.tsx`
4. **Figma Auto-Layout Specification**: [`components/email-signature/FIGMA_SPEC.md`](../../components/email-signature/FIGMA_SPEC.md)
5. **Rendered Samples Suite**: 12 pre-rendered HTML files in [`components/email-signature/samples/`](../../components/email-signature/samples/)
6. **Variations Specimen Sheet**: [`components/email-signature/capte-email-signature-variations.png`](../../components/email-signature/capte-email-signature-variations.png)
7. **Portal Integration**: Card added to Web Operations Portal [`index.html`](../../index.html)

---

## 6. QA Verification Matrix Results

| Test Scenario | New Outlook (Win) | Classic Outlook (Win) | Outlook Mac | Outlook Web | iOS / Android | Gmail (External) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Layout & Spacing** | PASS | PASS | PASS | PASS | PASS | PASS |
| **Dark Mode Legibility** | PASS | PASS | PASS | PASS | PASS | PASS |
| **Images Blocked Mode** | PASS | PASS | PASS | PASS | PASS | PASS |
| **`tel:` & `mailto:` Actions** | PASS | PASS | PASS | PASS | PASS | PASS |
| **UTM Tracking Inbound** | PASS | PASS | PASS | PASS | PASS | PASS |
| **WCAG 2.2 AA Contrast** | PASS (6.0:1) | PASS (6.0:1) | PASS (6.0:1) | PASS (6.0:1) | PASS (6.0:1) | PASS (6.0:1) |

---

## 7. Operational Governance & Rollback Plan

1. **CDN Asset Immutability**: Because sent emails permanently reference the hosted logo URL, **logo files on Webflow CDN must never be deleted or overwritten**. New iterations must use versioned filenames (e.g. `logo-v2@2x.png`).
2. **HTML Layout Versioning**: All signature HTML structures are version-controlled in GitHub. Any updates are reviewed through pull requests before publication.
3. **Adding New Offices**: To add a new regional office (e.g., Munich / `de`), add a single entry to `office-config.js`. The generator, React component, and samples update automatically without changing layout code.

---

## 8. Rollout Plan & Action Items for Management

### Step 1: Management Review & Legal Input
- [ ] **Review variations sheet** ([`capte-email-signature-variations.png`](../../components/email-signature/capte-email-signature-variations.png)).
- [ ] **Confirm Legal Line**: Decide if European entities require mandatory corporate registration text (e.g., SIRET / RCS for France or KvK for Netherlands) in the footer slot `{{LEGAL_LINE}}`.

### Step 2: Hosting Deployment
- [ ] Authorize publication of the generator tool to an internal password-protected Webflow URL (e.g. `capte.co/internal/email-signature` with `noindex, nofollow`).

### Step 3: Company-Wide Announcement
- [ ] Distribute a 2-paragraph email announcement to all employees with the internal link and 30-second setup instructions.
