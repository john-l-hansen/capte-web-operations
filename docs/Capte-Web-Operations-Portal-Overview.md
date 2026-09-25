# Capte Technologies — Design & Web Operations Portal
## Executive Overview, System Architecture & Operational Directory

**Document Owner**: John Hansen (john@capte.co) — Digital Design & Web Operations  
**Entity**: Capte Technologies Inc. (Los Angeles, CA)  
**Production Runtime**: capte.co & Webflow Enterprise  
**Repository**: https://github.com/john-l-hansen/capte-web-operations  
**Design System**: Figma File ID `oFZw7IVtiURZG2x5XhAKyD`  
**Classification**: Internal Operations / Share Drive Documentation  

---

### 1. Executive Summary & Business Mission

Capte Technologies engineers industrial IoT, smart telemetry, and precision positioning systems for transit agencies, municipal vehicle fleets, and industrial infrastructure across North America and Europe.

The **Capte Design & Web Operations Portal** serves as the unified operational nervous system connecting:
1. **Brand Design & Visual Assets** authored in Figma.
2. **Version-Controlled Engineering & CI/CD** housed in GitHub.
3. **Live Web Production & Marketing Automation** deployed across capte.co in Webflow.
4. **Internal Marketing & Field Operations Utilities** empowering sales, event marketing, and staff communications.

The portal eliminates operational drift, ensures zero attribution loss across marketing campaigns, guarantees cross-platform brand compliance, and enforces fail-closed engineering standards.

> **Strategic Roadmap & Migration Mandate:**  
> The explicit architectural intent for all components, utilities, and digital experiences across this repository is **progressive migration and native integration into the primary Webflow site (`capte.co`) when able**. All tools and components are authored with clean modular boundaries, design tokens, and semantic markup to facilitate seamless conversion to native Webflow components, CMS structures, and Code Components (`@webflow/react`).

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
       │          Webflow Production          │ ◄───│  Progressive Native Migration │
       │     (capte.co Live Site Embeds)      │     │  (Components, Tools, CMS)     │
       └──────────────────────────────────────┘     └───────────────────────────────┘
