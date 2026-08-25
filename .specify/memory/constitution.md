# Domyos Velo Trainer Constitution

## Core Principles

### I. Pure Domain & Service Decoupling
* Les services métier (`src/services/`) ne doivent jamais dépendre directement des composants React (`src/components/`).
* Les communications et protocoles matériels (Web Bluetooth FTMS, Heart Rate, Audio) sont isolés dans leurs modules respectifs et testables unitairement avec des mocks (`mockBluetoothService.ts`).
* Les états temps-réel utilisent le pattern observateur / abonnements (`subscribeState`, `subscribeConnection`, `subscribe`).

### II. TypeScript Strict & Shared Contracts
* Aucun type `any` n'est toléré dans le code de production.
* Tous les modèles de données métier, états Bluetooth, profils et séances d'entraînement sont centralisés dans `src/types/`.
* Les contrats d'interface doivent être immuables ou explicites sur leur mutabilité.

### III. Test-Driven & Quality Assurance (NON-NÉGOCIABLE)
* Toute logique algorithmique (calcul FTP, décodage FTMS/Cardio, machine à états du `workoutEngine`, calcul de zones) doit posséder sa suite de tests Vitest dans un dossier `__tests__/` adjacent.
* Avant toute validation de tâche ou déploiement, la commande `npm run test` doit s'exécuter avec 100% de succès.
* Pas de régression sur les 20 tests unitaires de référence.

### IV. Local-First & Privacy by Design
* Les données utilisateur, historiques d'entraînements et profils sont stockés en local dans le navigateur via Dexie (IndexedDB).
* Aucune donnée biométrique ou de séance ne doit fuiter sans consentement explicite.
* Mode hors-ligne complet et simulation intégrée supportés dès la conception.

### V. UI/UX Haute Performance & Immersion Sportive
* Palette sombre immersive (`bg-slate-950`, accents `cyan-500` / `indigo-500`) adaptée à l'effort physique et aux écrans de cockpit.
* Composants légers et réactifs basés sur React 19 + Tailwind CSS + Lucide React.
* Graphiques d'effort clairs et performants avec Recharts.
* Support du Screen Wake Lock API pour maintenir l'écran allumé pendant l'entraînement.

## Stack Technique & Contraintes

* **Frontend :** React 19.x, TypeScript 5.8+, Vite 6.x.
* **Styles :** Tailwind CSS 3.4+, PostCSS, Autoprefixer, `clsx`, `tailwind-merge`.
* **Icônes & Graphiques :** Lucide React, Recharts.
* **Persistance :** Dexie 4.x (`dexie-react-hooks`), IndexedDB.
* **Protocoles :** Web Bluetooth API (Service FTMS UUID `0x1826`, Heart Rate `0x180D`), Web Audio API, Screen Wake Lock API.
* **Tests :** Vitest 3.x (`vitest run`).
* **Hébergement :** Firebase Hosting (statique / SPA).

## Workflow de Développement & Spec-Driven Governance

1. **Spécifier avant de coder :** Toute nouvelle fonctionnalité commence par `/speckit.specify` pour cadrer le besoin utilisateur.
2. **Architecture & Planification :** Élaboration systématique du `plan.md` (`/speckit.plan`) et découpage en tâches atomiques (`/speckit.tasks`).
3. **Implémentation assistée :** Exécution séquentielle avec `/speckit.implement` en respectant scrupuleusement la présente Constitution.
4. **Validation :** Exécution systématique de `npm run test` et vérification de conformité via `/speckit.converge`.

**Version**: 1.0.0 | **Ratified**: 2026-08-25 | **Status**: Active

