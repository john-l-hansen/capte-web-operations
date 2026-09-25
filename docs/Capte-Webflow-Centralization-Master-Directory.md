# Capte Technologies — Webflow Centralization & Projects Master Directory

**Document Owner**: John Hansen ([john@capte.co](mailto:john@capte.co)) — Digital Design & Web Operations  
**Entity**: Capte Technologies Inc. (Los Angeles, CA)  
**Production Runtime**: [capte.co](https://capte.co) (Webflow Enterprise)  
**Repository**: [`capte-web-operations`](https://github.com/john-l-hansen/capte-web-operations)  
**Design System**: Figma (`Capte — Design System`, File ID: `oFZw7IVtiURZG2x5XhAKyD`)  
**Status**: Active / Canonical Directory (Google Drive Ready)  

---

## 1. Executive Summary & Purpose

To support Capte Technologies' expansion across North America and Europe in industrial IoT, vehicle fleet telemetry, and precision positioning, Web Operations has engineered a **centralized Webflow architecture**.

This ecosystem bridges visual design in **Figma**, version-controlled code in **GitHub**, production deployment in **Webflow**, and self-service marketing utilities for global staff.

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

## 2. Master Projects & Components Inventory

### 1. Codified Design Tokens & Automated Figma Sync
* **Location**: `design-system/` & `.github/workflows/figma-sync.yml`
* **Status**: **Active / Production**
* **Purpose**: Establishes a single source of truth for design variables, completely eliminating visual drift between Figma and Webflow.
* **Key Capabilities**:
  * **217 Codified Variables**: Brand colors, surface tints, functional states, typography scales (`Roboto`, `Roboto Mono`), spacing units, elevation shadows, and corner radii.
  * **Daily CI/CD Synchronization**: GitHub Actions automatically queries the Figma REST API, parses variable collections from `Capte — Design System`, and compiles `tokens.css` and `tokens.json`.
  * **Client-First Standards**: Fully aligned with Finsweet Client-First conventions for direct application in Webflow.

---

### 2. Promo Card Component (Region-Gated Event Embed)
* **Location**: `components/promo-card/`
* **Status**: **Active / Production** (e.g., Deployed for APTA EXPO 2026)
* **Purpose**: Region-targeted promotional floating card (desktop) and bottom drawer (mobile) for major industry events and webinars.
* **Key Capabilities**:
  * **Edge-Based Geolocation**: Uses Cloudflare's native `/cdn-cgi/trace` on `capte.co`—zero third-party API costs, no tracking scripts, zero latency, and no browser GPS permission dialogs.
  * **Dual-Delivery Architecture**: Built both as a Webflow Visual Code Component (editable properties in the Designer right panel) and a self-contained vanilla HTML embed.
  * **Fail-Closed Principle**: Automatically aborts rendering if geo-conditions are unmet or network errors occur, preventing broken layouts.
  * **Staging QA**: Supports instant URL query parameter overrides (`?promoDebug=1&promoCountry=US`).

---

### 3. Campaign Link & QR Code Generator
* **Location**: `components/campaign-qr-generator/` & `tools/campaign-qr-generator/`
* **Status**: **Active / Internal Tool & Web Component**
* **Purpose**: Generates scannable, print-safe QR codes and dynamic tracking links for trade show backdrops, vehicle wraps, banners, flyers, and badges.
* **Key Capabilities**:
  * **Anti-Dead-Print Engine**: Encodes Webflow 301 shortlinks (`https://capte.co/go/[slug]`) so printed physical collateral can be repointed anytime in Webflow Project Settings without reprinting.
  * **Forced GA4 Attribution**: Eliminates `Direct / None` attribution loss by auto-constructing standardized UTM tracking schemas.
  * **Print Physics Scannability**: Enforces Reed-Solomon Level Q/H error correction, ISO 4-module quiet zones, and 14.7:1+ optical contrast ratios.
  * **Dual Export**: Vector SVG (`.svg`) for large-format print houses and $1024 \times 1024\text{px}$ 300-DPI raster PNGs.

---

### 4. Multi-Office Email Signature System & Generator
* **Location**: `components/email-signature/` & `tools/email-signature/`
* **Status**: **Active / Ready to Deploy**
* **Purpose**: Brand-compliant, accessible, Word-engine-proof email signature generator for all Capte global employees.
* **Key Capabilities**:
  * **Multi-Office Localization**: Instant configuration for **Los Angeles** (HQ), **Versailles** (France), and **Amsterdam** (Netherlands) with localized postal formats and dialing codes.
  * **Outlook Word-Engine Compliant**: Built strictly with nested HTML tables and inline CSS to eliminate layout collapsing in Outlook on Windows.
  * **1-Click Dual Clipboard Export**: Simultaneously copies rich HTML and plain text for effortless 30-second setup.
  * **High-DPI Retina Branding**: Hosted `@2x` logo assets with 22px clear space and automated GA4 inbound tracking.

---

### 5. Blog Section-Anchor Extractor
* **Location**: `tools/blog-section-anchors/`
* **Status**: **Active / Utility**
* **Purpose**: Browser bookmarklet and utility allowing sales and marketing reps to pull deep H2/H3 anchor links from live Webflow CMS blog articles on `capte.co` for targeted email pitches and social campaigns.

---

### 6. Component Scaffolding SOP & Governance Constitution
* **Location**: `components/_template/`, `CONSTITUTION.md`, & `AGENTS.md`
* **Status**: **Repository Standard**
* **Purpose**: Standardized engineering template and 7-Article Governance Contract ensuring strict CSS scoping, fail-closed stability, accessibility, and multi-agent AI collaboration.

---

## 3. Quick Reference Matrix for Team Use

| Tool / Project | Primary User | Access / File Path | Deployment / Output |
| :--- | :--- | :--- | :--- |
| **Figma Token Sync** | Web Ops / Designers | `design-system/tokens.css` | Webflow Global Styles & Custom Embeds |
| **Promo Card** | Marketing / Event Leads | `components/promo-card/` | capte.co Homepage & Landing Pages |
| **Campaign QR Generator** | Print & Event Marketing | `tools/campaign-qr-generator/` | Vector SVG / 300-DPI PNG + Webflow 301 Redirect |
| **Email Signature Gen** | All Global Employees | `tools/email-signature/` | 1-Click Clipboard &rarr; Outlook / Apple Mail |
| **Section Anchor Extractor** | Sales & Marketing | `tools/blog-section-anchors/` | Deep-linked URL for Customer Outreach |
| **New Component Scaffold** | Developers / Agents | `components/_template/` | Webflow Code Component / Custom Embed |

---

## 4. Maintenance & Support Escalation

- **System Lead & Design Ops**: John Hansen ([john@capte.co](mailto:john@capte.co)) — Los Angeles, CA
- **GitHub Repository**: [`capte-web-operations`](https://github.com/john-l-hansen/capte-web-operations)
- **Figma Design System**: [`Capte — Design System` (File ID: `oFZw7IVtiURZG2x5XhAKyD`)](https://www.figma.com/design/oFZw7IVtiURZG2x5XhAKyD/Capte-%E2%80%94-Design-System?node-id=826-5425&t=dLQ3wZ6taQyM5qSf-1)
