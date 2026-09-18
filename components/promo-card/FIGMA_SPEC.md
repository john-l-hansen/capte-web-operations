# Promo Card — Figma Component Specification

**Component Name**: `Promo Card`  
**Location in Design System**: `Capte — Design System` (`oFZw7IVtiURZG2x5XhAKyD`) → `Components / Overlay / Promo Card`  
**Web Equivalent**: [`components/promo-card/promo-card.html`](promo-card.html)  
**Governance**: 1:1 Parity with Webflow Vanilla Custom Embed.

---

## 1. Component Properties & Variants Matrix

| Property | Type | Values | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `Device` | Variant | `Desktop`, `Tablet`, `Mobile` | `Desktop` | Viewport breakpoint adaptation. |
| `Has Media` | Boolean | `True`, `False` | `False` | Toggles the 1:1 square media thumbnail slot. |
| `Has Eyebrow` | Boolean | `True`, `False` | `True` | Toggles category/urgency tag above heading. |
| `State` | Variant | `Default`, `CTA Hover`, `Dismiss Hover` | `Default` | Interactive state for prototyping. |

---

## 2. Token & Variable Bindings (1:1 with `tokens.json`)

| Element | CSS Property | Figma Token Variable | Raw Fallback Value |
| :--- | :--- | :--- | :--- |
| **Card Surface** | Fill | `color/semantic/background/surface` | `#FFFFFF` |
| **Card Drop Shadow** | Effect | Custom Shadow | `X: 0, Y: 12, Blur: 32, Spread: 0, Color: rgba(0, 19, 132, 0.16)` |
| **Card Corner Radius** | Corner Radius | `borderRadius/lg` (12px / 0.75rem) | `12px` (Mobile top corners: `12px 12px 0 0`) |
| **Eyebrow Text** | Text Fill | `color/semantic/interactive/actionPrimary` | `#E85B28` (`color/primitive/secondary/500`) |
| **Heading Text** | Text Fill | `color/primitive/primary/700` | `#001384` |
| **Description Text** | Text Fill | `color/primitive/neutral/950` | `#0F0F11` |
| **CTA Text & Icon** | Text / Vector Fill | `color/semantic/interactive/actionPrimary` | `#E85B28` |
| **CTA Hover State** | Text / Vector Fill | `color/semantic/interactive/actionPrimaryHover` | `#CF4F22` (`color/primitive/secondary/600`) |
| **Close Button Icon** | Vector Stroke | `color/primitive/neutral/500` | `#7B8491` |
| **Close Button Hover Fill** | Fill | `color/primitive/primary/50` / `color/semantic/background/subtle` | `#DCEDFF` (`color/primitive/primary/100`) |
| **Media Background** | Fill | `color/primitive/primary/50` | `#DCEDFF` |
| **Media Corner Radius** | Corner Radius | `borderRadius/md` | `8px` |

---

## 3. Auto-Layout Frame Hierarchy

### Variant 1: `Device=Desktop` (Width: `352px` / `22rem`, Hug Height)
```text
❖ Promo Card [Auto Layout: Horizontal]
  ├── Layout: Direction=Horizontal, Gap=16px (spacing/4), Padding=Top 16px, Right 24px, Bottom 16px, Left 16px
  ├── Fill: color/semantic/background/surface (#FFFFFF)
  ├── Corner Radius: 12px (borderRadius/lg)
  ├── Effect: Drop Shadow (0px 12px 32px rgba(0, 19, 132, 0.16))
  │
  ├── ⬚ Media Slot [Auto Layout / Frame] (Visible when Has Media = True)
  │     ├── Width: 48px, Height: 48px (Fixed)
  │     ├── Corner Radius: 8px (borderRadius/md), Clip content: ON
  │     └── Fill: color/primitive/primary/50 (#DCEDFF)
  │
  ├── ⬚ Body [Auto Layout: Vertical] (Fill container width, Hug height)
  │     ├── Layout: Direction=Vertical, Gap=4px (spacing/1)
  │     │
  │     ├── T Eyebrow (Visible when Has Eyebrow = True)
  │     │     ├── Typography: Roboto Bold 12px / 0.75rem, Line Height: 16px, Letter Spacing: +2% (0.24px)
  │     │     ├── Text Case: UPPERCASE
  │     │     └── Fill: color/semantic/interactive/actionPrimary (#E85B28)
  │     │
  │     ├── T Heading
  │     │     ├── Typography: Roboto Bold 16px / 1rem, Line Height: 22.4px (1.4), Letter Spacing: 0
  │     │     └── Fill: color/primitive/primary/700 (#001384)
  │     │
  │     ├── T Description
  │     │     ├── Typography: Roboto Regular 14px / 0.875rem, Line Height: 21px (1.5), Letter Spacing: 0
  │     │     └── Fill: color/primitive/neutral/950 (#0F0F11)
  │     │
  │     └── ⬚ CTA Link [Auto Layout: Horizontal]
  │           ├── Layout: Gap=6px, Padding=Top 4px, Hug width & height
  │           ├── T CTA Label (Roboto SemiBold 14px / 0.875rem, Fill: #E85B28)
  │           └── ❖ Arrow Right Icon (14x14px, Stroke: 1.5px, Color: #E85B28)
  │
  └── ❖ Close Button [Position: Absolute (Top: 8px, Right: 8px)]
        ├── Width: 28px, Height: 28px, Corner Radius: 999px (borderRadius/full)
        ├── Fill: Transparent (Hover: #DCEDFF)
        └── ❖ Close Icon (16x16px, Stroke: 1.5px, Color: #7B8491)
```

---

### Variant 2: `Device=Tablet` (Width: `288px` / `18rem`, Hug Height)
- **Padding**: `16px` all sides (`spacing/4`).
- **Media Slot**: `40px` × `40px`.
- **Gap**: `8px` (`spacing/2`).
- **Heading**: `15px` / `0.9375rem`.
- **Close Button**: Absolute `Top: 8px, Right: 8px`.

---

### Variant 3: `Device=Mobile` (Width: `390px` / `100%`, Fixed Bottom Bar)
- **Auto Layout**: Direction=Horizontal, Space-Between, Align=Center.
- **Padding**: `Top: 8px, Right: 24px, Bottom: 8px, Left: 16px`.
- **Corner Radius**: `12px 12px 0 0` (Top corners rounded, bottom square).
- **Media Slot & Description & Eyebrow**: Hidden (`display: none`).
- **Heading**: `15px Bold`, Fill container.
- **CTA Link**: Compact inline text + arrow.
- **Close Button**: Absolute `Right: 8px, Center Y`.

---

## 4. Prototyping Interactions & Fixed Viewport Behavior

- **Trigger / Placement**: Pinned Overlay (`Bottom: 24px, Right: 24px` on Desktop/Tablet; `Bottom: 0, Left: 0, Right: 0` on Mobile).
- **Entry Animation**: Smart Animate → Slide In Up (Distance: `12px`, Duration: `240ms`, Easing: `Ease-out`).
- **Dismiss Interaction**: On Click of Close Button → Close Overlay / Smart Animate Fade Out (`160ms`).
