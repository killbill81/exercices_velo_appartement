import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Plus, Minus, Square } from 'lucide-react';
import { WorkoutStatus } from '../../types/workout';

interface WorkoutControlsProps {
  status: WorkoutStatus;
  intensityMultiplier: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onSkip: () => void;
  onPrevious: () => void;
  onAdjustIntensity: (delta: number) => void;
  onStop: () => void;
}

export const WorkoutControls: React.FC<WorkoutControlsProps> = ({
  status,
  intensityMultiplier,
  onStart,
  onPause,
  onResume,
  onSkip,
  onPrevious,
  onAdjustIntensity,
  onStop,
}) => {
  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isIdle = status === 'idle';

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-3.5 sm:p-5 shadow-2xl flex flex-wrap items-center justify-between gap-3">
      {/* Intensity Adjustment (±5%) */}
      <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
        <button
          onClick={() => onAdjustIntensity(-0.05)}
          title="Réduire l'intensité de 5%"
          className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 flex items-center justify-center font-bold transition-all"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="px-2 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400">Intensité</div>
          <div className="text-xs font-mono font-bold text-cyan-400">
            {Math.round(intensityMultiplier * 100)}%
          </div>
        </div>

        <button
          onClick={() => onAdjustIntensity(0.05)}
          title="Augmenter l'intensité de 5%"
          className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 flex items-center justify-center font-bold transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Main Play / Pause Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Previous Step */}
        <button
          onClick={onPrevious}
          disabled={isIdle}
          title="Bloc précédent"
          className="w-11 h-11 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 flex items-center justify-center transition-all disabled:opacity-40 disabled:pointer-events-none"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        {/* Big Center Action Button */}
        {isIdle && (
          <button
            onClick={onStart}
            className="px-6 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm sm:text-base flex items-center gap-2.5 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
          >
            <Play className="w-6 h-6 fill-current" />
            DÉMARRER LA SÉANCE
          </button>
        )}

        {isRunning && (
          <button
            onClick={onPause}
            className="px-6 h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm sm:text-base flex items-center gap-2.5 shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
          >
            <Pause className="w-6 h-6 fill-current" />
            PAUSE
          </button>
        )}

        {isPaused && (
          <button
            onClick={onResume}
            className="px-6 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm sm:text-base flex items-center gap-2.5 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
          >
            <Play className="w-6 h-6 fill-current" />
            REPRENDRE
          </button>
        )}

        {/* Skip Step */}
        <button
          onClick={onSkip}
          disabled={isIdle}
          title="Passer au bloc suivant"
          className="w-11 h-11 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 flex items-center justify-center transition-all disabled:opacity-40 disabled:pointer-events-none"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Stop Button */}
      {!isIdle && (
        <button
          onClick={onStop}
          title="Arrêter et terminer la séance"
          className="h-11 px-3.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-bold text-xs flex items-center gap-1.5 border border-rose-500/30 transition-all active:scale-95"
        >
          <Square className="w-4 h-4 fill-current" />
          <span className="hidden sm:inline">Terminer</span>
        </button>
      )}
    </div>
  );
};
