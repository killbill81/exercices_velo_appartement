# Phase 1: Data Model & UI Entities - UI/UX Cockpit Enhancements

## 1. UI Layout & View State Entities

### `CockpitViewState`
Represents the real-time presentation state of the training cockpit:
* `displayMode`: `'landscape-panoramic' | 'portrait-standard'`
* `isFullscreen`: `boolean`
* `isAutoControlActive`: `boolean` (Mode ERG)
* `visualPulse`: `VisualPulseState`

### `VisualPulseState`
State of the visual transition countdown:
* `active`: `boolean`
* `stepCountdown`: `number` (3, 2, 1, 0)
* `nextZoneColor`: `string` (Hex / Tailwind color code)
* `pulseIntensity`: `'subtle' | 'vibrant'`

## 2. Component Contract Models

### `NeonArcGaugeProps`
* `value`: `number` (Current real-time metric e.g. 185 W or 92 RPM)
* `targetValue`: `number` (Target metric e.g. 200 W or 90 RPM)
* `maxValue`: `number` (Scale maximum e.g. 400 W or 130 RPM)
* `label`: `string` ("PUISSANCE" | "CADENCE")
* `unit`: `string` ("W" | "RPM")
* `activeZone`: `PowerZone` (Coggan Zone Z1-Z7 with color & glow)
* `size`: `'lg' | 'xl' | 'panoramic'`

### `LandscapeControlsConfig`
* `leftZone`: `{ onDecreaseIntensity: () => void, onIncreaseIntensity: () => void, intensityMultiplier: number }`
* `rightZone`: `{ onTogglePlayPause: () => void, onSkipStep: () => void, onPreviousStep: () => void, onStopWorkout: () => void, status: WorkoutStatus }`
* `topZone`: `{ onToggleFullscreen: () => void, isFullscreen: boolean }`
