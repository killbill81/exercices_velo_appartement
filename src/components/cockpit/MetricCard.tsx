import React, { ReactNode } from 'react';

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  unit: string;
  subValue?: string;
  color?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  label,
  value,
  unit,
  subValue,
  color = 'text-cyan-400',
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
        <div className={`w-6 h-6 rounded-lg bg-slate-950 flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>

      <div className="my-1.5">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
            {value}
          </span>
          <span className="text-xs font-bold text-slate-400">{unit}</span>
        </div>
        {subValue && (
          <div className="text-[11px] text-slate-400 font-medium">{subValue}</div>
        )}
      </div>
    </div>
  );
};
