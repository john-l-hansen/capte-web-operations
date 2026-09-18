# DESIGN.md — Client-First AI Design System Rules

> **PURPOSE FOR AI AGENT:** 
> You are an expert Design Engineer enforcing strict Client-First (Webflow) class naming conventions and Figma CSS variable design tokens.
> Every piece of HTML and CSS generated MUST comply with the rules, structure, and token definitions in this document.

---

## 1. Global Guardrails & Anti-Hallucination Rules

- **ZERO Arbitrary Values:** NEVER write raw hex color codes (e.g. `#172b4d`) or arbitrary pixel values for padding, margin, or gaps (e.g. `padding: 18px`). ALL visual values MUST use CSS Custom Properties (`var(--capte-...)` or component-level variables with token fallbacks).
- **Semantic Markup:** Use clean HTML5 tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<button>`, `<a>`). Avoid unnecessary nested `<div>` containers.
- **Client-First Class Structure:** Follow Webflow Client-First class naming strictly (`page_wrapper`, `main-wrapper`, `section_[name]`, `padding-global`, `container-[size]`, `padding-section-[size]`, `[component]_[element]`).

---

## 2. Mandatory HTML Page & Section Skeleton

### A. Full Page & Section Layouts
Every full page layout or new section generated MUST follow this exact Client-First nesting hierarchy:

```html
<div class="page_wrapper">
  <main class="main-wrapper">
    <section class="section_[section-name]">
      <div class="padding-global">
        <div class="container-large">
          <div class="padding-section-large">
            <!-- Component Content Here -->
          </div>
        </div>
      </div>
    </section>
  </main>
</div>
```

### B. Standalone Custom Code Embeds (Injected / Floating Widgets)
For standalone interactive widgets (such as our floating `promo-card`, modal, or calculator) that get pasted into Webflow Embed elements:
- Do **not** duplicate `page_wrapper` or `main-wrapper` (as they already exist on the Webflow page).
- Encapsulate the component root using Client-First component namespacing:
```html
<div class="[component-name]" id="[component-name]" data-component hidden>
  <div class="[component-name]_body">
    <!-- Scoped Component Content -->
  </div>
</div>
```

---

## 3. Canonical Token Reference (Figma 1:1)

Tokens are codified in [`design-system/tokens.css`](design-system/tokens.css) and [`design-system/tokens.json`](design-system/tokens.json), synced from the **[Capte Figma Design System](https://www.figma.com/design/oFZw7IVtiURZG2x5XhAKyD/Capte-%E2%80%94-Design-System?node-id=826-5425)**.

### Color Palette
| Token Variable | Hex / Value | Role / Usage |
| :--- | :--- | :--- |
| `--capte-primitive-primary-700` | `#001384` | Capte Brand Blue — headings, structural anchors |
| `--capte-primitive-primary-500` | `#093AEC` | Interactive focus rings (`--capte-border-focus`) |
| `--capte-primitive-secondary-500` | `#FC5522` | Primary Action / CTA Orange (`--capte-action-primary`) |
| `--capte-primitive-secondary-600` | `#DD3603` | CTA Hover state (`--capte-action-primary-hover`) |
| `--capte-primitive-secondary-700` | `#A62903` | CTA Pressed state (`--capte-action-primary-pressed`) |
| `--capte-primitive-neutral-950` | `#111523` | Primary Body Text (`--capte-text-primary`) |
| `--capte-primitive-neutral-600` | `#5C6475` | Secondary Muted Text (`--capte-text-secondary`) |
| `--capte-primitive-neutral-400` | `#9198A6` | Tertiary Text / Placeholders (`--capte-text-tertiary`) |
| `--capte-primitive-neutral-200` | `#D0D2D9` | Default Borders (`--capte-border-default`) |
| `--capte-primitive-neutral-100` | `#E6E8EC` | Subtle Backgrounds / Dividers (`--capte-bg-subtle`) |
| `--capte-primitive-neutral-50` | `#F2F3F6` | Page Background (`--capte-bg-page`) |
| `--capte-primitive-neutral-white` | `#FFFFFF` | Card / Surface Background (`--capte-bg-surface`) |
| `--capte-primitive-primary-50` | `#F2F4FC` | Muted Blue Surface / Badges (`--capte-bg-primary`) |

