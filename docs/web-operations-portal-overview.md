# Capte Technologies — Design & Web Operations Portal
## Executive Overview, System Architecture & Operational Directory

**Document Owner**: John Hansen ([john@capte.co](mailto:john@capte.co)) — Digital Design & Web Operations  
**Entity**: Capte Technologies Inc. (Los Angeles, CA)  
**Production Runtime**: [capte.co](https://capte.co) & Webflow Enterprise  
**Repository**: [`john-l-hansen/capte-web-operations`](https://github.com/john-l-hansen/capte-web-operations)  
**Portal Entrypoint**: `index.html` (Local & CI Staging Portal)  
**Design System Source**: Figma (`Capte — Design System`, File ID: `oFZw7IVtiURZG2x5XhAKyD`)  
**Document Status**: Active / Canonical Overview (Share Drive Ready)  

---

## 1. Executive Summary & Business Mission

Capte Technologies engineers industrial IoT, smart telemetry, and precision positioning systems for transit agencies, municipal vehicle fleets, and industrial infrastructure across North America and Europe.

To match Capte’s engineering precision, the **Capte Design & Web Operations Portal** serves as the unified operational nervous system and living repository connecting:
1. **Brand Design & Visual Assets** authored in Figma.
2. **Version-Controlled Engineering & CI/CD** housed in GitHub.
3. **Live Web Production & Marketing Automation** deployed across [capte.co](https://capte.co) in Webflow.
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

## 2. Cross-Platform Source Authority Matrix

Authority within Capte’s web operations is strictly scoped by functional domain:

| Domain | Authoritative Scope | What is Carried into Operations | Primary Owner / Platform |
| :--- | :--- | :--- | :--- |
| **Google Drive / Shared Docs** | Business requirements, sales specs, strategic campaign goals, approved legal/editorial copy. | Doc URL, approval date, business decision owner. | John Hansen / Executive Team |
| **Figma** | Visual design intent, UI layouts, interactive component states, design tokens. | `Capte — Design System` file/node URLs, breakpoint specs. | John Hansen / Figma Workspace |
| **GitHub** | Implementation code, version history, CI/CD automation, technical documentation, design token builds. | Repo path, commit SHA, PR link, tagged releases. | `capte-web-operations` Repository |
| **Webflow** | Live deployed runtime state, CMS collections, page structures, published embeds, and ultimate migration destination. | Site/page URL, embed component instances, 301 redirects. | Webflow Designer (`capte.co`) |

---

## 3. Portal Inventory & Capabilities

### Section A: Internal Marketing & Operations Utilities

Located in `tools/` and accessible directly via the portal dashboard:

#### 1. Campaign Link & QR Generator (`tools/campaign-qr-generator/`)
* **Purpose**: High-reliability generator for physical print collateral (trade show booth backdrops, pull-up banners, badge lanyards, vehicle wraps, flyers, and executive handouts).
* **Key Features**:
  * **Anti-Dead-Print Engine**: Automatically formats short Webflow 301 vanity routes (`/go/[slug]`) so printed collateral can be repointed post-event without reprinting.
  * **Forced UTM Attribution**: Eliminates `Direct / None` traffic blindness by auto-constructing standardized UTM tracking schemas.
  * **Print Physics Scannability**: Native Reed-Solomon error correction in $\text{GF}(2^8)$ (Level Q / Level H) and 14:1+ optical contrast ratios.
  * **Dual Export**: Vector SVG (`.svg`) for professional print shops and $1024 \times 1024\text{px}$ 300-DPI PNGs.

#### 2. Blog Section-Anchor Extractor (`tools/blog-section-anchors/`)
* **Purpose**: One-click bookmarklet and utility allowing marketing and sales teams to extract deep anchor links (H2/H3 header IDs) from any live article on [capte.co](https://capte.co).
* **Key Features**:
  * Instant clipboard copying of deep-linked URLs for precise social media threads, customer email responses, and targeted outbound campaigns.
  * Preserves user position and enables granular content repurposing.

#### 3. Internal Email Signature Generator (`tools/email-signature/`)
* **Purpose**: Brand-correct, accessible, Word-engine-compliant Outlook email signature generator for all Capte global personnel.
* **Key Features**:
  * **Multi-Office Configuration**: Instant switching between Los Angeles (HQ), Versailles (France), and Amsterdam (Netherlands) offices with localized phone numbers and addresses.
  * **Dual Clipboard Copy**: Provides 1-click rich HTML clipboard copy (preserving inline styles for Outlook/Apple Mail) and clean plain-text fallback.
  * **Rock-Solid Email Client Compatibility**: Built with table-based layout, explicit pixel dimensions, inline CSS, and high-DPI retina logo assets.

---

### Section B: Active Web Components (Webflow Embeds)

Located in `components/` and deployed to [capte.co](https://capte.co):

#### 1. Promo Card (`components/promo-card/`)
* **Purpose**: Region-gated, campaign-driven promotional floating card (desktop bottom-right) and bottom drawer (mobile) used for major industry event promotions (e.g., APTA Expo, trade shows).
* **Key Features**:
  * **Privacy-Preserving Edge Geo-Detection**: Leverages Cloudflare same-origin `/cdn-cgi/trace` on production `capte.co`—eliminating third-party tracking APIs, latency, API costs, and browser GPS prompts.
  * **Fail-Closed Robustness**: Silently aborts rendering if geo-detection or campaign conditions fail, preventing broken UI states.
  * **Dual-Delivery Architecture**: Provided as both a Visual Code Component (`.tsx` + `.webflow.tsx`) and a self-contained vanilla embed (`.html`).
  * **Built-in Staging QA**: Supports URL parameter overrides (`?promoDebug=1&promoCountry=US`).

---

### Section C: Codified Brand Design System & Tokens

Located in `design-system/`:

* **217 Codified Variables**: Complete extraction of brand colors, surface tints, functional states, typography scales, spacing units, elevation shadows, and corner radii.
* **Automated CI/CD Sync**: Daily GitHub Actions workflow (`.github/workflows/figma-sync.yml`) queries the Figma REST API, parses variable collections, and compiles:
  * `design-system/tokens.css` (CSS Custom Properties for Webflow & web builds).
  * `design-system/tokens.json` (Structured JSON for programmatic tooling).
* **Baseline Brand Palette**:
  * **Capte Deep Blue**: `#001384` (Structural anchor, typography)
  * **Capte Accent Blue**: `#093AEC` (Interactive accents, links)
  * **Capte Accent Orange**: `#FC5522` / Hover: `#DD3603` (Primary conversion CTAs only)
  * **Surface / Muted Tints**: `#FFFFFF` / `#F2F4FC` / `#DCEDFF`
  * **Typography**: `Roboto`, `Roboto Mono` (Industrial clarity)

---

## 4. Engineering & Governance Standards

All components and tools in the portal are bound by the 7-Article Governance Contract established in [`CONSTITUTION.md`](file:///Users/johnhansen/Desktop/1-capte/design-and-web-operations/web-components/CONSTITUTION.md):

1. **Strict CSS Scoping**: Every class and custom property is namespaced (e.g., `.promo-card_*`, `.email-sig_*`) to prevent style bleeding into Webflow’s global CSS.
2. **Fail-Closed Principle**: Components must fail silently and gracefully. A missing asset, network timeout, or misconfiguration must never display broken UI to a site visitor.
3. **Zero Third-Party Tracking / Zero Client Secrets**: Geolocation and analytics must use first-party edge mechanisms (`/cdn-cgi/trace`). No API keys or credentials may be embedded in client-side code.
4. **Client-First Structure**: All Webflow HTML and CSS follow the Client-First class naming philosophy.
5. **Accessibility (a11y) & Performance**: Strict semantic HTML landmarks, full keyboard navigability, WCAG AA 4.5:1+ contrast compliance, and `@media (prefers-reduced-motion: reduce)` support.

---

## 5. Multi-Agent & Developer Operating Model

The repository is configured for autonomous and collaborative multi-agent development (Claude, OpenAI Codex / ChatGPT, Google Antigravity, and Cursor).

```text
  ┌──────────────────────┐
  │ Business / Design    │
  │ Request (John Hansen)│
  └──────────┬───────────┘
             │
             ▼
  ┌──────────────────────┐      ┌───────────────────────────┐
  │ Agent Specification  │ ───► │ Execution & Build         │
  │ & Token Verification │      │ (.tsx, .html, FIGMA_SPEC) │
  └──────────────────────┘      └─────────────┬─────────────┘
                                              │
                                              ▼
  ┌──────────────────────┐      ┌───────────────────────────┐
  │ Webflow Staging &    │ ◄─── │ Human Review & PR Merge   │
  │ Production Release   │      │ (John Hansen Approval)    │
  └──────────┬───────────┘      └───────────────────────────┘
             │
             ▼
  ┌────────────────────────────────────────────────────────┐
  │ Campaign Tagging (e.g., promo-card-apta-2026)          │
  │ & Ledger Update in campaigns.md                        │
  └────────────────────────────────────────────────────────┘
```

### Release & Campaign Versioning Protocol
* **Mechanism Updates**: Semantic version bumps (e.g., `v1.1.0`) recorded in each component's `CHANGELOG.md`.
* **Campaign Releases**: Specific marketing deployments (e.g., APTA Expo 2026) are tagged in git upon Webflow publication:
  ```bash
  git tag <component-name>-<campaign-id>  # e.g., promo-card-apta-2026-transform-expo
  git push origin --tags
  ```
* All deployments are logged in the respective component's `campaigns.md`.

---

## 6. Support, Ownership & Escalation

* **Owner & System Lead**: John Hansen ([john@capte.co](mailto:john@capte.co)) — Los Angeles, CA
* **Repository Issues & Bug Reports**: Direct via GitHub Issues at [`capte-web-operations/issues`](https://github.com/john-l-hansen/capte-web-operations/issues) or via email to [john@capte.co](mailto:john@capte.co).
* **Security & Token Flags**: Report any design token drift, broken embed instances, or security considerations immediately to [john@capte.co](mailto:john@capte.co).
