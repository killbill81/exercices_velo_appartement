# Spécification & Design Document : Vélo Domyos EB900 B & Pixel Watch

**Date :** 2026-08-25  
**Projet :** Application Web PWA d'Entraînement Cycliste Connecté  
**Périphériques cibles :** Vélo Domyos EB900 B (BLE FTMS) + Montre Google Pixel Watch 4 (BLE Heart Rate)  
**Appareil hôte :** Google Pixel 10 (Google Chrome / PWA avec Web Bluetooth API)  

---

## 1. Vue d'ensemble & Objectifs

L'objectif est de créer une application web progressive (PWA) réactive, moderne et orientée performance, conçue pour l'entraînement structuré sur vélo d'appartement Domyos EB900 B.

### Points Clés & Besoins Spécifiques :
1. **Double Flux Bluetooth Simultané (Web Bluetooth API) :**
   - **Flux 1 (Vélo Domyos EB900 B) :** Vitesse, Cadence (RPM), Puissance instantanée (Watts), Distance, Calories, et contrôle de résistance / mode ERG.
   - **Flux 2 (Montre Google Pixel Watch 4) :** Fréquence cardiaque continue au poignet (Standard BLE Heart Rate Service `0x180D`), prioritaire sur les capteurs du guidon du vélo.
2. **Programmes Structurés Évolutifs & Test FTP Automatisé :**
   - Test de puissance par paliers (Ramp Test) pour déterminer la FTP (Functional Threshold Power) de l'utilisateur.
   - Plans d'entraînement progressifs sur plusieurs semaines (HIIT, Seuil, Endurance, Récupération) dont les cibles en Watts et zones cardiaques s'ajustent automatiquement selon le niveau de l'utilisateur.
3. **Cockpit Haute Visibilité & Guidage Audio/Visuel :**
   - Interface plein écran optimisée pour écran de smartphone Pixel 10 fixé au guidon.
   - Bips audio de décompte (Web Audio API) et alertes visuelles de zones physiologiques.
   - Maintien automatique de l'écran allumé (Screen Wake Lock API).
4. **Persistance Locale & Analyse de Données :**
   - Enregistrement local sécurisé (IndexedDB) de l'historique complet des séances.
   - Visualisation graphique de la progression et export des données (TCX/CSV).

---

## 2. Architecture Technique & Flux de Données

```mermaid
graph TD
    subgraph Périphériques BLE
        EB900[Vélo Domyos EB900 B<br/>Service FTMS 0x1826]
        Watch[Google Pixel Watch 4<br/>Service Heart Rate 0x180D]
    end

    subgraph Couche Matérielle & Web Bluetooth (Pixel 10)
        BLE_Manager[Web Bluetooth Multi-Device Manager]
        EB900 -->|Watts, RPM, Vitesse, Dist| BLE_Manager
        Watch -->|FC continue poignet (BPM)| BLE_Manager
    end

    subgraph Cœur Applicatif (React 19 + TypeScript)
        Aggregator[Gestionnaire de Métriques & Priorité Cardio]
        WorkoutEngine[Moteur d'Entraînement & Intervalles]
        AudioEngine[Moteur Audio Web Audio API & Synthèse]
        Storage[Base Locale IndexedDB / Dexie]
        
        BLE_Manager --> Aggregator
        Aggregator --> WorkoutEngine
        WorkoutEngine --> AudioEngine
        WorkoutEngine --> Storage
    end

    subgraph Interface Utilisateur (Tailwind CSS + Lucide)
        CockpitView[Cockpit Live & Jauges XXL]
        ProgramView[Programmes & Plans Semaines]
        FTPTestView[Ramp Test FTP Automatisé]
        StatsView[Historique & Graphiques d'Évolution]
    end

    WorkoutEngine --> CockpitView
    Storage --> StatsView
    Storage --> ProgramView
    WorkoutEngine --> FTPTestView
```

### Logique de Priorisation du Rythme Cardiaque :
* **Priorité 1 :** Flux continu de la montre **Google Pixel Watch 4** (Service `0x180D`).
* **Priorité 2 (Fallback) :** Capteurs métalliques du guidon du vélo Domyos (intégrés dans le paquet FTMS `0x2AD2`).
* **Indicateur UI :** Badge visuel affichant la source active (`⌚ Pixel Watch` ou `🚲 Capteurs Guidon`).

---

## 3. Découpage Fonctionnel & Modules

