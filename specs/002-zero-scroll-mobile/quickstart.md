# Phase 1: Quickstart Validation - Zero-Scroll Mobile HUD

## Validation Scenarios

### Scenario 1: Mobile Portrait Zero-Scroll (Pixel 10)
1. Ouvrir l'application sur smartphone Google Pixel 10 en mode portrait (largeur ~412dp, hauteur ~924dp).
2. Lancer une séance d'entraînement.
3. Vérifier que la Timeline en haut, les deux jauges néon de Puissance et Cadence au milieu, le ruban des métriques (Cardio/Vitesse/Distance/Calories) et les boutons d'action en bas sont tous 100% visibles simultanément sans aucun défilement vertical.

### Scenario 2: Mobile Landscape Zero-Scroll
1. Tourner le smartphone en mode paysage.
2. Vérifier que les deux colonnes s'adaptent à la hauteur de l'écran sans faire déborder les boutons d'action.

### Scenario 3: Automated Test Suite Verification
1. Exécuter `npm test` pour s'assurer que l'intégralité des 24 tests unitaires continuent de passer avec 100% de succès.
