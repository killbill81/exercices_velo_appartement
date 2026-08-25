import React from 'react';
import { X, Play, Clock, Flame, Zap } from 'lucide-react';
import { WorkoutDefinition } from '../../types/workout';
import { scaleWorkoutToFtp } from '../../services/workout/workoutScaler';

interface WorkoutDetailModalProps {
  workout: WorkoutDefinition | null;
  userFtpWatts: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectAndStart: (workout: WorkoutDefinition) => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m} min`;
}

export const WorkoutDetailModal: React.FC<WorkoutDetailModalProps> = ({
  workout,
  userFtpWatts,
  isOpen,
  onClose,
  onSelectAndStart,
}) => {
  if (!isOpen || !workout) return null;

  const scaled = scaleWorkoutToFtp(workout, userFtpWatts);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              {workout.subtitle || workout.category.toUpperCase()}
            </div>
            <h2 className="text-xl font-black text-white mt-1">{workout.title}</h2>
            <p className="text-xs text-slate-400 mt-1">{workout.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-2 p-6 border-b border-slate-800/80 bg-slate-900/40">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs font-medium">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Durée</span>
            </div>
            <div className="text-lg font-black text-white font-mono mt-1">
              {formatDuration(scaled.totalDurationSeconds)}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs font-medium">
              <Zap className="w-3.5 h-3.5 text-orange-400" />
              <span>FTP Référence</span>
            </div>
            <div className="text-lg font-black text-orange-400 font-mono mt-1">
              {userFtpWatts} W
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 text-xs font-medium">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Stress TSS</span>
            </div>
            <div className="text-lg font-black text-white font-mono mt-1">
              {workout.estimatedTss || '~35'}
            </div>
          </div>
        </div>

        {/* Steps List */}
        <div className="p-6 max-h-[40vh] overflow-y-auto space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Déroulé des Intervalles ({scaled.scaledSteps.length} blocs)
          </h3>

          {scaled.scaledSteps.map((step, idx) => (
            <div
              key={step.id || idx}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-2.5 h-8 rounded-full"
                  style={{ backgroundColor: step.powerZone.color }}
                />
                <div>
                  <div className="font-bold text-slate-200">{step.name}</div>
                  <div className="text-[11px] text-slate-400">
                    {step.powerZone.name} {step.targetCadenceRpm ? `• ${step.targetCadenceRpm} RPM` : ''}
                  </div>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="font-bold text-white text-sm" style={{ color: step.powerZone.color }}>
                  {step.targetWatts} W
                </div>
                <div className="text-slate-500 text-[11px]">
                  {formatDuration(step.durationSeconds)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
          >
            Retour
          </button>
          <button
            onClick={() => {
              onSelectAndStart(workout);
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            Lancer cet entraînement
          </button>
        </div>
      </div>
    </div>
  );
};
