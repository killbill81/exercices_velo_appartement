import React, { useState } from 'react';
import { Activity, Play, CheckCircle2, Timer, Award } from 'lucide-react';
import { UnifiedBikeState } from '../../types/bluetooth';
import { UserProfile } from '../../types/user';
import { DEFAULT_RAMP_TEST } from '../../data/trainingPlans';
import { WorkoutDefinition } from '../../types/workout';
import { historyService } from '../../services/storage/historyService';

interface RampTestRunnerProps {
  bikeState: UnifiedBikeState;
  userProfile: UserProfile;
  onLaunchRampWorkout: (workout: WorkoutDefinition) => void;
  onFtpUpdated: (newFtp: number) => void;
}

export const RampTestRunner: React.FC<RampTestRunnerProps> = ({
  bikeState,
  userProfile,
  onLaunchRampWorkout,
  onFtpUpdated,
}) => {
  const [showDirectCalc, setShowDirectCalc] = useState(false);
  const [manualPeakWatts, setManualPeakWatts] = useState(200);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleManualSave = async () => {
    const calculatedFtp = Math.round(manualPeakWatts * 0.75);
    await historyService.saveFtpTestResult(
      userProfile.ftpWatts,
      calculatedFtp,
      manualPeakWatts,
      bikeState.heartRateBpm || userProfile.maxHeartRateBpm,
      1200
    );
    onFtpUpdated(calculatedFtp);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Activity className="w-4 h-4" />
          Protocole Médical & Sportif
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Ramp Test : Évaluez votre Puissance Seuil (FTP)
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          Le Ramp Test est le protocole de référence : après un échauffement doux de 5 minutes, la résistance augmente de <strong>+20 Watts toutes les minutes</strong>. Vous pédalez jusqu'à épuisement. Votre FTP est automatiquement calculée à <strong>75% de la puissance maximale atteinte</strong>.
        </p>
      </div>

      {/* FTP Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current FTP */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">FTP Actuelle</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-black text-amber-400 font-mono">{userProfile.ftpWatts}</span>
              <span className="text-lg font-bold text-slate-400">Watts</span>
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Ratio Puissance / Poids : <strong className="text-white font-mono">{(userProfile.ftpWatts / Math.max(40, userProfile.weightKg)).toFixed(2)} W/kg</strong>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Poids configuré : {userProfile.weightKg} kg</span>
            <span className="text-cyan-400 font-medium">Auto-calibré</span>
          </div>
        </div>

        {/* Start Ramp Test Action */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Timer className="w-4 h-4" />
              Test Guidé en Direct
            </div>
            <h3 className="text-base font-extrabold text-white mt-1">Lancer le Ramp Test sur le Cockpit</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Le cockpit vous guidera palier par palier avec les bips sonores, la jauge de watts et la montre Pixel Watch.
            </p>
          </div>

          <button
            onClick={() => onLaunchRampWorkout(DEFAULT_RAMP_TEST)}
            className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
          >
            <Play className="w-5 h-5 fill-current" />
            DÉMARRER LE RAMP TEST
          </button>
        </div>
      </div>

      {/* Manual Calculator / Fast Entry */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-white">Calculateur Rapide & Ajustement Manuel</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Si vous connaissez votre puissance maximale aérobie ou souhaitez ajuster votre FTP sans faire le test complet :
            </p>
          </div>
          <button
            onClick={() => setShowDirectCalc(!showDirectCalc)}
            className="text-xs text-cyan-400 font-bold hover:underline"
          >
            {showDirectCalc ? 'Masquer' : 'Afficher le calculateur'}
          </button>
        </div>

        {showDirectCalc && (
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Puissance maximale atteinte sur le dernier palier (Watts) :
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="80"
                  max="450"
                  step="5"
                  value={manualPeakWatts}
                  onChange={(e) => setManualPeakWatts(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <span className="text-lg font-black text-white font-mono w-16 text-right">
                  {manualPeakWatts}W
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Nouvelle FTP calculée (75% PMA) :</div>
                <div className="text-2xl font-black text-cyan-400 font-mono">
                  {Math.round(manualPeakWatts * 0.75)} Watts
                </div>
              </div>

              <button
                onClick={handleManualSave}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95"
              >
                Appliquer cette FTP
              </button>
            </div>

            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
                Votre profil et toutes les séances ont été mis à jour avec la nouvelle FTP !
              </div>
            )}
          </div>
        )}
      </div>

      {/* Guide Conseils */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-400" />
          Conseils pour réussir votre Ramp Test
        </h3>
        <ul className="text-xs text-slate-400 space-y-2 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">1.</span>
            Maintenez une <strong>cadence fluide et régulière (85 à 95 RPM)</strong> dès l'échauffement.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">2.</span>
            Ne partez pas trop fort ! Les premiers paliers semblent faciles, mais la difficulté s'accélère très vite.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">3.</span>
            Quand la cadence commence à chuter sous 70 RPM malgré tous vos efforts, terminez le test pour valider votre résultat.
          </li>
        </ul>
      </div>
    </div>
  );
};
