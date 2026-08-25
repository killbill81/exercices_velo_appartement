# Plan d'Implémentation : Application Entraînement Domyos EB900 B & Pixel Watch

**But :** Développer une application web progressive (PWA) réactive dédiée à l'entraînement structuré sur vélo d'appartement Domyos EB900 B avec intégration du rythme cardiaque continu de la montre Google Pixel Watch 4.

**Architecture :** Application Single Page sous React 19 et Vite, utilisant la Web Bluetooth API pour gérer simultanément le vélo (FTMS 0x1826) et la montre (Heart Rate 0x180D). Le cœur applicatif intègre un moteur d'entraînement avec décompte temps réel, génération sonore via Web Audio API, calcul des zones FTP et persistance locale des séances dans IndexedDB (Dexie).

**Stack Technique :**
- React 19 + TypeScript + Vite
- Tailwind CSS + Lucide React + Recharts
- Web Bluetooth API + Web Audio API + Screen Wake Lock API
- Dexie.js (IndexedDB)
- Vitest (Tests unitaires TDD)

---

## Liste Détaillée des Tâches

### Tâche 1 : Initialisation du Projet Vite React TypeScript & Dépendances
**Fichiers :**
- Créer : `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/index.css`, `src/App.tsx`, `src/main.tsx`
- Test : `src/test/setup.ts`, `vitest.config.ts`

**Étape 1 :** Configurer les dépendances (React 19, Lucide, Recharts, Dexie, Tailwind CSS, Vitest).  
**Étape 2 :** Valider le build et l'environnement de test Vitest.  
**Étape 3 :** Commiter localement (`chore: initialize Vite React 19 TypeScript project`).

---

### Tâche 2 : Cœur Bluetooth FTMS (Vélo Domyos) & Heart Rate (Pixel Watch)
**Fichiers :**
- Créer : `src/services/bluetooth/ftmsDecoder.ts`
- Créer : `src/services/bluetooth/heartRateDecoder.ts`
- Créer : `src/services/bluetooth/bluetoothManager.ts`
- Créer : `src/services/bluetooth/mockBluetoothService.ts` (Mode simulation pour tests sans être sur le vélo)
- Test : `src/services/bluetooth/__tests__/ftmsDecoder.test.ts`
- Test : `src/services/bluetooth/__tests__/heartRateDecoder.test.ts`

**Étape 1 (Test) :** Écrire les tests unitaires vérifiant le parsing des paquets BLE FTMS (`0x2AD2` : Watts, RPM, Vitesse) et Heart Rate (`0x2A37` : 8-bit / 16-bit BPM).  
**Étape 2 (Implémentation) :** Implémenter les décodeurs binaires et le gestionnaire multi-connexion avec fallback automatique vers les capteurs du guidon si la montre est absente.  
**Étape 3 (Validation) :** Exécuter les tests Vitest et commiter (`feat: add FTMS and Heart Rate BLE decoders and connection manager`).

---

### Tâche 3 : Moteur Physiologique FTP & Calculateur de Zones
**Fichiers :**
- Créer : `src/services/workout/ftpCalculator.ts`
- Créer : `src/services/workout/rampTestProtocol.ts`
- Créer : `src/types/workout.ts`
- Test : `src/services/workout/__tests__/ftpCalculator.test.ts`
- Test : `src/services/workout/__tests__/rampTest.test.ts`

**Étape 1 (Test) :** Tester le découpage des 7 zones Coggan (Z1 Récupération < 55%, Z2 Endurance 56-75%, Z3 Tempo 76-90%, Z4 Seuil 91-105%, Z5 VO2max 106-120%, Z6 Anaérobie 121-150%, Z7 Sprint > 150%) et le calcul de la FTP issue d'un Ramp Test (75% de la dernière minute).  
**Étape 2 (Implémentation) :** Coder les formules mathématiques et la logique du Ramp Test.  
**Étape 3 (Validation) :** Exécuter les tests et commiter (`feat: implement FTP zones calculator and Ramp Test logic`).

---

### Tâche 4 : Bibliothèque de Programmes d'Entraînement Évolutifs
**Fichiers :**
- Créer : `src/data/trainingPlans.ts`
- Créer : `src/services/workout/workoutScaler.ts`
- Test : `src/services/workout/__tests__/workoutScaler.test.ts`

