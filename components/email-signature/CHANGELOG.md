# Changelog — Email Signature Generator & Component

All notable changes to the Capte Email Signature component and generator utility will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

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
