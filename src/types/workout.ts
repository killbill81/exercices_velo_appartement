export type IntervalType = 'warmup' | 'active' | 'recovery' | 'cooldown' | 'test_ramp';

export interface WorkoutStep {
  id: string;
  name: string;
  durationSeconds: number;
  targetPowerPercentFtp: number; // Ex: 100 = 100% de la FTP, 150 = 150% de la FTP
  targetCadenceRpm?: number;     // Ex: 90 RPM
  type: IntervalType;
  description?: string;
}

export interface WorkoutDefinition {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'beginner' | 'hiit' | 'endurance' | 'threshold' | 'test' | 'custom';
  planId?: string;
  weekNumber?: number;
  sessionNumber?: number;
  steps: WorkoutStep[];
  estimatedTss?: number; // Training Stress Score
  isRampTest?: boolean;
}

export interface TrainingPlan {
  id: string;
  title: string;
  description: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  durationWeeks: number;
  sessionsPerWeek: number;
  bannerColor: string;
  workouts: WorkoutDefinition[];
}

export type WorkoutStatus = 'idle' | 'running' | 'paused' | 'finished';

export interface WorkoutEngineState {
  status: WorkoutStatus;
  currentStepIndex: number;
  currentStep: WorkoutStep | null;
  nextStep: WorkoutStep | null;
  stepElapsedSeconds: number;
  stepRemainingSeconds: number;
  totalElapsedSeconds: number;
  totalRemainingSeconds: number;
  targetPowerWatts: number;
  targetCadenceRpm?: number;
  completionPercentage: number;
}
