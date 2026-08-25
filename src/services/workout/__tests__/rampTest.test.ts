import { describe, it, expect } from 'vitest';
import { generateRampTestWorkout, calculateFtpFromRampTest } from '../rampTestProtocol';

describe('Ramp Test Protocol & FTP calculation', () => {
  it('should generate a valid Ramp Test workout with warmup, progressive steps and cooldown', () => {
    const workout = generateRampTestWorkout(100, 20);
    expect(workout.isRampTest).toBe(true);
    expect(workout.steps.length).toBeGreaterThan(15);
    expect(workout.steps[0].type).toBe('warmup');
    expect(workout.steps[1].type).toBe('test_ramp');
    expect(workout.steps[workout.steps.length - 1].type).toBe('cooldown');
  });

  it('should calculate FTP accurately when user fails at 30 seconds of Palier 6 (200W)', () => {
    // startWatts = 100, stepIncrement = 20
    // Palier 0: 100W, Palier 1: 120W, Palier 2: 140W, Palier 3: 160W, Palier 4: 180W, Palier 5: 200W
    // user reaches index 5 (200W) and stays 30s
    const result = calculateFtpFromRampTest(100, 20, 5, 30);
    
    // MAP = 180 + (200 - 180) * (30/60) = 190W
    // FTP = 190 * 0.75 = 142.5 -> 143W
    expect(result.maxAerobicPowerWatts).toBe(190);
    expect(result.newFtpWatts).toBe(143);
  });
});
