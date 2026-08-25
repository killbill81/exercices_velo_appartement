import { PowerZone, HeartRateZone } from '../../types/user';

/**
 * Calcule les 7 zones de puissance standard (Coggan) basées sur la FTP
 */
export function calculatePowerZones(ftpWatts: number): PowerZone[] {
  const ftp = Math.max(50, ftpWatts);

  return [
    {
      zone: 1,
      name: 'Z1 - Récupération Active',
      minPercent: 0,
      maxPercent: 55,
      minWatts: 0,
      maxWatts: Math.round(ftp * 0.55),
      color: '#3b82f6', // blue-500
      bgColor: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      textColor: 'text-blue-400',
      description: 'Effort très facile, favorise l\'élimination des toxines et l\'échauffement.',
    },
    {
      zone: 2,
      name: 'Z2 - Endurance Fondamentale',
      minPercent: 56,
      maxPercent: 75,
      minWatts: Math.round(ftp * 0.56),
      maxWatts: Math.round(ftp * 0.75),
      color: '#10b981', // emerald-500
      bgColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      textColor: 'text-emerald-400',
      description: 'Base aérobie, consommation maximale des lipides, tenable plusieurs heures.',
    },
    {
      zone: 3,
      name: 'Z3 - Tempo',
      minPercent: 76,
      maxPercent: 90,
      minWatts: Math.round(ftp * 0.76),
      maxWatts: Math.round(ftp * 0.90),
      color: '#f59e0b', // amber-500
      bgColor: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      textColor: 'text-amber-400',
      description: 'Effort soutenu rythmé, développement du volume respiratoire et glycogène.',
    },
    {
      zone: 4,
      name: 'Z4 - Seuil Lactique (FTP)',
      minPercent: 91,
      maxPercent: 105,
      minWatts: Math.round(ftp * 0.91),
      maxWatts: Math.round(ftp * 1.05),
      color: '#f97316', // orange-500
      bgColor: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
      textColor: 'text-orange-400',
      description: 'Puissance critique maximale tenable ~1h, accumulation gérée de lactate.',
    },
    {
      zone: 5,
      name: 'Z5 - VO2 Max',
      minPercent: 106,
      maxPercent: 120,
      minWatts: Math.round(ftp * 1.06),
      maxWatts: Math.round(ftp * 1.20),
      color: '#ef4444', // red-500
      bgColor: 'bg-red-500/10 border-red-500/30 text-red-400',
      textColor: 'text-red-400',
      description: 'Consommation maximale d\'oxygène, amélioration de la PMA (3-8 min).',
    },
    {
      zone: 6,
      name: 'Z6 - Capacité Anaérobie',
      minPercent: 121,
      maxPercent: 150,
      minWatts: Math.round(ftp * 1.21),
      maxWatts: Math.round(ftp * 1.50),
      color: '#dc2626', // red-600
      bgColor: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      textColor: 'text-rose-400',
      description: 'Intervalles courts et violents (30s - 2min), haute production d\'acide lactique.',
    },
    {
      zone: 7,
      name: 'Z7 - Puissance Neuromusculaire',
      minPercent: 151,
      maxPercent: 300,
      minWatts: Math.round(ftp * 1.51),
      maxWatts: Math.round(ftp * 3.0),
      color: '#a855f7', // purple-500
      bgColor: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
      textColor: 'text-purple-400',
      description: 'Sprint explosif maximal (< 15s), recrutement des fibres rapides.',
    },
  ];
}

/**
 * Trouve la zone de puissance pour une puissance donnée
 */
export function getPowerZone(currentWatts: number, ftpWatts: number): PowerZone {
  const zones = calculatePowerZones(ftpWatts);
  if (currentWatts <= 0) return zones[0];
  
  for (const zone of zones) {
    if (currentWatts <= zone.maxWatts) {
      return zone;
    }
  }
  return zones[zones.length - 1];
}

/**
 * Calcule les 5 zones de fréquence cardiaque basées sur la FC Max
 */
export function calculateHeartRateZones(maxHrBpm: number): HeartRateZone[] {
  const maxHr = Math.max(120, maxHrBpm);

  return [
    {
      zone: 1,
      name: 'Z1 - Récupération / Échauffement',
      minPercent: 50,
      maxPercent: 60,
      minBpm: Math.round(maxHr * 0.50),
      maxBpm: Math.round(maxHr * 0.60),
      color: '#3b82f6',
    },
    {
      zone: 2,
      name: 'Z2 - Endurance / Brûle-graisses',
      minPercent: 61,
      maxPercent: 70,
      minBpm: Math.round(maxHr * 0.61),
      maxBpm: Math.round(maxHr * 0.70),
      color: '#10b981',
    },
    {
      zone: 3,
      name: 'Z3 - Aérobie / Cardio',
      minPercent: 71,
      maxPercent: 80,
      minBpm: Math.round(maxHr * 0.71),
      maxBpm: Math.round(maxHr * 0.80),
      color: '#f59e0b',
    },
    {
      zone: 4,
      name: 'Z4 - Seuil Anaérobie',
      minPercent: 81,
      maxPercent: 90,
      minBpm: Math.round(maxHr * 0.81),
      maxBpm: Math.round(maxHr * 0.90),
      color: '#f97316',
    },
    {
      zone: 5,
      name: 'Z5 - Zone Rouge Maximale',
      minPercent: 91,
      maxPercent: 100,
      minBpm: Math.round(maxHr * 0.91),
      maxBpm: maxHr,
      color: '#ef4444',
    },
  ];
}

/**
 * Calcule le Training Stress Score (TSS) et Normalized Power (NP)
 */
export function calculateWorkoutMetrics(
  samplesWatts: number[], 
  durationSeconds: number, 
  ftpWatts: number
): {
  normalizedPowerWatts: number;
  intensityFactor: number;
  trainingStressScore: number;
} {
  const ftp = Math.max(50, ftpWatts);
  if (samplesWatts.length === 0 || durationSeconds <= 0) {
    return { normalizedPowerWatts: 0, intensityFactor: 0, trainingStressScore: 0 };
  }

  // Calcul du Normalized Power (NP) avec moyenne mobile 30s
  const windowSize = 30;
  const rollingAverages: number[] = [];

  for (let i = 0; i < samplesWatts.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const slice = samplesWatts.slice(start, i + 1);
    const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
    rollingAverages.push(avg);
  }

  const sumFourthPowers = rollingAverages.reduce((acc, val) => acc + Math.pow(val, 4), 0);
  const np = Math.round(Math.pow(sumFourthPowers / rollingAverages.length, 0.25));

  const intensityFactor = Number((np / ftp).toFixed(2));
  const tss = Math.round(((durationSeconds * np * intensityFactor) / (ftp * 3600)) * 100);

  return {
    normalizedPowerWatts: np,
    intensityFactor,
    trainingStressScore: Math.max(0, tss),
  };
}
