import React from 'react';
import { Zap, Target } from 'lucide-react';
import { getPowerZone } from '../../services/workout/ftpCalculator';

interface PowerZoneGaugeProps {
  currentWatts: number;
  targetWatts: number;
  ftpWatts: number;
}

export const PowerZoneGauge: React.FC<PowerZoneGaugeProps> = ({
  currentWatts,
  targetWatts,
  ftpWatts,
}) => {
  const currentZone = getPowerZone(currentWatts, ftpWatts);

  const pctFtp = Math.round((currentWatts / Math.max(1, ftpWatts)) * 100);
  const diffWatts = currentWatts - targetWatts;
  const isClose = Math.abs(diffWatts) <= 15;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
      {/* Background Glow */}
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: currentZone.color }}
      />

      {/* Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center border"
            style={{
              backgroundColor: `${currentZone.color}20`,
              borderColor: `${currentZone.color}40`,
              color: currentZone.color,
            }}
          >
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Puissance</h3>
            <div className="text-xs font-semibold" style={{ color: currentZone.color }}>
              {currentZone.name}
            </div>
          </div>
        </div>

        {/* % FTP Badge */}
        <div className="px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono font-bold text-slate-300">
          <span className="text-cyan-400">{pctFtp}%</span> FTP
        </div>
      </div>

      {/* Main Watts Display */}
      <div className="my-4 text-center z-10">
        <div className="flex items-baseline justify-center gap-2">
          <span
            className="text-6xl sm:text-7xl font-black font-mono tracking-tight transition-colors duration-300"
            style={{ color: currentWatts > 0 ? currentZone.color : '#94a3b8' }}
          >
            {currentWatts}
          </span>
          <span className="text-lg font-bold text-slate-400">W</span>
        </div>

        {/* Delta vs Target */}
        {targetWatts > 0 && (
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="flex items-center gap-1 text-xs font-medium text-slate-400">
              <Target className="w-3.5 h-3.5 text-slate-500" />
              <span>Cible :</span>
              <span className="font-bold text-white font-mono">{targetWatts} W</span>
            </div>

            <div
              className={`text-xs font-bold px-2 py-0.5 rounded-md font-mono ${
                isClose
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : diffWatts < 0
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              }`}
            >
              {diffWatts > 0 ? `+${diffWatts}` : diffWatts} W
            </div>
          </div>
        )}
      </div>

      {/* Visual Power Zone Bar */}
      <div className="space-y-1.5 z-10">
        <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
          <span>0W</span>
          <span className="text-orange-400">FTP {ftpWatts}W</span>
          <span>{Math.round(ftpWatts * 1.5)}W+</span>
        </div>
        <div className="w-full h-3 bg-slate-950 rounded-full p-0.5 border border-slate-800 flex overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300 shadow-sm"
            style={{
              width: `${Math.min(100, Math.max(5, (currentWatts / (ftpWatts * 1.5)) * 100))}%`,
              backgroundColor: currentZone.color,
            }}
          />
        </div>
      </div>
    </div>
  );
};
