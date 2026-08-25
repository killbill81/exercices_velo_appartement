import React from 'react';
import { Bluetooth, Watch, User, Activity, PlayCircle, History, Sparkles } from 'lucide-react';
import { BluetoothConnectionState } from '../../types/bluetooth';
import { UserProfile } from '../../types/user';

interface HeaderProps {
  activeTab: 'cockpit' | 'plans' | 'ramp' | 'history';
  onTabChange: (tab: 'cockpit' | 'plans' | 'ramp' | 'history') => void;
  connectionState: BluetoothConnectionState;
  userProfile: UserProfile;
  onOpenBluetoothModal: () => void;
  onOpenProfileModal: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
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
}) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-3 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & Titre */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onTabChange('cockpit')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-tight text-white sm:text-base">DOMYOS</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">EB900 B</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium hidden sm:block">Pixel 10 & Pixel Watch 4</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => onTabChange('cockpit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'cockpit'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Cockpit</span>
          </button>
          <button
            onClick={() => onTabChange('plans')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'plans'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
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
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Test</span> FTP
          </button>
          <button
            onClick={() => onTabChange('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'history'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Historique</span>
          </button>
        </nav>

        {/* Connexions BLE & Profil */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Bouton Simulation / Démo */}
          <button
            onClick={onToggleSimulation}
            title={isSimulating ? "Désactiver la simulation" : "Activer la simulation (Mode Démo)"}
            className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              isSimulating
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            {isSimulating ? '⚡ DÉMO ACTIVE' : '⚡ Démo'}
          </button>

          {/* Bouton Appairage Bluetooth */}
          <button
            onClick={onOpenBluetoothModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-all"
          >
            {/* Statut Vélo */}
            <div className="flex items-center gap-1" title="Statut Vélo Domyos">
              <Bluetooth className={`w-3.5 h-3.5 ${connectionState.bikeConnected ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${connectionState.bikeConnected ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
            </div>
            {/* Statut Montre Pixel Watch */}
            <div className="flex items-center gap-1 pl-1 border-l border-slate-700" title="Statut Pixel Watch 4">
              <Watch className={`w-3.5 h-3.5 ${connectionState.watchConnected ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${connectionState.watchConnected ? 'bg-cyan-400' : 'bg-slate-600'}`}></span>
            </div>
          </button>

          {/* Bouton Profil / FTP */}
          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-cyan-400 transition-all"
          >
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>{userProfile.ftpWatts}W</span>
          </button>
        </div>
      </div>
    </header>
  );
};
