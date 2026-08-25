/**
 * Thème graphique & Nuancier néon haute visibilité pour les zones Coggan et le Cockpit
 */

export interface ZoneVisualTheme {
  zoneIndex: number;
  name: string;
  code: string;
  color: string;       // Couleur principale (Hex)
  glowColor: string;   // Couleur néon avec transparence pour drop-shadow / box-shadow
  bgGradient: string;  // Dégradé de fond
  badgeClass: string;  // Classes Tailwind pour badges
}

export const COGGAN_ZONE_THEMES: Record<number, ZoneVisualTheme> = {
  1: {
    zoneIndex: 1,
    name: 'Récupération Active',
    code: 'Z1',
    color: '#94a3b8', // slate-400
    glowColor: 'rgba(148, 163, 184, 0.5)',
    bgGradient: 'from-slate-800/40 to-slate-900/60',
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
  },
  2: {
    zoneIndex: 2,
    name: 'Endurance Fondamentale',
    code: 'Z2',
    color: '#38bdf8', // sky-400
    glowColor: 'rgba(56, 189, 248, 0.5)',
    bgGradient: 'from-sky-950/40 to-slate-900/60',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  },
  3: {
    zoneIndex: 3,
    name: 'Tempo / Rythme',
    code: 'Z3',
    color: '#34d399', // emerald-400
    glowColor: 'rgba(52, 211, 153, 0.5)',
    bgGradient: 'from-emerald-950/40 to-slate-900/60',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  4: {
    zoneIndex: 4,
    name: 'Seuil Lactique / Sweet Spot',
    code: 'Z4',
    color: '#fbbf24', // amber-400
    glowColor: 'rgba(251, 191, 36, 0.5)',
    bgGradient: 'from-amber-950/40 to-slate-900/60',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  5: {
    zoneIndex: 5,
    name: 'PMA / VO2 Max',
    code: 'Z5',
    color: '#fb923c', // orange-400
    glowColor: 'rgba(251, 146, 60, 0.5)',
    bgGradient: 'from-orange-950/40 to-slate-900/60',
    badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  },
  6: {
    zoneIndex: 6,
    name: 'Capacité Anaérobie',
    code: 'Z6',
    color: '#f87171', // red-400
    glowColor: 'rgba(248, 113, 113, 0.6)',
    bgGradient: 'from-red-950/40 to-slate-900/60',
    badgeClass: 'bg-red-500/20 text-red-300 border-red-500/30',
  },
  7: {
    zoneIndex: 7,
    name: 'Puissance Neuromusculaire',
    code: 'Z7',
    color: '#c084fc', // purple-400
    glowColor: 'rgba(192, 132, 252, 0.6)',
    bgGradient: 'from-purple-950/40 to-slate-900/60',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
};

export function getZoneTheme(zoneIndex: number): ZoneVisualTheme {
  const boundedIndex = Math.max(1, Math.min(7, Math.round(zoneIndex)));
  return COGGAN_ZONE_THEMES[boundedIndex] || COGGAN_ZONE_THEMES[1];
}

export function getCadenceFeedback(cadenceRpm: number, targetCadenceRpm: number): {
  color: string;
  glowColor: string;
  status: 'slow' | 'on-target' | 'fast' | 'idle';
  message: string;
} {
  if (cadenceRpm === 0) {
    return {
      color: '#64748b',
      glowColor: 'rgba(100, 116, 139, 0.3)',
      status: 'idle',
      message: 'Arrêt',
    };
  }
  if (targetCadenceRpm <= 0) {
    return {
      color: '#38bdf8',
      glowColor: 'rgba(56, 189, 248, 0.5)',
      status: 'on-target',
      message: 'Rythme libre',
    };
  }

  const delta = cadenceRpm - targetCadenceRpm;
  if (Math.abs(delta) <= 5) {
    return {
      color: '#34d399', // Vert
      glowColor: 'rgba(52, 211, 153, 0.5)',
      status: 'on-target',
      message: 'Cadence parfaite',
    };
  } else if (delta < -5) {
    return {
      color: '#38bdf8', // Bleu
      glowColor: 'rgba(56, 189, 248, 0.5)',
      status: 'slow',
      message: `Accélérez (+${Math.abs(delta)} RPM)`,
    };
  } else {
    return {
      color: '#fbbf24', // Ambre
      glowColor: 'rgba(251, 191, 36, 0.5)',
      status: 'fast',
      message: `Ralentissez (-${delta} RPM)`,
    };
  }
}
