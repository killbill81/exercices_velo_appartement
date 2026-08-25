import React, { useState } from 'react';
import { Sparkles, Calendar, Clock, Flame, Play, ChevronRight } from 'lucide-react';
import { TRAINING_PLANS, STANDALONE_WORKOUTS } from '../../data/trainingPlans';
import { WorkoutDefinition } from '../../types/workout';
import { WorkoutDetailModal } from './WorkoutDetailModal';

interface PlanSelectorProps {
  userFtpWatts: number;
  onSelectWorkout: (workout: WorkoutDefinition) => void;
}

export const PlanSelector: React.FC<PlanSelectorProps> = ({
  userFtpWatts,
  onSelectWorkout,
}) => {
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutDefinition | null>(null);
  const [activePlanId, setActivePlanId] = useState<string>(TRAINING_PLANS[0].id);

  const activePlan = TRAINING_PLANS.find(p => p.id === activePlanId) || TRAINING_PLANS[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2.5 text-cyan-400 text-xs font-extrabold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          Programmes d'Entraînement Évolutifs
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Développez vos capacités séance après séance
        </h1>
        <p className="text-sm text-slate-400 mt-1.5 max-w-2xl">
          Toutes les puissances cibles (Watts) s'adaptent instantanément à votre niveau actuel (FTP : <strong>{userFtpWatts} W</strong>).
        </p>
      </div>

      {/* Plan Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TRAINING_PLANS.map((plan) => {
          const isSelected = plan.id === activePlanId;
          return (
            <div
              key={plan.id}
              onClick={() => setActivePlanId(plan.id)}
              className={`p-5 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                  : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[11px] font-bold text-slate-300 border border-slate-700">
                    {plan.level}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{plan.durationWeeks} semaines</span>
                  </div>
                </div>

                <h3 className="font-extrabold text-base text-white mb-1.5">{plan.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{plan.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">{plan.workouts.length} séances prévues</span>
                <span className={`font-bold flex items-center gap-1 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`}>
                  {isSelected ? 'Sélectionné' : 'Voir les séances'}
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Workouts in Selected Plan */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span>{activePlan.title}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{activePlan.description}</p>
          </div>
          <span className="text-xs font-bold text-slate-400">{activePlan.workouts.length} Séances</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {activePlan.workouts.map((workout, index) => {
            const totalDurationMinutes = Math.round(
              workout.steps.reduce((acc, s) => acc + s.durationSeconds, 0) / 60
            );

            return (
              <div
                key={workout.id}
                onClick={() => setSelectedWorkout(workout)}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/90 hover:border-cyan-500/40 hover:bg-slate-950 transition-all cursor-pointer flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-cyan-400 font-mono">
                      {workout.subtitle || `Séance ${index + 1}`}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {totalDurationMinutes} min
                      </span>
                      {workout.estimatedTss && (
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-amber-500" />
                          {workout.estimatedTss} TSS
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-extrabold text-sm text-white group-hover:text-cyan-300 transition-colors">
                    {workout.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {workout.description}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {workout.steps.length} blocs d'intervalles
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Standalone / Free Rides */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 shadow-lg space-y-4">
        <h2 className="text-base font-extrabold text-white">Séances Libres & Pédalage Continu</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {STANDALONE_WORKOUTS.map((workout) => (
            <div
              key={workout.id}
              onClick={() => setSelectedWorkout(workout)}
              className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-sm text-white">{workout.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{workout.subtitle}</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                <Play className="w-4 h-4 fill-current" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <WorkoutDetailModal
        workout={selectedWorkout}
        userFtpWatts={userFtpWatts}
        isOpen={Boolean(selectedWorkout)}
        onClose={() => setSelectedWorkout(null)}
        onSelectAndStart={onSelectWorkout}
      />
    </div>
  );
};
