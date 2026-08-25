import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { workoutEngine } from '../workoutEngine';
import { WorkoutDefinition } from '../../../types/workout';

describe('Workout Engine State Machine', () => {
  const sampleWorkout: WorkoutDefinition = {
    id: 'test-engine',
    title: 'Engine Test',
    subtitle: 'Sub',
    description: 'Desc',
    category: 'hiit',
    steps: [
      { id: '1', name: 'Step 1', durationSeconds: 2, targetPowerPercentFtp: 100, type: 'active' },
      { id: '2', name: 'Step 2', durationSeconds: 2, targetPowerPercentFtp: 120, type: 'active' }
    ]
  };

  beforeEach(() => {
    vi.useFakeTimers();
    workoutEngine.stop();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize and load workout in idle state', () => {
    workoutEngine.loadWorkout(sampleWorkout, 200);
    const state = workoutEngine.getState();
    expect(state.status).toBe('idle');
    expect(state.totalRemainingSeconds).toBe(4);
    expect(state.currentStepIndex).toBe(0);
    expect(state.targetWatts).toBe(200);
  });

  it('should advance to step 2 after step 1 duration completes', () => {
    workoutEngine.loadWorkout(sampleWorkout, 200);
    workoutEngine.start();
    expect(workoutEngine.getState().status).toBe('running');

    // Avancer de 2 secondes
    vi.advanceTimersByTime(2000);
    const state = workoutEngine.getState();
    expect(state.currentStepIndex).toBe(1);
    expect(state.targetWatts).toBe(240); // 120% of 200
  });

  it('should finish workout after all steps complete', () => {
    let finishedCalled = 0;
    workoutEngine.loadWorkout(sampleWorkout, 200);
    workoutEngine.onFinish(() => {
      finishedCalled += 1;
    });
    workoutEngine.start();

    // Avancer de 4 secondes
    vi.advanceTimersByTime(4000);
    expect(workoutEngine.getState().status).toBe('finished');
    expect(finishedCalled).toBe(1);

    // Vérifier que rappeler finish() ne relance pas d'événement en boucle
    workoutEngine.finish();
    expect(finishedCalled).toBe(1);
  });

  it('should cleanly restart workout from step 0 after being finished', () => {
    workoutEngine.loadWorkout(sampleWorkout, 200);
    workoutEngine.start();
    vi.advanceTimersByTime(4000);
    expect(workoutEngine.getState().status).toBe('finished');

    // Redémarrage
    workoutEngine.start();
    const state = workoutEngine.getState();
    expect(state.status).toBe('running');
    expect(state.currentStepIndex).toBe(0);
    expect(state.stepElapsedSeconds).toBe(0);
  });
});
