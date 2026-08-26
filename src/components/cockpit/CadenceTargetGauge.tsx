import React from 'react';
import { getCadenceFeedback } from '../../types/uiTheme';
import { NeonArcGauge } from './NeonArcGauge';

interface CadenceTargetGaugeProps {
  currentCadenceRpm: number;
  targetCadenceRpm?: number;
  size?: 'compact' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export const CadenceTargetGauge: React.FC<CadenceTargetGaugeProps> = ({
  currentCadenceRpm,
  targetCadenceRpm = 85,
  size = 'full',
  className = '',
}) => {
  const feedback = getCadenceFeedback(currentCadenceRpm, targetCadenceRpm);

  let statusBadge = `${targetCadenceRpm} RPM`;
  let statusBadgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

  if (feedback.status === 'on-target' && currentCadenceRpm > 0) {
    statusBadge = 'Cadence Idéale ✨';
    statusBadgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  } else if (feedback.status === 'slow') {
    statusBadge = feedback.message;
    statusBadgeClass = 'bg-sky-500/20 text-sky-300 border-sky-500/30';
  } else if (feedback.status === 'fast') {
    statusBadge = feedback.message;
    statusBadgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
  } else if (feedback.status === 'idle') {
    statusBadge = 'En attente';
    statusBadgeClass = 'bg-slate-800 text-slate-400 border-slate-700';
  }

  return (
    <NeonArcGauge
      currentValue={currentCadenceRpm}
      targetValue={targetCadenceRpm > 0 ? targetCadenceRpm : undefined}
      maxValue={130}
      label="Cadence"
      unit="RPM"
      color={feedback.color}
      glowColor={feedback.glowColor}
      zoneName={currentCadenceRpm > 0 ? feedback.message : 'Pédalez pour démarrer'}
      statusBadge={statusBadge}
      statusBadgeClass={statusBadgeClass}
      size={size}
      className={`border-emerald-500/30 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-emerald-950/20 hover:border-emerald-500/50 ${className}`}
    />
  );
};
