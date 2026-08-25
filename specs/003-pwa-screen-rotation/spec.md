# Feature Specification: Déverrouillage de la Rotation d'Écran PWA (Support Paysage Installé)

**Feature Branch**: `003-pwa-screen-rotation`
**Created**: 2026-08-25
**Status**: Specified
**Input**: User description: "l'application sur mon pixel ne passe pas en mode paysage. J'ai installé l'application sur le téléphone et l'écran ne tourne pas. Par contre si le je l'ouvre directement sur chrome de mon pixel, l'écran tourne"

## Overview
Correction du comportement d'orientation de l'application Progressive Web App (PWA) une fois installée sur Android (Google Pixel 10). L'application installée doit tourner librement en mode Paysage dès que le smartphone est incliné à l'horizontale sur le support guidon du vélo.

## Root Cause Analysis
Dans `public/manifest.json`, la directive `"orientation": "portrait-primary"` forçait le système d'exploitation Android (WebAPK) à verrouiller l'application installée en mode portrait vertical, ignorant la rotation automatique du gyroscope du téléphone.

## User Scenarios & Testing

### User Story 1 - Rotation Automatique de la PWA Installée (Priority: P1) 🎯 MVP
L'utilisateur ouvre l'application depuis l'icône installée sur l'écran d'accueil de son Pixel 10. Lorsqu'il incline son téléphone à l'horizontale sur le guidon, l'application bascule immédiatement et fluidement en mode Paysage Panoramique sans être bloquée par l'OS.

**Why this priority**: Permet d'utiliser l'application comme un vrai compteur de vélo étendu en mode paysage.

**Independent Test**: Installer la PWA sur Android, faire pivoter le téléphone et vérifier que l'orientation bascule entre Portrait et Paysage.

**Acceptance Scenarios**:
1. **Given** la PWA installée sur l'écran d'accueil d'un Pixel 10, **When** le cycliste tourne son téléphone à l'horizontale, **Then** l'application s'affiche en mode paysage 2 colonnes sans être verrouillée.
2. **Given** l'application lancée, **When** le cycliste tourne son téléphone à la verticale, **Then** l'application s'affiche en mode portrait zéro-scroll.

## Requirements

### Functional Requirements
- **FR-001**: Le fichier `public/manifest.json` MUST définir `"orientation": "any"` pour autoriser toutes les orientations (portrait, paysage gauche, paysage droite).
- **FR-002**: L'application MUST appeler `screen.orientation.unlock()` (si disponible dans le navigateur) pour libérer tout verrouillage matériel préalable.

## Success Criteria

### Measurable Outcomes
- **SC-001**: Rotation automatique fonctionnelle à 100% sur l'application PWA installée sur Android Chrome / Pixel 10.
- **SC-002**: Zéro blocage d'orientation dans le manifest web.
