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
  className?: string;
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
  className = '',
}) => {
  const hrZone = heartRateBpm > 0 ? getHeartRateZone(heartRateBpm, maxHeartRateBpm) : null;

  return (
    <div className={`w-full bg-slate-900/95 border border-slate-800 rounded-3xl p-2 sm:p-3 shadow-xl backdrop-blur-md flex flex-col justify-between ${className}`}>
      {/* Grille 2x3 de Tuiles Métriques Haute Visibilité */}
      <div className="grid grid-cols-3 grid-rows-2 gap-1.5 sm:gap-2.5 h-full w-full">
        
        {/* 1. Cardio Tuile (Priorité Pixel Watch) */}
        <div className="flex flex-col justify-between p-2 sm:p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Heart
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                  heartRateBpm > 0 ? 'text-rose-500 animate-pulse' : 'text-slate-600'
                }`}
                fill={heartRateBpm > 0 ? 'currentColor' : 'none'}
              />
              <span className="text-[10px] sm:text-xs font-black tracking-wider text-slate-400 uppercase">Cardio</span>
            </div>
            {heartRateSource === 'watch' && (
              <span className="flex items-center gap-0.5 px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-400 text-[9px] font-bold border border-cyan-500/30" title="Pixel Watch 4">
                <Watch className="w-2.5 h-2.5" />
                <span>Pixel</span>
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className="text-xl sm:text-2xl lg:text-3xl font-black font-mono tracking-tight leading-none"
              style={{ color: hrZone ? hrZone.color : '#ffffff' }}
            >
              {heartRateBpm > 0 ? heartRateBpm : '--'}
            </span>
            <span className="text-[10px] font-bold text-slate-500">BPM</span>
          </div>
          {hrZone && (
            <div className="text-[9px] font-bold truncate mt-0.5" style={{ color: hrZone.color }}>
              {hrZone.name}
            </div>
          )}
        </div>

        {/* 2. Vitesse Tuile */}
        <div className="flex flex-col justify-between p-2 sm:p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-sm transition-all">
          <div className="flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
            <span className="text-[10px] sm:text-xs font-black tracking-wider text-slate-400 uppercase">Vitesse</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl lg:text-3xl font-black font-mono text-white tracking-tight leading-none">
              {speedKmh.toFixed(1)}
            </span>
            <span className="text-[10px] font-bold text-slate-500">km/h</span>
          </div>
          <div className="text-[9px] font-semibold text-slate-500 truncate mt-0.5">
            Instantanée
          </div>
        </div>

        {/* 3. Distance Tuile */}
        <div className="flex flex-col justify-between p-2 sm:p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-sm transition-all">
          <div className="flex items-center gap-1">
            <Route className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            <span className="text-[10px] sm:text-xs font-black tracking-wider text-slate-400 uppercase">Distance</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl lg:text-3xl font-black font-mono text-white tracking-tight leading-none">
              {distanceKm.toFixed(2)}
            </span>
            <span className="text-[10px] font-bold text-slate-500">km</span>
          </div>
          <div className="text-[9px] font-semibold text-slate-500 truncate mt-0.5">
            Cumulée
          </div>
        </div>

        {/* 4. Calories Tuile */}
        <div className="flex flex-col justify-between p-2 sm:p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-sm transition-all">
          <div className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span className="text-[10px] sm:text-xs font-black tracking-wider text-slate-400 uppercase">Énergie</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl lg:text-3xl font-black font-mono text-white tracking-tight leading-none">
              {Math.round(caloriesKcal)}
            </span>
            <span className="text-[10px] font-bold text-slate-500">kcal</span>
          </div>
          <div className="text-[9px] font-semibold text-slate-500 truncate mt-0.5">
            Brûlées
          </div>
        </div>

        {/* 5. Temps Tuile */}
        <div className="flex flex-col justify-between p-2 sm:p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-sm transition-all">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
            <span className="text-[10px] sm:text-xs font-black tracking-wider text-slate-400 uppercase">Chrono</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl lg:text-3xl font-black font-mono text-white tracking-tight leading-none">
              {formatDuration(elapsedSeconds)}
            </span>
          </div>
          <div className="text-[9px] font-semibold text-slate-500 truncate mt-0.5">
            Temps écoulé
          </div>
        </div>

        {/* 6. Résistance / ERG Auto-Pilot Toggle Tuile */}
        <button
          onClick={onToggleAutoControl}
          title={isAutoControlActive ? "Mode ERG Automatique actif (cliquez pour basculer en manuel)" : "Mode Manuel (cliquez pour activer l'auto-pilot ERG)"}
          className={`flex flex-col justify-between p-2 sm:p-2.5 rounded-2xl border text-left transition-all active:scale-95 shadow-sm ${
            isAutoControlActive
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-500/10 ring-1 ring-amber-500/30'
              : 'bg-slate-950/80 text-slate-300 border-slate-800/90 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1">
              {isAutoControlActive ? (
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-current animate-pulse" />
              ) : (
                <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
              )}
              <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase text-slate-400">
                {isAutoControlActive ? 'Auto-Pilot' : 'Résistance'}
              </span>
            </div>
            <span className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded ${isAutoControlActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
              {isAutoControlActive ? 'ON' : 'MANUEL'}
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl lg:text-3xl font-black font-mono text-white tracking-tight leading-none">
              {isAutoControlActive ? 'ERG' : `R${resistanceLevel || 1}`}
            </span>
          </div>
          <div className="text-[9px] font-semibold text-slate-400 truncate mt-0.5">
            {isAutoControlActive ? 'Puissance asservie' : 'Niveau fixe'}
          </div>
        </button>

      </div>
    </div>
  );
};
