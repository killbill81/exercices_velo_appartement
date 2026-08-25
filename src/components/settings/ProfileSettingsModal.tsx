import React, { useState } from 'react';
import { User, X, Volume2, Mic, Smartphone, Check, Save, Zap } from 'lucide-react';
import { UserProfile } from '../../types/user';
import { historyService } from '../../services/storage/historyService';
import { soundPlayer } from '../../services/audio/soundPlayer';
import { speechCoach } from '../../services/audio/speechCoach';

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
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    const updated = await historyService.updateUserProfile({
      ftpWatts,
      weightKg,
      maxHeartRateBpm,
      soundAlertsEnabled: soundAlerts,
      voiceCoachEnabled: voiceCoach,
      screenWakeLockEnabled: wakeLock,
      autoBikeControlEnabled: autoBikeControl,
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
