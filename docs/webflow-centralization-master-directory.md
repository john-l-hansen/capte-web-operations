# Capte Technologies — Webflow Centralization & Projects Master Directory

**Document Owner**: John Hansen ([john@capte.co](mailto:john@capte.co)) — Digital Design & Web Operations  
**Entity**: Capte Technologies Inc. (Los Angeles, CA)  
**Production Runtime**: [capte.co](https://capte.co) (Webflow Enterprise)  
**Repository**: [`capte-web-operations`](https://github.com/john-l-hansen/capte-web-operations)  
**Target Audience**: Executive Team, Product & Web Operations, Marketing, Sales, and Regional Staff  

---

## 1. Executive Summary & Purpose

To support Capte Technologies' growth across North America and Europe in industrial IoT, fleet telemetry, and precision positioning, Web Operations has built a **centralized Webflow ecosystem**. 

This ecosystem connects:
1. **Figma Visual Design**: Design tokens and Auto Layout component definitions.
2. **GitHub Source of Truth**: Version-controlled React (`.tsx`), Webflow Code Component declarations (`.webflow.tsx`), and self-contained embeds (`.html`).
3. **Webflow Production ([capte.co](https://capte.co))**: Live client-facing landing pages, dynamic CMS collections, and region-gated marketing embeds.
4. **Internal Operations Tools**: Self-service utilities empowering non-technical sales, marketing, and field teams with 1-click workflows.

```text
       ┌────────────────────────────────────────────────────────┐
       │                 Figma Design System                    │
       │         (Visual Tokens, Layouts & Variants)            │
       └───────────────────────────┬────────────────────────────┘
                                   │ Daily Automated Sync
                                   ▼ (GitHub Actions CI/CD)
  ┌──────────────────────────────────────────────────────────────────────────────────┐
  │                      GitHub Repository: capte-web-operations                     │
  │  ┌─────────────────────────┐  ┌────────────────────────┐  ┌───────────────────┐  │
  │  │ design-system/          │  │ components/            │  │ tools/            │  │
  │  │ tokens.json, tokens.css │  │ Embeds & React (.tsx)  │  │ Marketing Apps    │  │
  │  └─────────────────────────┘  └────────────────────────┘  └───────────────────┘  │
  └─────────────────────────┬──────────────────────────────────────┬─────────────────┘
                            │ Reviewed PR Deploy                   │ Internal Utilities
                            ▼                                      ▼
        ┌──────────────────────────────────────┐     ┌───────────────────────────────┐
        │          Webflow Production          │     │    Internal Operations Portal │
        │     (capte.co Live Site Embeds)      │     │  (QR, Signatures, Extractors) │
        └──────────────────────────────────────┘     └───────────────────────────────┘
```

---

## 2. Master Project Inventory

The projects deployed or prepared for Webflow are organized into four core pillars:

```text
├── 1. Core Design System & CI/CD Pipeline
├── 2. Production Web Components (Webflow Embeds & Code Components)
├── 3. Internal Marketing & Operations Utilities
└── 4. Governance, Component Scaffolding & Multi-Agent Framework
```

---

### Pillar 1: Core Design System & CI/CD Pipeline

#### Project: Codified Design Tokens & Automated Figma Sync
* **Location**: `design-system/` & `.github/workflows/figma-sync.yml`
* **Status**: **Active / Production**
* **Purpose**: Establish a single, shared source of truth for all brand styles across Figma, GitHub, and Webflow, preventing design drift and visual inconsistencies.
* **Key Features & Implementation**:
  - **217 Codified Variables**: Complete extraction of brand colors, functional states, typography scales (`Roboto`, `Roboto Mono`), spacing units, elevation shadows, and border radii.
  - **Daily Automated CI/CD Sync**: A GitHub Actions workflow queries the Figma REST API, parses variable collections from `Capte — Design System` (Figma File ID: `oFZw7IVtiURZG2x5XhAKyD`), and compiles:
    - `tokens.css`: CSS custom properties (`var(--capte-*)`) ready for Webflow global code or component-level scoping.
    - `tokens.json`: Machine-readable tokens for programmatic tools and build pipelines.
  - **Client-First Alignment**: Formatted in accordance with Finsweet's Client-First conventions for seamless integration into Webflow classes.

---

### Pillar 2: Production Web Components (Client-Facing)

#### Project 1: Promo Card Component (`promo-card`)
* **Location**: `components/promo-card/`
* **Status**: **Active / Production** (e.g., Deployed for APTA EXPO 2026)
* **Purpose**: Region-gated, campaign-driven promotional floating card (desktop bottom-right) and bottom drawer (mobile) used for high-visibility event announcements and lead capture.
* **Key Features & Implementation**:
  - **Edge-Based Cloudflare Geolocation**: Leverages same-origin `/cdn-cgi/trace` on `capte.co`. Eliminates third-party geo-lookup APIs, monthly API subscription costs, latency delays, and intrusive browser GPS permission popups.
  - **Dual-Delivery Architecture**:
    1. **Visual Code Component (`.tsx` + `.webflow.tsx`)**: Allows marketers and designers to adjust campaign copy, dates, booth numbers, and target countries directly within Webflow Designer's visual sidebar without writing code.
    2. **Self-Contained Vanilla Embed (`.html`)**: Lightweight, drop-in snippet for standard Webflow Custom Code Embed elements.
  - **Fail-Closed Robustness**: If network geo-detection fails or conditions are unmet, the component silently aborts rendering, guaranteeing zero broken UI or layout shifts.
  - **Built-in Staging QA**: Supports instant URL query testing (`?promoDebug=1&promoCountry=US`).

---

### Pillar 3: Internal Marketing & Operations Utilities (Team Use)

#### Project 1: Campaign Link & QR Code Generator
* **Location**: `components/campaign-qr-generator/` & `tools/campaign-qr-generator/`
* **Status**: **Active / Internal Tool & Web Component**
* **Purpose**: High-reliability generator for physical print collateral (trade show booth backdrops, pull-up banners, badge lanyards, vehicle fleet wraps, flyers, and executive handouts).
* **Key Features & Implementation**:
  - **Anti-Dead-Print Engine (Webflow 301 Shortlinks)**: Generates short vanity routes (`https://capte.co/go/[slug]`). If an event finishes or a landing page changes, operations can repoint the destination in Webflow Project Settings at any time without reprinting physical collateral.
  - **Forced GA4 Attribution**: Automatically enforces standardized UTM tracking parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`), eliminating `Direct / None` attribution blindness.
  - **Print Physics & ISO/IEC 18004 Compliance**: Enforces Reed-Solomon Level Q (25%) / Level H (30%) error correction, ISO 4-module quiet zones, and high-contrast brand tokens (14.7:1+ optical contrast).
  - **Dual Format Output**: Instant vector SVG (`.svg`) for professional large-format print houses and $1024 \times 1024\text{px}$ 300-DPI raster PNGs.

#### Project 2: Multi-Office Email Signature System & Generator
* **Location**: `components/email-signature/` & `tools/email-signature/`
* **Status**: **Completed / Ready for Deployment**
* **Purpose**: Provide all global employees with an on-brand, accessible, Outlook Word-engine-compliant email signature with 1-click installation.
* **Key Features & Implementation**:
  - **Triple Office Localization**: Pre-configured support for **Los Angeles** (HQ), **Versailles** (France), and **Amsterdam** (Netherlands) with localized postal standards (USPS, La Poste, PostNL) and international dialing codes (`+1`, `+33`, `+31`).
  - **Outlook Word-Engine Proof Markup**: Built strictly with nested `<table>` layouts and inline CSS to survive Microsoft Outlook Windows sanitization and prevent collapsed flexbox/margin bugs.
  - **1-Click Dual Clipboard Copy**: Simultaneously writes rich HTML and plain-text fallback to the clipboard via the Modern Clipboard API.
  - **High-DPI Retina Branding**: Hosted `@2x` logo assets with brand-standard **22px clear space** and automated GA4 inbound campaign tracking.

#### Project 3: Blog Section-Anchor Extractor
* **Location**: `tools/blog-section-anchors/`
* **Status**: **Active / Operational Utility**
* **Purpose**: One-click bookmarklet and helper utility allowing marketing, PR, and sales reps to extract deep anchor links (H2/H3 header IDs) from live Webflow CMS blog posts on [capte.co](https://capte.co).
* **Key Features & Implementation**:
  - Enables granular linking directly to specific subtopics in whitepapers, case studies, and blog articles for targeted client emails and social media threads.

---

### Pillar 4: Architecture, Governance & Component Scaffolding

#### Project 1: Universal Component Scaffolding Framework (`_template`)
* **Location**: `components/_template/`
* **Status**: **Active / Standard Operating Procedure**
* **Purpose**: Ensure that every new component built for Webflow meets enterprise reliability, accessibility, and maintainability standards.
* **Included Blueprint Files**:
  - `Template.tsx`: React functional component with scoped styling.
  - `Template.webflow.tsx`: Webflow Designer property definitions (`props.Text`, `props.Link`, `props.Boolean`, `props.Image`, `props.Variant`).
  - `Template.module.css`: Scoped CSS using `--capte-*` design tokens.
  - `template.html`: Standalone vanilla HTML/CSS/JS payload for direct Webflow embed.
  - `FIGMA_SPEC.md`: 1:1 Auto Layout and design variable specification.
  - `campaigns.md`: Versioning ledger for live campaign releases.

#### Project 2: Governance Contract & Constitution
* **Location**: `CONSTITUTION.md` & `AGENTS.md`
* **Status**: **Canonical Repository Law**
* **Governing Principles**:
  1. **Strict CSS Scoping**: Every component is namespaced (`.<component-name>_*`) to eliminate collisions with Webflow site styles.
  2. **Fail-Closed Principle**: Components must fail silently and gracefully if external conditions are unmet.
  3. **Zero Third-Party Tracking / Zero Client Secrets**: Strict data privacy and performance.
  4. **Accessibility (WCAG AA)**: Minimum 4.5:1 contrast, semantic markup, full keyboard navigation, and reduced-motion support.

---

## 3. Quick Reference Matrix for Team Use

| Tool / Component | Primary User | Where to Access / Run | Output / Deployment Target |
| :--- | :--- | :--- | :--- |
| **Figma Token Sync** | Web Ops / Designers | GitHub Actions (`.github/workflows/figma-sync.yml`) | `design-system/tokens.css` & Webflow Global Styles |
| **Promo Card** | Marketing / Event Leads | `components/promo-card/promo-card.html` or Designer Component | [capte.co](https://capte.co) Homepage & Landing Pages |
| **Campaign QR Generator** | Event / Print Marketing | `tools/campaign-qr-generator/` or Webflow Internal Embed | Vector SVG / 300-DPI PNG + Webflow 301 Redirect |
| **Email Signature Gen** | All Global Staff | `tools/email-signature/` or `/internal/email-signature` | 1-Click Clipboard &rarr; Outlook / Apple Mail / Web |
| **Section-Anchor Extractor**| Marketing / Sales | `tools/blog-section-anchors/` (Browser Bookmarklet) | Deep Anchor Link for Outbound Correspondence |
| **New Component Scaffold** | Developers / Agents | `components/_template/` | Webflow Custom Embed / Webflow App Registry |

---

## 4. Maintenance & Support

- **Lead Contact**: John Hansen ([john@capte.co](mailto:john@capte.co))
- **Source Code Repository**: [github.com/john-l-hansen/capte-web-operations](https://github.com/john-l-hansen/capte-web-operations)
- **Figma Design System**: [`Capte — Design System` (oFZw7IVtiURZG2x5XhAKyD)](https://www.figma.com/design/oFZw7IVtiURZG2x5XhAKyD/Capte-%E2%80%94-Design-System?node-id=826-5425&t=dLQ3wZ6taQyM5qSf-1)
