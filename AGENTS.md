# Capte Design & Web Ops — Canonical Agent Contract

This is the canonical repository contract for all AI agents collaborating on Capte's digital design and web operations (including Claude, ChatGPT / OpenAI Codex, Google Antigravity, and Cursor). All operational workflows and adapters are governed by the supreme laws established in **[CONSTITUTION.md](CONSTITUTION.md)**.

For detailed operational procedures, handoff templates, conflict resolution, and deployment protocols, read [docs/agent-workflow.md](docs/agent-workflow.md). For Client-First styling rules and design tokens, read [DESIGN.md](DESIGN.md).

---

## 1. Role, Ownership & Principles

- **Owner & Final Authority**: John Hansen ([john@capte.co](mailto:john@capte.co)) — Web/Print Designer & Digital Design / Web Operations lead at Capte Technologies Inc. (Los Angeles, CA). John owns [capte.co](https://www.capte.co) end-to-end and makes all final decisions regarding design direction, brand standards, and technical implementation.
- **Reporting Issues**: Direct urgent flags, security disclosures, or design escalations to [john@capte.co](mailto:john@capte.co).
- **Company**: Capte Technologies engineers industrial IoT, smart telemetry, and precision positioning systems for transit agencies, vehicle fleets, and industrial infrastructure across the U.S. and Europe.
- **Tone & Aesthetic ("Technically Elegant")**: Every design and component must be clear, precise, restrained, accessible, and robust. We prioritize industrial clarity and clean ergonomics over decorative noise.
- **Operational Reality**: Webflow Designer is our deployment target, but GitHub is our version-controlled source of truth.

---

## 2. Cross-Platform Source Authority

Authority is strictly scoped to domain functions. Timestamp recency does not automatically supersede approved documentation.

| Domain | Authoritative Scope | What to Carry into a Task |
| :--- | :--- | :--- |
| **Google Drive** | Business requirements, sales specs, strategic decisions, approved copy. | Doc URL, section, approval date, decision owner. |
| **Figma** | Visual design intent, UI layouts, interactive states, design tokens. | [Capte Design System](https://www.figma.com/design/oFZw7IVtiURZG2x5XhAKyD/Capte-%E2%80%94-Design-System?node-id=826-5425&t=dLQ3wZ6taQyM5qSf-1) file/node URL, version/date, breakpoint specs. |
| **GitHub** | Implementation code, version history, PR reviews, technical documentation. | Repo path, commit SHA, branch name, PR link. |
| **Webflow** | Live deployed runtime state, page structures, published embeds. | Site/page URL, domain, embed location, deployed timestamp. |

---

## 3. Bidirectional System Architecture: Figma ⟷ GitHub ⟷ Webflow

GitHub is our central single source of truth connecting visual design in Figma to live production in Webflow.

```text
       ┌────────────────────────┐
       │   Figma Design System  │ (File: oFZw7IVtiURZG2x5XhAKyD)
       └──────────┬───▲─────────┘
   1. Daily Token │   │ 4. Reverse Backport
   Sync via CI/CD │   │    (FIGMA_SPEC.md + JS Snippet)
                  ▼   │
       ┌──────────┴───┴─────────┐
       │  GitHub Repository     │ (Single Source of Truth)
       │  - design-system/      │   - tokens.json & tokens.css
       │  - components/<name>/  │   - .html, README, FIGMA_SPEC, CHANGELOG
       └──────────┬───▲─────────┘
  2. Reviewed PR  │   │ 3. Extract & Codify
  & Embed Deploy  │   │    ("Web Ahead of Design")
                  ▼   │
       ┌──────────┴───┴─────────┐
       │   Webflow Production   │ (capte.co / Custom Embeds)
       └────────────────────────┘
```

### A. Forward Flow (Design → GitHub → Webflow)
1. **Figma Authoring**: Visual tokens (colors, spacing, radii) and UI components are authored in Figma.
2. **Automated CI/CD Sync**: Daily GitHub Actions workflow (`.github/workflows/figma-sync.yml`) queries the Figma REST API, parses variables into `design-system/tokens.json` & `design-system/tokens.css`, and opens a PR (`figma-sync/daily-update`).
3. **Embed Engineering**: Codebase components in `components/<name>/` consume token CSS variables (`var(--capte-...)`) and follow Client-First structure.
4. **Webflow Deployment**: Reviewed and approved `.html` files are pasted into Webflow custom code embeds and published.

### B. Reverse Flow (Webflow → GitHub → Figma: "Web Ahead of Design")
When web implementation or custom code gets ahead of Figma:
1. **Capture & Standardize**: Extract the component into `components/<name>/<name>.html`, converting all styles to Client-First classes and 1:1 `var(--capte-...)` design tokens.
2. **Generate Figma Specification**: Author `components/<name>/FIGMA_SPEC.md` containing the complete Auto Layout hierarchy, padding, sizing modes, variant matrix, and variable bindings.
3. **Figma Canvas Generation**: Provide a 1-click JavaScript snippet for the Figma Developer Console (`Cmd+Option+I`) to automatically construct the component on the Figma canvas.
4. **Design System Integration**: Backport the generated component into `Capte — Design System` (`oFZw7IVtiURZG2x5XhAKyD`), achieving 1:1 parity with zero design drift.

---

## 4. Brand Tokens & Design System Baseline

The full codified design system with 217 variables is housed in **[`design-system/`](design-system/README.md)** (CSS custom properties in [`design-system/tokens.css`](design-system/tokens.css) and JSON in [`design-system/tokens.json`](design-system/tokens.json)).

Key baseline highlights:

| Token / Purpose | Value | Notes |
| :--- | :--- | :--- |
| **Primary Brand Blue** | `#001384` / `#093AEC` | Structural elements, headings, brand anchor |
| **Accent Orange** | `#FC5522` / `#E85B28` | Interactive CTAs only (hover: `#DD3603` / `#cf4f22`) |
| **Surface (Clean)** | `#FFFFFF` | Primary card and page surface |
| **Muted Surface Tint** | `#DCEDFF` / `#F2F4FC` | Subtle containers, media placeholders, badges |
| **Body Text** | `#111523` / `#0F0F11` | Primary readable typography |
| **Muted Text / Borders** | `#7B8491` / `#B0B6BF` | Secondary captions, disabled states, borders |
| **Typography** | `Roboto`, Arial, sans-serif | Industrial-modern font stack (`Roboto Mono` for technical labels) |
| **Inline Element Radius** | `0.25rem` (4px) | Buttons, inline tags, form fields (`--capte-radius-sm`) |
| **Floating Surface Radius** | `0.75rem` (12px) | Floating cards, modals, popovers (`--capte-radius-lg`) |
| **Pill / Badge Radius** | `9999px` | Badges, dismiss buttons, pill tags (`--capte-radius-full`) |

---

## 5. Web Component Architecture Standards

Every component built for Webflow embeds must adhere to these standards:

1. **Self-Contained Vanilla Payload**: Single-file `.html` containing semantic HTML, scoped CSS, and zero-dependency vanilla JavaScript.
2. **Strict CSS Scoping**: All classes and custom properties must be prefixed with the component name (e.g. `.promo-card`, `.promo-card_body`, `--promo-*`) to eliminate side effects on Webflow global styles.
3. **Fail-Closed Robustness**: When external conditions (e.g. network calls, geo-detection, DOM elements) fail or cannot be determined, components must fail closed (remain hidden gracefully) rather than render broken states.
4. **Cloudflare Geo-Targeting**: Leverage same-origin `/cdn-cgi/trace` on production `capte.co` to avoid third-party geolocation APIs, rate limits, and browser GPS prompts. Always support `?promoDebug=1` for staging QA.
5. **Accessibility (a11y)**: Semantic HTML landmarks, clear ARIA labeling, full keyboard navigability with visible focus indicators, and `@media (prefers-reduced-motion: reduce)` transitions disabled.

---

## 6. Repository Structure & Versioning Conventions

```text
web-components/
├── AGENTS.md                  # Canonical shared contract (this file)
├── CLAUDE.md                  # Claude adapter
├── README.md                  # Repository overview & quick start
├── CHANGELOG.md               # Repo-level and guidance changes
├── docs/
│   └── agent-workflow.md      # Multi-agent operating model & handoffs
├── .agent/rules/
│   └── shared-contract.md     # Antigravity workspace rule adapter
└── components/
    └── <component-name>/
        ├── <component-name>.html  # Production Webflow embed code
        ├── README.md              # Component documentation & QA checklist
        ├── FIGMA_SPEC.md          # 1:1 Auto Layout & variable specification
        ├── CHANGELOG.md           # Mechanism versioning (SemVer)
        └── campaigns.md           # (Optional) Ledger of live campaign launches
```

### Release & Campaign Tagging
- **Mechanism Updates**: Bumps the component version in `components/<name>/CHANGELOG.md` (e.g. `v1.1.0`).
- **Campaign Configuration Releases**: Editing the `CONFIG` block for a specific event or campaign is tagged upon Webflow publication:
  ```bash
  git tag <component-name>-<campaign-id>  # e.g. promo-card-apta-2026-expo
  git push origin --tags
  ```
- The deployment is then recorded as an entry in the component's `campaigns.md`.
