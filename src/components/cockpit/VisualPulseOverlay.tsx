import React from 'react';

export interface VisualPulseOverlayProps {
  isActive: boolean;
  countdown: number; // 3, 2, 1
  color?: string;
  nextStepName?: string;
  nextWatts?: number;
}

export const VisualPulseOverlay: React.FC<VisualPulseOverlayProps> = ({
  isActive,
  countdown,
  color = '#38bdf8',
  nextStepName,
  nextWatts,
}) => {
  if (!isActive || countdown <= 0 || countdown > 3) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 transition-all duration-300 flex items-center justify-center"
      style={{
        boxShadow: `inset 0 0 80px ${color}, inset 0 0 30px ${color}`,
        border: `3px solid ${color}`,
      }}
    >
      {/* Floating Center Badge for Transition */}
      <div
        className="bg-slate-950/90 border-2 rounded-3xl px-8 py-6 flex flex-col items-center justify-center shadow-2xl backdrop-blur-xl animate-bounce"
        style={{ borderColor: color, boxShadow: `0 0 50px ${color}` }}
      >
        <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
          PROCHAIN PALIER DANS
        </span>
        <span
          className="text-7xl sm:text-8xl font-black my-1"
          style={{ color, textShadow: `0 0 30px ${color}` }}
        >
          {countdown}
        </span>
        {nextStepName && (
          <div className="text-sm font-bold text-white mt-1">
            {nextStepName} {nextWatts ? `(${nextWatts} W)` : ''}
          </div>
        )}
      </div>
    </div>
  );
};
