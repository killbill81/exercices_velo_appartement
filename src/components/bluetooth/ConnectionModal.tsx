import React, { useState, useEffect } from 'react';
import { Bluetooth, Watch, X, CheckCircle2, AlertTriangle, RefreshCw, Zap, ShieldCheck, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { BluetoothConnectionState } from '../../types/bluetooth';
import { bluetoothManager } from '../../services/bluetooth/bluetoothManager';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectionState: BluetoothConnectionState;
  isSimulating: boolean;
  onToggleSimulation: () => void;
}

export const ConnectionModal: React.FC<ConnectionModalProps> = ({
  isOpen,
  onClose,
  connectionState,
  isSimulating,
  onToggleSimulation,
}) => {
  const [showWatchHelp, setShowWatchHelp] = useState(false);
  const [authorizedDevices, setAuthorizedDevices] = useState<BluetoothDevice[]>([]);

  useEffect(() => {
    if (isOpen) {
      bluetoothManager.getAuthorizedDevices().then((devices) => {
        setAuthorizedDevices(devices);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isWebBleSupported = bluetoothManager.isWebBluetoothSupported();
  const pairedWatch = authorizedDevices.find(d => 
    d.name?.toLowerCase().includes('watch') || 
    d.name?.toLowerCase().includes('pixel') || 
    d.name?.toLowerCase().includes('heart')
  ) || (authorizedDevices.length > 0 ? authorizedDevices[0] : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Bluetooth className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">Connexion Bluetooth BLE</h2>
              <p className="text-xs text-slate-400">Vélo Domyos EB900 B & Pixel Watch 4</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Support Alert */}
        {!isWebBleSupported && (
          <div className="m-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong>Web Bluetooth non détecté :</strong> Pour connecter votre vélo et votre montre, ouvrez cette page dans <strong>Google Chrome</strong> ou <strong>Microsoft Edge</strong> sur votre Google Pixel 10 ou votre ordinateur.
            </div>
          </div>
        )}

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* CARTE 1 : Vélo Domyos EB900 B */}
          <div className={`p-4 rounded-2xl border transition-all ${
            connectionState.bikeConnected
              ? 'bg-emerald-500/5 border-emerald-500/30'
              : 'bg-slate-950/60 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${
                  connectionState.bikeConnected
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  🚲
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Vélo DOMYOS EB900 B</h3>
                  <p className="text-xs text-slate-400">
                    {connectionState.bikeConnected
                      ? connectionState.bikeDeviceName || 'Connecté (FTMS)'
                      : 'Auto-alimenté • Protocole BLE FTMS'}
                  </p>
                </div>
              </div>

              {connectionState.bikeConnected ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Connecté
                </div>
              ) : (
                <span className="text-[11px] text-slate-500 font-medium">Non connecté</span>
              )}
            </div>

            <p className="text-xs text-slate-400 mb-3.5 leading-relaxed">
              Pédalez 2-3 secondes pour allumer la console et activer le signal Bluetooth, puis cliquez sur Associer.
            </p>

            {connectionState.bikeError && (
              <div className="mb-3 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {connectionState.bikeError}
              </div>
            )}

            <div className="flex items-center gap-2">
              {connectionState.bikeConnected ? (
                <button
                  onClick={() => bluetoothManager.disconnectBike()}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all border border-slate-700"
                >
                  Déconnecter le vélo
                </button>
              ) : (
                <button
                  onClick={() => bluetoothManager.connectBike()}
                  disabled={connectionState.bikeConnecting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                >
                  {connectionState.bikeConnecting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Recherche du vélo en cours...
                    </>
                  ) : (
                    <>
                      <Bluetooth className="w-3.5 h-3.5" />
                      Associer le vélo Domyos
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* CARTE 2 : Google Pixel Watch 4 */}
          <div className={`p-4 rounded-2xl border transition-all ${
            connectionState.watchConnected
              ? 'bg-cyan-500/5 border-cyan-500/30'
              : 'bg-slate-950/60 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border ${
                  connectionState.watchConnected
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  <Watch className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Google Pixel Watch 4</h3>
                  <p className="text-xs text-slate-400">
                    {connectionState.watchConnected
                      ? connectionState.watchDeviceName || 'Connectée (Priorité Cardio)'
                      : 'Fréquence cardiaque continue au poignet'}
                  </p>
                </div>
              </div>

              {connectionState.watchConnected ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Connectée
                </div>
              ) : (
                <span className="text-[11px] text-slate-500 font-medium">Non connectée</span>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 mb-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Priorité active au poignet :
              </div>
              <p className="text-slate-400">
                La montre permet un relevé ininterrompu même quand vous lâchez le guidon du vélo.
              </p>
            </div>

            {/* Guide dépliant Wear OS */}
            <div className="mb-3.5 bg-slate-900/80 border border-slate-800/80 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowWatchHelp(!showWatchHelp)}
                className="w-full px-3 py-2 text-left flex items-center justify-between text-xs text-amber-300 font-semibold hover:bg-slate-800/50 transition-all"
              >
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>La montre n'apparaît pas dans la liste ?</span>
                </div>
                {showWatchHelp ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showWatchHelp && (
                <div className="p-3 border-t border-slate-800 text-[11px] text-slate-300 space-y-2 leading-relaxed bg-slate-950/40">
                  <p className="font-bold text-amber-300">
                    💡 Pourquoi la Pixel Watch n'émet pas de signal automatiquement :
                  </p>
                  <p className="text-slate-400">
                    Par souci d'économie de batterie, Wear OS coupe la balise Bluetooth dès que la déconnexion a lieu. Pour la rendre détectable :
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
                    <li>Sur votre montre, ouvrez l'application <strong>Fitbit</strong> ou l'application Wear OS <strong>Heart for Bluetooth</strong>.</li>
                    <li>Lancez une activité (ex: <em>Vélo d'intérieur</em>) ou appuyez sur <strong>Start Broadcasting</strong>.</li>
                    <li>Gardez l'écran de la montre <strong>allumé</strong> puis cliquez sur Associer ci-dessous.</li>
                  </ol>
                </div>
              )}
            </div>

            {connectionState.watchError && (
              <div className="mb-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {connectionState.watchError}
              </div>
            )}

            <div className="flex flex-col gap-2">
              {connectionState.watchConnected ? (
                <button
                  onClick={() => bluetoothManager.disconnectWatch()}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all border border-slate-700"
                >
                  Déconnecter la montre
                </button>
              ) : (
                <>
                  {/* Bouton Reconnexion Rapide si déjà mémorisée */}
                  {pairedWatch && (
                    <button
                      onClick={() => bluetoothManager.connectAuthorizedWatch(pairedWatch)}
                      disabled={connectionState.watchConnecting}
                      className="w-full py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current text-cyan-400" />
                      Reconnexion Directe ({pairedWatch.name || 'Pixel Watch 4'})
                    </button>
                  )}

                  {/* Bouton Scan Standard */}
                  <button
                    onClick={() => bluetoothManager.connectWatch()}
                    disabled={connectionState.watchConnecting}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                  >
                    {connectionState.watchConnecting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Recherche de la Pixel Watch...
                      </>
                    ) : (
                      <>
                        <Watch className="w-3.5 h-3.5" />
                        {pairedWatch ? 'Re-scanner un nouvel appareil' : 'Associer la Pixel Watch 4'}
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* CARTE 3 : Mode Démo / Simulation */}
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-xs text-white">Mode Simulation & Démo</h4>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Simule les watts, la cadence et la montre pour tester sans être sur le vélo.
              </p>
            </div>
            <button
              onClick={onToggleSimulation}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isSimulating
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isSimulating ? 'Arrêter Démo' : 'Lancer Démo'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-all"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
