# Email Signature — Figma Component Specification

**Component Name**: `Email Signature`  
**Location in Design System**: `Capte — Design System` (`oFZw7IVtiURZG2x5XhAKyD`) → `Components / Utility / Email Signature`  
**Web Equivalent**: [`components/email-signature/email-signature.html`](email-signature.html)  
**Governance**: 1:1 Parity with Outlook Windows Word-Engine HTML Embed & Webflow Code Component.

---

## 1. Component Properties & Variants Matrix

| Property | Type | Values | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `Variant` | Variant | `New Email`, `Reply / Forward` | `New Email` | Main signature layout structure. |
| `Office` | Variant | `Los Angeles`, `Versailles`, `Amsterdam` | `Los Angeles` | Office address and default postal format. |
| `Language` | Variant | `English`, `Français`, `Nederlands` | `English` | Field labels language (`Mobile`, `Office`, `Email`, `Web`). |
| `Has Pronouns` | Boolean | `True`, `False` | `False` | Toggles `(she/her)` or custom pronouns display. |
| `Has Office Phone` | Boolean | `True`, `False` | `False` | Toggles optional landline row. |
| `Has LinkedIn` | Boolean | `True`, `False` | `False` | Toggles optional LinkedIn text link. |
| `Has Legal Line` | Boolean | `True`, `False` | `False` | Toggles owner-managed legal/registration footer line. |

---

## 2. Token & Variable Bindings (1:1 with `tokens.json`)

| Element | CSS / Design Property | Figma Token Variable | Raw Fallback Value |
| :--- | :--- | :--- | :--- |
| **Full Name** | Typography & Fill | Arial Bold 15px / 20px, `color/primitive/primary/700` | `#001384` |
| **Pronouns Span** | Typography & Fill | Arial Regular 13px / 20px, `color/primitive/neutral/600` | `#5C6470` (6.0:1 contrast) |
| **Job Title** | Typography & Fill | Arial Regular 13px / 18px, `color/primitive/neutral/950` | `#0F0F11` |
| **Row Labels** | Typography & Fill | Arial Regular 13px / 20px, `color/primitive/neutral/600`, Width: 64px | `#5C6470` |
| **Row Values** | Typography & Fill | Arial Regular 13px / 20px, `color/primitive/neutral/950` | `#0F0F11` |
| **Web Link & LinkedIn** | Typography & Fill | Arial Regular 13px / 20px Underline, `color/primitive/primary/700` | `#001384` |
| **Address** | Typography & Fill | Arial Regular 13px / 18px, `color/primitive/neutral/600` | `#5C6470` |
| **Legal Line** | Typography & Fill | Arial Regular 12px / 16px, `color/primitive/neutral/600` | `#5C6470` |
| **Tile Surface** | Fill | `color/primitive/neutral/white` | `#FFFFFF` |
| **Logo Display Dimensions** | Frame Size | Width: `189px`, Height: `92px` (22px clearspace built in) | `189 × 92px` |
| **Details Indent** | Auto Layout Padding | Left: `22px` (Aligned to logo mark) | `22px` (New Email) / `0px` (Reply) |

---

## 3. Auto-Layout Frame Hierarchy

### Variant 1: `Variant=New Email` (Width: `Hug / 360px+`, Hug Height)
```text
❖ Email Signature [Auto Layout: Vertical]
  ├── Layout: Direction=Vertical, Gap=0px, Padding=0px
  ├── Fill: #FFFFFF
  │
  ├── ⬚ Logo Row [Auto Layout: Horizontal]
  │     ├── Width: 189px, Height: 92px (Fixed)
  │     ├── Padding: 0px
  │     └── 🖼️ capte-email-signature-logo@2x.png (189x92 display)
  │
  ├── ⬚ Content Block [Auto Layout: Vertical]
  │     ├── Layout: Direction=Vertical, Gap=0px, Padding=Left 22px
  │     │
  │     ├── T Name (+ Pronouns) [Auto Layout: Horizontal]
  │     │     ├── Padding: Top 2px, Bottom 0px
  │     │     ├── T Name: Arial Bold 15px / 20px, Fill #001384
  │     │     └── T Pronouns: Arial Regular 13px / 20px, Fill #5C6470 (optional)
  │     │
  │     ├── T Job Title
  │     │     ├── Padding: Top 0px, Bottom 10px
  │     │     └── Typography: Arial Regular 13px / 18px, Fill #0F0F11
  │     │
  │     ├── ⬚ Contact Rows [Auto Layout: Vertical, Gap 0px]
  │     │     ├── ⬚ Row (Mobile) [Auto Layout: Horizontal, Gap 0px]
  │     │     │     ├── T Label: Width 64px (Fixed), Arial 13/20, Fill #5C6470 ("Mobile" / "Portable" / "Mobiel")
  │     │     │     └── T Value: Arial 13/20, Fill #0F0F11 ("+1 858 231 2916")
  │     │     ├── ⬚ Row (Office - Optional) [Auto Layout: Horizontal]
  │     │     │     ├── T Label: Width 64px (Fixed), Arial 13/20, Fill #5C6470 ("Office" / "Bureau" / "Kantoor")
  │     │     │     └── T Value: Arial 13/20, Fill #0F0F11
  │     │     ├── ⬚ Row (Email) [Auto Layout: Horizontal]
  │     │     │     ├── T Label: Width 64px (Fixed), Arial 13/20, Fill #5C6470 ("Email" / "E-mail")
  │     │     │     └── T Value: Arial 13/20, Fill #0F0F11 ("john@capte.co")
  │     │     └── ⬚ Row (Web & Links) [Auto Layout: Horizontal]
  │     │           ├── T Label: Width 64px (Fixed), Arial 13/20, Fill #5C6470 ("Web" / "Site web" / "Website")
  │     │           └── T Value: Arial 13/20 Underline, Fill #001384 ("capte.co")
  │     │
  │     ├── T Address Block
  │     │     ├── Padding: Top 10px, Bottom 0px
  │     │     ├── Typography: Arial Regular 13px / 18px, Fill #5C6470
  │     │     └── Content: Line 1 + Line 2, Country (localized)
  │     │
  │     └── T Legal Line (Optional)
  │           ├── Padding: Top 8px, Bottom 0px
  │           └── Typography: Arial Regular 12px / 16px, Fill #5C6470
```

