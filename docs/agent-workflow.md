# Multi-Agent Operating Workflow & Component Lifecycle

[AGENTS.md](../AGENTS.md) defines our canonical shared contract. This document provides the detailed operational procedures for agents (Claude, ChatGPT / Codex, Antigravity) and human contributors collaborating across Capte's digital design and web operations.

---

## Part 1: The Foundation — Why & How We Operate

### 1.1 The Multi-Agent Collaboration Model
We operate with peer AI agents across different specialized strengths:
- **Claude / ChatGPT**: High-level conceptualization, copy drafting, structural reviews, proposal alignment.
- **Antigravity**: Direct filesystem execution, local tool manipulation, multi-file code editing, git operations, testing, and GitHub syncing.

Because agents do not share a direct background socket, the **local git repository and filesystem serve as the single source of truth**. What one agent writes or commits, the others read and build upon.

### 1.2 Cross-Platform Source Authority
We maintain strict authority boundaries so agents know which system owns what:

| System | Authoritative For | Non-Authoritative / Context Only |
| :--- | :--- | :--- |
| **Google Drive** | Strategic direction, executive approvals, sales copy, business requirements | Implementation details, draft notes |
| **Figma** | Visual design intent, layouts, breakpoints, spacing, interactive UI states | Live production state, untested prototypes |
| **GitHub** | Code implementation, version history, PR reviews, technical documentation | Live deployment status |
| **Webflow** | Actual live production runtime, published page DOM, active embeds | Code archiving, version history |

#### Discrepancy Resolution & Automated Sync:
- **Automated Figma Sync Pipeline**: A scheduled GitHub Actions workflow ([`.github/workflows/figma-sync.yml`](../.github/workflows/figma-sync.yml)) queries the Figma REST API daily. If design tokens or components in Figma are updated, it automatically opens a Pull Request on branch `figma-sync/daily-update`.
- **Figma differs from Code**: Verify Figma node is marked as approved. Update code in GitHub to match approved Figma design via a PR referencing the Figma node/version.
- **Webflow differs from GitHub**: If an emergency hotfix was made directly in Webflow, capture the live snippet, diff it against GitHub, open a PR to reconcile the change into the repo, and redeploy from GitHub. Never blindly overwrite without diffing.
- **Requirements Ambiguity**: When approved sources conflict or design tokens shift, present concise options to John Hansen for decision before proceeding.

### 1.3 Startup Protocol
When starting or picking up a task in any agent:
1. **Review Context**: Read `AGENTS.md`, `docs/agent-workflow.md`, the root `README.md`, and any relevant component docs.
2. **Inspect Environment**: Check current branch, commit hash (`HEAD`), uncommitted changes, and open PRs. Never overwrite or wipe another agent's in-progress branch.
3. **Establish Scope**: Restate acceptance criteria and identify which authority sources are required. (Do not block on unneeded Drive/Figma access).
4. **State Assumptions**: Explicitly note assumptions and missing information. Ask clarifying questions only if a missing source is blocking.
5. **Branching**: Work on a dedicated task branch (`feat/...`, `fix/...`, `docs/...`).
6. **Authorization Check**: Verify permission level (code preparation vs. PR creation vs. release tagging vs. production Webflow publication).

### 1.4 Handoff Protocol
When transferring work between sessions or agents, record this structured block in the PR description, issue comment, or task response:

```text
Outcome & Scope:
Status: [in progress | ready for review | merged | deployed]
Owner & Next Action:
Repository & Branch: [branch name @ commit SHA | PR #]
Changed Files & Summary:
Authority Sources Used: [Drive docs | Figma nodes | GitHub refs | Webflow page]
Decisions & Assumptions:
Validation Performed & Results:
Known Limitations / Blockers:
Authorization Status: [what is authorized; what still needs approval]
Deployment State: [not deployed | deployed to <url> at <timestamp>]
Rollback Reference:
```

---

## Part 2: The Components — The Why & How

### 2.1 Why Custom Webflow Components Exist & The Migration Intent
Capte's public website ([capte.co](https://www.capte.co)) is hosted on Webflow. While Webflow provides visual layout tools, complex interactive behaviors, dynamic geo-gated promotions, specialized utilities, and brand experiences require specialized code engineering.

- **The Problem**: Webflow Embed elements have no built-in version history, no code diffing, and no automated rollback tracking.
- **The Solution**: Every custom embed is authored, reviewed, versioned, and documented in `components/` first. Webflow is our deployment target; GitHub is our archive and source of truth.
- **The Long-Term Intent**: The explicit architectural goal for all components, utilities, and digital experiences across this repository is **progressive migration and native integration into the Webflow site (`capte.co`) when able**, whether as native Webflow components, CMS-driven experiences, Webflow Apps, or visual Code Components.

