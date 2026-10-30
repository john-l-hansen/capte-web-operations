# Capte Icon Explorer & Marketing Operations

> **Location**: `tools/icon-explorer/`  
> **Deployment Target**: GitHub Pages (`https://john-l-hansen.github.io/capte-web-operations/tools/icon-explorer/`) & Webflow Marketing Portal  
> **Catalog Source**: `john-l-hansen/capte-icons` (60 Master Icons, 720 Optical Templates, 12,960 Configurations)  
> **Version**: `v1.0.0`

---

## 1. Overview & Objective

The **Capte Icon Explorer** provides an interactive, zero-dependency browser experience modeled directly after **Google Fonts / Material Symbols**. It empowers marketing, sales, product, and design teams to:

* Search and browse all 60 official Capte icons across Fleet, Energy, Security, Location, Analytics, and Operations.
* Adjust optical size (20, 24, 40, 48 dp), stroke weight, grade, style (Outline, Filled, Duotone), and color palettes in real-time.
* Export high-fidelity assets in three standard formats: **SVG (Download & Copy)**, **High-DPI PNG (1x, 2x, 3x for slides/docs)**, and **Raw Code (Inline SVG & Webflow Client-First embed snippets)**.
* Share exact configurations via deep-link URLs.

---

## 2. Interactive Features

### A. Google Fonts-Style Slide-Over Drawer
Clicking any icon in the gallery opens a right-hand inspect drawer that isolates the icon with full tuning controls while keeping the search grid visible and accessible on desktop.

* **Optical Size**: Switch between `20 dp`, `24 dp`, `40 dp`, and `48 dp`.
* **Style Treatments**: `Outline`, `Filled`, or `Duotone`.
* **Stroke Weight**: `Thin`, `Medium`, `Heavy`.
* **Grade (Optical Stroke Density)**: `Dark theme`, `Normal`, `Emphasis`.
* **Theme Palettes**: Switch between Capte's official Light and Dark palettes.
* **Color Swatches & Custom Hex**: Quick buttons for Capte Primary Blue (`#001384`), Accent Blue (`#093AEC`), Accent Orange (`#FC5522`), Dark Body (`#111523`), White, and `currentColor`, plus a native color picker for testing against custom background colors.

### B. Canvas Background Modes
Toggle the main workspace between **Light Muted** (`#F2F4FC`), **Pure White** (`#FFFFFF`), **Dark Slate** (`#0F1322`), and **Brand Navy** (`#001384`) using the top-right header toggles.

### C. URL Deep-Linking & Parameter State
Every setting is bound to the URL query string via `window.history.replaceState()`, allowing team members to share pre-configured icons directly in Slack, Jira, or documentation:

```text
https://john-l-hansen.github.io/capte-web-operations/tools/icon-explorer/?icon=shield-lock&size=24&weight=medium&grade=normal&style=duotone&theme=light&color=%23001384
```

Clicking **"Copy Direct Link to this Icon"** in the drawer automatically puts the active URL on your clipboard.

---

## 3. Asset Export Suite

| Format | Mechanism | Use Case |
| :--- | :--- | :--- |
| **Download SVG** | Direct vector `.svg` download | Illustrator, Figma, high-resolution vector print assets, and digital design. |
| **Copy SVG Code** | Direct clipboard copy of `<svg>` string | Fast paste into Webflow HTML embeds, codebases, or Figma canvas (`Cmd+V`). |
| **Download PNG** | In-browser `<canvas>` rasterization with 1x / 2x (Retina) / 3x (300 DPI) scaling | Google Slides, PowerPoint presentations, Keynote, Google Docs, and email signatures. |
| **Raw Code Snippet** | One-click copy with syntax toggle | **Inline SVG** or **Webflow Embed** (`<div class="capte-icon-embed is-[size]dp">...</div>`). |

---

## 4. Maintenance & Upstream Sync

The catalog is sourced from `john-l-hansen/capte-icons`:
1. When new icons or stroke updates land in `capte-icons`, minified `catalog.json` can be updated:
   ```bash
   python3 -c "import json; d = json.load(open('../../capte-icons/packages/icons/catalog.json')); open('tools/icon-explorer/catalog.json', 'w').write(json.dumps(d, separators=(',', ':')))"
   ```
2. Because the explorer runs on vanilla JavaScript with zero compilation steps, committing and pushing to `main` immediately updates GitHub Pages with zero build latency.
