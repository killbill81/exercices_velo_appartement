import React from 'react';
import { getPowerZone } from '../../services/workout/ftpCalculator';
import { getZoneTheme } from '../../types/uiTheme';
import { NeonArcGauge } from './NeonArcGauge';

interface PowerZoneGaugeProps {
  currentWatts: number;
  targetWatts: number;
  ftpWatts: number;
  size?: 'md' | 'lg' | 'xl';
}

export const PowerZoneGauge: React.FC<PowerZoneGaugeProps> = ({
  currentWatts,
  targetWatts,
  ftpWatts,
  size = 'lg',
}) => {
  const currentZone = getPowerZone(currentWatts, ftpWatts);
  const theme = getZoneTheme(currentZone.zone);

  const pctFtp = Math.round((currentWatts / Math.max(1, ftpWatts)) * 100);
  const diffWatts = currentWatts - targetWatts;

  let statusBadge = `${pctFtp}% FTP`;
  let statusBadgeClass = theme.badgeClass;

  if (targetWatts > 0) {
    if (Math.abs(diffWatts) <= 10) {
      statusBadge = `Parfait (${diffWatts > 0 ? `+${diffWatts}` : diffWatts}W)`;
      statusBadgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    } else if (diffWatts < -10) {
      statusBadge = `${diffWatts}W`;
      statusBadgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    } else {
      statusBadge = `+${diffWatts}W`;
      statusBadgeClass = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  }

  const maxScaleWatts = Math.max(Math.round(ftpWatts * 1.6), 350);

  return (
    <NeonArcGauge
      currentValue={currentWatts}
      targetValue={targetWatts > 0 ? targetWatts : undefined}
      maxValue={maxScaleWatts}
      label="Puissance"
      unit="W"
      color={theme.color}
      glowColor={theme.glowColor}
      zoneName={`${theme.code} • ${theme.name}`}
      statusBadge={statusBadge}
      statusBadgeClass={statusBadgeClass}
      size={size}
    />
  );
};
