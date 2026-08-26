import React, { useState } from 'react';
import { User, X, Volume2, Mic, Smartphone, Check, Save, Zap, Heart, Unlink, ShieldCheck, Activity } from 'lucide-react';
import { UserProfile } from '../../types/user';
import { historyService } from '../../services/storage/historyService';
import { soundPlayer } from '../../services/audio/soundPlayer';
import { speechCoach } from '../../services/audio/speechCoach';
import { fitbitService } from '../../services/health/fitbitService';
import { googleFitService } from '../../services/health/googleFitService';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onProfileUpdated: (profile: UserProfile) => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onProfileUpdated,
}) => {
  const [ftpWatts, setFtpWatts] = useState(userProfile.ftpWatts);
  const [weightKg, setWeightKg] = useState(userProfile.weightKg);
  const [maxHeartRateBpm, setMaxHeartRateBpm] = useState(userProfile.maxHeartRateBpm);
  const [soundAlerts, setSoundAlerts] = useState(userProfile.soundAlertsEnabled);
  const [voiceCoach, setVoiceCoach] = useState(userProfile.voiceCoachEnabled);
  const [wakeLock, setWakeLock] = useState(userProfile.screenWakeLockEnabled);
  const [autoBikeControl, setAutoBikeControl] = useState(userProfile.autoBikeControlEnabled ?? true);
  
  // Google Fit integration state (style Decathlon)
  const [googleFitAccessToken, setGoogleFitAccessToken] = useState(userProfile.googleFitAccessToken || '');
  const [googleFitUserEmail, setGoogleFitUserEmail] = useState(userProfile.googleFitUserEmail || '');
  const [googleFitAutoSync, setGoogleFitAutoSync] = useState(userProfile.googleFitAutoSyncEnabled ?? true);
  const [googleFitClientId, setGoogleFitClientId] = useState(userProfile.googleFitClientId || '');

  // Fitbit integration state
  const [fitbitClientId, setFitbitClientId] = useState(userProfile.fitbitClientId || '');
  const [fitbitAutoSync, setFitbitAutoSync] = useState(userProfile.fitbitAutoSyncEnabled ?? false);
  const [fitbitAccessToken, setFitbitAccessToken] = useState(userProfile.fitbitAccessToken || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const isGoogleFitConnected = Boolean(googleFitAccessToken);
  const isFitbitConnected = Boolean(fitbitAccessToken);

  const handleConnectGoogleFit = () => {
    const authUrl = googleFitService.getAuthorizationUrl(googleFitClientId);
    window.location.href = authUrl;
  };

  const handleDisconnectGoogleFit = async () => {
    setGoogleFitAccessToken('');
    setGoogleFitUserEmail('');
    const updated = await historyService.updateUserProfile({
      googleFitAccessToken: undefined,
      googleFitUserEmail: undefined,
    });
    onProfileUpdated(updated);
  };

  const handleConnectFitbit = () => {
    const authUrl = fitbitService.getAuthorizationUrl(fitbitClientId);
    window.location.href = authUrl;
  };

  const handleDisconnectFitbit = async () => {
    setFitbitAccessToken('');
    const updated = await historyService.updateUserProfile({
      fitbitAccessToken: undefined,
      fitbitUserId: undefined,
    });
    onProfileUpdated(updated);
  };

  const handleSave = async () => {
    const updated = await historyService.updateUserProfile({
      ftpWatts,
      weightKg,
      maxHeartRateBpm,
      soundAlertsEnabled: soundAlerts,
      voiceCoachEnabled: voiceCoach,
      screenWakeLockEnabled: wakeLock,
      autoBikeControlEnabled: autoBikeControl,
      googleFitClientId: googleFitClientId.trim() || undefined,
      googleFitAutoSyncEnabled: googleFitAutoSync,
      googleFitAccessToken: googleFitAccessToken || undefined,
      googleFitUserEmail: googleFitUserEmail || undefined,
      fitbitClientId: fitbitClientId.trim() || undefined,
      fitbitAutoSyncEnabled: fitbitAutoSync,
      fitbitAccessToken: fitbitAccessToken || undefined,
    });

    soundPlayer.setMuted(!soundAlerts);
    speechCoach.setEnabled(voiceCoach);

    onProfileUpdated(updated);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">Profil & Paramètres</h2>
              <p className="text-xs text-slate-400">Calibrage physiologique et préférences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* FTP */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Puissance Seuil Fonctionnelle (FTP en Watts)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="50"
                max="500"
                value={ftpWatts}
                onChange={(e) => setFtpWatts(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-cyan-400 font-bold focus:outline-none focus:border-cyan-500"
              />
              <span className="text-xs text-slate-400 font-medium">Watts</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Cette valeur calibre automatiquement toutes les cibles de vos entraînements.
            </p>
          </div>

          {/* Poids & Cardio */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Poids (kg)</label>
              <input
                type="number"
                min="30"
                max="200"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-white font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">FC Max (BPM)</label>
              <input
                type="number"
                min="100"
                max="230"
                value={maxHeartRateBpm}
                onChange={(e) => setMaxHeartRateBpm(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-rose-400 font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Audio & Device Toggles */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Options d'Assistance</h3>

            {/* Bips sonores */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="text-xs font-bold text-white">Bips de décompte sonores</div>
                  <div className="text-[10px] text-slate-400">Signaux 3, 2, 1, GO avant chaque bloc</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={soundAlerts}
                onChange={(e) => setSoundAlerts(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded"
              />
            </label>

            {/* Voice Coach */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Mic className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-xs font-bold text-white">Coach vocal (Synthèse vocale)</div>
                  <div className="text-[10px] text-slate-400">Annonce des consignes et encouragements</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={voiceCoach}
                onChange={(e) => setVoiceCoach(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded"
              />
            </label>

            {/* Maintien de l'écran allumé */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-white">Maintien de l'écran allumé</div>
                  <div className="text-[10px] text-slate-400">Évite la mise en veille sur Pixel 10</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={wakeLock}
                onChange={(e) => setWakeLock(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded"
              />
            </label>

            {/* Pilotage Automatique Vélo */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-xs font-bold text-white">Pilotage automatique du vélo (Mode ERG)</div>
                  <div className="text-[10px] text-slate-400">Ajuste la résistance motorisée du Domyos EB900 B selon le programme</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoBikeControl}
                onChange={(e) => setAutoBikeControl(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded"
              />
            </label>
          </div>

          {/* Section Synchronisation Santé : Google Fit (style Decathlon) & Fitbit */}
          <div className="pt-3 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Google Fit & Health Connect (Decathlon)
              </h3>
              {isGoogleFitConnected ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  Connecté
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-slate-500">Non associé</span>
              )}
            </div>

            {/* Carte Google Fit Principale */}
            <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Connectez votre compte Google pour envoyer <strong>automatiquement</strong> vos entraînements vers <strong>Google Fit</strong> et l'application <strong>Google Health Connect</strong> sur votre Pixel / montre connectée.
              </p>

              {isGoogleFitConnected ? (
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="text-xs font-mono text-cyan-400 truncate">
                    {googleFitUserEmail || userProfile.googleFitUserEmail || 'Compte Google connecté'}
                  </div>
                  <button
                    type="button"
                    onClick={handleDisconnectGoogleFit}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Unlink className="w-3.5 h-3.5" />
                    Déconnecter
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={handleConnectGoogleFit}
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs flex items-center justify-center gap-2.5 shadow-md shadow-white/10 transition-all active:scale-95"
                  >
                    {/* Google 'G' SVG Logo */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Se connecter avec Google (Google Fit)</span>
                  </button>
                </div>
              )}

              {/* Option Synchronisation Automatique Google Fit */}
              <label className="flex items-center justify-between pt-2 border-t border-slate-800/80 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white">Synchronisation automatique Google Fit</div>
                  <div className="text-[10px] text-slate-400">Envoi immédiat dès la fin de la séance</div>
                </div>
                <input
                  type="checkbox"
                  checked={googleFitAutoSync}
                  onChange={(e) => setGoogleFitAutoSync(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 rounded"
                />
              </label>
            </div>

            {/* Optionnel : Section Fitbit & Avancé */}
            <details className="group rounded-2xl bg-slate-950/50 border border-slate-800/80 p-3 text-xs">
              <summary className="font-bold text-slate-400 cursor-pointer flex items-center justify-between list-none">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  Synchronisation Fitbit alternative (Optionnel)
                </span>
                <span className="text-[10px] text-slate-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-3 space-y-2.5 pt-2 border-t border-slate-800/80">
                <p className="text-[11px] text-slate-400">
                  Liaison directe via l'API Web Fitbit (nécessite votre Client ID gratuit sur dev.fitbit.com).
                </p>
                {isFitbitConnected ? (
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 text-xs font-mono">Fitbit lié ✅</span>
                    <button
                      type="button"
                      onClick={handleDisconnectFitbit}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Déconnecter
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleConnectFitbit}
                    className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-slate-700 transition-all"
                  >
                    Lier mon compte Fitbit
                  </button>
                )}

                <label className="flex items-center justify-between pt-1 cursor-pointer">
                  <span className="text-[11px] text-slate-400">Auto-sync Fitbit</span>
                  <input
                    type="checkbox"
                    checked={fitbitAutoSync}
                    onChange={(e) => setFitbitAutoSync(e.target.checked)}
                    className="w-3.5 h-3.5 accent-cyan-500 rounded"
                  />
                </label>

                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">
                    Fitbit Client ID (Optionnel)
                  </label>
                  <input
                    type="text"
                    placeholder="Votre Client ID Fitbit"
                    value={fitbitClientId}
                    onChange={(e) => setFitbitClientId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">
                    Google OAuth Client ID (Optionnel)
                  </label>
                  <input
                    type="text"
                    placeholder="domyos-velo-trainer.apps.googleusercontent.com"
                    value={googleFitClientId}
                    onChange={(e) => setGoogleFitClientId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                Enregistré !
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Enregistrer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
