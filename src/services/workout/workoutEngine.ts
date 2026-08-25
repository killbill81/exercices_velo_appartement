import { 
  WorkoutDefinition, 
  WorkoutStatus 
} from '../../types/workout';
import { 
  ScaledWorkoutDefinition, 
  ScaledWorkoutStep, 
  scaleWorkoutToFtp 
} from './workoutScaler';
import { SessionSample, CompletedSession } from '../../types/user';
import { soundPlayer } from '../audio/soundPlayer';
import { speechCoach } from '../audio/speechCoach';
import { screenWakeLockService } from '../device/wakeLock';
import { bluetoothManager } from '../bluetooth/bluetoothManager';
import { calculateWorkoutMetrics } from './ftpCalculator';

export interface WorkoutEngineState {
  status: WorkoutStatus;
  workout: ScaledWorkoutDefinition | null;
  currentStepIndex: number;
  currentStep: ScaledWorkoutStep | null;
  nextStep: ScaledWorkoutStep | null;
  stepElapsedSeconds: number;
  stepRemainingSeconds: number;
  totalElapsedSeconds: number;
  totalRemainingSeconds: number;
  intensityMultiplier: number; // 1.0 par défaut, modifiable en cours d'effort (±5%)
  targetWatts: number;
  targetCadenceRpm?: number;
  progressPercent: number;
}

export type WorkoutStateListener = (state: WorkoutEngineState) => void;
export type WorkoutFinishListener = (completedSession: CompletedSession) => void;

class WorkoutEngine {
  private status: WorkoutStatus = 'idle';
  private scaledWorkout: ScaledWorkoutDefinition | null = null;
  private currentStepIndex = 0;
  private stepElapsedSeconds = 0;
  private totalElapsedSeconds = 0;
  private intensityMultiplier = 1.0;
  private timer: number | null = null;
  
  private samples: SessionSample[] = [];
  private startedAtIso = '';

  private stateListeners: Set<WorkoutStateListener> = new Set();
  private finishListeners: Set<WorkoutFinishListener> = new Set();

  public subscribe(listener: WorkoutStateListener): () => void {
    this.stateListeners.add(listener);
    listener(this.getState());
    return () => this.stateListeners.delete(listener);
  }

  public onFinish(listener: WorkoutFinishListener): () => void {
    this.finishListeners.add(listener);
    return () => this.finishListeners.delete(listener);
  }

  private notifyState() {
    const state = this.getState();
    this.stateListeners.forEach(fn => fn(state));
  }

  public getState(): WorkoutEngineState {
    const workout = this.scaledWorkout;
    const currentStep = workout ? workout.scaledSteps[this.currentStepIndex] || null : null;
    const nextStep = workout ? workout.scaledSteps[this.currentStepIndex + 1] || null : null;
    
    const stepDuration = currentStep?.durationSeconds || 0;
    const stepRemaining = Math.max(0, stepDuration - this.stepElapsedSeconds);
    const totalDuration = workout?.totalDurationSeconds || 0;
    const totalRemaining = Math.max(0, totalDuration - this.totalElapsedSeconds);

    const baseTargetWatts = currentStep?.targetWatts || 0;
    const effectiveTargetWatts = Math.round(baseTargetWatts * this.intensityMultiplier);

    const progressPercent = totalDuration > 0
      ? Math.min(100, Math.round((this.totalElapsedSeconds / totalDuration) * 100))
      : 0;

    return {
      status: this.status,
      workout,
      currentStepIndex: this.currentStepIndex,
      currentStep,
      nextStep,
      stepElapsedSeconds: this.stepElapsedSeconds,
      stepRemainingSeconds: stepRemaining,
      totalElapsedSeconds: this.totalElapsedSeconds,
      totalRemainingSeconds: totalRemaining,
      intensityMultiplier: this.intensityMultiplier,
      targetWatts: effectiveTargetWatts,
      targetCadenceRpm: currentStep?.targetCadenceRpm,
      progressPercent,
    };
  }

  /**
   * Prépare et charge une séance avec la FTP actuelle
   */
  public loadWorkout(workout: WorkoutDefinition, userFtpWatts: number) {
    this.stop();
    this.scaledWorkout = scaleWorkoutToFtp(workout, userFtpWatts);
    this.currentStepIndex = 0;
    this.stepElapsedSeconds = 0;
    this.totalElapsedSeconds = 0;
    this.intensityMultiplier = 1.0;
    this.samples = [];
    this.status = 'idle';
    this.notifyState();
  }

