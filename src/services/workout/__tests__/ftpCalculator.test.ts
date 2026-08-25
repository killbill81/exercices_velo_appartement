import { describe, it, expect } from 'vitest';
import { calculatePowerZones, getPowerZone, calculateHeartRateZones, calculateWorkoutMetrics } from '../ftpCalculator';

describe('FTP Calculator & Physiological Zones', () => {
  it('should calculate accurate 7 power zones for FTP = 200W', () => {
    const zones = calculatePowerZones(200);
    expect(zones.length).toBe(7);

    // Z1: 0 - 55% -> 0 - 110W
    expect(zones[0].maxWatts).toBe(110);
    // Z2: 56% - 75% -> 112 - 150W
    expect(zones[1].minWatts).toBe(112);
    expect(zones[1].maxWatts).toBe(150);
    // Z4: 91% - 105% -> 182 - 210W
    expect(zones[3].minWatts).toBe(182);
    expect(zones[3].maxWatts).toBe(210);
  });

  it('should correctly identify the active power zone', () => {
    const ftp = 200;
    expect(getPowerZone(80, ftp).zone).toBe(1);   // Z1 Récupération
    expect(getPowerZone(140, ftp).zone).toBe(2);  // Z2 Endurance
    expect(getPowerZone(170, ftp).zone).toBe(3);  // Z3 Tempo
    expect(getPowerZone(195, ftp).zone).toBe(4);  // Z4 Seuil
    expect(getPowerZone(220, ftp).zone).toBe(5);  // Z5 VO2max
    expect(getPowerZone(260, ftp).zone).toBe(6);  // Z6 Anaérobie
    expect(getPowerZone(350, ftp).zone).toBe(7);  // Z7 Sprint
  });

  it('should calculate 5 Heart Rate zones for FC Max = 190 BPM', () => {
    const zones = calculateHeartRateZones(190);
    expect(zones.length).toBe(5);
    expect(zones[0].maxBpm).toBe(114); // 60% of 190
    expect(zones[4].maxBpm).toBe(190); // 100% of 190
  });

  it('should compute valid TSS and Intensity Factor', () => {
    const samples = Array(1800).fill(160); // 30 min at 160W
    const metrics = calculateWorkoutMetrics(samples, 1800, 200);
    expect(metrics.normalizedPowerWatts).toBe(160);
    expect(metrics.intensityFactor).toBeCloseTo(0.8, 1);
    expect(metrics.trainingStressScore).toBeGreaterThan(20);
  });
});
