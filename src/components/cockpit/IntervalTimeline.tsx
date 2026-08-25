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
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-2.5 sm:p-3.5 shadow-lg backdrop-blur-md space-y-1.5">
      {/* Row 1: Step Info & Large Countdown */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0 animate-ping"
            style={{ backgroundColor: currentStep.powerZone.color }}
          />
          <div className="truncate">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-extrabold text-xs sm:text-sm text-white truncate">
                {currentStep.name}
              </span>
              <span
                className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border shrink-0"
                style={{
                  backgroundColor: `${currentStep.powerZone.color}20`,
                  borderColor: `${currentStep.powerZone.color}40`,
                  color: currentStep.powerZone.color,
                }}
              >
                {currentStep.targetWatts}W
              </span>
            </div>
            {nextStep && (
              <div className="flex items-center gap-1 text-[10px] text-slate-400 truncate mt-0.5">
                <span className="text-slate-500">Puis</span>
                <ArrowRight className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                <span className="text-slate-300 truncate">{nextStep.name}</span>
                <span style={{ color: nextStep.powerZone.color }} className="font-mono font-bold shrink-0">
                  ({nextStep.targetWatts}W)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Big Countdown Timer */}
        <div className="text-right shrink-0">
          <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 font-medium">
            <Timer className={`w-3 h-3 ${stepRemainingSeconds <= 3 ? 'text-amber-400 animate-spin' : 'text-cyan-400'}`} />
            <span className={stepRemainingSeconds <= 3 ? 'text-amber-300 font-bold' : ''}>
              {stepRemainingSeconds <= 3 ? 'Prêt !' : 'Fin bloc'}
            </span>
          </div>
          <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight leading-none transition-all ${
            stepRemainingSeconds <= 3 ? 'text-amber-400 scale-105 animate-pulse' : 'text-white'
          }`}>
            {formatTime(stepRemainingSeconds)}
          </div>
        </div>
      </div>

      {/* Row 2: Slim Segmented Timeline Bar & Remaining Time */}
      <div className="space-y-1">
        <div className="w-full h-2 sm:h-2.5 bg-slate-950 rounded-full p-0.5 border border-slate-800 flex gap-0.5 overflow-hidden">
          {workout.scaledSteps.map((step, idx) => {
            const widthPct = Math.max(2, (step.durationSeconds / totalDuration) * 100);
            const isCurrent = idx === currentStepIndex;
            const isPast = idx < currentStepIndex;

            return (
              <div
                key={step.id}
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: step.powerZone.color,
                }}
                className={`h-full rounded-full transition-all duration-300 ${
                  isCurrent
                    ? 'ring-1 ring-white animate-pulse'
                    : isPast
                    ? 'opacity-30'
                    : 'opacity-70'
                }`}
              />
            );
          })}
        </div>

        <div className="flex justify-between items-center text-[9px] sm:text-[10px] text-slate-400 font-medium px-0.5">
          <span>Bloc {currentStepIndex + 1}/{workout.scaledSteps.length}</span>
          <span className="flex items-center gap-1">
            <Flag className="w-2.5 h-2.5 text-emerald-400" />
            Total : <strong className="text-white font-mono">{formatTime(totalRemainingSeconds)}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
