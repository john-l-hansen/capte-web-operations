# Changelog

All notable changes to the `capte-web-components` repository (new components added, architectural updates, repo-level guidance). Per-component mechanism changes belong in that component's own `CHANGELOG.md`.

## [Unreleased]

### Added
- Added **Capte Icon Explorer & Marketing Operations Tool (`tools/icon-explorer/`)**: Interactive Google Fonts / Material Symbols-style icon gallery and inspect drawer built on Capte's official 60-master icon system (`john-l-hansen/capte-icons`). Features real-time optical sizing (20, 24, 40, 48 dp), stroke weights (Thin/Medium/Heavy), grades (Dark/Normal/Emphasis), treatments (Outline/Filled/Duotone), theme palettes, custom hex color overrides, URL parameter deep-linking (`?icon=...`), and a complete asset export suite (Download SVG, Copy SVG, High-DPI PNG rasterization at 1x/2x/3x, and raw Inline SVG / Webflow embed snippets). Statically served via GitHub Pages.
- Updated Design & Web Operations Portal (`index.html`) linking directly to the new Icon Explorer tool under Marketing & Ops Tools.
- Scaffolded **Centralized Email Signature Edge Router (`workers/sig-router/`)**: Cloudflare Worker backend for `sig.capte.co` enabling centralized marketing campaign banner distribution managed in Webflow CMS, automated GA4 campaign attribution redirects (`/r/banner`), fail-closed transparent PNG fallback, and pre-filled employee generator onboarding (`/setup?user=...`).
- Authored **Centralized Email Signature Architecture & Implementation Plan** (`docs/proposals/centralized-email-signature-plan.md`): Detailed feasibility assessment, technical constraint evaluation across Outlook/Gmail/Apple Mail rendering engines, Webflow CMS schema, and 3-day execution roadmap.
- Upgraded **Blog Section-Anchor Extractor & Shortener to v1.2.0** (`tools/blog-section-anchors/`): Integrated parallel link shortening with dual-engine architecture supporting TinyURL Pro with Capte Branded Domains (`go.capte.co`), a zero-config CORS fallback engine (`is.gd`), URI-encoded hash-fragment preservation (`#heading-id`), in-page modal HUD fallback for clipboard restrictions, and an interactive connection testing panel on `bookmarklet.html`.
- Added **Branded Shortener Setup Guide SOP** (`docs/branded-shortener-setup-guide.md`) detailing Cloudflare DNS CNAME and TinyURL Pro branded domain configuration.
- Updated Web Operations Portal (`index.html`) to showcase the upgraded `v1.2.0` Blog Section-Anchor Extractor & Shortener utility.
- Released **Email Signature Generator v1.1.0**: Universal cross-platform logo supporting light and dark mode email clients, Roboto font stack with elevated 16px/14px type scale, flush left optical alignment, clean placeholder validation UX, brand favicon and Open Graph assets.
- Codified Capte Figma Design System tokens into `design-system/` (`tokens.css` and `tokens.json`) covering 217 variables, color ramps, typography, and spacing/radii scales.
- Automated daily Figma sync pipeline via GitHub Actions (`.github/workflows/figma-sync.yml` and `scripts/figma-sync.js`) to open automated Pull Requests when Figma variables or files are updated.
- Comprehensive multi-agent operating model and component lifecycle documentation in `docs/agent-workflow.md`.
- Expanded canonical agent contract in `AGENTS.md` covering Foundation (role, tone, authority, brand tokens) and Components (standards, structure, lifecycle).
- Antigravity workspace rule adapters in `.agent/rules/shared-contract.md` and `.agents/rules/shared-contract.md`.
- Root `README.md` restructure into Foundation ("The Why & How") and Components ("The Why & How").
- Added **Campaign Link & QR Generator** (`tools/campaign-qr-generator/` & `components/campaign-qr-generator/`): Zero-dependency vanilla Web Component `<campaign-qr-generator>` with ISO/IEC 18004 Reed-Solomon engine, Webflow 301 vanity redirect helper (anti-dead-print), forced UTM builder, and Vector SVG / 300-DPI PNG export suite.
- Added **Web Operations Portal Overview Documents** (`docs/web-operations-portal-overview.md`, `docs/Capte-Web-Operations-Portal-Overview.html`, and `docs/Capte-Web-Operations-Portal-Overview.md`) for company share drive archiving.
- Codified the **Webflow Migration & Convergence Mandate** across `CONSTITUTION.md` (Article VII.4), `AGENTS.md` (Section 1 & 5.7), `README.md`, `DESIGN.md`, `docs/agent-workflow.md`, and the portal dashboard (`index.html`) declaring that all repository components, utilities, and digital experiences are engineered with the architectural intent to migrate natively into the primary Webflow site (`capte.co`) when able.

### Changed
- Streamlined `CLAUDE.md` to serve as a thin adapter pointing to `AGENTS.md` and `docs/agent-workflow.md`.

## [1.0.0] - 2026-09-09
### Added
- Initial repository setup and Webflow embed workflow.
- `promo-card` component: IP-based (Cloudflare `/cdn-cgi/trace`) country + campaign-window gated promotional card, session-scoped dismiss, responsive collapse to a bottom bar on mobile widths.
