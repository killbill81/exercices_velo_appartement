# Feature Specification: Amélioration Ergonomique UI et UX Cockpit

**Feature Branch**: `001-lioration-ergonomie-ui`
**Created**: 2026-08-25
**Status**: Clarified
**Input**: User description: "améliore l'ux et l'ui"

## Overview
Optimisation de l'ergonomie, du design visuel et de l'expérience utilisateur (UI/UX) pour l'application d'entraînement connectée, particulièrement adaptée aux conditions réelles d'utilisation sur smartphone (Google Pixel 10) fixé sur le guidon du vélo Domyos EB900 B.

## Clarifications

### Session 2026-08-25
- Q: Comment souhaitez-vous orienter l'affichage du cockpit lors de vos entraînements sur votre Pixel 10 fixé au guidon ? → A: Option C (Mode Paysage "Compteur de bord" horizontal strict façon Garmin Edge / Wahoo avec disposition panoramique optimisée).
- Q: Souhaitez-vous que l'application utilise des vibrations haptiques et des alertes visuelles clignotantes lors des transitions de blocs ? → A: Option B (Pulsations visuelles lumineuses dynamiques uniquement aux transitions, sans vibration haptique).
- Q: Quel style visuel préférez-vous pour les jauges principales de Watts et de Cadence sur votre cockpit ? → A: Option A (Arcs circulaires néon avec halos lumineux colorés dynamiques selon la zone Coggan active).
- Q: Quel niveau de détail préférez-vous pour les annonces vocales du coach pendant vos séances ? → A: Option A (Annonces concises & directes : Nom du palier + Watts cibles + durée pour préserver la concentration).
- Q: Comment souhaitez-vous positionner les commandes tactiles en mode Paysage ? → A: Option A (Commandes latérales gauche/droite pour un accès direct au pouce sans lâcher le guidon, avec bouton Plein Écran dédié).

## User Scenarios & Testing

### User Story 1 - Cockpit Panoramique Paysage & Plein Écran (Priority: P1)
En plein effort physique (transpiration, secousses, vision périphérique), le cycliste dispose d'un affichage horizontal panoramique façon "Compteur de bord GPS" (Garmin Edge / Wahoo Bolt) sur son Pixel 10. Les métriques vitales (Watts XXL, Zone Coggan, Cadence cible, Cardio) sont représentées par des arcs circulaires néon luminescents, réparties de manière équilibrée et lisibles à 1 mètre sans plisser les yeux.

**Why this priority**: C'est le cœur de l'expérience sportive. L'orientation paysage permet d'exploiter la largeur de l'écran pour afficher simultanément les jauges géantes, la timeline et les contrôles tactiles sans défilement vertical.

**Independent Test**: Lancer une séance en tenant ou fixant le smartphone en mode paysage, vérifier que tout le cockpit tient sur un seul écran sans scroll avec contraste maximal et arcs néon fluides.

**Acceptance Scenarios**:
1. **Given** une séance en cours en mode paysage, **When** le cycliste regarde son écran, **Then** la puissance actuelle et la cadence sont affichées à gauche en arcs circulaires néon XXL avec le halo coloré de la zone Coggan, tandis que la timeline et les métriques sont à droite.
2. **Given** l'application ouverte, **When** le cycliste clique sur l'icône plein écran, **Then** le navigateur passe en mode Fullscreen sans barres d'interface parasites.

---

### User Story 2 - Transitions d'Intervalles avec Pulsations Visuelles Dynamiques (Priority: P2)
Le cycliste visualise la structure globale de sa séance sous forme de profil altimétrique/puissance interactif avec une pulsation visuelle lumineuse synchronisée avec le décompte sonore lors des 3 dernières secondes d'un bloc.

**Why this priority**: Permet d'anticiper l'effort et la difficulté des paliers à venir visuellement sans vibration mécanique.

**Independent Test**: Charger une séance HIIT, observer la pulsation lumineuse fluide aux transitions d'intervalles (T-3s, T-2s, T-1s, GO).

**Acceptance Scenarios**:
1. **Given** un entraînement structuré, **When** un intervalle approche de sa fin (T-3s), **Then** une animation de pulsation visuelle lumineuse de couleur de la prochaine zone accompagne le décompte sonore.

---

### User Story 3 - Guidage Vocal Concis & Commandes Tactiles Latérales (Priority: P3)
Le coach vocal énonce de façon percutante et synthétique chaque changement d'allure (ex: "Sprint, 220 Watts, 30 secondes"), tandis que les boutons tactiles d'intensité ($\pm 5\%$) et de pause sont situés sur les flancs de l'écran pour un accès direct au pouce.

**Why this priority**: Permet de piloter la séance instantanément sans lâcher le guidon.

**Independent Test**: En plein pédalage, toucher les boutons $\pm 5\%$ sur le bord gauche et le bouton pause sur le bord droit avec les pouces.

---

### Edge Cases
- Écran mouillé ou doigts transpirants : les zones de clic tactiles latérales doivent être larges ($\ge 48\text{px}$) et espacées.
- Verrouillage de rotation d'écran : l'application doit encourager et s'adapter au mode paysage sans décalage de layout.

## Requirements

### Functional Requirements
- **FR-001**: Le cockpit MUST proposer une typographie haute lisibilité (chiffres XXL) avec thème sombre OLED (`#020617` / `#0f172a`).
- **FR-002**: L'application MUST supporter un mode Plein Écran immersif (Fullscreen API) activable en 1 clic.
- **FR-003**: Le bandeau de pilotage automatique (Mode ERG) MUST offrir un retour visuel animé clair quand le servomoteur du vélo ajuste la résistance.
- **FR-004**: Les boutons d'action en cours d'exercice MUST avoir une surface de contact d'au moins 48px avec retour visuel immédiat.
- **FR-005**: Le résumé de séance MUST afficher le temps passé dans chacune des 7 zones Coggan avec leur couleur standardisée.
- **FR-006**: Le layout du cockpit MUST être spécialement optimisé pour le mode Paysage horizontal (Compteur de bord panoramique sans scroll vertical).
- **FR-007**: L'application MUST afficher une pulsation visuelle lumineuse dynamique (anneau ou bordure colorée) lors du décompte des 3 dernières secondes avant chaque changement d'intervalle.
- **FR-008**: Les jauges de Watts et de Cadence MUST utiliser des arcs circulaires néon avec halos luminescents réactifs à la zone Coggan active ($Z1$ à $Z7$).
- **FR-009**: Le coach vocal MUST formuler des annonces brèves et synthétiques (Intitulé + Puissance cible + Durée).
- **FR-010**: Les commandes tactiles en mode paysage MUST être disposées sur les côtés latéraux (gauche pour l'intensité $\pm 5\%$, droite pour Pause/Saut/Fin) pour être actionnables sans lâcher les poignées du guidon.

## Success Criteria

### Measurable Outcomes
- **SC-001**: Toutes les métriques clés (Watts, Cadence, BPM) lisibles à 1 mètre sans zoom en mode paysage.
- **SC-002**: Zéro défilement vertical requis sur le Cockpit en mode paysage plein écran sur Pixel 10.
- **SC-003**: 100% des boutons critiques accessibles d'une seule main au pouce sur écran 6.3 pouces.