### Variant 2: `Variant=Reply / Forward` (Compact)
```text
❖ Email Signature (Reply) [Auto Layout: Vertical]
  ├── Layout: Direction=Vertical, Gap=0px, Padding=0px
  ├── T Name: Arial Bold 15px / 20px, Fill #001384 (Padding 0px)
  ├── T Title: Arial Regular 13px / 18px, Fill #0F0F11 (Padding: Bottom 10px) → "Job Title, Capte Technologies"
  └── ⬚ Row (Mobile) [Auto Layout: Horizontal]
        ├── T Label: Width 64px (Fixed), Arial 13/20, Fill #5C6470
        └── T Value: Arial 13/20, Fill #0F0F11
```

---

## 4. Figma Developer Console JavaScript Snippet

Run this snippet in the Figma Dev Console (`Cmd+Option+I`) to automatically construct the Email Signature component on the Figma canvas:

```javascript
(function createFigmaEmailSignature() {
  const component = figma.createComponent();
  component.name = "Email Signature / New Email / Los Angeles";
  component.layoutMode = "VERTICAL";
  component.primaryAxisSizingMode = "AUTO";
  component.counterAxisSizingMode = "AUTO";
  component.itemSpacing = 0;
  component.paddingLeft = 0;
  component.paddingRight = 0;
  component.paddingTop = 0;
  component.paddingBottom = 0;
  component.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

  // Logo Placeholder Frame (189x92)
  const logoFrame = figma.createFrame();
  logoFrame.name = "Logo Row";
  logoFrame.resize(189, 92);
  logoFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  component.appendChild(logoFrame);

  // Content Block Frame with 22px padding
  const contentBlock = figma.createFrame();
  contentBlock.name = "Content Block";
  contentBlock.layoutMode = "VERTICAL";
  contentBlock.primaryAxisSizingMode = "AUTO";
  contentBlock.counterAxisSizingMode = "AUTO";
  contentBlock.itemSpacing = 0;
  contentBlock.paddingLeft = 22;
  contentBlock.fills = [];
  component.appendChild(contentBlock);

  // Load Arial font before creating text nodes
  figma.loadFontAsync({ family: "Arial", style: "Bold" }).then(() => {
    figma.loadFontAsync({ family: "Arial", style: "Regular" }).then(() => {
      // Name
      const nameText = figma.createText();
      nameText.fontName = { family: "Arial", style: "Bold" };
      nameText.fontSize = 15;
      nameText.lineHeight = { value: 20, unit: "PIXELS" };
      nameText.characters = "John Hansen";
      nameText.fills = [{ type: 'SOLID', color: { r: 0/255, g: 19/255, b: 132/255 } }];
      contentBlock.appendChild(nameText);

      // Title
      const titleText = figma.createText();
      titleText.fontName = { family: "Arial", style: "Regular" };
      titleText.fontSize = 13;
      titleText.lineHeight = { value: 18, unit: "PIXELS" };
      titleText.characters = "Lead Web/Print Designer & Web Operations";
      titleText.fills = [{ type: 'SOLID', color: { r: 15/255, g: 15/255, b: 17/255 } }];
      contentBlock.appendChild(titleText);

      figma.currentPage.appendChild(component);
      figma.viewport.scrollAndZoomIntoView([component]);
      console.log("Email Signature component created on canvas!");
    });
  });
})();
```
