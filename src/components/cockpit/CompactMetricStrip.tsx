import React from 'react';
import { Heart, Gauge, Route, Flame, Clock, Sliders, Zap, Watch } from 'lucide-react';
import { getHeartRateZone } from '../../services/workout/ftpCalculator';

interface CompactMetricStripProps {
  heartRateBpm: number;
  heartRateSource: 'watch' | 'bike' | 'none';
  maxHeartRateBpm: number;
  speedKmh: number;
  distanceKm: number;
  caloriesKcal: number;
  elapsedSeconds: number;
  resistanceLevel: number;
  isAutoControlActive: boolean;
  onToggleAutoControl: () => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export const CompactMetricStrip: React.FC<CompactMetricStripProps> = ({
  heartRateBpm,
  heartRateSource,
  maxHeartRateBpm,
  speedKmh,
  distanceKm,
  caloriesKcal,
  elapsedSeconds,
  resistanceLevel,
  isAutoControlActive,
  onToggleAutoControl,
}) => {
  const hrZone = heartRateBpm > 0 ? getHeartRateZone(heartRateBpm, maxHeartRateBpm) : null;

  return (
    <div className="w-full bg-slate-900/95 border border-slate-800 rounded-2xl p-1.5 sm:p-2 shadow-lg backdrop-blur-md flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
      {/* 1. Cardio Chip (Priorité Pixel Watch) */}
      <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0">
        <Heart
          className={`w-3.5 h-3.5 ${
            heartRateBpm > 0 ? 'text-rose-500 animate-pulse' : 'text-slate-600'
          }`}
          fill={heartRateBpm > 0 ? 'currentColor' : 'none'}
        />
        <span
          className="text-xs sm:text-sm font-black font-mono tracking-tight"
          style={{ color: hrZone ? hrZone.color : '#ffffff' }}
        >
          {heartRateBpm > 0 ? heartRateBpm : '--'}
        </span>
        <span className="text-[9px] font-bold text-slate-500">BPM</span>
        {heartRateSource === 'watch' && (
          <span title="Pixel Watch 4">
            <Watch className="w-3 h-3 text-cyan-400 ml-0.5" />
          </span>
        )}
      </div>

      {/* 2. Vitesse */}
      <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-950/60 border border-slate-800/80 shrink-0">
        <Gauge className="w-3 h-3 text-cyan-400" />
        <span className="text-xs font-black font-mono text-white">{speedKmh.toFixed(1)}</span>
        <span className="text-[9px] font-bold text-slate-500">km/h</span>
      </div>

      {/* 3. Distance */}
      <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-950/60 border border-slate-800/80 shrink-0">
        <Route className="w-3 h-3 text-emerald-400" />
        <span className="text-xs font-black font-mono text-white">{distanceKm.toFixed(2)}</span>
        <span className="text-[9px] font-bold text-slate-500">km</span>
      </div>

      {/* 4. Calories */}
      <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-950/60 border border-slate-800/80 shrink-0">
        <Flame className="w-3 h-3 text-amber-400" />
        <span className="text-xs font-black font-mono text-white">{Math.round(caloriesKcal)}</span>
        <span className="text-[9px] font-bold text-slate-500">kcal</span>
      </div>

      {/* 5. Temps */}
      <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-950/60 border border-slate-800/80 shrink-0">
        <Clock className="w-3 h-3 text-purple-400" />
        <span className="text-xs font-black font-mono text-white">{formatDuration(elapsedSeconds)}</span>
      </div>

      {/* 6. Résistance & ERG Auto-Pilot Toggle */}
      <button
        onClick={onToggleAutoControl}
        title={isAutoControlActive ? "Mode ERG Automatique actif (cliquez pour passer en manuel)" : "Mode Manuel (cliquez pour activer l'auto-pilot)"}
        className={`flex items-center gap-1 px-2 py-1 rounded-xl border transition-all shrink-0 ${
          isAutoControlActive
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
            : 'bg-slate-950/60 text-slate-400 border-slate-800'
        }`}
      >
        {isAutoControlActive ? (
          <Zap className="w-3 h-3 text-amber-400 fill-current animate-pulse" />
        ) : (
          <Sliders className="w-3 h-3 text-rose-400" />
        )}
        <span className="text-xs font-black font-mono text-white">
          {isAutoControlActive ? 'ERG' : `R${resistanceLevel || 1}`}
        </span>
      </button>
    </div>
  );
};
