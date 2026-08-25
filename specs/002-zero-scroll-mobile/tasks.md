# Tasks: Cockpit Mobile "Zéro-Scroll" (Single-Screen Viewport Fitted)

**Branch**: `002-zero-scroll-mobile` | **Spec**: [spec.md](file:///c:/xampp/htdocs/VELO/specs/002-zero-scroll-mobile/spec.md) | **Plan**: [plan.md](file:///c:/xampp/htdocs/VELO/specs/002-zero-scroll-mobile/plan.md)

---

## Phase 1: Setup & Primitives

- [X] T001 [P] Add `compact` size variant to NeonArcGauge.tsx in src/components/cockpit/NeonArcGauge.tsx
- [X] T002 [P] Create CompactMetricStrip.tsx combining Cardio, Speed, Distance, Calories, Resistance, and ERG mode in src/components/cockpit/CompactMetricStrip.tsx

---

## Phase 2: User Story 1 (MVP) - Cockpit Portrait Zéro-Scroll

- [X] T003 [US1] Streamline IntervalTimeline.tsx into ultra-compact header (height <= 75px) in src/components/cockpit/IntervalTimeline.tsx
- [X] T004 [US1] Refactor LiveCockpit.tsx to lock height to `h-[calc(100dvh-115px)]` with `flex flex-col justify-between overflow-hidden` in src/components/cockpit/LiveCockpit.tsx
- [X] T005 [US1] Update PowerZoneGauge.tsx & CadenceTargetGauge.tsx for responsive side-by-side compact sizing in src/components/cockpit/

---

## Phase 3: Polish & Verification

- [X] T006 [P] Run and verify full Vitest test suite (`npm test`)
- [X] T007 [P] Execute production build (`npm run build`)
- [X] T008 Deploy and push to GitHub
