# Phase 1: Component & UI Contracts - UI/UX Cockpit Enhancements

## 1. `NeonArcGauge` Contract
```typescript
export interface NeonArcGaugeProps {
  currentValue: number;
  targetValue: number;
  maxValue: number;
  label: string;
  unit: string;
  color: string;
  glowColor: string;
  zoneName?: string;
  subLabel?: string;
}
```

## 2. `VisualPulseOverlay` Contract
```typescript
export interface VisualPulseOverlayProps {
  isActive: boolean;
  countdown: number; // 3, 2, 1
  color: string;
}
```

## 3. `FullscreenToggle` Contract
```typescript
export interface FullscreenToggleProps {
  isFullscreen: boolean;
  onToggle: () => void;
}
```
