import React from 'react';
import { UnifiedBikeState } from '../../types/bluetooth';
import { UserProfile } from '../../types/user';
import { WorkoutEngineState } from '../../services/workout/workoutEngine';
import { bluetoothManager } from '../../services/bluetooth/bluetoothManager';
import { getPowerZone } from '../../services/workout/ftpCalculator';
import { getZoneTheme } from '../../types/uiTheme';
import { PowerZoneGauge } from './PowerZoneGauge';
import { CadenceTargetGauge } from './CadenceTargetGauge';
import { IntervalTimeline } from './IntervalTimeline';
import { CompactMetricStrip } from './CompactMetricStrip';
import { LateralControls } from './LateralControls';
import { VisualPulseOverlay } from './VisualPulseOverlay';

interface LiveCockpitProps {
  bikeState: UnifiedBikeState;
  workoutState: WorkoutEngineState;
  userProfile: UserProfile;
  onStartWorkout: () => void;
  onPauseWorkout: () => void;
  onResumeWorkout: () => void;
  onSkipStep: () => void;
  onPreviousStep: () => void;
  onAdjustIntensity: (delta: number) => void;
  onStopWorkout: () => void;
  onOpenPlanSelector: () => void;
}

export const LiveCockpit: React.FC<LiveCockpitProps> = ({
  bikeState,
  workoutState,
  userProfile,
  onStartWorkout,
  onPauseWorkout,
  onResumeWorkout,
  onSkipStep,
  onPreviousStep,
  onAdjustIntensity,
  onStopWorkout,
  onOpenPlanSelector,
}) => {
  // Calcul de la zone du prochain palier pour la pulsation lumineuse (T-3s)
  const nextZoneTheme = workoutState.nextStep
    ? getZoneTheme(getPowerZone(workoutState.nextStep.targetWatts, userProfile.ftpWatts).zone)
    : getZoneTheme(1);

  const isTransitioning =
    workoutState.status === 'running' &&
    workoutState.stepRemainingSeconds <= 3 &&
    workoutState.stepRemainingSeconds > 0 &&
    !!workoutState.nextStep;

  return (
    <div className="w-full h-full max-h-full flex flex-col justify-between overflow-hidden max-w-7xl mx-auto px-1 py-0.5">
      {/* 1. Animation de Pulsation Lumineuse (T-3s) */}
      <VisualPulseOverlay
        isActive={isTransitioning}
        countdown={workoutState.stepRemainingSeconds}
        color={nextZoneTheme.color}
        nextStepName={workoutState.nextStep?.name}
        nextWatts={workoutState.nextStep?.targetWatts}
      />

      {/* 2. Conteneur Principal : 2 colonnes en Paysage / Desktop, 1 colonne en Portrait Mobile */}
      <div className="w-full h-full flex flex-col landscape:flex-row lg:flex-row items-stretch justify-between gap-1.5 sm:gap-3 overflow-hidden">
        
        {/* COLONNE GAUCHE (ou Milieu en portrait) : Jauges Néon Duo (Watts + Cadence) */}
        <div className="w-full landscape:w-[48%] lg:w-[48%] flex flex-col justify-center items-center shrink-0 my-auto">
          <div className="grid grid-cols-2 gap-1.5 sm:gap-3 w-full max-w-lg">
            <PowerZoneGauge
              currentWatts={bikeState.powerWatts}
              targetWatts={workoutState.targetWatts}
              ftpWatts={userProfile.ftpWatts}
              size="compact"
            />

            <CadenceTargetGauge
              currentCadenceRpm={bikeState.cadenceRpm}
              targetCadenceRpm={workoutState.targetCadenceRpm || 85}
              size="compact"
            />
          </div>
        </div>

        {/* COLONNE DROITE : Timeline, Métriques & Commandes */}
        <div className="w-full landscape:w-[52%] lg:w-[52%] flex flex-col justify-between h-full gap-1 overflow-hidden py-0.5">
          {/* Haut Droite : Timeline Palier */}
          <div className="w-full shrink-0">
            {workoutState.workout ? (
              <IntervalTimeline
                workout={workoutState.workout}
                currentStepIndex={workoutState.currentStepIndex}
                stepRemainingSeconds={workoutState.stepRemainingSeconds}
                totalRemainingSeconds={workoutState.totalRemainingSeconds}
                currentStep={workoutState.currentStep}
                nextStep={workoutState.nextStep}
              />
            ) : (
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 flex items-center justify-between gap-2 shadow-lg">
                <div>
                  <h3 className="text-xs font-bold text-white">Aucun programme actif</h3>
                  <p className="text-[10px] text-slate-400">Pédalage libre ou choisissez un plan.</p>
                </div>
                <button
                  onClick={onOpenPlanSelector}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 font-bold text-[11px] shadow-md transition-all shrink-0"
                >
                  Choisir un plan
                </button>
              </div>
            )}
          </div>

          {/* Milieu Droite : Ruban Métriques */}
          <div className="w-full shrink-0">
            <CompactMetricStrip
              heartRateBpm={bikeState.heartRateBpm}
              heartRateSource={bikeState.heartRateSource}
              maxHeartRateBpm={userProfile.maxHeartRateBpm}
              speedKmh={bikeState.speedKmh}
              distanceKm={bikeState.distanceKm}
              caloriesKcal={bikeState.caloriesKcal}
              elapsedSeconds={workoutState.totalElapsedSeconds || bikeState.elapsedTimeSeconds}
              resistanceLevel={bikeState.resistanceLevel}
              isAutoControlActive={bikeState.isAutoControlActive}
              onToggleAutoControl={() => bluetoothManager.setAutoControlEnabled(!bikeState.isAutoControlActive)}
            />
          </div>

          {/* Bas Droite : Commandes Tactiles */}
          <div className="w-full shrink-0">
            <LateralControls
              status={workoutState.status}
              intensityMultiplier={workoutState.intensityMultiplier}
              onStart={onStartWorkout}
              onPause={onPauseWorkout}
              onResume={onResumeWorkout}
              onSkipStep={onSkipStep}
              onPreviousStep={onPreviousStep}
              onAdjustIntensity={onAdjustIntensity}
              onStop={onStopWorkout}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
