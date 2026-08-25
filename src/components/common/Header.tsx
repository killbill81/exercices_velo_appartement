import React, { useState, useEffect } from 'react';
import { Bluetooth, Watch, User, Activity, PlayCircle, History, Sparkles, Zap, Maximize2, Minimize2, RotateCw } from 'lucide-react';
import { BluetoothConnectionState } from '../../types/bluetooth';
import { UserProfile } from '../../types/user';
import { toggleFullscreen, isFullscreen, subscribeFullscreenChange } from '../../utils/fullscreen';

interface HeaderProps {
  activeTab: 'cockpit' | 'plans' | 'ramp' | 'history';
  onTabChange: (tab: 'cockpit' | 'plans' | 'ramp' | 'history') => void;
  connectionState: BluetoothConnectionState;
  userProfile: UserProfile;
  onOpenBluetoothModal: () => void;
  onOpenProfileModal: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  isForceLandscape: boolean;
  onToggleForceLandscape: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  connectionState,
  userProfile,
  onOpenBluetoothModal,
  onOpenProfileModal,
  isSimulating,
  onToggleSimulation,
  isForceLandscape,
  onToggleForceLandscape,
}) => {
  const [fullscreenActive, setFullscreenActive] = useState<boolean>(isFullscreen());

  useEffect(() => {
    const unsubscribe = subscribeFullscreenChange((fs) => {
      setFullscreenActive(fs);
    });
    return () => unsubscribe();
  }, []);

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-3 py-2 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & Titre */}
        <div 
          className="flex items-center gap-2 cursor-pointer shrink-0" 
          onClick={() => onTabChange('cockpit')}
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-sm sm:text-base tracking-tight text-white">DOMYOS</span>
            <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">EB900 B</span>
          </div>
        </div>

        {/* Navigation Tabs (Visible uniquement sur Desktop / Tablette) */}
        <nav className="hidden md:flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => onTabChange('cockpit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'cockpit'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Cockpit</span>
          </button>
          <button
            onClick={() => onTabChange('plans')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'plans'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Programmes</span>
          </button>
          <button
            onClick={() => onTabChange('ramp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'ramp'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Test FTP</span>
          </button>
          <button
            onClick={() => onTabChange('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'history'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Historique</span>
          </button>
        </nav>

        {/* Boutons d'Action Droite (TOUJOURS VISIBLES SUR SMARTPHONE) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Bouton Forcer Rotation 90° Paysage (Compteur Vélo) */}
          <button
            onClick={onToggleForceLandscape}
            title={isForceLandscape ? "Désactiver la rotation 90° forcée" : "Forcer le mode paysage horizontal 90° (Compteur de guidon)"}
            className={`flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 shadow-sm ${
              isForceLandscape
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-cyan-500/20'
                : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-300'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isForceLandscape ? 'rotate-90 text-slate-950' : 'text-slate-400'}`} />
            <span className="hidden sm:inline text-[11px]">90°</span>
          </button>

          {/* Bouton Plein Écran */}
          <button
            onClick={() => toggleFullscreen()}
            title={fullscreenActive ? "Quitter le plein écran" : "Passer en plein écran immersif"}
            className="flex items-center justify-center p-1.5 sm:px-2 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-300 transition-all active:scale-95 shadow-sm"
          >
            {fullscreenActive ? (
              <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-slate-300" />
            )}
          </button>

          {/* Bouton Simulation / Démo */}
          <button
            onClick={onToggleSimulation}
            title={isSimulating ? "Arrêter le mode simulation" : "Lancer le mode démo (simulation)"}
            className={`px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 ${
              isSimulating
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30 animate-pulse'
                : 'bg-slate-800/80 text-amber-400 border-amber-500/30 hover:bg-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span className="text-[11px] font-bold">
              {isSimulating ? 'DÉMO' : 'Démo'}
            </span>
          </button>

          {/* Bouton Appairage Bluetooth Multi-Périphériques */}
          <button
            onClick={onOpenBluetoothModal}
            title="Gérer les connexions Bluetooth (Vélo & Montre)"
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-all active:scale-95 shadow-sm"
          >
            {/* Statut Vélo */}
            <div className="flex items-center gap-1" title="Statut Vélo Domyos">
              <Bluetooth className={`w-3.5 h-3.5 ${connectionState.bikeConnected ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${connectionState.bikeConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            </div>
            {/* Statut Montre Pixel Watch */}
            <div className="flex items-center gap-1 pl-1 border-l border-slate-700" title="Statut Montre Pixel Watch 4">
              <Watch className={`w-3.5 h-3.5 ${connectionState.watchConnected ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${connectionState.watchConnected ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
            </div>
          </button>

          {/* Bouton Profil / FTP */}
          <button
            onClick={onOpenProfileModal}
            title="Modifier votre FTP et vos paramètres"
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-cyan-400 transition-all active:scale-95 shadow-sm"
          >
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono">{userProfile.ftpWatts}W</span>
          </button>
        </div>
      </div>
    </header>
  );
};
