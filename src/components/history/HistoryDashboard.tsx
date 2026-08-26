import React, { useEffect, useState } from 'react';
import { History, Calendar, Trophy, Download, Eye, Trash2, AlertTriangle } from 'lucide-react';
import { CompletedSession, FtpTestHistoryItem, UserProfile } from '../../types/user';
import { historyService } from '../../services/storage/historyService';
import { SessionSummaryModal } from '../summary/SessionSummaryModal';

interface HistoryDashboardProps {
  userProfile: UserProfile;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

export const HistoryDashboard: React.FC<HistoryDashboardProps> = ({ userProfile }) => {
  const [sessions, setSessions] = useState<CompletedSession[]>([]);
  const [ftpHistory, setFtpHistory] = useState<FtpTestHistoryItem[]>([]);
  const [selectedSession, setSelectedSession] = useState<CompletedSession | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<CompletedSession | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const s = await historyService.getAllSessions();
    const f = await historyService.getFtpHistory();
    setSessions(s);
    setFtpHistory(f);
  };

  const confirmDelete = async () => {
    if (!sessionToDelete) return;
    await historyService.deleteSession(sessionToDelete.sessionId);
    setSessionToDelete(null);
    await loadData();
  };

  const totalDistanceKm = sessions.reduce((acc, s) => acc + s.totalDistanceKm, 0);
  const totalCalories = sessions.reduce((acc, s) => acc + s.totalCaloriesKcal, 0);
  const totalDurationHours = (sessions.reduce((acc, s) => acc + s.durationSeconds, 0) / 3600).toFixed(1);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
          <History className="w-4 h-4" />
          Suivi & Progression Personnelle
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Historique de vos Entraînements
        </h1>
        <p className="text-sm text-slate-400 mt-1.5">
          Toutes vos sessions sur le Domyos EB900 B et Pixel Watch 4 enregistrées en local.
        </p>
      </div>

      {/* Global Totals Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-lg">
          <div className="text-xs font-bold text-slate-400 uppercase">Séances Réalisées</div>
          <div className="text-3xl font-black text-white font-mono mt-1">{sessions.length}</div>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-lg">
          <div className="text-xs font-bold text-slate-400 uppercase">Heures de Selle</div>
          <div className="text-3xl font-black text-cyan-400 font-mono mt-1">{totalDurationHours} <span className="text-sm">h</span></div>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-lg">
          <div className="text-xs font-bold text-slate-400 uppercase">Distance Totale</div>
          <div className="text-3xl font-black text-emerald-400 font-mono mt-1">{totalDistanceKm.toFixed(1)} <span className="text-sm">km</span></div>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-lg">
          <div className="text-xs font-bold text-slate-400 uppercase">Calories Brûlées</div>
          <div className="text-3xl font-black text-amber-400 font-mono mt-1">{totalCalories} <span className="text-sm">kcal</span></div>
        </div>
      </div>

      {/* FTP Evolution History */}
      {ftpHistory.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            Évolution de votre FTP (Ramp Tests)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ftpHistory.map((item, idx) => (
              <div key={item.id || idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {new Date(item.date).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="text-xl font-black text-amber-400 font-mono mt-0.5">
                    {item.newFtpWatts} W
                  </div>
                </div>
                {item.previousFtpWatts > 0 && (
                  <div className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                    +{item.newFtpWatts - item.previousFtpWatts} W
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Sessions List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            Détail des Séances ({sessions.length})
          </h2>
          {sessions.length > 0 && (
            <span className="text-xs text-slate-500 font-medium">
              Gérer ou supprimer à l'unité
            </span>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <p className="text-sm">Aucune séance enregistrée pour le moment.</p>
            <p className="text-xs mt-1">Vos séances terminées apparaîtront automatiquement ici !</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.sessionId}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
                    <span>
                      {new Date(session.startedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] uppercase font-bold text-cyan-400">
                      {session.category}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-white">{session.workoutTitle}</h3>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Durée</div>
                    <div className="font-bold text-white">{formatDuration(session.durationSeconds)}</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Watts Moy</div>
                    <div className="font-bold text-orange-400">{session.avgPowerWatts} W</div>
                  </div>

                  {session.avgHeartRateBpm > 0 && (
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Cardio Moy</div>
                      <div className="font-bold text-rose-400">{session.avgHeartRateBpm} BPM</div>
                    </div>
                  )}

                  {/* Action Buttons: View, Download TCX, Delete */}
                  <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
                    <button
                      onClick={() => setSelectedSession(session)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all active:scale-95"
                      title="Voir les détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => historyService.downloadTcx(session)}
                      className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 transition-all active:scale-95"
                      title="Exporter en TCX (Strava)"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setSessionToDelete(session)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-all border border-rose-500/20 active:scale-95"
                      title="Supprimer cette séance"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Deletion */}
      {sessionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-base text-white">Supprimer cette séance ?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Voulez-vous vraiment supprimer la séance <strong className="text-white">"{sessionToDelete.workoutTitle}"</strong> du {new Date(sessionToDelete.startedAt).toLocaleDateString('fr-FR')} ? Cette action est irréversible.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setSessionToDelete(null)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/30 active:scale-95"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <SessionSummaryModal
        session={selectedSession}
        isOpen={Boolean(selectedSession)}
        onClose={() => setSelectedSession(null)}
        userProfile={userProfile}
      />
    </div>
  );
};
