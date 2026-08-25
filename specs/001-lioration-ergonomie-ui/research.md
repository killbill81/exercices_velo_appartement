# Phase 0: Research & Technical Decisions - UI/UX Cockpit Enhancements

## Decision 1: Landscape Panoramic Layout ("Compteur de bord")
* **Decision**: Architect the primary training HUD in a dual-column panoramic layout optimized for landscape orientation (`@media (orientation: landscape)` and responsive Tailwind grid).
* **Rationale**: On a handlebar-mounted smartphone (Google Pixel 10), landscape provides a wide viewing angle matching high-end bike computers (Garmin Edge / Wahoo). Placing primary dials (Watts & RPM) on the left and workout structure (Timeline & metrics) on the right eliminates vertical scrolling completely.
* **Alternatives Considered**:
  - *Vertical portrait only*: Rejected by user during clarification (Option C selected). Requires scrolling to see all secondary metrics and controls.
  - *Fixed viewport scaling (CSS zoom / transform)*: Can cause blurry fonts on high-DPI OLED screens. Modern CSS flexbox/grid is sharper and adaptive.

## Decision 2: Neon Circular Arc Gauges with Dynamic Coggan Color Halos
* **Decision**: Implement SVG-based circular neon arc gauges with dynamic SVG gradient definitions, `stroke-dasharray`/`stroke-dashoffset` interpolation, and reactive drop-shadow glowing halos matching the active Coggan zone ($Z1$ Grey, $Z2$ Blue, $Z3$ Green, $Z4$ Yellow, $Z5$ Orange, $Z6$ Red, $Z7$ Purple).
* **Rationale**: Instant peripheral vision perception. Cyclists do not need to read small numbers during hard sprints; the glowing color halo immediately communicates whether they are on target.
* **Alternatives Considered**:
  - *Canvas 2D rendering*: Higher complexity, harder to style responsively with Tailwind. SVG scales infinitely and uses hardware-accelerated CSS filters.
  - *Linear bar gauges*: Evaluated in clarification (Option B) and rejected in favor of circular arcs (Option A).

## Decision 3: Visual Pulse Transitions ($T-3\text{s}, T-2\text{s}, T-1\text{s}, GO$)
* **Decision**: Create a CSS keyframe animation (`animate-pulse-zone`) that applies a subtle expanding colored border and inner radial glow during the final 3 seconds of each interval block, synchronized with Web Audio beeps.
* **Rationale**: Fulfills clarification decision (Option B: visual pulse without vibration) for silent/music training environments.
* **Alternatives Considered**:
  - *Full screen flashing*: Can be visually aggressive or disorienting during high heart rate efforts. A peripheral border halo is subtle, professional, and clear.

## Decision 4: Fullscreen API Integration
* **Decision**: Leverage the standard `document.documentElement.requestFullscreen()` / `document.exitFullscreen()` API with a dedicated one-click toggle in the header/cockpit.
* **Rationale**: Removes URL address bars and navigation buttons on Chrome Android, dedicating 100% of the Pixel 10 OLED display to the workout HUD.
* **Alternatives Considered**:
  - *PWA standalone mode only*: Works when installed to homescreen, but adding the in-app toggle allows instant fullscreen even in browser preview.

## Decision 5: Lateral Thumb Control Zones
* **Decision**: In landscape mode, position the Intensity adjustment ($\pm 5\%$) on the bottom-left edge, and Workout controls (Pause/Resume, Skip, Finish) on the bottom-right edge, with minimum touch targets of $48\times 48\text{px}$.
* **Rationale**: Natural thumb reach zones when hands are resting on the handlebars or hood grips.
