import { describe, it, expect } from 'vitest';
import { scaleWorkoutToFtp } from '../workoutScaler';
import { WorkoutDefinition } from '../../../types/workout';

describe('Workout Scaler', () => {
  const sampleWorkout: WorkoutDefinition = {
    id: 'test-workout',
    title: 'Test',
    subtitle: 'Sub',
    description: 'Desc',
    category: 'hiit',
    steps: [
      { id: '1', name: 'Warmup', durationSeconds: 300, targetPowerPercentFtp: 60, type: 'warmup' },
      { id: '2', name: 'Interval', durationSeconds: 60, targetPowerPercentFtp: 120, type: 'active' },
      { id: '3', name: 'Recovery', durationSeconds: 60, targetPowerPercentFtp: 50, type: 'recovery' }
    ]
  };

  it('should scale target watts according to FTP = 200W', () => {
    const scaled = scaleWorkoutToFtp(sampleWorkout, 200);
    expect(scaled.totalDurationSeconds).toBe(420);
    expect(scaled.scaledSteps[0].targetWatts).toBe(120); // 60% of 200
    expect(scaled.scaledSteps[1].targetWatts).toBe(240); // 120% of 200
    expect(scaled.scaledSteps[2].targetWatts).toBe(100); // 50% of 200
  });

  it('should auto-adapt when FTP changes to 250W', () => {
    const scaled = scaleWorkoutToFtp(sampleWorkout, 250);
    expect(scaled.scaledSteps[0].targetWatts).toBe(150); // 60% of 250
    expect(scaled.scaledSteps[1].targetWatts).toBe(300); // 120% of 250
    expect(scaled.scaledSteps[2].targetWatts).toBe(125); // 50% of 250
  });
});