**Étape 1 (Test) :** Vérifier que chaque séance adapte dynamiquement les puissances cibles (Watts) de ses blocs lorsque la FTP utilisateur change.  
**Étape 2 (Implémentation) :** Définir 3 programmes complets (Plan 4 semaines Débutant / Remise en forme, Plan 6 semaines HIIT & Brûleur de graisses, Plan 8 semaines Progression Seuil & Endurance) + mode séance personnalisée.  
**Étape 3 (Validation) :** Commiter (`feat: add multi-week structured training plans with dynamic FTP scaling`).

---

### Tâche 5 : Moteur d'Exécution d'Entraînement, Audio & Wake Lock
**Fichiers :**
- Créer : `src/services/workout/workoutEngine.ts`
- Créer : `src/services/audio/soundPlayer.ts` (Bips Web Audio API 3-2-1 Go)
- Créer : `src/services/audio/speechCoach.ts` (Synthèse vocale d'encouragement et d'annonces)
- Créer : `src/services/device/wakeLock.ts` (Maintien de l'écran du Pixel 10 allumé)
- Test : `src/services/workout/__tests__/workoutEngine.test.ts`

**Étape 1 (Test) :** Tester les transitions d'intervalles (warmup -> interval -> recovery -> cooldown) et l'émission des signaux de décompte à T-3s, T-2s, T-1s, T-0s.  
**Étape 2 (Implémentation) :** Coder la machine à états temporelle et la synthèse sonore sans latence.  
**Étape 3 (Validation) :** Commiter (`feat: add workout execution engine with audio cues and screen wake lock`).

---

### Tâche 6 : Base de Données Locale IndexedDB & Historique
**Fichiers :**
- Créer : `src/services/storage/db.ts`
- Créer : `src/services/storage/historyService.ts`
- Test : `src/services/storage/__tests__/historyService.test.ts`

**Étape 1 (Test) :** Tester l'enregistrement d'une session complète avec échantillons temporels, calcul des moyennes et agrégation par zones.  
**Étape 2 (Implémentation) :** Configurer Dexie.js pour stocker le profil, les séances terminées et les résultats des tests FTP.  
**Étape 3 (Validation) :** Commiter (`feat: add IndexedDB storage and history tracking with Dexie`).

---

### Tâche 7 : Interface Utilisateur Cockpit Haute Lisibilité (Spécial Guidon Pixel 10)
**Fichiers :**
- Créer : `src/components/cockpit/LiveCockpit.tsx`
- Créer : `src/components/cockpit/MetricCard.tsx`
- Créer : `src/components/cockpit/PowerZoneGauge.tsx`
- Créer : `src/components/cockpit/CadenceTargetGauge.tsx`
- Créer : `src/components/cockpit/HeartRateBadge.tsx` (Statut Pixel Watch vs Guidon)
- Créer : `src/components/cockpit/IntervalProgress.tsx`
- Créer : `src/components/cockpit/WorkoutControls.tsx`

**Étape 1 :** Créer des composants UI ergonomiques avec grands chiffres contrastés, animations fluides des jauges et contrôles tactiles volumineux.  
**Étape 2 :** Commiter (`feat: create high-visibility live cockpit UI for mobile`).

---

### Tâche 8 : Vues Programmes, Test FTP, Bilan de Séance & Historique
**Fichiers :**
- Créer : `src/components/plans/PlanSelector.tsx`
- Créer : `src/components/plans/WeekSessionCard.tsx`
- Créer : `src/components/ftp/RampTestRunner.tsx`
- Créer : `src/components/summary/SessionSummaryModal.tsx`
- Créer : `src/components/history/HistoryDashboard.tsx`
- Créer : `src/components/settings/ProfileSettings.tsx`
- Créer : `src/components/bluetooth/ConnectionModal.tsx`

**Étape 1 :** Intégrer les vues de sélection de programme, l'assistant interactif de Ramp Test, le tableau de bord avec graphiques Recharts (évolution FTP, répartition des zones) et la boîte de dialogue de connexion Bluetooth double appareil.  
**Étape 2 :** Commiter (`feat: add plan selector, ramp test runner, summary and analytics dashboard`).

---

### Tâche 9 : PWA, Mode Hors-ligne & Vérification Globale
**Fichiers :**
- Créer : `public/manifest.json`, `public/favicon.svg`, `public/icon-192.png`, `public/icon-512.png`
- Modifier : `index.html`
- Créer : `src/registerServiceWorker.ts`

**Étape 1 :** Configurer le manifeste PWA pour installation native en plein écran sur Pixel 10.  
**Étape 2 :** Exécuter tous les tests unitaires et le build de production (`npm run build`).  
**Étape 3 :** Commiter (`feat: configure PWA manifest and finalize production build`).
