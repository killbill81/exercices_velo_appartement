import React from 'react';
import { PlayCircle, Sparkles, Activity, History } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'cockpit' | 'plans' | 'ramp' | 'history';
  onTabChange: (tab: 'cockpit' | 'plans' | 'ramp' | 'history') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'cockpit' as const,
      label: 'Cockpit',
      icon: PlayCircle,
    },
    {
      id: 'plans' as const,
      label: 'Programmes',
      icon: Sparkles,
    },
    {
      id: 'ramp' as const,
      label: 'Test FTP',
      icon: Activity,
    },
    {
      id: 'history' as const,
      label: 'Historique',
      icon: History,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/90 px-3 py-1.5 shadow-2xl safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-cyan-400 font-extrabold scale-105'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 shadow-sm shadow-cyan-500/20'
                    : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
