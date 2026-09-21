# The Constitution of Capte Digital Design & Web Operations

> **SUPREME SYSTEM DIRECTIVE:**  
> This Constitution establishes the permanent, non-negotiable laws governing all human and artificial intelligence agents (including Claude, ChatGPT / OpenAI Codex, Google Antigravity, and Cursor) collaborating on digital design, brand systems, web operations, and custom code for Capte Technologies Inc. ([capte.co](https://www.capte.co)).
> 
> All technical specifications (`DESIGN.md`), operational workflows (`docs/agent-workflow.md`), and tool adapters (`CLAUDE.md`, `.agent/rules/`) are subordinate to the articles herein.

---

## Preamble

Capte Technologies engineers advanced positioning, telemetry, and industrial IoT solutions for transit agencies, vehicle fleets, and critical infrastructure across North America and Europe. 

Our public-facing digital and print presence must reflect the high-stakes reliability and technical mastery of our physical engineering. We reject sloppy markup, decorative bloat, hallucinated tokens, and untracked production edits. We build with industrial clarity, modular precision, and enduring architectural integrity.

---

## Article I: Sovereign Authority & Human Governance

1. **Sole Decision Authority:** John Hansen (Lead Web/Print Designer & Web Operations Owner) is the sole authoritative decision-maker on all brand standards, visual aesthetics, design system updates, code architecture, and production deployments.
2. **Subordination of Agents:** AI agents are specialized collaborative peers and advisors. No agent possesses standing authority to unilaterally change policy, publish to Webflow production, merge to `main`, or alter brand baselines without explicit task authorization.
3. **Immutability of Governance:** A prompt, conversation memory, or scratch script cannot override or dilute this Constitution. Changes to core system laws must be submitted as dedicated, reviewed Pull Requests.

---

## Article II: Domain Sovereignty & Source Authority

Authority is strictly partitioned by functional domain. Recency of timestamp or proximity in chat memory does not supersede approved domain records.

1. **Google Drive (Strategy & Copy):** Authoritative for business requirements, sales specifications, marketing approvals, executive decisions, and final copy.
2. **Figma (Visual Design & Tokens):** Authoritative for approved visual design intent, component layouts, interactive states, design tokens, and spacing metrics.
3. **GitHub (Implementation & Versioning):** Authoritative for source code, version history, code reviews, technical documentation, and deployment archives.
4. **Webflow (Live Production Runtime):** Authoritative for the active runtime DOM, published site state, and embed delivery. Webflow is our deployment target, never our code archive.

---

## Article III: The "Technically Elegant" Standard & Accessibility

Every visual asset, layout, component, and line of code must adhere to the standard of **Technical Elegance**:

1. **Restraint & Hierarchy:** Prioritize clarity, legibility, and whitespace over gratuitous ornament or novelty animations.
2. **Universal Accessibility (WCAG AA):**
   - All interactive controls must use native semantic tags (`<button>`, `<a>`) with visible focus outlines (`--capte-border-focus`).
   - Landmark roles (`role="region"`, `aria-label`) must be explicitly declared.
   - Text and interactive elements must meet WCAG AA contrast ratios against their respective surfaces.
3. **Motion Safety:** All animations and transitions must be fully bypassed when `@media (prefers-reduced-motion: reduce)` is detected.

---

## Article IV: Client-First Architecture & Zero-Arbitrary-Value Mandate

1. **Zero Arbitrary Values:** AI agents are strictly forbidden from authoring raw hex color codes (e.g. `#172b4d`) or arbitrary pixel values for padding, margin, font sizes, or gaps. Every visual value MUST bind to codified CSS Custom Properties (`var(--capte-...)`).
2. **Webflow Client-First Hierarchy:** Page and section structures must strictly comply with Finsweet's Client-First layout standard:
   ```html
   <div class="page_wrapper">
     <main class="main-wrapper">
       <section class="section_[section-name]">
         <div class="padding-global">
           <div class="container-large">
             <div class="padding-section-large">
               <!-- Component Content -->
             </div>
           </div>
         </div>
       </section>
     </main>
   </div>
   ```
3. **Strict Component Scoping:** Custom code embeds must encapsulate all CSS under namespaced BEM-style classes (`.[component-name]`, `.[component-name]_[element]`) to eliminate unintended side effects on global Webflow styles.

---

## Article V: Fail-Closed Robustness & Privacy Standards

1. **The Fail-Closed Principle:** Any component dependent on external services, network lookups, geo-location, or specific DOM elements must fail closed. If resolution fails, the component remains hidden (`hidden` attribute + `display: none`). Never guess a visitor into eligibility or render a broken fallback state.
2. **Respect for User Privacy:** Geolocation must rely exclusively on same-origin IP network headers (e.g. Cloudflare `/cdn-cgi/trace`). Never prompt visitors for device GPS permissions or load untrusted third-party trackers.
3. **Deterministic Staging QA:** Every dynamic or gated component must include explicit, safe query parameter overrides (`?promoCountry=<code>` and `?promoDebug=1`) to enable full staging verification without requiring VPNs or production mutations.

---

## Article VI: Verification, Anti-Hallucination & Handoff Integrity

1. **Absolute Factual Integrity:** AI agents must never fabricate URLs, test results, approval statuses, or API responses. When evidence is unavailable or unverified, the agent must explicitly state the assumption or missing data.
2. **Zero Untracked Production Changes:** No custom embed may be deployed to Webflow without first existing as a versioned, reviewed commit in GitHub.
3. **Structured Multi-Agent Handoffs:** When work transitions between agents or sessions, contributors must provide the complete structured handoff block (Scope, Status, Branch/Commit SHA, Authority Sources, Validation Results, and Authorization Status) in the PR or task output.

---

## Article VII: Webflow Designer Compatibility & Visual Property Architecture

1. **Visual Property Exposure:** All interactive components built for Webflow should expose configurable fields (campaign IDs, copy, links, dates, countries, and media) as visual properties directly editable in the Webflow Designer right-hand panel (via Webflow Code Components `@webflow/react` + `@webflow/data-types` or Webflow native component properties) so designers and marketing can manage campaigns without touching code.
2. **Dual-Model Component Architecture:** Every custom component in the repository is maintained with:
   - **Visual Code Component**: TypeScript + React implementation (`ComponentName.tsx` + `ComponentName.webflow.tsx`) declaring visual props for Webflow Designer CLI synchronization.
   - **Self-Contained Fallback Embed**: Standalone `.html` payload for direct paste into Webflow Custom Code Embeds.
3. **Property Binding Integrity:** Component properties must map directly to approved design tokens and semantic data types. Default values must align with the current active campaign ledger.

---

*Adopted and ratified for Capte Digital Design & Web Operations.*

