# Phase 0: Research - Zero-Scroll Viewport Fitted Cockpit Layout

## Decision 1: Dynamic Viewport Units (`100dvh`) with Strict Flexbox Fill
* **Decision**: Lock the Cockpit wrapper to `h-[calc(100dvh-115px)]` on mobile portrait and `h-[calc(100dvh-60px)]` on landscape/fullscreen, using `flex flex-col justify-between overflow-hidden`.
* **Rationale**: `100dvh` (Dynamic Viewport Height) automatically adapts to mobile browser chrome (URL bars opening/collapsing on Android Chrome). Flexbox with `justify-between` ensures all 5 vertical sections distribute proportionally to fill 100% of the screen with exactly 0 pixel of scroll.
* **Alternatives Considered**:
  - `height: 100vh`: Classic viewport height doesn't account for Android mobile address bars, causing bottom elements to be pushed below the fold.
  - `overflow-y: auto`: Forces scrolling during cycling when hands are sweaty.

## Decision 2: Compact High-Contrast Neon Gauges (`size="compact"`)
* **Decision**: Add a `compact` mode to `NeonArcGauge` with a diameter of $135\text{px}-155\text{px}$ in portrait so both Puissance and Cadence fit side-by-side on a $412\text{px}$ wide screen (Pixel 10).
* **Rationale**: Side-by-side dual gauges save over $250\text{px}$ of vertical height compared to stacked gauges, leaving plenty of room for timeline, metrics, and buttons.

## Decision 3: Slim Interval Timeline Header
* **Decision**: Condense the interval header into a streamlined banner ($\sim 65\text{px}$ total height) featuring the block title, target watts, next step pill, and a bold countdown timer with an inline segmented progress bar.
* **Rationale**: Provides all necessary training pacing without consuming 1/3 of the mobile display.

## Decision 4: Horizontal Single-Row Metric Strip
* **Decision**: Replace bulky individual metric cards with a unified, high-density dark strip displaying Cardio BPM (colored by HR zone), Speed, Distance, Calories, Resistance level, and ERG mode indicator.
* **Rationale**: Condenses 6 separate cards into a single 44px high row.
