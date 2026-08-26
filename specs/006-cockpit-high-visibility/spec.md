# Feature Specification: Cockpit High-Visibility Layout & Card Proportions

**Feature Branch**: `006-cockpit-high-visibility`
**Created**: 2026-08-26
**Status**: Specified
**Input**: User feedback with annotated screenshot: "Il faudrait que tu agrandisses certaines parties sur l'affichage et que ça prenne plus de place. Il y a les deux cadres de gauche. Le premier cadre complètement à gauche, la puissance, il faudrait l'augmenter en hauteur. Le cadre de la cadence, aussi l'augmenter en hauteur, ça donne plus d'importance. Peut-être avoir une nuance de couleur du cadre peut-être un peu différente pour les distinguer. Et le cadre plutôt horizontal qui est complètement à droite, où il y a le BPM, les kilomètres/heure, tout ça, et les calories, l'agrandir et le suivre dans ce cadre rouge pour que ça prenne plus de place sur la hauteur. Peut-être du coup afficher les informations un peu plus gros."

## Overview
Optimisation visuelle et ergonomique de l'interface Cockpit pour maximiser l'occupation verticale de l'écran sans aucun espace vide :
1. **Élévation et agrandissement des 2 jauges néon gauches (Puissance & Cadence)** : étirement vertical pleine hauteur (`h-full`) avec typographie XXL et différenciation chromatique des cartes (Puissance avec halo de zone actif, Cadence avec teinte émeraude/menthe dédiée).
2. **Refonte du panneau métriques droit en grille haute visibilité multi-tuiles (2x3)** : remplacement du ruban fin par 6 grandes cartes de métriques aérées (Cardio BPM Pixel Watch, Vitesse km/h, Distance km, Calories kcal, Chrono, Mode ERG / Résistance) avec valeurs agrandies pour une lisibilité parfaite à 1 mètre sur le guidon.

## User Scenarios & Testing

### User Story 1 - Jauges Pleine Hauteur & Nuance Chromatique (Priority: P1) 🎯 MVP
L'utilisateur sur son vélo voit ses 2 jauges (Watts et RPM) occuper toute la hauteur disponible à gauche, avec des chiffres géants et une distinction nette entre le cadre Puissance (halo de zone $Z1-Z7$) et le cadre Cadence (liseré émeraude distinct).

**Acceptance Scenarios**:
1. **Given** le cockpit en affichage paysage, **When** la séance s'affiche, **Then** les cartes de Puissance et de Cadence s'étirent sur 100% de la hauteur de la colonne gauche.
2. **Given** les 2 cadres côte à côte, **When** l'utilisateur regarde la cadence, **Then** le cadre présente une nuance émeraude distincte du cadre de puissance.

---

### User Story 2 - Grille Métriques Haute Visibilité XXL (Priority: P2)
L'utilisateur voit l'ensemble de ses 6 métriques secondaires occuper généreusement la partie inférieure droite sous forme de tuiles spacieuses avec des chiffres géants faciles à lire pendant un effort intense.

**Acceptance Scenarios**:
1. **Given** le panneau de droite, **When** les métriques sont rendues, **Then** les 6 indicateurs (BPM, km/h, km, kcal, temps, ERG) sont disposés en grille 2x3 de grandes tuiles avec chiffres XXL.
2. **Given** le bouton ERG / Résistance, **When** l'utilisateur appuie dessus, **Then** le mode bascule instantanément tout en restant intégré à la grille.

## Requirements

### Functional & UI Requirements
- **FR-001**: `LiveCockpit.tsx` MUST étirer la colonne de gauche et les cartes de jauges sur toute la hauteur (`h-full flex-1`).
- **FR-002**: `NeonArcGauge.tsx` MUST supporter un mode `size="responsive-full"` où le SVG et les textes s'ajustent pour remplir verticalement la carte.
- **FR-003**: `CadenceTargetGauge.tsx` MUST appliquer une bordure et un dégradé d'arrière-plan distincts (`border-emerald-500/30 bg-gradient-to-b from-slate-900 to-emerald-950/20`).
- **FR-004**: `PowerZoneGauge.tsx` MUST appliquer une bordure dynamique selon la zone de puissance active.
- **FR-005**: `CompactMetricStrip.tsx` MUST être refondu en `HighVisibilityMetricGrid.tsx` (ou grille 2x3 enrichie) pour remplir toute la hauteur du cadre inférieur droit avec des chiffres `text-xl` à `text-2xl`.
- **FR-006**: L'ensemble du cockpit MUST rester 100% zéro-scroll sur tous les formats d'écrans (`h-[100dvh]`).

## Success Criteria

### Measurable Outcomes
- **SC-001**: 0 pixel d'espace noir inutile perdu au-dessus ou en-dessous des jauges et des métriques.
- **SC-002**: Taille des chiffres des métriques augmentée d'au moins 60% par rapport à l'ancienne version.