### A. Gestionnaire Bluetooth (`bluetooth/`)
- `ftmsService.ts` : Connexion au Domyos EB900 B, décodage des trames BLE FTMS (Watts, RPM, Vitesse, Distance, Résistance actuelle).
- `heartRateService.ts` : Connexion à la montre Pixel Watch (BLE Heart Rate `0x180D`, `0x2A37`), décodage de la fréquence cardiaque et de la variabilité RR.
- `bluetoothManager.ts` : Orchestration des deux connexions, reconnexion automatique en cas de coupure, état de connexion global.

### B. Moteur d'Entraînement (`workout/`)
- `ftpEngine.ts` : Calcul des 7 zones de puissance Coggan (Z1 Récupération à Z7 Neuromusculaire) et 5 zones de FC.
- `rampTest.ts` : Déroulé automatisé du Ramp Test (+20W/min après échauffement) et calcul de la FTP finale.
- `trainingPlans.ts` : Bibliothèque de programmes structurés (ex: "Remise en forme 4 semaines", "Explosion FTP 6 semaines", "HIIT Cardio & Perte de gras").
- `workoutExecutor.ts` : Machine à états gérant les blocs d'intervalles (Échauffement, Travail, Récupération, Retour au calme), le décompte à la seconde, le respect des cibles.

### C. Moteur Audio & Retour Utilisateur (`audio/`)
- `audioCuePlayer.ts` : Génération de signaux sonores purs via Web Audio API (bips aigus/graves à 3s, 2s, 1s et tonalité de changement de bloc).
- `speechAnnouncer.ts` : Annonces vocales via `window.speechSynthesis` (ex: *"Attention sprint dans 3 secondes, cible 280 Watts"*).
- `wakeLock.ts` : Verrouillage de veille d'écran du Pixel 10 pendant la séance.

### D. Interface Utilisateur & Expérience Cycliste (`components/`)
- `LiveCockpit.tsx` : Compteur XXL haute lisibilité, jauge de puissance avec zones colorées dynamiques, jauge de cadence RPM, indicateur de FC et cardio-zone.
- `WorkoutProgressBar.tsx` : Graphique temporel de la séance avec position courante et intensité des blocs à venir.
- `TrainingPlanSelector.tsx` : Vue des semaines et séances du programme sélectionné avec badge d'accomplissement.
- `FTPTestModal.tsx` : Guide et interface interactive pour le test de niveau.
- `SessionSummary.tsx` : Bilan de fin de séance (courbes puissance/cadence/FC, Watts moyens, calories, temps dans chaque zone).
- `HistoryView.tsx` : Calendrier des séances passées, courbe d'évolution de la FTP et de la charge d'entraînement.

---

## 4. Modèle de Données (IndexedDB / TypeScript)

```typescript
// Profil utilisateur et zones
export interface UserProfile {
  id: string;
  name: string;
  weightKg: number;
  maxHeartRate: number;
  ftpWatts: number; // Puissance seuil fonctionnelle
  lastFtpTestDate?: string;
}

// Séance d'entraînement structurée
export interface WorkoutStep {
  id: string;
  name: string;
  durationSeconds: number;
  targetPowerPercentFtp: number; // Ex: 120% de la FTP
  targetCadenceRpm?: number;     // Ex: 90 RPM
  type: 'warmup' | 'interval' | 'recovery' | 'cooldown';
}

export interface WorkoutDefinition {
  id: string;
  title: string;
  description: string;
  planId?: string;
  weekNumber?: number;
  sessionNumber?: number;
  steps: WorkoutStep[];
  totalDurationSeconds: number;
}

// Données enregistrées d'une séance complétée
export interface CompletedSession {
  id: string;
  workoutId: string;
  workoutTitle: string;
  date: string;
  durationSeconds: number;
  avgPowerWatts: number;
  maxPowerWatts: number;
  avgCadenceRpm: number;
  avgHeartRateBpm: number;
  maxHeartRateBpm: number;
  totalCalories: number;
  totalDistanceKm: number;
  samples: Array<{
    timestampMs: number;
    powerWatts: number;
    cadenceRpm: number;
    heartRateBpm: number;
    heartRateSource: 'watch' | 'bike';
    speedKmh: number;
  }>;
}
```

---

## 5. Stratégie de Vérification & Tests

1. **Simulateur Bluetooth BLE (Mock Mode) :**
   - Création d'un mode de simulation temps réel intégré dans l'application permettant de tester les watts, la cadence, les intervalles et la montre Pixel Watch même hors du vélo pour le développement et la validation.
2. **Tests Unitaires :**
   - Tests de calcul des zones FTP et de l'algorithme du Ramp Test.
   - Tests de la machine à états de décompte d'intervalles.
3. **Validation Réelle sur Smartphone Pixel 10 :**
   - Appairage simultané du Domyos EB900 B et de la Pixel Watch 4 via Chrome Mobile.
