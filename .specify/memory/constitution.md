<!--
# Sync Impact Report
- **Version Change**: 1.0.0 → 1.1.0 (Minor version bump: standardized Spec Kit structure, FTMS Control Point integration, and strict governance rules)
- **Modified Principles**:
  - `I. Pure Domain & Service Decoupling` → Updated with bidirectional FTMS control point governance.
  - `II. TypeScript Strict & Shared Contracts` → Formalized immutability and contract isolation.
  - `III. Test-Driven & Quality Assurance (NON-NÉGOCIABLE)` → Enforced Vitest 100% pass rate.
  - `IV. Local-First & Privacy by Design` → Consolidated Dexie.js offline persistence rules.
  - `V. Ergonomie Mobile & Immersion Sportive` → Refined high-visibility HUD & Screen Wake Lock standards.
- **Added Sections**:
  - `## Stack Technique & Contraintes Matérielles`
  - `## Workflow de Développement & Spec-Driven Development`
  - `## Governance`
- **Removed Sections**: None.
- **Follow-up TODOs**: None.
-->

# Domyos Velo Trainer Constitution

## Core Principles

### I. Pure Domain & Service Decoupling
Every core domain service (`src/services/`) MUST remain strictly decoupled from UI components (`src/components/`).
* Hardware communication protocols (Web Bluetooth FTMS `0x1826`, FTMS Control Point `0x2AD9`, Heart Rate Service `0x180D`, Web Audio API, Screen Wake Lock) MUST reside in isolated service layers.
* Multi-sensor state aggregation MUST use the unified state pattern (`subscribeState`, `subscribeConnection`) with explicit wearable-over-equipment priority rules.
* All services MUST provide simulation/mock counterparts for isolated unit and manual testing without physical hardware.

### II. TypeScript Strict & Shared Contracts
Type safety is absolute across the codebase.
* The `any` type MUST NOT be used in production code under any circumstance.
* All domain entities, Bluetooth telemetry frames, user profiles, Coggan zones, and training workout step schemas MUST be centralized in `src/types/`.
* Data contracts passed across service boundaries MUST be immutable or explicitly documented for state transitions.

### III. Test-Driven & Quality Assurance (NON-NÉGOCIABLE)
Automated verification is mandatory for all algorithmic and state machine logic.
* All calculation models (Coggan FTP zones, Normalized Power, Intensity Factor, TSS, Ramp Test calculations), binary BLE decoders (`ftmsDecoder`, `heartRateDecoder`), and the `workoutEngine` state machine MUST have comprehensive Vitest test coverage in adjacent `__tests__/` directories.
* The test suite (`npm run test`) MUST pass with 100% success before any task completion, commit, or deployment.
* Regressions against existing test baselines MUST NOT be merged.

### IV. Local-First & Privacy by Design
User privacy and offline autonomy are foundational architecture pillars.
* All user profiles, training metrics, completed workouts, and FTP progression history MUST be stored locally on the client device using IndexedDB via Dexie.js.
* No telemetry, biometric heart rate data, or workout logs MUST be transmitted to external third-party servers without explicit user command (e.g., manual TCX file download).
* The application MUST function completely offline once loaded as a Progressive Web App (PWA).

### V. Ergonomie Mobile & Immersion Sportive
The user interface MUST be specifically optimized for high-intensity physical training on mobile screens (Pixel 10) mounted on handlebars.
* High-visibility dark mode (`bg-slate-950`, high-contrast Coggan zone color indicators, XXL telemetry typography) MUST be enforced across all live training views.
* Touch targets for active workout controls (Start, Pause, Resume, Skip, Adjust Intensity $\pm 5\%$, Stop) MUST satisfy minimum touch ergonomic dimensions ($\ge 44\text{px}$) with thumb-friendly placement.
* Screen Wake Lock API MUST be automatically requested upon workout start and released upon workout finish/stop to prevent phone screen sleep during exercise.

## Stack Technique & Contraintes Matérielles

* **Frontend Framework :** React 19.x with TypeScript 5.8+, Vite 6.x.
* **Styling & Layout :** Tailwind CSS 3.4+, PostCSS, Lucide React icons, Recharts for physiological telemetry.
* **Data Storage :** Dexie.js 4.x (IndexedDB local database).
* **Hardware & Web APIs :** Web Bluetooth API (BLE FTMS `0x1826`, Control Point `0x2AD9`, Heart Rate `0x180D`), Web Audio API, Web Speech API (speechCoach), Screen Wake Lock API.
* **Automated Testing :** Vitest 3.x with fake timers and mocked Web APIs.
* **Hosting & Delivery :** Static Progressive Web App on HTTPS via Firebase Hosting.

## Workflow de Développement & Spec-Driven Development

1. **Specification First :** Every new feature or architectural change MUST begin with `/speckit.specify` to establish user requirements and acceptance criteria.
2. **Technical Planning :** Architecture decisions and risk assessments MUST be documented via `/speckit.plan` and decomposed into atomic tasks with `/speckit.tasks`.
3. **Structured Implementation :** Execution MUST proceed incrementally via `/speckit.implement`, preserving backward compatibility and verifying unit tests after every step.
4. **Validation & Convergence :** Codebase integrity MUST be audited with `/speckit.converge` before final user presentation.

## Governance

* This Constitution represents the supreme technical governance for the Domyos Velo Trainer project and supersedes informal conventions.
* Amendments to this Constitution MUST be made through the `/speckit.constitution` command, incrementing the semantic version with a documented Sync Impact Report.
* Any pull request, refactoring, or feature addition MUST strictly conform to the 5 Core Principles.

**Version**: 1.1.0 | **Ratified**: 2026-08-25 | **Last Amended**: 2026-08-25