  /**
   * Démarre la séance
   */
  public start() {
    if (!this.scaledWorkout) return;
    this.status = 'running';
    this.startedAtIso = new Date().toISOString();
    
    screenWakeLockService.requestWakeLock();
    soundPlayer.playStartBeep();
    
    const firstStep = this.scaledWorkout.scaledSteps[0];
    if (firstStep) {
      speechCoach.announceStep(firstStep.name, firstStep.targetWatts, firstStep.durationSeconds);
    }

    this.startTimer();
    this.notifyState();
  }

  public pause() {
    if (this.status !== 'running') return;
    this.status = 'paused';
    this.stopTimer();
    this.notifyState();
  }

  public resume() {
    if (this.status !== 'paused') return;
    this.status = 'running';
    screenWakeLockService.requestWakeLock();
    this.startTimer();
    this.notifyState();
  }

  public skipStep() {
    if (!this.scaledWorkout || this.status === 'idle') return;
    if (this.currentStepIndex < this.scaledWorkout.scaledSteps.length - 1) {
      this.currentStepIndex += 1;
      this.stepElapsedSeconds = 0;
      const nextStep = this.scaledWorkout.scaledSteps[this.currentStepIndex];
      soundPlayer.playStartBeep();
      speechCoach.announceStep(nextStep.name, Math.round(nextStep.targetWatts * this.intensityMultiplier), nextStep.durationSeconds);
      this.notifyState();
    } else {
      this.finish();
    }
  }

  public previousStep() {
    if (!this.scaledWorkout || this.status === 'idle') return;
    if (this.currentStepIndex > 0) {
      this.currentStepIndex -= 1;
      this.stepElapsedSeconds = 0;
      this.notifyState();
    }
  }

  public adjustIntensity(deltaMultiplier: number) {
    this.intensityMultiplier = Math.max(0.5, Math.min(1.5, Number((this.intensityMultiplier + deltaMultiplier).toFixed(2))));
    this.notifyState();
  }

  public stop() {
    this.stopTimer();
    screenWakeLockService.releaseWakeLock();
    this.status = 'idle';
    this.currentStepIndex = 0;
    this.stepElapsedSeconds = 0;
    this.totalElapsedSeconds = 0;
    this.intensityMultiplier = 1.0;
    this.notifyState();
  }

  private startTimer() {
    this.stopTimer();
    this.timer = setInterval(() => this.tick(), 1000) as unknown as number;
  }

  private stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Boucle principale de tick par seconde
   */
  public tick() {
    if (this.status !== 'running' || !this.scaledWorkout) return;

    this.stepElapsedSeconds += 1;
    this.totalElapsedSeconds += 1;

    const currentStep = this.scaledWorkout.scaledSteps[this.currentStepIndex];
    if (!currentStep) return;

    const stepRemaining = currentStep.durationSeconds - this.stepElapsedSeconds;

    // Échantillonnage de la métrique seconde par seconde
    const bikeState = bluetoothManager.getUnifiedState();
    const effectiveTargetWatts = Math.round(currentStep.targetWatts * this.intensityMultiplier);

    const sample: SessionSample = {
      timestampMs: Date.now(),
      elapsedSeconds: this.totalElapsedSeconds,
      powerWatts: bikeState.powerWatts,
      targetPowerWatts: effectiveTargetWatts,
      cadenceRpm: bikeState.cadenceRpm,
      targetCadenceRpm: currentStep.targetCadenceRpm,
      speedKmh: bikeState.speedKmh,
      heartRateBpm: bikeState.heartRateBpm,
      heartRateSource: bikeState.heartRateSource,
      resistanceLevel: bikeState.resistanceLevel,
      stepIndex: this.currentStepIndex,
    };
    this.samples.push(sample);

    // Bips de décompte sonores (3, 2, 1)
    if (stepRemaining > 0 && stepRemaining <= 3) {
      soundPlayer.playCountdownBeep(stepRemaining);
    }

    // Changement d'intervalle ou fin
    if (this.stepElapsedSeconds >= currentStep.durationSeconds) {
      if (this.currentStepIndex < this.scaledWorkout.scaledSteps.length - 1) {
        this.currentStepIndex += 1;
        this.stepElapsedSeconds = 0;
        const nextStep = this.scaledWorkout.scaledSteps[this.currentStepIndex];
        soundPlayer.playStartBeep();
        speechCoach.announceStep(nextStep.name, Math.round(nextStep.targetWatts * this.intensityMultiplier), nextStep.durationSeconds);
      } else {
        this.finish();
        return;
      }
    }

    this.notifyState();
  }

