# Phase 1: Data Model & UI Contracts - Zero-Scroll Mobile HUD

## 1. Component Props & Density Options

### `CompactGaugeProps`
* `size`: `'compact' | 'md' | 'lg' | 'xl'` (Defaults to `'compact'` on mobile portrait, `'lg'` on landscape/desktop).
* `currentValue`: `number`
* `targetValue`: `number | undefined`
* `label`: `string`
* `unit`: `string`
* `color`: `string`
* `glowColor`: `string`

### `CompactMetricStripProps`
* `heartRateBpm`: `number`
* `heartRateSource`: `'watch' | 'bike' | 'none'`
* `maxHeartRateBpm`: `number`
* `speedKmh`: `number`
* `distanceKm`: `number`
* `caloriesKcal`: `number`
* `resistanceLevel`: `number`
* `isAutoControlActive`: `boolean`
* `targetControlledWatts`: `number`
* `onToggleAutoControl`: `() => void`
