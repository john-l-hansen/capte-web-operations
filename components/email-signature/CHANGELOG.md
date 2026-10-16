# Changelog — Email Signature Generator & Component

All notable changes to the Capte Email Signature component and generator utility will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-10-16

### Changed
- **Cross-Platform Universal Logo**: Replaced solid white-tile asset with universal transparent PNG (`750x248` master rendered at `150x50` Retina display size) featuring an anti-aliased white contour stroke. Eliminates rectangular "sticker" effect on dark surfaces while rendering natively in both light and dark email clients without CSS filters.
- **Brand Typography Stack & Proportional Scale**: Upgraded font stack to `'Roboto', Arial, Helvetica, sans-serif` across all 12 permutations and generator templates. Elevated name typography to `16px / line-height: 22px` (`#001384`) and detail text to `14px / line-height: 20px` (`#0F0F11` and `#5C6470`).
- **Precision Left Alignment**: Aligned contact lines directly flush (`padding-left: 0`) under the outer curve of the Capte mark, paired with a balanced `14px` gap beneath the logo.
- **Stacked Action Hierarchy**: Redesigned generator actions with a prominent full-width primary CTA ("Copy signature") above a 2-column secondary utility row ("Copy HTML" and "Copy plain text") matching Capte UI ergonomics.
- **Form UX & Progressive Validation**: Implemented clean starting states with placeholder examples (`e.g. Sarah Chen`) and on-demand validation (`validateForm(showErrors)`), completely eliminating startup red error outlines.
- **Brand Polish & Metadata**: Integrated official brand favicon, Open Graph social card (`capte-email-signature-og.png`), and aligned page metadata format (`Email Signature Generator | Capte Technologies`).

## [1.0.0] - 2026-09-25

### Added
- **Word-Engine-Compliant Outlook HTML Generator**: Nested `<table>` architecture with strict inline CSS, `cellpadding="0" cellspacing="0" border="0"` and zero external CSS dependencies.
- **Centralized Office Configuration (`office-config.js`)**: Single-source-of-truth configuration supporting Los Angeles (`la`), Versailles (`fr`), and Amsterdam (`nl`) with localized postal formatting, phone dial codes, format hints, and localized country names in English, French, and Dutch.
- **Interactive Generator App (`tools/email-signature/email-signature-generator.html`)**:
  - Live preview container with dark mode and image-blocking toggles.
  - 1-click clipboard actions: dual rich HTML + plain text copy with `ClipboardItem` (and `execCommand` fallback), raw HTML copy, and plain text copy.
  - Accessible tabbed installation guides for New Outlook & Web, Classic Outlook for Windows, Outlook for Mac, and iOS/Android.
  - Real-time field validation with `aria-describedby` and `aria-invalid` bindings.
- **Webflow Code Component (`EmailSignature.tsx`, `EmailSignature.webflow.tsx`, `EmailSignature.module.css`)**: Dual-delivery support for visual editing in Webflow Designer.
- **Figma Specification (`FIGMA_SPEC.md`)**: Complete Auto Layout hierarchy, variable bindings, and 1-click Developer Console generation script.
- **Rendered HTML Sample Suite (`samples/`)**: 9 office × language combinations + reply variants, each under 3.5 KB (well below the 15 KB Outlook threshold).
- **QA Verification Matrix**: Complete multi-client validation report.
