# Capte Technologies — Internal Email Signature Generator & Component

> **Location**: `tools/email-signature/` & `components/email-signature/`  
> **Component**: `<EmailSignature>` & Interactive Generator Web App  
> **Deployment Target**: Internal Web Operations Portal (`index.html`) & Webflow  
> **Version**: `v1.0.0`  
> **Owner**: John Hansen ([john@capte.co](mailto:john@capte.co))

---

## 1. Overview & Objective

The **Capte Email Signature Generator** provides employees across Los Angeles, Versailles, and Amsterdam with brand-accurate, accessible, and Outlook Windows Word-engine-compliant email signatures.

### Key Architectural Highlights
- **Word-Engine Robustness**: 100% nested `<table>` layout with strict inline styling (`cellpadding="0" cellspacing="0" border="0"`), zero CSS classes, zero external stylesheets, and zero CSS custom properties in the final email signature payload.
- **Strict Size Budget**: Entire HTML signature payload is under **3.5 KB** (far below the 15 KB Outlook threshold).
- **1-Click Dual Clipboard Integration**: Copies both `text/html` and `text/plain` using modern `ClipboardItem` APIs, with robust fallback for older environments.
- **Postal & Linguistic Compliance**: Encodes local postal conventions (French: `78000 Versailles` no comma; Dutch: `1014 BA Amsterdam` 4-digit space 2-letter uppercase postcode; US: street, city, state, zip).
- **WCAG 2.2 AA Accessible**: Label text uses `#5C6470` providing a **6.0:1 contrast ratio** (surpassing the 4.5:1 AA requirement, avoiding `#7B8491` which fails at 3.8:1).
- **Hosted Assets & Placeholders**: The logo URL (`{{LOGO_URL}}`) and legal/registration line (`{{LEGAL_LINE}}`) are preserved as placeholders for owner configuration. Never embeds base64 images (which Outlook converts to attachments or strips).

---

## 2. Design Tokens & Visual Hierarchy

| Element | Font & Sizing | Color Hex & Token | Notes |
| :--- | :--- | :--- | :--- |
| **Full Name** | Arial Bold 15px / 20px | `#001384` | Primary brand anchor |
| **Pronouns (Optional)** | Arial Regular 13px / 20px | `#5C6470` | Non-bold, wrapped in `(...)` |
| **Job Title** | Arial Regular 13px / 18px | `#0F0F11` | Primary readable dark body |
| **Contact Labels** | Arial Regular 13px / 20px | `#5C6470` | Fixed width column: `64px` |
| **Contact Values** | Arial Regular 13px / 20px | `#0F0F11` | Clickable `tel:` and `mailto:` links |
| **Web Link** | Arial Regular 13px / 20px | `#001384` | Underlined `capte.co` with UTM tracking |
| **Address** | Arial Regular 13px / 18px | `#5C6470` | 10px top margin/padding |
| **Details Indent** | 22px left padding | — | Aligned to the Capte logo mark |
| **Accent Orange** | `#FC5522` / `#E85B28` | — | Used only inside official logo graphic |

---

## 3. How to Add a New Office

All office configurations are centralized in a single file: [`office-config.js`](office-config.js).

To add a new office (e.g., Munich / `de`), add a single entry into the `offices` dictionary:

```javascript
// tools/email-signature/office-config.js
offices: {
  // ... existing offices (la, fr, nl)
  de: {
    label: "Munich",
    line1: "Leopoldstraße 120",
    line2: "80804 München",
    country: {
      en: "Germany",
      fr: "Allemagne",
      nl: "Duitsland"
    },
    defaultLang: "en",
    dial: "+49",
    path: "",
    phonePlaceholder: "+49 89 1234 5678",
    phoneHint: "DE format: +49 89 1234 5678"
  }
}
```
*No template or layout modifications are required; the generator app, React component, and sample builder automatically recognize and adapt to the new office.*

---

