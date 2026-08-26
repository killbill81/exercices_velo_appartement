import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Square, Plus, Minus } from 'lucide-react';
import { WorkoutStatus } from '../../types/workout';

interface LateralControlsProps {
  status: WorkoutStatus;
  intensityMultiplier: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onSkipStep: () => void;
  onPreviousStep: () => void;
  onAdjustIntensity: (delta: number) => void;
  onStop: () => void;
}

export const LateralControls: React.FC<LateralControlsProps> = ({
  status,
  intensityMultiplier,
  onStart,
  onPause,
  onResume,
  onSkipStep,
  onPreviousStep,
  onAdjustIntensity,
  onStop,
}) => {
  const intensityPct = Math.round(intensityMultiplier * 100);

  return (
    <div className="w-full flex items-center justify-between gap-1.5 sm:gap-2 py-0.5">
      {/* 1. Flanc Gauche : Réglage d'Intensité (+/- 5%) accessible au pouce gauche */}
      <div className="flex items-center gap-1 bg-slate-900/95 border border-slate-800 rounded-xl p-1 shadow-md backdrop-blur-md">
        <button
          onClick={() => onAdjustIntensity(-0.05)}
          disabled={status !== 'running' || intensityMultiplier <= 0.5}
          title="Diminuer l'intensité de 5%"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-white border border-slate-700 shadow-sm transition-all"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <div className="px-1 text-center min-w-[42px] sm:min-w-[48px]">
          <div className="text-[8px] uppercase font-black tracking-wider text-slate-400 leading-none">Intensité</div>
          <div className={`text-xs sm:text-sm font-black font-mono leading-tight ${intensityPct === 100 ? 'text-white' : intensityPct > 100 ? 'text-amber-400' : 'text-cyan-400'}`}>
            {intensityPct}%
          </div>
        </div>

        <button
          onClick={() => onAdjustIntensity(0.05)}
          disabled={status !== 'running' || intensityMultiplier >= 1.5}
          title="Augmenter l'intensité de 5%"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-white border border-slate-700 shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Flanc Droit : Contrôles d'Entraînement accessibles au pouce droit */}
      <div className="flex items-center gap-1 bg-slate-900/95 border border-slate-800 rounded-xl p-1 shadow-md backdrop-blur-md">
        {/* Reculer d'un palier */}
        <button
          onClick={onPreviousStep}
          disabled={status !== 'running' && status !== 'paused'}
          title="Palier précédent"
          className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-slate-300 border border-slate-700 transition-all"
        >
          <SkipBack className="w-3 h-3" />
        </button>

        {/* Bouton Principal : Démarrer / Pause / Reprendre */}
        {status === 'idle' || status === 'finished' ? (
          <button
            onClick={onStart}
            className="h-8 sm:h-8.5 px-3 sm:px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-95 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Démarrer</span>
          </button>
        ) : status === 'running' ? (
          <button
            onClick={onPause}
            className="h-8 sm:h-8.5 px-3 sm:px-4 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
          >
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>Pause</span>
          </button>
        ) : (
          <button
            onClick={onResume}
            className="h-8 sm:h-8.5 px-3 sm:px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Reprendre</span>
          </button>
        )}

        {/* Sauter palier */}
        <button
          onClick={onSkipStep}
          disabled={status !== 'running'}
          title="Palier suivant"
          className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-slate-300 border border-slate-700 transition-all"
        >
          <SkipForward className="w-3 h-3" />
        </button>

        {/* Arrêter */}
        {(status === 'running' || status === 'paused') && (
          <button
            onClick={onStop}
            title="Arrêter la séance"
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 active:scale-95 flex items-center justify-center text-red-400 border border-red-500/30 transition-all ml-0.5"
          >
            <Square className="w-3 h-3 fill-current" />
          </button>
        )}
      </div>
    </div>
  );
};