  /**
   * Clôture de la séance et calcul du bilan
   */
  public finish() {
    this.stopTimer();
    this.status = 'finished';
    screenWakeLockService.releaseWakeLock();
    soundPlayer.playFinishFanfare();
    speechCoach.announceFinish();

    if (!this.scaledWorkout) return;

    const completedAtIso = new Date().toISOString();
    const ftp = this.scaledWorkout.ftpWatts;

    // Calculs statistiques
    const wattsList = this.samples.map(s => s.powerWatts);
    const rpmList = this.samples.map(s => s.cadenceRpm);
    const hrList = this.samples.map(s => s.heartRateBpm).filter(hr => hr > 0);
    const speedList = this.samples.map(s => s.speedKmh);

    const avgWatts = wattsList.length ? Math.round(wattsList.reduce((a, b) => a + b, 0) / wattsList.length) : 0;
    const maxWatts = wattsList.length ? Math.max(...wattsList) : 0;
    const avgRpm = rpmList.length ? Math.round(rpmList.reduce((a, b) => a + b, 0) / rpmList.length) : 0;
    const maxRpm = rpmList.length ? Math.max(...rpmList) : 0;
    const avgHr = hrList.length ? Math.round(hrList.reduce((a, b) => a + b, 0) / hrList.length) : 0;
    const maxHr = hrList.length ? Math.max(...hrList) : 0;
    const avgSpeed = speedList.length ? Number((speedList.reduce((a, b) => a + b, 0) / speedList.length).toFixed(1)) : 0;
    const maxSpeed = speedList.length ? Number(Math.max(...speedList).toFixed(1)) : 0;

    const metrics = calculateWorkoutMetrics(wattsList, this.totalElapsedSeconds, ftp);
    const lastBikeState = bluetoothManager.getUnifiedState();

    // Temps passé par zone de puissance Z1-Z7
    const timeInPowerZones = [0, 0, 0, 0, 0, 0, 0];
    wattsList.forEach(w => {
      const pct = (w / ftp) * 100;
      if (pct <= 55) timeInPowerZones[0]++;
      else if (pct <= 75) timeInPowerZones[1]++;
      else if (pct <= 90) timeInPowerZones[2]++;
      else if (pct <= 105) timeInPowerZones[3]++;
      else if (pct <= 120) timeInPowerZones[4]++;
      else if (pct <= 150) timeInPowerZones[5]++;
      else timeInPowerZones[6]++;
    });

    // Temps passé par zone cardio Z1-Z5
    const timeInHrZones = [0, 0, 0, 0, 0];
    const maxHrRef = maxHr > 0 ? maxHr : 190;
    hrList.forEach(hr => {
      const pct = (hr / maxHrRef) * 100;
      if (pct <= 60) timeInHrZones[0]++;
      else if (pct <= 70) timeInHrZones[1]++;
      else if (pct <= 80) timeInHrZones[2]++;
      else if (pct <= 90) timeInHrZones[3]++;
      else timeInHrZones[4]++;
    });

    const completedSession: CompletedSession = {
      sessionId: `session-${Date.now()}`,
      workoutId: this.scaledWorkout.id,
      workoutTitle: this.scaledWorkout.title,
      category: this.scaledWorkout.category,
      startedAt: this.startedAtIso,
      completedAt: completedAtIso,
      durationSeconds: this.totalElapsedSeconds,
      avgPowerWatts: avgWatts,
      maxPowerWatts: maxWatts,
      avgCadenceRpm: avgRpm,
      maxCadenceRpm: maxRpm,
      avgHeartRateBpm: avgHr,
      maxHeartRateBpm: maxHr,
      avgSpeedKmh: avgSpeed,
      maxSpeedKmh: maxSpeed,
      totalDistanceKm: lastBikeState.distanceKm,
      totalCaloriesKcal: Math.round(lastBikeState.caloriesKcal),
      normalizedPowerWatts: metrics.normalizedPowerWatts,
      intensityFactor: metrics.intensityFactor,
      trainingStressScore: metrics.trainingStressScore,
      timeInPowerZonesSeconds: timeInPowerZones,
      timeInHeartRateZonesSeconds: timeInHrZones,
      samples: this.samples,
    };

    this.finishListeners.forEach(fn => fn(completedSession));
    this.notifyState();
  }
}

export const workoutEngine = new WorkoutEngine();
