# capte-web-operations

Webflow Code Components, custom embeds, codified design tokens, and multi-agent design engineering for [capte.co](https://www.capte.co).

This repository serves as the **central source of truth, version control, and multi-agent development environment** connecting Figma design tokens directly to Webflow Designer and production runtime.

---

## 🏛️ 1. The Foundation — Why & How

### Why this repository exists
Capte's public marketing website is hosted on Webflow. While Webflow provides visual page design, custom interactive UI, dynamic region gating, and specialized brand features require custom code embeds. 
- **Webflow Designer is our deployment target, not our archive.** Code pasted directly into Webflow lacks version history, pull request reviews, and historical diffing.
- This repository houses the canonical source code, design token baselines, and campaign release history.

### The Multi-Agent Operating Model
We operate across specialized AI agents (Claude, ChatGPT / Codex, Antigravity) with **John Hansen** as the lead designer, web ops owner, and final authority.
- **Single Source of Truth**: Because agents do not share a live chat socket, the local repository and git commits act as the shared brain.
- **Domain Authority Matrix**:
  - 📄 **Google Drive**: Strategic requirements, sales copy, approved business decisions.
  - 🎨 **Figma**: Visual design intent, interactive UI states, layout tokens (synced daily via GitHub Actions).
  - 💻 **GitHub**: Implementation code, pull request reviews, technical documentation.
  - 🌐 **Webflow**: Live production runtime and published embed delivery.

- **Automated Cloud Sync**: A daily GitHub Actions workflow ([`.github/workflows/figma-sync.yml`](.github/workflows/figma-sync.yml)) queries Figma for token/component changes and automatically opens a Pull Request for John Hansen.

For full operating procedures, startup protocols, and handoff templates, see [docs/agent-workflow.md](docs/agent-workflow.md) and [AGENTS.md](AGENTS.md).

---

## 🧩 2. The Components — Why & How

### Why our components are built this way
Every component is engineered with **Dual-Delivery Webflow Compatibility**:
- **Visual Webflow Code Components**: Written in TypeScript + React (`@webflow/react` + `@webflow/data-types`) with visual properties (inputs, toggles, link pickers, asset uploaders) so designers can edit campaign properties directly in the Webflow Designer panel.
- **Zero-Dependency Vanilla Code**: Self-contained `.html` embed payloads for instant copy-pasting into Webflow Custom Code Embed elements.
- **Strict CSS Scoping**: Component styles (`.promo-card`, `--promo-*`) are strictly namespaced with 1:1 Figma design tokens (`var(--capte-...)`).
- **Fail-Closed Robustness**: Components fail gracefully (stay hidden) if network services or geo-lookups are unavailable.
- **Cloudflare Geo-Targeting**: Uses same-origin `/cdn-cgi/trace` on production `capte.co` (no third-party API keys or device GPS prompts) with `?promoDebug=1` and `?promoCountry=<code>` query parameters for staging QA.
- **Accessibility & Motion**: Full keyboard navigation, visible focus states, ARIA landmarks, and `prefers-reduced-motion` compliance.

### Component Structure
Each component is organized inside its own directory under `components/`:

```
components/
  <component-name>/
    ├── <ComponentName>.tsx          → React component implementation
    ├── <ComponentName>.webflow.tsx  → Webflow Designer property definitions (declareComponent)
    ├── <ComponentName>.module.css   → Scoped CSS with design tokens
    ├── <component-name>.html        → Self-contained vanilla embed payload
    ├── README.md                    → Architecture, configuration schema, and QA checklist
    ├── FIGMA_SPEC.md                → 1:1 Auto Layout and variable binding spec
    ├── CHANGELOG.md                 → Semantic version history for mechanism changes
    └── campaigns.md                 → (Optional) Ledger of live campaign launches & configs
```

### Component Workflow

1. **Build & Update**: Develop the component with React/TypeScript (`<ComponentName>.tsx`) and expose visual properties (`<ComponentName>.webflow.tsx`).
2. **Visual Webflow Push**: Run `npx webflow code-components push` to sync to the Webflow Designer workspace.
3. **Embed Alternative**: Alternatively, paste the self-contained `<component-name>.html` directly into a Webflow Custom Code Embed.
4. **Campaign Configuration Launches**: Tag releases upon publication:
   ```bash
   git tag <component-name>-<campaign-id>
   git push origin --tags
   ```
   and record the deployment row in that component's `campaigns.md`.

---

## 📦 Active Components

| Component | Status | Description | Documentation |
| :--- | :--- | :--- | :--- |
| [`promo-card`](components/promo-card/README.md) | `v1.0.0` (Production Ready) | Region + campaign-gated promotional card. Floats bottom-right on desktop; collapses to a bottom bar on mobile. Built for APTA 2026 and recurring campaigns. | [Read Guide](components/promo-card/README.md) |

---

## 🛠️ Internal Marketing & Ops Tools

| Tool | Status | Description | Documentation |
| :--- | :--- | :--- | :--- |
| [`blog-section-anchors`](tools/blog-section-anchors/README.md) | `v1.0.0` | Browser bookmarklet & console extractor that generates heading deep-link URLs from published blog posts to support section-level social campaigns. | [Read Guide](tools/blog-section-anchors/README.md) |

---

## 📚 Agent Guidance & Governance

- **[CONSTITUTION.md](CONSTITUTION.md)** — Supreme, non-negotiable laws governing all human & AI collaboration across Capte web ops.
- **[DESIGN.md](DESIGN.md)** — AI Designer Manual with Client-First rules, token tables, and Webflow styling conventions.
- **[design-system/](design-system/README.md)** — Codified design tokens, CSS variables (`tokens.css`), JSON tokens (`tokens.json`), and Figma specs.
- **[AGENTS.md](AGENTS.md)** — Canonical shared contract, brand tokens, and standards.
- **[docs/agent-workflow.md](docs/agent-workflow.md)** — Multi-agent operating model, startup/handoff protocols, and conflict resolution.
- **[CLAUDE.md](CLAUDE.md)** — Adapter for Claude projects.
- **[.agent/rules/shared-contract.md](.agent/rules/shared-contract.md)** — Adapter for Antigravity workspace rules.

---

## 📬 Reporting Issues & Support

For bug reports, design token discrepancies, security flags, or technical inquiries regarding Capte's web components and design system integrations:

- **Lead Contact & Authority**: **John Hansen** ([john@capte.co](mailto:john@capte.co))
- **Issue Tracking**: Submit a [GitHub Issue](https://github.com/john-l-hansen/capte-web-operations/issues) or Pull Request for code/token revisions.

