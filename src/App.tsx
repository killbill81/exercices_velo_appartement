import { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { LiveCockpit } from './components/cockpit/LiveCockpit';
import { PlanSelector } from './components/plans/PlanSelector';
import { RampTestRunner } from './components/ftp/RampTestRunner';
import { HistoryDashboard } from './components/history/HistoryDashboard';
import { ConnectionModal } from './components/bluetooth/ConnectionModal';
import { ProfileSettingsModal } from './components/settings/ProfileSettingsModal';
import { SessionSummaryModal } from './components/summary/SessionSummaryModal';

import { bluetoothManager } from './services/bluetooth/bluetoothManager';
import { mockBluetoothService } from './services/bluetooth/mockBluetoothService';
import { workoutEngine, WorkoutEngineState } from './services/workout/workoutEngine';
import { historyService, DEFAULT_USER_PROFILE } from './services/storage/historyService';
import { BluetoothConnectionState, UnifiedBikeState } from './types/bluetooth';
import { UserProfile, CompletedSession } from './types/user';
import { WorkoutDefinition } from './types/workout';
import { TRAINING_PLANS } from './data/trainingPlans';

export default function App() {
  const [activeTab, setActiveTab] = useState<'cockpit' | 'plans' | 'ramp' | 'history'>('cockpit');
  const [bikeState, setBikeState] = useState<UnifiedBikeState>(bluetoothManager.getUnifiedState());
  const [connectionState, setConnectionState] = useState<BluetoothConnectionState>(bluetoothManager.getConnectionState());
  const [workoutState, setWorkoutState] = useState<WorkoutEngineState>(workoutEngine.getState());
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);

  // Modals
  const [isBluetoothModalOpen, setIsBluetoothModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [summarySession, setSummarySession] = useState<CompletedSession | null>(null);

  // Simulation mode
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    // Nettoyage éventuel d'anciens flags de rotation forcée
    try {
      localStorage.removeItem('velo_force_landscape');
    } catch {}

    // 0. Libérer l'orientation pour un comportement mobile natif fluide (portrait/paysage)
    try {
      if (typeof window !== 'undefined' && 'screen' in window && window.screen.orientation && 'unlock' in window.screen.orientation) {
        (window.screen.orientation as unknown as { unlock: () => Promise<void> }).unlock().catch(() => {});
      }
    } catch {
      // Ignorer si non supporté
    }

    // 1. Charger le profil utilisateur
    historyService.getUserProfile().then((profile) => {
      setUserProfile(profile);
      // Précharger une séance d'accueil (ex: 1ère séance du plan Fitness)
      if (!workoutEngine.getState().workout) {
        workoutEngine.loadWorkout(TRAINING_PLANS[0].workouts[0], profile.ftpWatts);
      }
    });

    // 2. S'abonner aux flux Bluetooth
    const unsubBleState = bluetoothManager.subscribeState((state) => {
      setBikeState(state);
    });

    const unsubBleConn = bluetoothManager.subscribeConnection((conn) => {
      setConnectionState(conn);
    });

    // 3. S'abonner au moteur d'entraînement
    const unsubWorkout = workoutEngine.subscribe((state) => {
      setWorkoutState(state);
      // Mettre à jour les cibles du simulateur si actif
      if (mockBluetoothService.isRunning() && state.targetWatts > 0) {
        mockBluetoothService.setTargets(state.targetWatts, state.targetCadenceRpm);
      }
    });

    // 4. Clôture de séance
    const unsubFinish = workoutEngine.onFinish(async (session) => {
      await historyService.saveSession(session);
      setSummarySession(session);
    });

    return () => {
      unsubBleState();
      unsubBleConn();
      unsubWorkout();
      unsubFinish();
    };
  }, []);

  const handleToggleSimulation = () => {
    if (isSimulating) {
      mockBluetoothService.stopSimulation();
      setIsSimulating(false);
    } else {
      mockBluetoothService.startSimulation();
      setIsSimulating(true);
    }
  };

  const handleSelectWorkout = (workout: WorkoutDefinition) => {
    workoutEngine.loadWorkout(workout, userProfile.ftpWatts);
    setActiveTab('cockpit');
    workoutEngine.start();
  };

  const handleFtpUpdated = (newFtp: number) => {
    setUserProfile(prev => ({ ...prev, ftpWatts: newFtp }));
    if (workoutState.workout) {
      // Recharger la séance en cours avec la nouvelle FTP
      workoutEngine.loadWorkout(workoutState.workout, newFtp);
    }
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white overflow-hidden">
      {/* Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        connectionState={connectionState}
        userProfile={userProfile}
        onOpenBluetoothModal={() => setIsBluetoothModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        isSimulating={isSimulating}
        onToggleSimulation={handleToggleSimulation}
      />

      {/* Main Content Area */}
      <main className={`flex-1 max-w-7xl w-full mx-auto ${
        activeTab === 'cockpit'
          ? 'p-1 sm:p-2 pb-16 lg:pb-4 overflow-hidden h-full'
          : 'p-3 sm:p-6 pb-24 lg:pb-8 overflow-y-auto'
      }`}>
        {activeTab === 'cockpit' && (
          <LiveCockpit
            bikeState={bikeState}
            workoutState={workoutState}
            userProfile={userProfile}
            onStartWorkout={() => workoutEngine.start()}
            onPauseWorkout={() => workoutEngine.pause()}
            onResumeWorkout={() => workoutEngine.resume()}
            onSkipStep={() => workoutEngine.skipStep()}
            onPreviousStep={() => workoutEngine.previousStep()}
            onAdjustIntensity={(delta) => workoutEngine.adjustIntensity(delta)}
            onStopWorkout={() => workoutEngine.finish()}
            onOpenPlanSelector={() => setActiveTab('plans')}
          />
        )}

        {activeTab === 'plans' && (
          <PlanSelector
            userFtpWatts={userProfile.ftpWatts}
            onSelectWorkout={handleSelectWorkout}
          />
        )}

        {activeTab === 'ramp' && (
          <RampTestRunner
            bikeState={bikeState}
            userProfile={userProfile}
            onLaunchRampWorkout={handleSelectWorkout}
            onFtpUpdated={handleFtpUpdated}
          />
        )}

        {activeTab === 'history' && (
          <HistoryDashboard userFtpWatts={userProfile.ftpWatts} />
        )}
      </main>

      {/* Bottom Navigation for Mobile (Pixel 10) */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Bluetooth Connection Modal */}
      <ConnectionModal
        isOpen={isBluetoothModalOpen}
        onClose={() => setIsBluetoothModalOpen(false)}
        connectionState={connectionState}
        isSimulating={isSimulating}
        onToggleSimulation={handleToggleSimulation}
      />

      {/* User Profile & Settings Modal */}
      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        onProfileUpdated={setUserProfile}
      />

      {/* Completed Session Summary Modal */}
      <SessionSummaryModal
        session={summarySession}
        isOpen={Boolean(summarySession)}
        onClose={() => {
          setSummarySession(null);
          workoutEngine.stop();
        }}
        userFtpWatts={userProfile.ftpWatts}
      />
    </div>
  );
}
