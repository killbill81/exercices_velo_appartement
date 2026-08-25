import React from 'react';
import { Timer, ArrowRight, Flag } from 'lucide-react';
import { ScaledWorkoutDefinition, ScaledWorkoutStep } from '../../services/workout/workoutScaler';

interface IntervalTimelineProps {
  workout: ScaledWorkoutDefinition | null;
  currentStepIndex: number;
  stepRemainingSeconds: number;
  totalRemainingSeconds: number;
  currentStep: ScaledWorkoutStep | null;
  nextStep: ScaledWorkoutStep | null;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export const IntervalTimeline: React.FC<IntervalTimelineProps> = ({
  workout,
  currentStepIndex,
  stepRemainingSeconds,
  totalRemainingSeconds,
  currentStep,
  nextStep,
}) => {
  if (!workout || !currentStep) return null;

  const totalDuration = workout.totalDurationSeconds || 1;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Header with Timers */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full animate-ping"
              style={{ backgroundColor: currentStep.powerZone.color }}
            />
            <h3 className="font-extrabold text-sm sm:text-base text-white">
              {currentStep.name}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentStep.description || `${currentStep.targetWatts}W • ${currentStep.powerZone.name}`}
          </p>
        </div>

        {/* Step Countdown Timer */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400 font-medium">
            <Timer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Fin du bloc dans</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white mt-0.5">
            {formatTime(stepRemainingSeconds)}
          </div>
        </div>
      </div>

      {/* Interactive Segmented Timeline Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-12 bg-slate-950 rounded-2xl p-1 border border-slate-800/80 flex gap-1 overflow-hidden relative">
          {workout.scaledSteps.map((step, idx) => {
            const widthPct = Math.max(2, (step.durationSeconds / totalDuration) * 100);
            const isCurrent = idx === currentStepIndex;
            const isPast = idx < currentStepIndex;

            // Hauteur relative à la puissance (min 30%, max 100%)
            const heightPct = Math.min(100, Math.max(35, (step.targetWatts / (workout.ftpWatts * 1.5)) * 100));

            return (
              <div
                key={step.id}
                style={{ width: `${widthPct}%` }}
                className="h-full flex items-end relative group"
                title={`${step.name} (${step.targetWatts}W - ${formatTime(step.durationSeconds)})`}
              >
                <div
                  className={`w-full rounded-lg transition-all duration-300 ${
                    isCurrent
                      ? 'ring-2 ring-white shadow-lg animate-pulse'
                      : isPast
                      ? 'opacity-40'
                      : 'opacity-85 hover:opacity-100'
                  }`}
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: step.powerZone.color,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Progress labels */}
        <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium px-1">
          <span>Bloc {currentStepIndex + 1} sur {workout.scaledSteps.length}</span>
          <span className="flex items-center gap-1">
            <Flag className="w-3 h-3 text-emerald-400" />
            Total restant : <strong className="text-white font-mono">{formatTime(totalRemainingSeconds)}</strong>
          </span>
        </div>
      </div>

      {/* Next Step Preview */}
      {nextStep && (
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Suivant</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-200">{nextStep.name}</span>
          </div>
          <div className="flex items-center gap-2 font-mono font-bold">
            <span style={{ color: nextStep.powerZone.color }}>{nextStep.targetWatts} W</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{formatTime(nextStep.durationSeconds)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
