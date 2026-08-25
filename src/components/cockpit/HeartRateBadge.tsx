import React from 'react';
import { Heart, Watch, Zap } from 'lucide-react';
import { HeartRateSource } from '../../types/bluetooth';
import { calculateHeartRateZones } from '../../services/workout/ftpCalculator';

interface HeartRateBadgeProps {
  heartRateBpm: number;
  source: HeartRateSource;
  maxHeartRateBpm: number;
}

export const HeartRateBadge: React.FC<HeartRateBadgeProps> = ({
  heartRateBpm,
  source,
  maxHeartRateBpm,
}) => {
  const hrZones = calculateHeartRateZones(maxHeartRateBpm);
  let activeZone = hrZones[0];
  if (heartRateBpm > 0) {
    for (const z of hrZones) {
      if (heartRateBpm <= z.maxBpm) {
        activeZone = z;
        break;
      }
    }
  }

  const isZero = heartRateBpm <= 0;

  return (
    <div className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
      isZero
        ? 'bg-slate-900/80 border-slate-800'
        : 'bg-slate-900 border-slate-700/80 shadow-lg'
    }`}>
      <div className="flex items-center gap-3">
        {/* Animated Heart Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center relative shadow-md transition-all"
          style={{ backgroundColor: !isZero ? `${activeZone.color}25` : '#1e293b' }}
        >
          <Heart
            className={`w-6 h-6 transition-all ${
              !isZero
                ? 'animate-pulse text-rose-500'
                : 'text-slate-600'
            }`}
            style={{ color: !isZero ? activeZone.color : undefined }}
            fill={!isZero ? activeZone.color : 'none'}
          />
          {source === 'watch' && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-[9px] font-black shadow">
              <Watch className="w-2.5 h-2.5" />
            </div>
          )}
        </div>

        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black tracking-tight text-white font-mono">
              {isZero ? '--' : heartRateBpm}
            </span>
            <span className="text-xs font-bold text-slate-400">BPM</span>
          </div>

          <div className="text-[11px] font-semibold flex items-center gap-1.5 mt-0.5">
            {source === 'watch' && (
              <span className="text-cyan-400 flex items-center gap-1">
                <Watch className="w-3 h-3" />
                Pixel Watch 4 (Poignet)
              </span>
            )}
            {source === 'bike' && (
              <span className="text-emerald-400 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Capteurs Guidon Vélo
              </span>
            )}
            {source === 'none' && (
              <span className="text-slate-500">Cardio non connecté</span>
            )}
          </div>
        </div>
      </div>

      {/* Zone Cardio Badge */}
      {!isZero && (
        <div className="text-right">
          <div
            className="px-2.5 py-1 rounded-lg text-xs font-bold border inline-block"
            style={{
              borderColor: `${activeZone.color}60`,
              backgroundColor: `${activeZone.color}15`,
              color: activeZone.color,
            }}
          >
            Z{activeZone.zone} • {Math.round((heartRateBpm / maxHeartRateBpm) * 100)}%
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">
            {activeZone.name.split('-')[1]?.trim() || activeZone.name}
          </div>
        </div>
      )}
    </div>
  );
};
