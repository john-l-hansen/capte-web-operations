/**
 * Capte Technologies — Email Signature Office & Localization Configuration
 * Single source of truth for offices, postal conventions, default languages, and localized labels.
 * 
 * To add a new office: Add a single entry to the `offices` object.
 */

const OFFICE_CONFIG = {
  offices: {
    la: {
      label: "Los Angeles",
      line1: "500 S Grand Ave, Suite 2060",
      line2: "Los Angeles, CA 90071",
      country: {
        en: "United States",
        fr: "États-Unis",
        nl: "Verenigde Staten"
      },
      defaultLang: "en",
      dial: "+1",
      path: "",
      phonePlaceholder: "+1 858 231 2916",
      phoneHint: "US format: +1 858 231 2916"
    },
    fr: {
      label: "Versailles",
      line1: "7 rue des Chantiers",
      line2: "78000 Versailles",
      country: {
        en: "France",
        fr: "France",
        nl: "Frankrijk"
      },
      defaultLang: "fr",
      dial: "+33",
      path: "",
      phonePlaceholder: "+33 6 12 34 56 78",
      phoneHint: "FR format: +33 6 12 34 56 78 (digits in pairs)"
    },
    nl: {
      label: "Amsterdam",
      line1: "Kabelweg 57",
      line2: "1014 BA Amsterdam",
      country: {
        en: "Netherlands",
        fr: "Pays-Bas",
        nl: "Nederland"
      },
      defaultLang: "nl",
      dial: "+31",
      path: "",
      phonePlaceholder: "+31 6 1234 5678",
      phoneHint: "NL mobile: +31 6 1234 5678 | Landline: +31 20 123 4567"
    }
  },
  labels: {
    en: {
      name: "English",
      nativeName: "English",
      mobile: "Mobile",
      office: "Office",
      email: "Email",
      web: "Web"
    },
    fr: {
      name: "French",
      nativeName: "Français",
      mobile: "Portable",
      office: "Bureau",
      email: "E-mail",
      web: "Site web"
    },
    nl: {
      name: "Dutch",
      nativeName: "Nederlands",
      mobile: "Mobiel",
      office: "Kantoor",
      email: "E-mail",
      web: "Website"
    }
  },
  defaults: {
    siteBaseUrl: "https://www.capte.co",
    logoDisplayWidth: 189,
    logoDisplayHeight: 92,
    defaultLogoUrl: "{{LOGO_URL}}",
    defaultLegalLine: "{{LEGAL_LINE}}"
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = OFFICE_CONFIG;
}