### 2.2 Component Standards & Architecture
Every component adheres to six architectural pillars:

1. **Single-File Embed Payload (`<component-name>.html`)**:
   - Contains semantic HTML, encapsulated `<style>`, and self-executing vanilla `<script>`.
   - Zero external libraries or heavy dependencies.
2. **Strict CSS Encapsulation**:
   - Component classes must use consistent BEM-style prefixes (`.promo-card`, `.promo-card_media`, `.promo-card_body`, `.promo-card--active`).
   - CSS variables must be prefixed (`--promo-*`) with sensible fallbacks.
3. **Fail-Closed Principle**:
   - Region/campaign gates must fail closed. If the geo-service is unreachable or timestamps are invalid, the component remains hidden (`hidden` attribute + `display: none`).
4. **Cloudflare Geo-Detection**:
   - Production uses Cloudflare's same-origin `/cdn-cgi/trace` endpoint (`loc=US`).
   - Avoids third-party APIs, API keys, rate limits, and browser location prompts.
   - Always provides a `?promoDebug=1` query parameter override so components can be tested in Webflow Designer and staging domains (`*.webflow.io`).
5. **Accessibility & Motion Compliance**:
   - Use semantic landmarks (`role="region"`, `aria-label`).
   - Ensure all controls are native accessible buttons/links with visible focus rings.
   - Respect user motion preferences via `@media (prefers-reduced-motion: reduce)`.
6. **Webflow Native Migration Readiness**:
   - Code and DOM structure must be structured for straightforward translation into Webflow native elements, CMS collection bindings, and visual Code Components (`@webflow/react`) as platform features expand.

### 2.3 Component Lifecycle: From Idea to Live Production

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 1. Spec &    │ ──> │ 2. Build &   │ ──> │ 3. Review    │ ──> │ 4. Webflow   │ ──> │ 5. Tag &     │
│    Design    │     │    Document  │     │    & QA      │     │    Publish   │     │    Log       │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
  Drive / Figma        components/<name>     Staging / PR        capte.co Embed       Git Tag &
                       .html, README, etc.   ?promoDebug=1                            campaigns.md
```

1. **Scaffold Component Directory**:
   Create `components/<component-name>/` with:
   - `<component-name>.html`
   - `README.md` (purpose, config schema, QA checklist)
   - `FIGMA_SPEC.md` (1:1 Auto Layout and variable binding spec)
   - `CHANGELOG.md` (mechanism version history)
   - `campaigns.md` (launch ledger, if reusable/campaign-driven)
2. **Implement & QA Locally**:
   - Verify all responsive states (Desktop, Tablet, Mobile).
   - Test keyboard tab order, focus indicators, and screen reader announcements.
   - Verify fail-closed states and debug overrides.
3. **Review & Merge via GitHub PR**:
   - Open a PR against `main`. Document changes and QA results.
   - Obtain review and merge approval from John.
4. **Deploy to Webflow**:
   - Paste the reviewed `.html` code into the targeted Webflow Embed element.
   - Publish to Webflow staging / production.
   - Test on the live domain using the QA checklist.
5. **Tag & Record Campaign**:
   - For campaign-specific launches, create a git tag:
     ```bash
     git tag <component-name>-<campaign-id>
     git push origin --tags
     ```
   - Add a row to `components/<component-name>/campaigns.md` detailing the live config, publish timestamp, and author.

### 2.4 The Reverse Sync Lifecycle ("Web Ahead of Design")
When live web development gets ahead of Figma visual designs:
1. **Deconstruct Live Embed**: Analyze the live component DOM and CSS, stripping arbitrary values and remapping them to design system variables (`var(--capte-...)`).
2. **Codify in Repo**: Package the standard `.html` embed and write `components/<name>/FIGMA_SPEC.md` defining Auto Layout directions, paddings, sizing modes, and variant properties.
3. **Automate Figma Canvas Assembly**: Write an executable Figma Plugin API JavaScript snippet for the Figma Developer Console (`Cmd+Option+I`) to generate the component on the Figma canvas.
4. **Commit & Close Loop**: Push `FIGMA_SPEC.md` to GitHub and backport the generated node into `Capte — Design System` (`oFZw7IVtiURZG2x5XhAKyD`).

---

## Part 3: Governance & Multi-Agent Adapters

- **Final Authority**: John Hansen reserves all review, merge, tagging, and publication authority.
- **Contract Integrity**: If an agent proposes a change to shared guidance, it must be submitted as a PR to `AGENTS.md` and this document simultaneously.
- **Adapters**:
  - `CLAUDE.md`: Thin entry point for Claude.
  - `.agent/rules/shared-contract.md`: Workspace rule for Antigravity.
  - `.agents/rules/shared-contract.md`: Alternative path symlink.
