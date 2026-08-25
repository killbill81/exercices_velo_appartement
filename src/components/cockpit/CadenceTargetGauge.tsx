import React from 'react';
import { RotateCw, Target } from 'lucide-react';

interface CadenceTargetGaugeProps {
  currentCadenceRpm: number;
  targetCadenceRpm?: number;
}

export const CadenceTargetGauge: React.FC<CadenceTargetGaugeProps> = ({
  currentCadenceRpm,
  targetCadenceRpm = 85,
}) => {
  const diffRpm = currentCadenceRpm - targetCadenceRpm;
  const isOptimal = Math.abs(diffRpm) <= 4 && currentCadenceRpm > 0;
  const isTooSlow = diffRpm < -4 && currentCadenceRpm > 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <RotateCw className={`w-4 h-4 ${currentCadenceRpm > 0 ? 'animate-spin' : ''}`} style={{ animationDuration: currentCadenceRpm > 0 ? `${60 / currentCadenceRpm}s` : '0s' }} />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Cadence</h3>
            <div className="text-xs font-semibold text-cyan-400">
              Tours de pédale / min
            </div>
          </div>
        </div>

        {/* Target Badge */}
        <div className="px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono font-bold text-slate-300 flex items-center gap-1">
          <Target className="w-3 h-3 text-slate-500" />
          <span className="text-white">{targetCadenceRpm}</span> RPM
        </div>
      </div>

      {/* Main RPM Display */}
      <div className="my-4 text-center z-10">
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-white">
            {currentCadenceRpm}
          </span>
          <span className="text-lg font-bold text-slate-400">RPM</span>
        </div>

        {/* Guidance status */}
        <div className="mt-2 flex justify-center">
          {currentCadenceRpm === 0 ? (
            <div className="text-xs text-slate-500 font-medium">Pédalez pour lancer</div>
          ) : isOptimal ? (
            <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5 animate-pulse">
              <span>✨</span> Cadence Parfaite
            </div>
          ) : isTooSlow ? (
            <div className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5">
              <span>⚡</span> Pédalez plus vite (+{Math.abs(diffRpm)} RPM)
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 flex items-center gap-1.5">
              <span>🛑</span> Ralentissez (-{diffRpm} RPM)
            </div>
          )}
        </div>
      </div>

      {/* Visual Cadence Gauge */}
      <div className="space-y-1.5 z-10">
        <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
          <span>50 RPM</span>
          <span className="text-cyan-400">{targetCadenceRpm} RPM</span>
          <span>120 RPM</span>
        </div>
        <div className="w-full h-3 bg-slate-950 rounded-full p-0.5 border border-slate-800 flex overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 shadow-sm ${
              isOptimal ? 'bg-emerald-400' : isTooSlow ? 'bg-amber-400' : 'bg-blue-400'
            }`}
            style={{
              width: `${Math.min(100, Math.max(5, (currentCadenceRpm / 120) * 100))}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