## 4. How to Update Tokens or Layout

1. **Colors & Spacing**: Modify the inline style strings in the generator template function inside [`office-config.js`](office-config.js) or [`tools/email-signature/email-signature-generator.html`](../../tools/email-signature/email-signature-generator.html).
2. **Logo Dimensions**:
   - The display dimensions are fixed at **189×92px** (clearspace of 22px built into the asset).
   - If the logo asset changes, upload the new `@2x.png` file to Webflow CDN and update the `{{LOGO_URL}}` reference.
3. **UTM Attribution**:
   - UTM schema format: `https://www.capte.co/?utm_source=email-signature&utm_medium=email&utm_campaign=employee-signature&utm_content=office-{officeKey}`.

---

## 5. Rollback Plan & Safety Mandates

> [!CAUTION]
> **Never Replace or Delete Hosted Logo Assets:**
> Because thousands of previously sent emails contain references pointing to the hosted logo image URL, **never delete or overwrite an existing logo asset file on the CDN**. Always upload new versions under a versioned path (e.g., `capte-email-signature-logo-v2@2x.png`) and update the generator default.

### Rollback Steps
1. **HTML Signature Layout**: Previous signature layouts are version-controlled in git and archived in [`components/email-signature/samples/`](samples/). To roll back, revert the commit in git or restore the previous sample HTML.
2. **Webflow Embed / Internal Tool**:
   - If hosting the generator on Webflow under a password-protected internal URL (e.g. `/internal/email-signature`), revert the custom code embed block in Webflow Designer to the previous git commit.

---

## 6. Comprehensive QA Verification Matrix

| Check / Test Case | New Outlook (Win) | Classic Outlook (Win Word Engine) | Outlook Mac | Outlook Web | iOS Outlook | Gmail (Recipient) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Layout matches variations spec** | PASS | PASS | PASS | PASS | PASS | PASS |
| **2. Dark mode legibility & tile contrast** | PASS | PASS | PASS | PASS | PASS | PASS |
| **3. Images blocked: alt text & readable data** | PASS | PASS | PASS | PASS | PASS | PASS |
| **4. `tel:` & `mailto:` links trigger correctly** | PASS | PASS | PASS | PASS | PASS | PASS |
| **5. UTM parameters arrive intact** | PASS | PASS | PASS | PASS | PASS | PASS |
| **6. Screen reader (VoiceOver/NVDA) accessibility** | PASS | PASS | PASS | PASS | PASS | PASS |
| **7. Reply variant stays compact in 3-message thread** | PASS | PASS | PASS | PASS | PASS | PASS |

### Office × Language Combination Test Matrix (All 9 Variants + Reply)
- **Los Angeles**:
  - `la-en.html`: English labels, "United States", +1 dial prefill (PASS)
  - `la-fr.html`: French labels ("Portable", "Bureau", "E-mail", "Site web"), "États-Unis" (PASS)
  - `la-nl.html`: Dutch labels ("Mobiel", "Kantoor", "E-mail", "Website"), "Verenigde Staten" (PASS)
- **Versailles**:
  - `fr-en.html`: English labels, "78000 Versailles", "France" (PASS)
  - `fr-fr.html`: French labels, "78000 Versailles", "France", lang="fr" (PASS)
  - `fr-nl.html`: Dutch labels, "78000 Versailles", "Frankrijk", lang="nl" (PASS)
- **Amsterdam**:
  - `nl-en.html`: English labels, "1014 BA Amsterdam", "Netherlands" (PASS)
  - `nl-fr.html`: French labels, "1014 BA Amsterdam", "Pays-Bas" (PASS)
  - `nl-nl.html`: Dutch labels, "1014 BA Amsterdam", "Nederland", lang="nl" (PASS)
- **Reply Variant**:
  - `reply-la.html`, `reply-fr.html`, `reply-nl.html`: No logo row, 0px left padding, "Title, Capte Technologies", mobile only (PASS)
