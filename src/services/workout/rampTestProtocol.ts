import { WorkoutDefinition, WorkoutStep } from '../../types/workout';

export interface RampTestResult {
  newFtpWatts: number;
  maxAerobicPowerWatts: number;
  completedStepCount: number;
  totalDurationSeconds: number;
  lastStepDurationSeconds: number;
}

/**
 * Construit un entraînement complet de Ramp Test dynamique (+20W par minute)
 * avec une base de 25 paliers progressifs pour couvrir de 80W à 560W.
 */
export function generateRampTestWorkout(startWatts = 100, stepIncrementWatts = 20): WorkoutDefinition {
  const steps: WorkoutStep[] = [];

  // Étape 1 : Échauffement 5 minutes à intensité douce (80W / Z1)
  steps.push({
    id: 'ramp-warmup',
    name: 'Échauffement progressif',
    durationSeconds: 300, // 5 min
    targetPowerPercentFtp: 50,
    targetCadenceRpm: 85,
    type: 'warmup',
    description: 'Pédalez souplement pour faire monter la température et préparer le cœur.',
  });

  // Paliers de 1 minute (+20W à chaque minute)
  const maxSteps = 25;
  for (let i = 0; i < maxSteps; i++) {
    const targetWatts = startWatts + i * stepIncrementWatts;
    // On convertit en pourcentage relatif à 100W pour la flexibilité
    steps.push({
      id: `ramp-step-${i + 1}`,
      name: `Palier ${i + 1} (${targetWatts} W)`,
      durationSeconds: 60,
      targetPowerPercentFtp: Math.round((targetWatts / 100) * 100),
      targetCadenceRpm: 90,
      type: 'test_ramp',
      description: `Maintenez une cadence constante (85-95 RPM) à ${targetWatts}W.`,
    });
  }

  // Retour au calme final (5 minutes)
  steps.push({
    id: 'ramp-cooldown',
    name: 'Retour au calme',
    durationSeconds: 300,
    targetPowerPercentFtp: 40,
    targetCadenceRpm: 75,
    type: 'cooldown',
    description: 'Bravo ! Pédalez très légèrement pour récupérer et faire redescendre le rythme cardiaque.',
  });

  return {
    id: 'ramp-test-standard',
    title: 'Ramp Test FTP Automatique',
    subtitle: 'Évaluation physiologique de votre puissance seuil',
    description: 'Test d\'effort progressif par paliers de 1 minute (+20W). Donnez le meilleur de vous-même jusqu\'à épuisement pour calculer votre FTP exacte.',
    category: 'test',
    steps,
    isRampTest: true,
  };
}

/**
 * Calcule la FTP à partir de la dernière seconde du Ramp Test
 * Formule standard : FTP = 75% de la PMA atteinte (avec prorata de la dernière fraction de minute).
 */
export function calculateFtpFromRampTest(
  startWatts: number,
  stepIncrementWatts: number,
  lastCompletedStepIndex: number, // 0-based dans les paliers de test
  secondsInLastStep: number       // 0 à 60s
): RampTestResult {
  const previousStepWatts = lastCompletedStepIndex > 0
    ? startWatts + (lastCompletedStepIndex - 1) * stepIncrementWatts
    : startWatts;

  const currentStepWatts = startWatts + lastCompletedStepIndex * stepIncrementWatts;
  
  // Puissance maximale aérobie équivalente avec interpolation temporelle
  const fraction = Math.min(1, Math.max(0, secondsInLastStep / 60));
  const maxAerobicPower = previousStepWatts + (currentStepWatts - previousStepWatts) * fraction;

  // Calcul standard de la FTP (75% de la PMA sur Ramp Test)
  const newFtpWatts = Math.round(maxAerobicPower * 0.75);

  return {
    newFtpWatts: Math.max(60, newFtpWatts),
    maxAerobicPowerWatts: Math.round(maxAerobicPower),
    completedStepCount: lastCompletedStepIndex + (fraction >= 0.95 ? 1 : 0),
    totalDurationSeconds: 300 + lastCompletedStepIndex * 60 + secondsInLastStep,
    lastStepDurationSeconds: secondsInLastStep,
  };
}
