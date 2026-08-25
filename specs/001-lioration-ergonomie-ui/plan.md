# Implementation Plan: Amélioration Ergonomique UI et UX Cockpit

**Branch**: `001-lioration-ergonomie-ui` | **Date**: 2026-08-25 | **Spec**: [spec.md](file:///c:/xampp/htdocs/VELO/specs/001-lioration-ergonomie-ui/spec.md)

**Input**: Feature specification from `specs/001-lioration-ergonomie-ui/spec.md`

## Summary

Refonte ergonomique et visuelle complète du Cockpit d'entraînement pour smartphone fixé au guidon (Google Pixel 10), avec architecture panoramique Paysage sans scroll vertical ("Compteur de bord" style Garmin/Wahoo), jauges circulaires néon avec halos réactifs aux zones Coggan ($Z1-Z7$), pulsations visuelles lumineuses aux transitions d'intervalles ($T-3\text{s}$), commandes tactiles ergonomiques latérales pour les pouces et bouton mode Plein Écran dédié.

## Technical Context

**Language/Version**: TypeScript 5.8+, React 19.x, Vite 6.x  
**Primary Dependencies**: Tailwind CSS 3.4+, Lucide React, Recharts  
**Storage**: Dexie.js 4.x (IndexedDB local database)  
**Testing**: Vitest 3.x with 100% pass requirement on domain models & UI components  
**Target Platform**: Mobile PWA (Google Pixel 10, Chrome Android & Desktop browsers)  
**Project Type**: Sports & Fitness Training Web Application / PWA  
**Performance Goals**: 60 FPS CSS animations, zero vertical layout shift, instant reaction to BLE metrics  
**Constraints**: 100% offline-capable, OLED battery-efficient dark theme (`#020617`), high touch targets ($\ge 48\text{px}$)  
**Scale/Scope**: Live Cockpit, Timeline, Gauges, Workout Controls, Settings  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

* [x] **I. Pure Domain & Service Decoupling**: UI components consume metrics via `UnifiedBikeState` without tight coupling to BLE low-level drivers.
* [x] **II. TypeScript Strict & Shared Contracts**: Zero `any` in production; all UI contracts defined in `contracts/ui-contracts.md` and `src/types/`.
* [x] **III. Test-Driven & Quality Assurance**: 100% Vitest test suite pass required before completion.
* [x] **IV. Local-First & Privacy by Design**: All layout preferences stored in local IndexedDB/localStorage; zero external data leaks.
* [x] **V. Ergonomie Mobile & Immersion Sportive**: Minimum touch dimensions $\ge 48\text{px}$, OLED high contrast, Screen Wake Lock active.

## Project Structure

### Documentation (this feature)

```text
specs/001-lioration-ergonomie-ui/
├── spec.md              # Feature specification & 5/5 resolved clarifications
├── plan.md              # This implementation plan
├── research.md          # Phase 0 decisions (Landscape, Neon Gauges, Visual Pulse, Fullscreen)
├── data-model.md        # Phase 1 UI state entities
├── quickstart.md        # Phase 1 validation scenarios
└── contracts/
    └── ui-contracts.md  # Phase 1 component interfaces
```

### Source Code Components

```text
src/
├── components/
│   ├── cockpit/
│   │   ├── LiveCockpit.tsx          # Main HUD with responsive landscape/portrait switch
│   │   ├── NeonArcGauge.tsx         # [NEW] SVG Circular neon arc gauge with Coggan zone glow
│   │   ├── VisualPulseOverlay.tsx   # [NEW] Peripheral glowing countdown animation (T-3s, 2s, 1s)
│   │   ├── PowerZoneGauge.tsx       # Upgraded power zone gauge
│   │   ├── CadenceTargetGauge.tsx   # Upgraded cadence target gauge
│   │   ├── IntervalTimeline.tsx     # Enhanced interactive interval timeline
│   │   ├── LateralControls.tsx      # [NEW] Thumb-accessible controls for landscape mode
│   │   └── WorkoutControls.tsx      # Standard workout controls
│   ├── common/
│   │   ├── Header.tsx               # Header with Fullscreen button toggle
│   │   └── BottomNav.tsx            # Mobile navigation bar
└── types/
    └── bluetooth.ts / workout.ts    # Contract models
```

## Structure Decision

The feature directly upgrades the React presentation layer in `src/components/cockpit/` while adhering strictly to existing domain contracts and state engines.
