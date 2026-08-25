import { TrainingPlan, WorkoutDefinition } from '../types/workout';
import { generateRampTestWorkout } from '../services/workout/rampTestProtocol';

export const DEFAULT_RAMP_TEST = generateRampTestWorkout(100, 20);

export const TRAINING_PLANS: TrainingPlan[] = [
  {
    id: 'plan-fitness-4w',
    title: 'Remise en Forme & Cardio Santé',
    description: 'Programme accessible pour réactiver le cœur, améliorer le souffle, brûler des calories et s\'habituer à un pédalage régulier.',
    level: 'Débutant',
    durationWeeks: 4,
    sessionsPerWeek: 3,
    bannerColor: 'from-emerald-600 to-teal-800',
    workouts: [
      // SEMAINE 1
      {
        id: 'fit-w1-s1',
        title: 'Éveil Aérobie & Cadence',
        subtitle: 'Semaine 1 • Séance 1',
        description: 'Prise de contact en douceur avec des variations de cadence pour trouver votre coup de pédale optimal.',
        category: 'beginner',
        planId: 'plan-fitness-4w',
        weekNumber: 1,
        sessionNumber: 1,
        estimatedTss: 25,
        steps: [
          { id: 'w1-1', name: 'Échauffement progressif', durationSeconds: 300, targetPowerPercentFtp: 50, targetCadenceRpm: 80, type: 'warmup' },
          { id: 'w1-2', name: 'Cadence fluide 85 RPM', durationSeconds: 240, targetPowerPercentFtp: 65, targetCadenceRpm: 85, type: 'active' },
          { id: 'w1-3', name: 'Récupération souple', durationSeconds: 120, targetPowerPercentFtp: 50, targetCadenceRpm: 80, type: 'recovery' },
          { id: 'w1-4', name: 'Cadence dynamique 95 RPM', durationSeconds: 240, targetPowerPercentFtp: 70, targetCadenceRpm: 95, type: 'active' },
          { id: 'w1-5', name: 'Récupération souple', durationSeconds: 120, targetPowerPercentFtp: 50, targetCadenceRpm: 80, type: 'recovery' },
          { id: 'w1-6', name: 'Allure régulière', durationSeconds: 300, targetPowerPercentFtp: 65, targetCadenceRpm: 85, type: 'active' },
          { id: 'w1-7', name: 'Retour au calme', durationSeconds: 180, targetPowerPercentFtp: 45, targetCadenceRpm: 75, type: 'cooldown' },
        ]
      },
      {
        id: 'fit-w1-s2',
        title: 'Petite Pyramide Z2/Z3',
        subtitle: 'Semaine 1 • Séance 2',
        description: 'Montée progressive d\'intensité puis descente pour faire travailler le cœur sans épuisement.',
        category: 'beginner',
        planId: 'plan-fitness-4w',
        weekNumber: 1,
        sessionNumber: 2,
        estimatedTss: 30,
        steps: [
          { id: 'p1-1', name: 'Échauffement', durationSeconds: 300, targetPowerPercentFtp: 50, targetCadenceRpm: 80, type: 'warmup' },
          { id: 'p1-2', name: 'Palier 1 (Z2)', durationSeconds: 180, targetPowerPercentFtp: 65, targetCadenceRpm: 85, type: 'active' },
          { id: 'p1-3', name: 'Palier 2 (Z3 léger)', durationSeconds: 180, targetPowerPercentFtp: 75, targetCadenceRpm: 85, type: 'active' },
          { id: 'p1-4', name: 'Sommet Pyramide (Z3)', durationSeconds: 120, targetPowerPercentFtp: 85, targetCadenceRpm: 90, type: 'active' },
          { id: 'p1-5', name: 'Descente Palier 2', durationSeconds: 180, targetPowerPercentFtp: 75, targetCadenceRpm: 85, type: 'active' },
          { id: 'p1-6', name: 'Descente Palier 1', durationSeconds: 180, targetPowerPercentFtp: 65, targetCadenceRpm: 80, type: 'active' },
          { id: 'p1-7', name: 'Retour au calme', durationSeconds: 300, targetPowerPercentFtp: 45, targetCadenceRpm: 75, type: 'cooldown' },
        ]
      },
      {
        id: 'fit-w1-s3',
        title: 'Endurance Fondamentale Continue',
        subtitle: 'Semaine 1 • Séance 3',
        description: 'Séance d\'endurance en continu en zone 2 pour optimiser l\'utilisation des lipides.',
        category: 'endurance',
        planId: 'plan-fitness-4w',
        weekNumber: 1,
        sessionNumber: 3,
        estimatedTss: 35,
        steps: [
          { id: 'e1-1', name: 'Échauffement', durationSeconds: 300, targetPowerPercentFtp: 50, targetCadenceRpm: 80, type: 'warmup' },
          { id: 'e1-2', name: 'Bloc Endurance 1', durationSeconds: 600, targetPowerPercentFtp: 65, targetCadenceRpm: 85, type: 'active' },
          { id: 'e1-3', name: 'Mini transition', durationSeconds: 60, targetPowerPercentFtp: 55, targetCadenceRpm: 80, type: 'recovery' },
          { id: 'e1-4', name: 'Bloc Endurance 2', durationSeconds: 600, targetPowerPercentFtp: 68, targetCadenceRpm: 85, type: 'active' },
          { id: 'e1-5', name: 'Retour au calme', durationSeconds: 240, targetPowerPercentFtp: 45, targetCadenceRpm: 75, type: 'cooldown' },
        ]
      },
      // SEMAINE 2
      {
        id: 'fit-w2-s1',
        title: 'Intervalles Aérobie 3x3 min',
        subtitle: 'Semaine 2 • Séance 1',
        description: '3 répétitions de 3 minutes en zone Tempo avec récupération active complète.',
        category: 'beginner',
        planId: 'plan-fitness-4w',
        weekNumber: 2,
        sessionNumber: 1,
        estimatedTss: 35,
        steps: [
          { id: 'a2-1', name: 'Échauffement', durationSeconds: 300, targetPowerPercentFtp: 50, targetCadenceRpm: 80, type: 'warmup' },
          { id: 'a2-2', name: 'Intervalle 1 (Z3)', durationSeconds: 180, targetPowerPercentFtp: 80, targetCadenceRpm: 90, type: 'active' },
          { id: 'a2-3', name: 'Récupération 1', durationSeconds: 120, targetPowerPercentFtp: 50, targetCadenceRpm: 80, type: 'recovery' },
          { id: 'a2-4', name: 'Intervalle 2 (Z3)', durationSeconds: 180, targetPowerPercentFtp: 80, targetCadenceRpm: 90, type: 'active' },
          { id: 'a2-5', name: 'Récupération 2', durationSeconds: 120, targetPowerPercentFtp: 50, targetCadenceRpm: 80, type: 'recovery' },
          { id: 'a2-6', name: 'Intervalle 3 (Z3)', durationSeconds: 180, targetPowerPercentFtp: 85, targetCadenceRpm: 90, type: 'active' },
          { id: 'a2-7', name: 'Retour au calme', durationSeconds: 240, targetPowerPercentFtp: 45, targetCadenceRpm: 75, type: 'cooldown' },
        ]
      },
      // SEMAINE 4 (Final test)
      {
        id: 'fit-w4-s3',
        title: 'Ramp Test de Bilan Final',
        subtitle: 'Semaine 4 • Séance 3',
        description: 'Mesurez vos progrès après 4 semaines d\'entraînement régulier et mettez à jour votre FTP !',
        category: 'test',
        planId: 'plan-fitness-4w',
        weekNumber: 4,
        sessionNumber: 3,
        steps: DEFAULT_RAMP_TEST.steps,
        isRampTest: true,
      }
    ]
  },
  {
    id: 'plan-hiit-fatburn-6w',
    title: 'HIIT Explosion & Brûleur de Graisses',
    description: 'Entraînements par intervalles à haute intensité pour booster le métabolisme, la VO2max et maximiser la dépense calorique post-effort.',
    level: 'Intermédiaire',
    durationWeeks: 6,
    sessionsPerWeek: 3,
    bannerColor: 'from-amber-600 to-red-800',
    workouts: [
      {
        id: 'hiit-tabata-express',
        title: 'Tabata Cycliste 20/10 x 8',
        subtitle: 'Intervalles Haute Intensité',
        description: 'Le protocole légendaire Tabata : 20 secondes d\'effort explosif (Z6) / 10 secondes de répit, répété 8 fois.',
        category: 'hiit',
        planId: 'plan-hiit-fatburn-6w',
        estimatedTss: 42,
        steps: [
          { id: 'tb-w', name: 'Échauffement complet', durationSeconds: 360, targetPowerPercentFtp: 60, targetCadenceRpm: 85, type: 'warmup' },
          // Tabata 8x (20s / 10s)
          { id: 'tb-1', name: 'Sprint 1 (140% FTP)', durationSeconds: 20, targetPowerPercentFtp: 140, targetCadenceRpm: 100, type: 'active' },
          { id: 'tb-1r', name: 'Répit 1', durationSeconds: 10, targetPowerPercentFtp: 40, targetCadenceRpm: 70, type: 'recovery' },
          { id: 'tb-2', name: 'Sprint 2 (140% FTP)', durationSeconds: 20, targetPowerPercentFtp: 140, targetCadenceRpm: 100, type: 'active' },
          { id: 'tb-2r', name: 'Répit 2', durationSeconds: 10, targetPowerPercentFtp: 40, targetCadenceRpm: 70, type: 'recovery' },
          { id: 'tb-3', name: 'Sprint 3 (140% FTP)', durationSeconds: 20, targetPowerPercentFtp: 140, targetCadenceRpm: 100, type: 'active' },
          { id: 'tb-3r', name: 'Répit 3', durationSeconds: 10, targetPowerPercentFtp: 40, targetCadenceRpm: 70, type: 'recovery' },
          { id: 'tb-4', name: 'Sprint 4 (140% FTP)', durationSeconds: 20, targetPowerPercentFtp: 140, targetCadenceRpm: 100, type: 'active' },
          { id: 'tb-4r', name: 'Répit 4', durationSeconds: 10, targetPowerPercentFtp: 40, targetCadenceRpm: 70, type: 'recovery' },
          { id: 'tb-5', name: 'Sprint 5 (140% FTP)', durationSeconds: 20, targetPowerPercentFtp: 140, targetCadenceRpm: 100, type: 'active' },
          { id: 'tb-5r', name: 'Répit 5', durationSeconds: 10, targetPowerPercentFtp: 40, targetCadenceRpm: 70, type: 'recovery' },
          { id: 'tb-6', name: 'Sprint 6 (140% FTP)', durationSeconds: 20, targetPowerPercentFtp: 140, targetCadenceRpm: 100, type: 'active' },
          { id: 'tb-6r', name: 'Répit 6', durationSeconds: 10, targetPowerPercentFtp: 40, targetCadenceRpm: 70, type: 'recovery' },
          { id: 'tb-7', name: 'Sprint 7 (140% FTP)', durationSeconds: 20, targetPowerPercentFtp: 140, targetCadenceRpm: 100, type: 'active' },
          { id: 'tb-7r', name: 'Répit 7', durationSeconds: 10, targetPowerPercentFtp: 40, targetCadenceRpm: 70, type: 'recovery' },
          { id: 'tb-8', name: 'Sprint Final Max !', durationSeconds: 20, targetPowerPercentFtp: 150, targetCadenceRpm: 105, type: 'active' },
          { id: 'tb-8r', name: 'Répit Final', durationSeconds: 10, targetPowerPercentFtp: 40, targetCadenceRpm: 70, type: 'recovery' },
          { id: 'tb-cd', name: 'Retour au calme', durationSeconds: 300, targetPowerPercentFtp: 45, targetCadenceRpm: 75, type: 'cooldown' },
        ]
      },
      {
        id: 'hiit-30-30-series',
        title: '30/30 VO2max (2 séries de 6)',
        subtitle: 'Puissance Aérobie Maximale',
        description: '30 secondes à 120% FTP / 30 secondes de récupération active. Idéal pour repousser son seuil de fatigue.',
        category: 'hiit',
        planId: 'plan-hiit-fatburn-6w',
        estimatedTss: 50,
        steps: [
          { id: 'h30-w', name: 'Échauffement', durationSeconds: 360, targetPowerPercentFtp: 60, targetCadenceRpm: 85, type: 'warmup' },
          // Série 1
          { id: 'h30-1', name: 'Effort 1 (120%)', durationSeconds: 30, targetPowerPercentFtp: 120, targetCadenceRpm: 95, type: 'active' },
          { id: 'h30-1r', name: 'Récup 1', durationSeconds: 30, targetPowerPercentFtp: 50, targetCadenceRpm: 80, type: 'recovery' },
          { id: 'h30-2', name: 'Effort 2 (120%)', durationSeconds: 30, targetPowerPercentFtp: 120, targetCadenceRpm: 95, type: 'active' },
          { id: 'h30-2r', name: 'Récup 2', durationSeconds: 30, targetPowerPercentFtp: 50, targetCadenceRpm: 80, type: 'recovery' },
          { id: 'h30-3', name: 'Effort 3 (120%)', durationSeconds: 30, targetPowerPercentFtp: 120, targetCadenceRpm: 95, type: 'active' },
          { id: 'h30-3r', name: 'Récup 3', durationSeconds: 30, targetPowerPercentFtp: 50, targetCadenceRpm: 80, type: 'recovery' },
          { id: 'h30-4', name: 'Effort 4 (120%)', durationSeconds: 30, targetPowerPercentFtp: 120, targetCadenceRpm: 95, type: 'active' },
          { id: 'h30-4r', name: 'Récup 4', durationSeconds: 30, targetPowerPercentFtp: 50, targetCadenceRpm: 80, type: 'recovery' },
          // Pause inter-série
          { id: 'h30-mid', name: 'Récupération inter-séries', durationSeconds: 180, targetPowerPercentFtp: 50, targetCadenceRpm: 80, type: 'recovery' },
          // Série 2
          { id: 'h30-5', name: 'Effort 5 (120%)', durationSeconds: 30, targetPowerPercentFtp: 120, targetCadenceRpm: 95, type: 'active' },
          { id: 'h30-5r', name: 'Récup 5', durationSeconds: 30, targetPowerPercentFtp: 50, targetCadenceRpm: 80, type: 'recovery' },
          { id: 'h30-6', name: 'Effort 6 (120%)', durationSeconds: 30, targetPowerPercentFtp: 120, targetCadenceRpm: 95, type: 'active' },
          { id: 'h30-6r', name: 'Récup 6', durationSeconds: 30, targetPowerPercentFtp: 50, targetCadenceRpm: 80, type: 'recovery' },
          { id: 'h30-7', name: 'Effort 7 (120%)', durationSeconds: 30, targetPowerPercentFtp: 120, targetCadenceRpm: 95, type: 'active' },
          { id: 'h30-7r', name: 'Récup 7', durationSeconds: 30, targetPowerPercentFtp: 50, targetCadenceRpm: 80, type: 'recovery' },
          { id: 'h30-8', name: 'Effort 8 Final (125%)', durationSeconds: 30, targetPowerPercentFtp: 125, targetCadenceRpm: 100, type: 'active' },
          { id: 'h30-8r', name: 'Récupération', durationSeconds: 30, targetPowerPercentFtp: 45, targetCadenceRpm: 75, type: 'recovery' },
          { id: 'h30-cd', name: 'Retour au calme', durationSeconds: 300, targetPowerPercentFtp: 45, targetCadenceRpm: 75, type: 'cooldown' },
        ]
      }
    ]
  },
  {
    id: 'plan-threshold-power-8w',
    title: 'Seuil FTP & Puissance Cycliste',
    description: 'Programme avancé pour augmenter durablement votre puissance au seuil (Watts) et développer une grande résistance à la fatigue.',
    level: 'Avancé',
    durationWeeks: 8,
    sessionsPerWeek: 4,
    bannerColor: 'from-purple-600 to-indigo-900',
    workouts: [
      {
        id: 'threshold-sweetspot-2x12',
        title: 'Sweet Spot 2x12 minutes (90% FTP)',
        subtitle: 'Endurance de Puissance',
        description: 'La zone optimale "Sweet Spot" (88-93% FTP) pour développer la puissance sans fatigue excessive.',
        category: 'threshold',
        planId: 'plan-threshold-power-8w',
        estimatedTss: 58,
        steps: [
          { id: 'ss-w', name: 'Échauffement avec débrayage', durationSeconds: 420, targetPowerPercentFtp: 65, targetCadenceRpm: 85, type: 'warmup' },
          { id: 'ss-1', name: 'Bloc Sweet Spot 1 (90% FTP)', durationSeconds: 720, targetPowerPercentFtp: 90, targetCadenceRpm: 90, type: 'active' },
          { id: 'ss-r', name: 'Récupération médiane', durationSeconds: 240, targetPowerPercentFtp: 55, targetCadenceRpm: 80, type: 'recovery' },
          { id: 'ss-2', name: 'Bloc Sweet Spot 2 (92% FTP)', durationSeconds: 720, targetPowerPercentFtp: 92, targetCadenceRpm: 90, type: 'active' },
          { id: 'ss-cd', name: 'Retour au calme', durationSeconds: 300, targetPowerPercentFtp: 50, targetCadenceRpm: 75, type: 'cooldown' },
        ]
      },
      {
        id: 'threshold-over-under-3x8',
        title: 'Over-Under Seuil (3x8 minutes)',
        subtitle: 'Tolérance au Lactate',
        description: 'Alternance 2 min à 95% FTP (Under) et 1 min à 108% FTP (Over). Entraîne le corps à recycler les toxines sous l\'effort.',
        category: 'threshold',
        planId: 'plan-threshold-power-8w',
        estimatedTss: 65,
        steps: [
          { id: 'ou-w', name: 'Échauffement', durationSeconds: 360, targetPowerPercentFtp: 65, targetCadenceRpm: 85, type: 'warmup' },
          // Bloc 1
          { id: 'ou-1u', name: 'Under (95% FTP)', durationSeconds: 120, targetPowerPercentFtp: 95, targetCadenceRpm: 90, type: 'active' },
          { id: 'ou-1o', name: 'Over (108% FTP)', durationSeconds: 60, targetPowerPercentFtp: 108, targetCadenceRpm: 95, type: 'active' },
          { id: 'ou-1u2', name: 'Under (95% FTP)', durationSeconds: 120, targetPowerPercentFtp: 95, targetCadenceRpm: 90, type: 'active' },
          { id: 'ou-1o2', name: 'Over (108% FTP)', durationSeconds: 60, targetPowerPercentFtp: 108, targetCadenceRpm: 95, type: 'active' },
          // Récup
          { id: 'ou-r1', name: 'Récupération', durationSeconds: 180, targetPowerPercentFtp: 50, targetCadenceRpm: 80, type: 'recovery' },
          // Bloc 2
          { id: 'ou-2u', name: 'Under (95% FTP)', durationSeconds: 120, targetPowerPercentFtp: 95, targetCadenceRpm: 90, type: 'active' },
          { id: 'ou-2o', name: 'Over (108% FTP)', durationSeconds: 60, targetPowerPercentFtp: 108, targetCadenceRpm: 95, type: 'active' },
          { id: 'ou-2u2', name: 'Under (95% FTP)', durationSeconds: 120, targetPowerPercentFtp: 95, targetCadenceRpm: 90, type: 'active' },
          { id: 'ou-2o2', name: 'Over (108% FTP)', durationSeconds: 60, targetPowerPercentFtp: 108, targetCadenceRpm: 95, type: 'active' },
          // Cooldown
          { id: 'ou-cd', name: 'Retour au calme', durationSeconds: 300, targetPowerPercentFtp: 45, targetCadenceRpm: 75, type: 'cooldown' },
        ]
      }
    ]
  }
];

export const STANDALONE_WORKOUTS: WorkoutDefinition[] = [
  DEFAULT_RAMP_TEST,
  {
    id: 'free-ride',
    title: 'Pédalage Libre & Enregistrement',
    subtitle: 'Sans contrainte d\'intervalles',
    description: 'Pédalez librement à votre rythme tout en enregistrant vos watts, cadence et le cardio de votre Pixel Watch.',
    category: 'custom',
    steps: [
      { id: 'free-1', name: 'Pédalage libre', durationSeconds: 3600, targetPowerPercentFtp: 70, targetCadenceRpm: 85, type: 'active' }
    ]
  }
];
