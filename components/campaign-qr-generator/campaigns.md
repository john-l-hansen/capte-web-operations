# Campaign Link & QR Code Ledger

This ledger tracks all deployed print, trade show, and marketing campaign QR links for Capte Technologies.

---

## Active & Deployed Campaigns

| Date | Vanity Route | Campaign Slug | Channel / Placement | Target Destination | ECC / Specs | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **2026-09-22** | `/go/telematics-guide` | `telematics_buyer_guide_2026` | `live_event` / `booth_banner_main` | [`/guides/30-questions-to-ask-your-telematics-provider`](https://capte.co/guides/30-questions-to-ask-your-telematics-provider) | Level Q (25%), 300 DPI, `#001384` | **Active** |
| **2026-09-21** | `/go/apta-expo-2026` | `apta_expo_2026` | `trade_show` / `badge_lanyard` | [`/events/2026/apta-transform-expo`](https://capte.co/events/2026/apta-transform-expo) | Level Q (25%), 300 DPI, `#001384` | **Active** |

---

## Webflow 301 Redirect Reference

| Old Path | Webflow Redirect To Path (Including Forced UTMs) |
| :--- | :--- |
| `/go/telematics-guide` | `/guides/30-questions-to-ask-your-telematics-provider?utm_source=live_event&utm_medium=qr_print&utm_campaign=telematics_buyer_guide_2026&utm_content=booth_banner_main&utm_term=booth_412` |
| `/go/apta-expo-2026` | `/events/2026/apta-transform-expo?utm_source=trade_show&utm_medium=qr_print&utm_campaign=apta_expo_2026&utm_content=badge_lanyard&utm_term=booth_412` |

---

## Ledger Management

* **UI Generator**: Open [`campaign-qr-generator.html`](campaign-qr-generator.html) in any browser to create new links or export the updated markdown table via the **"Copy Markdown"** button.
* **Release Tagging**: Tag campaign releases in git when published in Webflow:
  ```bash
  git tag qr-telematics-buyer-guide-2026
  git push origin --tags
  ```
