import React from 'react';
import { Gauge, Route, Flame, Clock, Sliders, Zap } from 'lucide-react';
import { UnifiedBikeState } from '../../types/bluetooth';
import { UserProfile } from '../../types/user';
import { WorkoutEngineState } from '../../services/workout/workoutEngine';
import { bluetoothManager } from '../../services/bluetooth/bluetoothManager';
import { getPowerZone } from '../../services/workout/ftpCalculator';
import { getZoneTheme } from '../../types/uiTheme';
import { PowerZoneGauge } from './PowerZoneGauge';
import { CadenceTargetGauge } from './CadenceTargetGauge';
import { HeartRateBadge } from './HeartRateBadge';
import { IntervalTimeline } from './IntervalTimeline';
import { MetricCard } from './MetricCard';
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

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
  // Calcul de la zone du prochain palier pour l'animation de pulsation lumineuse (T-3s)
  const nextZoneTheme = workoutState.nextStep
    ? getZoneTheme(getPowerZone(workoutState.nextStep.targetWatts, userProfile.ftpWatts).zone)
    : getZoneTheme(1);

  const isTransitioning =
    workoutState.status === 'running' &&
    workoutState.stepRemainingSeconds <= 3 &&
    workoutState.stepRemainingSeconds > 0 &&
    !!workoutState.nextStep;

  return (
    <div className="max-w-7xl mx-auto pb-6 space-y-4">
      {/* Visual Pulse Transition Overlay (T-3s, 2s, 1s) */}
      <VisualPulseOverlay
        isActive={isTransitioning}
        countdown={workoutState.stepRemainingSeconds}
        color={nextZoneTheme.color}
        nextStepName={workoutState.nextStep?.name}
        nextWatts={workoutState.nextStep?.targetWatts}
      />

      {/* Main Responsive Grid: Stacks on portrait, side-by-side panoramic on landscape/desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* ========================================================================= */}
        {/* COLONNE GAUCHE (Landscape: 6/12 ou 7/12) : JAUGES GÉANTES NÉON DE BORD    */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 xl:col-span-6 space-y-4">
          {/* Dual Main Neon Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PowerZoneGauge
              currentWatts={bikeState.powerWatts}
              targetWatts={workoutState.targetWatts}
              ftpWatts={userProfile.ftpWatts}
              size="lg"
            />

            <CadenceTargetGauge
              currentCadenceRpm={bikeState.cadenceRpm}
              targetCadenceRpm={workoutState.targetCadenceRpm || 85}
              size="lg"
            />
          </div>

          {/* Heart Rate Sensor Priority Banner */}
          <HeartRateBadge
            heartRateBpm={bikeState.heartRateBpm}
            source={bikeState.heartRateSource}
            maxHeartRateBpm={userProfile.maxHeartRateBpm}
          />
        </div>

        {/* ========================================================================= */}
        {/* COLONNE DROITE (Landscape: 6/12 ou 5/12) : TIMELINE & MÉTRIQUES & COMMANDES */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 xl:col-span-6 space-y-4">
          {/* 1. Timeline & Interval Header */}
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
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-white">Aucune séance sélectionnée</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choisissez un programme structuré (HIIT, Seuil, Cardio) ou lancez un tour libre.
                </p>
              </div>
              <button
                onClick={onOpenPlanSelector}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
              >
                Choisir une séance
              </button>
            </div>
          )}

          {/* 2. Auto-Pilot Vélo (Mode ERG) Status Banner */}
          <div className={`p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
            bikeState.isAutoControlActive
              ? 'bg-amber-500/10 border-amber-500/30 shadow-md shadow-amber-500/5'
              : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl shrink-0 ${
                bikeState.isAutoControlActive
                  ? 'bg-amber-500/20 text-amber-400 animate-pulse'
                  : 'bg-slate-800 text-slate-500'
              }`}>
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-white">
                    {bikeState.isAutoControlActive ? '⚡ Pilotage Automatique Vélo (Mode ERG)' : '✋ Pilotage Manuel de la Résistance'}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    bikeState.isAutoControlActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {bikeState.isAutoControlActive ? 'ACTIF' : 'MANUEL'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {bikeState.isAutoControlActive
                    ? `La résistance magnétique s'adapte automatiquement sur ${workoutState.targetWatts > 0 ? workoutState.targetWatts : userProfile.ftpWatts} W.`
                    : 'La résistance magnétique reste réglée manuellement depuis la console du vélo.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => bluetoothManager.setAutoControlEnabled(!bikeState.isAutoControlActive)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                bikeState.isAutoControlActive
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
              }`}
            >
              {bikeState.isAutoControlActive ? 'Passer en Manuel' : 'Activer Auto-Pilot'}
            </button>
          </div>

          {/* 3. Secondary Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <MetricCard
              icon={<Gauge className="w-3.5 h-3.5 text-cyan-400" />}
              label="Vitesse"
              value={bikeState.speedKmh.toFixed(1)}
              unit="km/h"
            />
            <MetricCard
              icon={<Route className="w-3.5 h-3.5 text-emerald-400" />}
              label="Distance"
              value={bikeState.distanceKm.toFixed(2)}
              unit="km"
            />
            <MetricCard
              icon={<Flame className="w-3.5 h-3.5 text-amber-400" />}
              label="Calories"
              value={Math.round(bikeState.caloriesKcal)}
              unit="kcal"
            />
            <MetricCard
              icon={<Clock className="w-3.5 h-3.5 text-purple-400" />}
              label="Temps"
              value={formatDuration(workoutState.totalElapsedSeconds || bikeState.elapsedTimeSeconds)}
              unit=""
            />
            <MetricCard
              icon={<Sliders className="w-3.5 h-3.5 text-rose-400" />}
              label="Résistance"
              value={bikeState.resistanceLevel || 1}
              unit="/ 15"
            />
          </div>

          {/* 4. Ergonomic Thumb Controls for Hands on Handlebars */}
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
  );
};
