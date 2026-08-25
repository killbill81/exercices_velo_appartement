# Implementation Plan: Cockpit Mobile "Zéro-Scroll" (Single-Screen Viewport Fitted)

**Branch**: `002-zero-scroll-mobile` | **Date**: 2026-08-25 | **Spec**: [spec.md](file:///c:/xampp/htdocs/VELO/specs/002-zero-scroll-mobile/spec.md)

**Input**: Feature specification from `specs/002-zero-scroll-mobile/spec.md`

## Summary

Optimisation stricte du viewport mobile (`100dvh`) pour afficher l'intégralité du Cockpit sur un seul écran sans défilement : jauges néon compactes côte à côte en mode portrait, timeline affinée haute performance, ruban horizontal de métriques unifiées et barre de commandes tactiles ancrée.

## Technical Context

**Language/Version**: TypeScript 5.8+, React 19.x, Vite 6.x  
**Primary Dependencies**: Tailwind CSS 3.4+, Lucide React, Recharts  
**Target Platform**: Mobile PWA (Google Pixel 10, Chrome Android)  
**Viewport Constraints**: `h-[calc(100dvh-115px)]` en mode portrait avec BottomNav, `h-[calc(100dvh-55px)]` en plein écran.  
**Performance Goals**: 0 pixel de scroll vertical, 60 FPS CSS transitions.  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

* [x] **I. Pure Domain & Service Decoupling**: Purement axé sur la couche présentation React/Tailwind.
* [x] **II. TypeScript Strict & Shared Contracts**: Typage strict préservé.
* [x] **III. Test-Driven & Quality Assurance**: 100% de succès sur Vitest exigé.
* [x] **IV. Local-First & Privacy by Design**: 100% local.
* [x] **V. Ergonomie Mobile & Immersion Sportive**: Cibles tactiles $\ge 44\text{px}$, élimination complète du besoin de scroller en plein effort.

## Project Structure & Modifications

```text
src/components/cockpit/
├── LiveCockpit.tsx          # Conteneur principal flex h-[calc(100dvh-115px)] overflow-hidden
├── NeonArcGauge.tsx         # Support du mode size="compact" (diamètre 135-155px)
├── CompactMetricStrip.tsx   # [NEW] Ruban horizontal condensé (Cardio, Vitesse, Dist, Kcal, Résistance, ERG)
├── IntervalTimeline.tsx     # Timeline compacte haute densité (hauteur <= 75px)
└── LateralControls.tsx      # Barre de commandes adaptée au pouce
```
