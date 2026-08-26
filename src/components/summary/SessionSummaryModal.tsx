import React, { useState, useEffect } from 'react';
import { Trophy, Download, X, Flame, Zap, Heart, RotateCw, Route, Clock, Activity, CheckCircle2, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { CompletedSession, UserProfile } from '../../types/user';
import { historyService } from '../../services/storage/historyService';
import { fitbitService } from '../../services/health/fitbitService';
import { calculatePowerZones } from '../../services/workout/ftpCalculator';

interface SessionSummaryModalProps {
  session: CompletedSession | null;
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({
  session,
  isOpen,
  onClose,
  userProfile,
}) => {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [syncError, setSyncError] = useState<string | null>(null);

  const isFitbitConnected = Boolean(userProfile.fitbitAccessToken);

  useEffect(() => {
    if (!isOpen || !session) {
      setSyncStatus('idle');
      setSyncError(null);
      return;
    }

    // Si déjà synchronisé
    if (session.fitbitSyncStatus === 'synced') {
      setSyncStatus('synced');
      return;
    }

    // Synchronisation automatique si le compte est lié et l'auto-sync activé
    if (isFitbitConnected && userProfile.fitbitAutoSyncEnabled !== false) {
      handleSyncFitbit();
    }
  }, [isOpen, session, userProfile.fitbitAccessToken]);

  const handleSyncFitbit = async () => {
    if (!session || !isFitbitConnected) return;

    setSyncStatus('syncing');
    setSyncError(null);

    const result = await fitbitService.syncSession(session, userProfile);

    if (result.success) {
      setSyncStatus('synced');
      // Mettre à jour l'état de la séance
      session.fitbitSyncStatus = 'synced';
      session.fitbitActivityId = result.activityId;
      session.fitbitSyncedAt = new Date().toISOString();
    } else {
      setSyncStatus('error');
      setSyncError(result.error || 'Échec de synchronisation');
    }
  };

  if (!isOpen || !session) return null;

  const powerZones = calculatePowerZones(userProfile.ftpWatts);
  const totalZoneSeconds = session.timeInPowerZonesSeconds.reduce((a, b) => a + b, 0) || 1;

  const handleExportTcx = () => {
    historyService.downloadTcx(session);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-950 to-emerald-950/30 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/25">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                Séance Terminée avec Succès !
              </div>
              <h2 className="text-xl font-black text-white mt-0.5">{session.workoutTitle}</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {new Date(session.startedAt).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400 uppercase">
                <Clock className="w-3 h-3 text-cyan-400" />
                Durée
              </div>
              <div className="text-xl font-black text-white font-mono mt-1">
                {formatDuration(session.durationSeconds)}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400 uppercase">
                <Zap className="w-3 h-3 text-orange-400" />
                Puissance Moy
              </div>
              <div className="text-xl font-black text-orange-400 font-mono mt-1">
                {session.avgPowerWatts} <span className="text-xs font-bold text-slate-400">W</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Max {session.maxPowerWatts} W</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400 uppercase">
                <Heart className="w-3 h-3 text-rose-400" />
                Cardio Moy
              </div>
              <div className="text-xl font-black text-rose-400 font-mono mt-1">
                {session.avgHeartRateBpm || '--'} <span className="text-xs font-bold text-slate-400">BPM</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Max {session.maxHeartRateBpm || '--'} BPM</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400 uppercase">
                <RotateCw className="w-3 h-3 text-cyan-400" />
                Cadence Moy
              </div>
              <div className="text-xl font-black text-white font-mono mt-1">
                {session.avgCadenceRpm} <span className="text-xs font-bold text-slate-400">RPM</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Max {session.maxCadenceRpm} RPM</div>
            </div>
          </div>

          {/* Secondary Details (Distance, Calories, TSS) */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-slate-400">Distance</div>
                <div className="font-bold text-white font-mono">{session.totalDistanceKm.toFixed(2)} km</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-slate-400">Calories</div>
                <div className="font-bold text-white font-mono">{session.totalCaloriesKcal} kcal</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-slate-400">Score TSS</div>
                <div className="font-bold text-white font-mono">{session.trainingStressScore || '--'}</div>
              </div>
            </div>
          </div>

          {/* Health & Fitbit Auto-Sync Status Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Fitbit & Google Health Connect</span>
              </div>
              {syncStatus === 'synced' && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Synchronisé
                </span>
              )}
              {syncStatus === 'syncing' && (
                <span className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 bg-cyan-500/20 border border-cyan-500/30 px-2.5 py-0.5 rounded-full animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Envoi en cours...
                </span>
              )}
              {syncStatus === 'error' && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Non synchronisé
                </span>
              )}
              {syncStatus === 'idle' && !isFitbitConnected && (
                <span className="text-[10px] text-slate-500 font-semibold">Non associé</span>
              )}
            </div>

            {syncStatus === 'synced' ? (
              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-slate-400">
                  Activité enregistrée avec succès dans Fitbit et disponible dans Google Health.
                </p>
                <a
                  href="https://www.fitbit.com/activities"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 shrink-0 ml-2"
                >
                  <span>Voir sur Fitbit</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : syncStatus === 'error' ? (
              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-amber-400/90 truncate max-w-[70%]">
                  {syncError || 'Erreur lors de la synchronisation'}
                </p>
                <button
                  onClick={handleSyncFitbit}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Réessayer
                </button>
              </div>
            ) : !isFitbitConnected ? (
              <p className="text-xs text-slate-400">
                Associez votre compte Fitbit dans votre profil pour synchroniser automatiquement vos séances vers Fitbit et Google Health Connect.
              </p>
            ) : (
              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-slate-400">Prêt pour la synchronisation.</p>
                <button
                  onClick={handleSyncFitbit}
                  className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold transition-all"
                >
                  Synchroniser maintenant
                </button>
              </div>
            )}
          </div>

          {/* Power Zones Distribution */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              Répartition par Zones de Puissance
            </h3>

            <div className="space-y-2">
              {powerZones.map((zone, idx) => {
                const seconds = session.timeInPowerZonesSeconds[idx] || 0;
                const pct = Math.round((seconds / totalZoneSeconds) * 100);

                return (
                  <div key={zone.zone} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="flex items-center gap-2 text-slate-300">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: zone.color }} />
                        {zone.name}
                      </span>
                      <span className="font-mono text-slate-400">
                        {formatDuration(seconds)} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: zone.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <button
            onClick={handleExportTcx}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            Exporter le fichier d'activité (.TCX)
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
