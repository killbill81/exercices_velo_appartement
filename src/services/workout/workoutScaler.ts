import { WorkoutDefinition, WorkoutStep } from '../../types/workout';
import { getPowerZone } from './ftpCalculator';
import { PowerZone } from '../../types/user';

export interface ScaledWorkoutStep extends WorkoutStep {
  targetWatts: number;
  powerZone: PowerZone;
  accumulatedStartSeconds: number;
  accumulatedEndSeconds: number;
}

export interface ScaledWorkoutDefinition extends WorkoutDefinition {
  scaledSteps: ScaledWorkoutStep[];
  totalDurationSeconds: number;
  ftpWatts: number;
}

/**
 * Adapte dynamiquement une séance d'entraînement à la FTP de l'utilisateur
 */
export function scaleWorkoutToFtp(workout: WorkoutDefinition, ftpWatts: number): ScaledWorkoutDefinition {
  const ftp = Math.max(50, ftpWatts);
  let currentAccumulated = 0;

  const scaledSteps: ScaledWorkoutStep[] = workout.steps.map((step) => {
    let targetWatts = 0;
    
    if (workout.isRampTest && step.type === 'test_ramp') {
      // Pour le ramp test, targetPowerPercentFtp = targetWatts réels
      targetWatts = step.targetPowerPercentFtp;
    } else {
      targetWatts = Math.round((step.targetPowerPercentFtp / 100) * ftp);
    }

    const powerZone = getPowerZone(targetWatts, ftp);
    const start = currentAccumulated;
    currentAccumulated += step.durationSeconds;

    return {
      ...step,
      targetWatts: Math.max(20, targetWatts),
      powerZone,
      accumulatedStartSeconds: start,
      accumulatedEndSeconds: currentAccumulated,
    };
  });

  return {
    ...workout,
    scaledSteps,
    totalDurationSeconds: currentAccumulated,
    ftpWatts: ftp,
  };
}
