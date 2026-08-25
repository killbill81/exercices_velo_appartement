export interface BikeMetrics {
  instantSpeedKmh: number;      // Vitesse instantanée en km/h
  averageSpeedKmh?: number;     // Vitesse moyenne en km/h
  instantCadenceRpm: number;    // Cadence instantanée (tours/minute)
  averageCadenceRpm?: number;   // Cadence moyenne
  instantPowerWatts: number;    // Puissance instantanée en Watts
  averagePowerWatts?: number;   // Puissance moyenne
  totalDistanceMeters: number;  // Distance cumulée en mètres
  totalEnergyKcal: number;      // Calories dépensées
  elapsedTimeSeconds: number;   // Temps écoulé
  resistanceLevel?: number;     // Niveau de résistance (1-15 sur EB900 B)
  heartRateBpm?: number;        // Rythme cardiaque détecté sur le guidon
  rawFlags?: number;
}

export interface HeartRateData {
  heartRateBpm: number;
  contactDetected?: boolean;
  energyExpendedKcal?: number;
  rrIntervalsMs?: number[];
}

export type HeartRateSource = 'watch' | 'bike' | 'none';

export interface UnifiedBikeState {
  // Métriques combinées en direct
  powerWatts: number;
  cadenceRpm: number;
  speedKmh: number;
  distanceKm: number;
  caloriesKcal: number;
  elapsedTimeSeconds: number;
  resistanceLevel: number;
  
  // Suivi cardiaque combiné
  heartRateBpm: number;
  heartRateSource: HeartRateSource;
  isWatchConnected: boolean;
  isBikeConnected: boolean;
  
  // Noms d'appareils
  bikeDeviceName: string | null;
  watchDeviceName: string | null;
}

export interface BluetoothConnectionState {
  bikeConnected: boolean;
  bikeConnecting: boolean;
  bikeError: string | null;
  bikeDeviceName: string | null;

  watchConnected: boolean;
  watchConnecting: boolean;
  watchError: string | null;
  watchDeviceName: string | null;
}
