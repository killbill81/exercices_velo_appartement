import { HeartRateSource } from './bluetooth';

export interface PowerZone {
  zone: number;
  name: string;
  minPercent: number;
  maxPercent: number;
  minWatts: number;
  maxWatts: number;
  color: string;
  bgColor: string;
  textColor: string;
  description: string;
}

export interface HeartRateZone {
  zone: number;
  name: string;
  minPercent: number;
  maxPercent: number;
  minBpm: number;
  maxBpm: number;
  color: string;
}

export interface UserProfile {
  id: string;
  name: string;
  ftpWatts: number;            // Puissance Seuil Fonctionnelle (Défaut: 150W)
  maxHeartRateBpm: number;     // FC Max (ex: 220 - age ou calculé)
  restingHeartRateBpm: number; // FC Repos (ex: 60)
  weightKg: number;            // Poids en kg (pour calcul W/kg)
  heightCm?: number;
  age?: number;
  soundAlertsEnabled: boolean;
  voiceCoachEnabled: boolean;
  screenWakeLockEnabled: boolean;
  autoBikeControlEnabled: boolean;
  updatedAt: string;
}

export interface SessionSample {
  timestampMs: number;
  elapsedSeconds: number;
  powerWatts: number;
  targetPowerWatts: number;
  cadenceRpm: number;
  targetCadenceRpm?: number;
  speedKmh: number;
  heartRateBpm: number;
  heartRateSource: HeartRateSource;
  resistanceLevel: number;
  stepIndex: number;
}

export interface CompletedSession {
  id?: number; // Auto-increment ID in Dexie
  sessionId: string;
  workoutId: string;
  workoutTitle: string;
  category: string;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  
  // Statistiques moyennes et max
  avgPowerWatts: number;
  maxPowerWatts: number;
  avgCadenceRpm: number;
  maxCadenceRpm: number;
  avgHeartRateBpm: number;
  maxHeartRateBpm: number;
  avgSpeedKmh: number;
  maxSpeedKmh: number;
  totalDistanceKm: number;
  totalCaloriesKcal: number;
  
  // Métriques d'entraînement
  normalizedPowerWatts: number;
  intensityFactor: number;
  trainingStressScore: number;
  timeInPowerZonesSeconds: number[]; // Index 0-6 pour Z1-Z7
  timeInHeartRateZonesSeconds: number[]; // Index 0-4 pour Z1-Z5
  
  // Échantillons bruts
  samples: SessionSample[];
}

export interface FtpTestHistoryItem {
  id?: number;
  date: string;
  previousFtpWatts: number;
  newFtpWatts: number;
  peakMinutePowerWatts: number;
  maxHeartRateBpm: number;
  testDurationSeconds: number;
  notes?: string;
}
