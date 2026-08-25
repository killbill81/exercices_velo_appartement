# Feature Specification: Cockpit Mobile "Zéro-Scroll" (Single-Screen Viewport Fitted)

**Feature Branch**: `002-zero-scroll-mobile`
**Created**: 2026-08-25
**Status**: Specified
**Input**: User description: "J'ai testé sur mon téléphone. Je suis obligé de scroller pour avoir toutes les infos. je veux toutes les infos, du moins importantes sur l'écran sans scroller"

## Overview
Refonte architecturale du Cockpit pour garantir un affichage **"Zéro-Scroll"** strict sur smartphone (Google Pixel 10, écran 6.3 pouces). Toutes les informations critiques (Watts, Cadence, Cardio, Timeline de palier, Décompte, Vitesse, Distance, Calories, Résistance et Commandes tactiles) doivent être visibles simultanément sur un seul écran sans aucun défilement vertical, que le téléphone soit tenu en **Portrait** ou en **Paysage**.

## User Scenarios & Testing

### User Story 1 - Cockpit Portrait Zéro-Scroll Compact (Priority: P1) 🎯 MVP
Lorsque le smartphone est posé verticalement sur le support guidon, le cycliste voit l'intégralité de sa séance d'entraînement sur une seule vue adaptée à la hauteur de l'écran (`100dvh`), sans avoir à faire glisser son doigt vers le bas pendant le pédalage.

**Why this priority**: C'est le retour direct utilisateur. En plein effort physique et avec les mains moites, faire défiler un écran est frustrant et dangereux.

**Independent Test**: Ouvrir l'application sur Pixel 10 en mode portrait : vérifier que le haut de l'écran (Timeline/Palier) et le bas de l'écran (Commandes Démarrer/Pause/Intensité) sont visibles simultanément sans aucun scrollbar.

**Acceptance Scenarios**:
1. **Given** une séance lancée en mode portrait sur Pixel 10, **When** l'utilisateur regarde son écran, **Then** 100% des composants (Timeline, Jauges Watts/Cadence, Cardio, Métriques clés, Commandes $\pm 5\%$, Pause/Saut) tiennent dans la hauteur de la fenêtre sans défilement.
2. **Given** l'écran d'un smartphone, **When** la hauteur de l'écran varie (clavier fermé, barres du navigateur), **Then** le layout utilise `100dvh` et `flex-col justify-between` pour s'ajuster dynamiquement.

---

### User Story 2 - Cockpit Paysage Panoramique Zéro-Scroll (Priority: P2)
Lorsque le smartphone est orienté à l'horizontale (mode paysage), les éléments se répartissent en 2 colonnes ultra-compactes optimisées pour une hauteur restreinte ($\sim 380-420\text{px}$) sans nécessiter de scroll.

**Why this priority**: Permet une utilisation type "Compteur de vélo Garmin/Wahoo" sans dépassement de hauteur.

**Independent Test**: Basculer le smartphone en mode paysage, vérifier que le layout 2 colonnes rentre intégralement dans l'écran.

---

### User Story 3 - Hiérarchisation Visuelle Haute Densité (Priority: P3)
Les métriques secondaires (Vitesse, Distance, Calories, Résistance, Statut ERG) sont regroupées dans un ruban compact horizontal à haute densité d'information.

**Why this priority**: Économise l'espace vertical au profit des chiffres géants de Puissance et Cadence.

**Independent Test**: Vérifier que toutes les métriques secondaires sont lisibles dans une seule rangée fine de 44px de haut.

---

### Edge Cases
- Écrans compacts ($< 680\text{px}$ de hauteur utile) : réduction automatique de l'échelle des jauges néon (`size="compact"` ou `md`) pour préserver l'espace des boutons tactiles.
- Mode Plein Écran (Fullscreen) : gain de 50px de hauteur supplémentaire en masquant les barres d'adresse de Chrome.

## Requirements

### Functional Requirements
- **FR-001**: Le conteneur principal du cockpit MUST être dimensionné pour tenir dans la hauteur visible du viewport (`max-h-[calc(100dvh-125px)]` ou `h-full` avec `overflow-hidden`).
- **FR-002**: En mode Portrait, les jauges de Watts et de Cadence MUST être disposées côte à côte (grille 2 colonnes compacte) avec des diamètres ajustés pour ne pas dépasser $150-180\text{px}$ de hauteur.
- **FR-003**: Le bandeau de Timeline MUST être condensé (hauteur $\le 75\text{px}$) avec le nom du bloc, le compte à rebours XXL et la barre d'intervalle.
- **FR-004**: Les métriques secondaires (Vitesse, Distance, Calories, Temps, Résistance, Cardio) MUST être réunies dans un ruban horizontal compact de hauteur $\le 48\text{px}$.
- **FR-005**: Les commandes tactiles (Intensité $\pm 5\%$, Démarrer, Pause, Saut, Stop) MUST être ancrées en bas du cockpit avec des boutons de $44\text{px}$ de haut minimum.
- **FR-006**: Aucun composant du Cockpit ne MUST générer de barre de défilement vertical (`overflow-y-auto` désactivé au profit de `h-full flex flex-col justify-between`).

## Success Criteria

### Measurable Outcomes
- **SC-001**: 0 pixel de défilement vertical requis sur Google Pixel 10 (1080 x 2424 px / 412 x 924 dp) en mode Portrait et Paysage.
- **SC-002**: 100% des métriques essentielles (Watts, Zone Coggan, Cadence, Cardio, Décompte palier, Vitesse, Distance, Temps, Boutons de contrôle) visibles en permanence d'un seul coup d'œil.
- **SC-003**: Cibles tactiles des boutons de contrôle supérieures ou égales à 44 x 44 px conformes aux recommandations d'accessibilité mobile.
