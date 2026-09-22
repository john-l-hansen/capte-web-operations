# Changelog — Campaign Link & QR Generator

All notable changes to the `<campaign-qr-generator>` tool and Web Component will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-09-22

### Added
- **Zero-Dependency ISO/IEC 18004 Reed-Solomon QR Encoder**:
  - Full Galois Field $\text{GF}(2^8)$ polynomial arithmetic (generator $0x11D$).
  - Complete support for QR Versions 1 through 40 and Error Correction Levels L (7%), M (15%), Q (25%), and H (30%).
  - Standard 8-mask pattern evaluation with penalty minimization ($N_1, N_2, N_3, N_4$).
  - Dynamic 15-bit BCH format information and 18-bit BCH version information encoding.
- **`<campaign-qr-generator>` Web Component**:
  - Shadow DOM encapsulated rendering.
  - Native SVG generator with crisp pixel alignment and configurable quiet zone (default 4 modules).
  - High-DPI 300-DPI canvas rasterizer for clean $1024 \times 1024\text{px}$ exports.
  - Public export methods: `downloadSvg()`, `downloadPng()`, `copySvg()`, `copyUrl()`.
- **Dynamic 301 Vanity Redirect Engine (Anti-Dead-Print)**:
  - Generates repointable `/go/[event-slug]` vanity routes.
  - Instant Webflow 301 Redirect snippet builder for Project Settings copy-pasting.
- **Forced UTM Attribution Builder**:
  - Auto-constructs and sanitizes `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and `utm_term`.
  - Chip presets for common event channels (`live_event`, `trade_show`, `booth_banner`, `badge_lanyard`).
- **Print Physics & Scannability Inspector**:
  - Real-time optical contrast ratio calculator using Capte brand design tokens (`#001384`, `#111215`, `#FAFAF8`, `#FFFFFF`).
  - Scannability status badge with contrast threshold alerts.
- **Documentation & Print Guidelines**:
  - Complete README with physical scanning distance matrix and Webflow deployment instructions.
