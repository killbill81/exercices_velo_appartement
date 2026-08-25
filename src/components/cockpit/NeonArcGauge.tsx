import React from 'react';

export interface NeonArcGaugeProps {
  currentValue: number;
  targetValue?: number;
  maxValue: number;
  label: string;
  unit: string;
  color: string;
  glowColor: string;
  zoneName?: string;
  subLabel?: string;
  statusBadge?: string;
  statusBadgeClass?: string;
  size?: 'compact' | 'md' | 'lg' | 'xl';
}

export const NeonArcGauge: React.FC<NeonArcGaugeProps> = ({
  currentValue,
  targetValue,
  maxValue,
  label,
  unit,
  color,
  glowColor,
  zoneName,
  subLabel,
  statusBadge,
  statusBadgeClass = 'bg-slate-800 text-slate-300',
  size = 'lg',
}) => {
  // Arc geometry: 240 degrees (from 150 deg to 390 deg)
  const radius = 80;
  const strokeWidth = 12;
  const center = 100;
  const startAngle = 150;
  const sweepAngle = 240;

  // Percentage of max value
  const progressRatio = Math.max(0, Math.min(1, currentValue / (maxValue || 1)));
  const targetRatio = targetValue ? Math.max(0, Math.min(1, targetValue / (maxValue || 1))) : null;

  // Arc math helper: convert polar to cartesian
  const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians),
    };
  };

  // Generate SVG path string for arc
  const describeArc = (cx: number, cy: number, r: number, start: number, end: number) => {
    const startPoint = polarToCartesian(cx, cy, r, end);
    const endPoint = polarToCartesian(cx, cy, r, start);
    const largeArcFlag = end - start <= 180 ? '0' : '1';
    return `M ${startPoint.x} ${startPoint.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${endPoint.x} ${endPoint.y}`;
  };

  const bgArcPath = describeArc(center, center, radius, startAngle, startAngle + sweepAngle);
  const currentAngle = startAngle + progressRatio * sweepAngle;
  const progressArcPath = describeArc(center, center, radius, startAngle, Math.max(startAngle + 0.1, currentAngle));

  // Target marker position
  let targetPoint: { x: number; y: number } | null = null;
  if (targetRatio !== null) {
    const targetAngle = startAngle + targetRatio * sweepAngle;
    targetPoint = polarToCartesian(center, center, radius, targetAngle);
  }

  // Dimension scaling
  const sizeClasses = {
    compact: 'w-32 h-32 xs:w-36 xs:h-36 sm:w-44 sm:h-44',
    md: 'w-44 h-44 sm:w-52 sm:h-52',
    lg: 'w-52 h-52 sm:w-60 sm:h-60 lg:w-64 lg:h-64',
    xl: 'w-60 h-60 sm:w-68 sm:h-68 lg:w-76 lg:h-76',
  }[size];

  const valueFontSize = {
    compact: 'text-3xl xs:text-4xl sm:text-5xl',
    md: 'text-4xl sm:text-5xl',
    lg: 'text-5xl sm:text-6xl lg:text-7xl',
    xl: 'text-6xl sm:text-7xl lg:text-8xl',
  }[size];

  const containerPadding = size === 'compact' ? 'p-2 sm:p-3' : 'p-3 sm:p-4';

  return (
    <div className={`relative flex flex-col items-center justify-center ${containerPadding} rounded-2xl sm:rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-slate-700`}>
      {/* Header Label & Badge */}
      <div className="w-full flex items-center justify-between px-2 mb-1 z-10">
        <span className="text-xs font-black tracking-wider text-slate-400 uppercase">
          {label}
        </span>
        {statusBadge && (
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border transition-colors ${statusBadgeClass}`}>
            {statusBadge}
          </span>
        )}
      </div>

      {/* SVG Arc Gauge */}
      <div className={`relative ${sizeClasses} flex items-center justify-center`}>
        <svg viewBox="0 0 200 200" className="w-full h-full transform transition-all duration-300">
          <defs>
            {/* Dynamic Drop Shadow Glow */}
            <filter id={`glow-${label}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={glowColor} floodOpacity="0.8" />
            </filter>
            {/* Gradient definition */}
            <linearGradient id={`grad-${label}`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor={color} />
              <stop offset="100%" stopColor={color} />
            </linearGradient>
          </defs>

          {/* Background Track Arc */}
          <path
            d={bgArcPath}
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active Progress Arc with Neon Glow */}
          <path
            d={progressArcPath}
            fill="none"
            stroke={`url(#grad-${label})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            filter={`url(#glow-${label})`}
            className="transition-all duration-300 ease-out"
          />

          {/* Target Marker Tick */}
          {targetPoint && (
            <circle
              cx={targetPoint.x}
              cy={targetPoint.y}
              r="6"
              fill="#ffffff"
              stroke={color}
              strokeWidth="2"
              className="animate-pulse shadow-lg"
            />
          )}
        </svg>

        {/* Center Digital Value & Unit */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
          <div className="flex items-baseline gap-1">
            <span
              className={`font-black tracking-tight text-white ${valueFontSize} drop-shadow-md transition-colors duration-200`}
              style={{ textShadow: `0 0 20px ${glowColor}` }}
            >
              {Math.round(currentValue)}
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-400">
              {unit}
            </span>
          </div>

          {/* Target Delta or Sub-label */}
          {targetValue !== undefined && targetValue > 0 ? (
            <div className="text-[11px] sm:text-xs font-semibold text-slate-400 mt-0.5">
              Cible : <span className="font-bold text-slate-200">{targetValue} {unit}</span>
            </div>
          ) : subLabel ? (
            <div className="text-[11px] sm:text-xs font-medium text-slate-400 mt-0.5">
              {subLabel}
            </div>
          ) : null}
        </div>
      </div>

      {/* Footer Zone Name */}
      {zoneName && (
        <div className="mt-1 text-xs font-bold text-center transition-colors" style={{ color }}>
          {zoneName}
        </div>
      )}
    </div>
  );
};