```

---

### 2. Cross-Platform Source Authority Matrix

Authority within Capte's web operations is strictly scoped by functional domain:

| Domain | Authoritative Scope | What is Carried into Operations | Primary Owner / Platform |
| :--- | :--- | :--- | :--- |
| **Google Drive / Shared Docs** | Business requirements, sales specs, strategic campaign goals, approved legal/editorial copy. | Doc URL, approval date, business decision owner. | John Hansen / Executive Team |
| **Figma** | Visual design intent, UI layouts, interactive component states, design tokens. | Capte Design System file/node URLs, breakpoint specs. | John Hansen / Figma Workspace |
| **GitHub** | Implementation code, version history, CI/CD automation, technical documentation, design token builds. | Repo path, commit SHA, PR link, tagged releases. | capte-web-operations Repository |
| **Webflow** | Live deployed runtime state, CMS collections, page structures, published custom embeds, and ultimate migration destination. | Site/page URL, embed component instances, 301 redirects. | Webflow Designer (capte.co) |

---

### 3. Portal Inventory & Capabilities

#### Section A: Internal Marketing & Operations Utilities

* **Campaign Link & QR Generator (`tools/campaign-qr-generator/`)**:
  * **Anti-Dead-Print Engine**: Formats short Webflow 301 vanity routes (`/go/[slug]`) so physical print collateral (trade shows, vehicle wraps, banners, badges) can be repointed post-event without costly reprints.
  * **Forced UTM Schema**: Eliminates `Direct / None` traffic blindness by auto-building structured UTM attribution for Google Analytics 4 (GA4) and CRM ingestion.
  * **Print Physics Scannability**: Native Reed-Solomon polynomial division in GF(2^8) (Level Q / Level H error correction) and 14:1+ optical contrast ratios.
  * **Dual Production Export**: Vector SVG (`.svg`) for professional print shops and 1024x1024px 300-DPI PNGs.

* **Blog Section-Anchor Extractor (`tools/blog-section-anchors/`)**:
  * **1-Click Bookmarklet Tool**: Extracts deep anchor links (H2/H3 header IDs) from any live article on capte.co.
  * **Social & Sales Repurposing**: Allows marketing and sales teams to link directly to specific technical sections in emails and social campaigns.

* **Internal Email Signature Generator (`tools/email-signature/`)**:
  * **Multi-Office Configuration**: Instant switching between Los Angeles (HQ), Versailles (France), and Amsterdam (Netherlands) offices with localized phone numbers and addresses.
  * **Dual Clipboard Copy**: 1-click rich HTML clipboard copy (preserving inline styles for Outlook/Apple Mail) and plain-text fallback.
  * **Word-Engine Compliant**: Explicit pixel dimensions, inline styles, and high-DPI retina logos to avoid distortion across Outlook and mobile clients.

#### Section B: Active Web Components (Webflow Production Embeds)

* **Promo Card (`components/promo-card/`)**:
  * **Edge Geo-Targeting**: Leverages Cloudflare same-origin `/cdn-cgi/trace` on capte.co for instant, zero-API geolocation (eliminating third-party tracking APIs, latency, and GPS browser prompts).
  * **Fail-Closed Robustness**: Silently aborts rendering if geo-detection or campaign conditions fail, preventing broken visual states.
  * **Dual-Delivery Architecture**: Built as both a Visual Code Component (`.tsx` + `.webflow.tsx`) and a self-contained vanilla embed (`.html`).
  * **Staging QA**: Full URL parameter override support (`?promoDebug=1&promoCountry=US`).

#### Section C: Codified Brand Design System & Tokens

* **217 Codified Variables**: Complete extraction of brand colors, surface tints, functional states, typography scales, spacing units, elevation shadows, and corner radii.
* **Automated CI/CD Sync**: Daily GitHub Actions workflow (`.github/workflows/figma-sync.yml`) queries the Figma REST API and parses variable collections into `tokens.css` and `tokens.json`.
* **Baseline Brand Palette**:
  * **Capte Deep Blue**: `#001384` (Structural anchor, typography)
  * **Capte Accent Blue**: `#093AEC` (Interactive accents, links)
  * **Capte Accent Orange**: `#FC5522` / Hover: `#DD3603` (Primary conversion CTAs only)
  * **Surface / Muted Tints**: `#FFFFFF` / `#F2F4FC` / `#DCEDFF`

---

### 4. Engineering & Governance Standards

All tools and components adhere to the 7-Article Governance Contract (`CONSTITUTION.md`):

* **Strict CSS Scoping**: Every class and variable is namespaced (e.g., `.promo-card_*`, `.email-sig_*`) to prevent style collisions with Webflow's global CSS.
* **Fail-Closed Principle**: Components fail silently and cleanly; missing network responses or bad parameters never produce broken UI.
* **Zero Third-Party Tracking / Zero Client Secrets**: No external tracking scripts, GPS popups, or sensitive API keys in client-side code.
* **Client-First Structure**: Complete alignment with Webflow Client-First class conventions.
* **Accessibility (a11y) & Performance**: Semantic HTML landmarks, keyboard accessibility, WCAG AA 4.5:1+ contrast compliance, and reduced-motion query support.

---

### 5. Multi-Agent & Developer Operating Model

The repository provides standardized adapters (`AGENTS.md`, `CLAUDE.md`, `.agents/rules/`) allowing human developers and AI agents (Claude, Codex/ChatGPT, Google Antigravity, Cursor) to collaborate with zero governance drift.

#### Campaign Versioning & Tagging Protocol
* **Mechanism Updates**: Semantic version bumps (e.g., `v1.1.0`) logged in each component's `CHANGELOG.md`.
* **Campaign Releases**: Specific marketing event deployments are tagged in git upon Webflow publication:
  ```bash
  git tag <component-name>-<campaign-id>  # e.g., promo-card-apta-2026-transform-expo
  git push origin --tags
  ```
* Every deployment is tracked in the component's `campaigns.md`.

---

### 6. Support, Ownership & Escalation

* **Owner & System Lead**: John Hansen (john@capte.co) — Los Angeles, CA
* **Repository & Bug Tracker**: https://github.com/john-l-hansen/capte-web-operations
* **Security Disclosures & Token Flags**: Report any design token drift, broken embed instances, or security considerations immediately to john@capte.co.