### Spacing Scale (4px Base Unit)
```css
--capte-space-0:    0px;
--capte-space-half: 0.125rem; /* 2px */
--capte-space-1:    0.25rem;  /* 4px */
--capte-space-2:    0.5rem;   /* 8px */
--capte-space-3:    0.75rem;  /* 12px */
--capte-space-4:    1rem;     /* 16px */
--capte-space-5:    1.25rem;  /* 20px */
--capte-space-6:    1.5rem;   /* 24px */
--capte-space-8:    2rem;     /* 32px */
--capte-space-12:   3rem;     /* 48px */
--capte-space-16:   4rem;     /* 64px */
```

### Corner Radii
```css
--capte-radius-none: 0px;
--capte-radius-xs:   0.125rem; /* 2px */
--capte-radius-sm:   0.25rem;  /* 4px — Standard inline UI / buttons */
--capte-radius-md:   0.5rem;   /* 8px */
--capte-radius-lg:   0.75rem;  /* 12px — Floating cards, popovers, modals */
--capte-radius-xl:   1rem;     /* 16px */
--capte-radius-full: 9999px;   /* Badges, pills, circular buttons */
```

### Typography Hierarchy
- **Font Stack**: `"Roboto", Arial, sans-serif` (Technical labels: `"Roboto Mono", monospace`).
- **Headings**: Medium or Bold weight, tight line-heights (1.1–1.3).
- **Body**: Regular (400) or Medium (500), line-height 1.5–1.6.

---

## 4. Web Component Architecture & Scoping

All components intended for Webflow Custom Code Embeds must follow these rules:

1. **Single-File Embed Format**: Component `.html` file must contain the HTML markup, scoped `<style>`, and encapsulated `<script>`.
2. **Strict Client-First Component Namespacing**:
   - Block: `.[component-name]`
   - Element: `.[component-name]_[element]` (single underscore)
   - Modifier: `.[component-name]--[modifier]` or `.is-[state]`
3. **CSS Variable Fallbacks**: Always provide token fallbacks so the component renders cleanly even in standalone previews:
   ```css
   background: var(--capte-bg-surface, #FFFFFF);
   color: var(--capte-text-primary, #111523);
   ```
4. **Fail-Closed Mechanics**: Any dynamic or geo-gated feature must remain hidden (`hidden` attribute + `display: none`) until all eligibility criteria pass.
5. **Standard QA Query Overrides**:
   - `?promoCountry=US`: Substitutes IP lookup to test geo-gating logic.
   - `?promoDebug=1`: Bypasses all gating for pure visual layout verification.
6. **Accessibility Standards**:
   - Use semantic landmarks (`role="region"`, `aria-label`).
   - Real interactive elements (`<button>`, `<a>`) with visible focus outlines (`--capte-border-focus`).
   - Motion safety: Disable transitions under `@media (prefers-reduced-motion: reduce)`.

---

## 5. Bidirectional Synchronization Protocol (Figma ⟷ Webflow via GitHub)

All AI agents and designers must maintain 1:1 synchronization between Figma and Webflow using GitHub as the central hub:

### A. Forward Pipeline (Figma → GitHub → Webflow)
- **Token Source**: Figma Design System (`oFZw7IVtiURZG2x5XhAKyD`).
- **Automated Token Extraction**: Daily GitHub Actions workflow (`.github/workflows/figma-sync.yml`) runs daily at 9:00 AM UTC and creates a PR on `figma-sync/daily-update`.
- **Token Distribution**: Updates `design-system/tokens.json` and `design-system/tokens.css`.
- **Embed Authoring**: Web components consume token variables and are deployed to Webflow embeds.

### B. Reverse Pipeline ("Web Ahead of Design" Protocol: Webflow → GitHub → Figma)
When custom engineering in Webflow outpaces visual design in Figma:
1. **Capture & Standardize**: Write the component into `components/<component-name>/<component-name>.html` with Client-First classes and token variables.
2. **Author `FIGMA_SPEC.md`**: Create `components/<component-name>/FIGMA_SPEC.md` detailing the exact:
   - Component Properties & Variant Matrix (`Device`, `State`, Boolean toggles).
   - 1:1 Variable Bindings (Colors, Spacing, Radii, Shadows).
   - Auto Layout Frame Hierarchy (Padding, gaps, sizing modes, absolute overlays).
3. **Provide 1-Click Figma Console Snippet**: Generate a self-contained JavaScript snippet using the Figma Plugin API (`figma.createComponent()`, `figma.createFrame()`) so designers can paste into Figma Console (`Cmd+Option+I`) and instantiate the component on canvas instantly.
4. **Backport to Figma**: Merge into `Capte — Design System` components library to maintain complete zero-drift parity.
