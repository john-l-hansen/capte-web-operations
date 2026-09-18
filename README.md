# capte-web-components

Reusable custom-code web components for [capte.co](https://www.capte.co), engineered for Webflow Custom Code Embeds.

This repository serves as the **source of truth, version control, and multi-agent development environment** for all custom embeds powering Capte's digital presence.

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
Every component is built for frictionless deployment into Webflow:
- **Zero-Dependency Vanilla Code**: Single-file `.html` containing semantic HTML, encapsulated CSS, and vanilla JS.
- **Strict CSS Scoping**: Component styles (`.promo-card`, `--promo-*`) are strictly namespaced to prevent collisions with Webflow base styles.
- **Fail-Closed Robustness**: Components fail gracefully (stay hidden) if network services or geo-lookups are unavailable.
- **Cloudflare Geo-Targeting**: Uses same-origin `/cdn-cgi/trace` on production `capte.co` (no third-party API keys or device GPS prompts) with a `?promoDebug=1` query parameter for staging QA.
- **Accessibility & Motion**: Full keyboard navigation, visible focus states, ARIA landmarks, and `prefers-reduced-motion` compliance.

### Component Structure
Each component is organized inside its own directory under `components/`:

```
components/
  <component-name>/
    ├── <component-name>.html   → Self-contained embed code (HTML + scoped CSS + JS)
    ├── README.md               → Architecture, configuration schema, and QA checklist
    ├── CHANGELOG.md             → Semantic version history for mechanism changes
    └── campaigns.md            → (Optional) Ledger of live campaign launches & configs
```

### Component Workflow

1. **Build & Update**: Develop the component in `components/<component-name>/<component-name>.html`.
2. **Mechanism Changes**: Commit code updates with conventional commits and bump the component's `CHANGELOG.md`.
3. **Campaign Configuration Launches**: For config-driven components (like `promo-card`), update the `CONFIG` block, deploy to Webflow, tag the release:
   ```bash
   git tag <component-name>-<campaign-id>
   git push origin --tags
   ```
   and record the deployment row in that component's `campaigns.md`.
4. **Deploy**: Paste the tested `.html` file into the targeted Webflow Embed element.

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

