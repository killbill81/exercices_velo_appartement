# Feature Specification: Forcer le Mode Paysage par Défaut (PWA & Manifest)

**Feature Branch**: `004-force-default-landscape`
**Created**: 2026-08-25
**Status**: Specified
**Input**: User description: "non rien ne tourne. JE te propose de mettre l'application par défaut en mode paysage même si c'est du portrait"

## Overview
Configuration de l'application Progressive Web App (PWA) pour s'ouvrir et s'afficher **par défaut en Mode Paysage Horizontal** (style compteur de vélo Garmin Edge / Wahoo Bolt) sur Google Pixel 10 et tous les smartphones, via la directive native du manifeste Web et le verrouillage d'orientation au démarrage.

## User Scenarios & Testing

### User Story 1 - Lancement Automatique en Mode Paysage (Priority: P1) 🎯 MVP
Dès que le cycliste lance l'application installée sur son smartphone fixé au guidon, Android bascule et verrouille l'affichage à l'horizontale en mode Paysage Panoramique, offrant immédiatement le Cockpit 2 colonnes avec les jauges géantes néon et la timeline sans manipulation manuelle.

**Why this priority**: Répond directement à la demande de l'utilisateur pour transformer son smartphone en véritable compteur de vélo horizontal.

**Independent Test**: Ouvrir l'application sur Pixel 10 et vérifier qu'elle s'ouvre d'office en mode horizontal paysage.

**Acceptance Scenarios**:
1. **Given** la PWA installée, **When** l'utilisateur l'ouvre, **Then** Android affiche l'application directement en orientation paysage.
2. **Given** l'application ouverte, **When** le composant racine se charge, **Then** `screen.orientation.lock('landscape')` est invoqué pour garantir l'orientation horizontale.

## Requirements

### Functional Requirements
- **FR-001**: Le fichier `public/manifest.json` MUST définir `"orientation": "landscape"`.
- **FR-002**: L'application dans `src/App.tsx` MUST tenter de verrouiller l'orientation en paysage au démarrage via `screen.orientation.lock('landscape')`.

## Success Criteria

### Measurable Outcomes
- **SC-001**: 100% des démarrages de la PWA installée sur Android s'ouvrent en mode Paysage horizontal par défaut.
