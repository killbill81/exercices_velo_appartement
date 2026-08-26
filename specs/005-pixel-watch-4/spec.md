# Feature Specification: Reconnexion & Détection Avancée Google Pixel Watch 4

**Feature Branch**: `005-pixel-watch-4`
**Created**: 2026-08-26
**Status**: Specified
**Input**: User feedback: "Il y a une chose bizarre. J'ai réussi à le faire une fois hier, et depuis que je me suis déconnecté, je n'arrive plus à connecter ma Google Pixel Watch 4 à l'application. Pourtant, j'ai bien activé tout ce qu'il faut dessus, autorisé d'autres appareils à se connecter avec une association étendue, mais je ne vois pas du tout ma Pixel Watch 4 qui apparaît dans la liste du matériel détecté. Alors, je ne sais pas pourquoi, j'essaie de tout faire mais j'y arrive pas."

## Overview
Résolution du problème de visibilité et de reconnexion de la **Google Pixel Watch 4** (Wear OS) en Web Bluetooth BLE. Intégration de la reconnexion directe sans scan via `navigator.bluetooth.getDevices()`, élargissement des filtres de découverte et guide visuel d'activation Wear OS.

## Root Cause Analysis
1. **Arrêt de la balise BLE sur la montre :** Sur Wear OS (Pixel Watch), la diffusion cardio BLE standard (`0x180D`) s'arrête automatiquement dès que la session se déconnecte ou que l'application de diffusion sur la montre passe en veille. Sans émission active de balises publicitaires (advertisement packets), le navigateur Web ne peut physiquement pas détecter la montre dans la liste de scan.
2. **Autorisations Chrome mémorisées inexploitées :** Une fois associée hier, Chrome a stocké l'autorisation du périphérique dans `navigator.bluetooth.getDevices()`. L'application doit permettre une reconnexion instantanée en 1 clic sans avoir à réouvrir le scanner BLE.

## User Scenarios & Testing

### User Story 1 - Reconnexion Instantanée 1-Clic (Priority: P1) 🎯 MVP
L'utilisateur ouvre le modal Bluetooth. L'application vérifie si une Pixel Watch 4 a déjà été associée précédemment via `navigator.bluetooth.getDevices()`. Un bouton **"⚡ Reconnecter la Pixel Watch mémorisée"** permet de rétablir le flux cardio instantanément sans passer par la fenêtre de scan.

**Why this priority**: Évite à l'utilisateur de devoir scanner et chercher sa montre à chaque nouvelle séance.

**Independent Test**: Ouvrir le modal Bluetooth, cliquer sur "Reconnexion rapide" et vérifier la réception immédiate du BPM.

---

### User Story 2 - Scan Élargi & Assistant de Dépannage Pixel Watch (Priority: P2)
Si l'appareil n'est pas encore mémorisé ou doit être réassocié, l'application propose un mode de scan universel (`acceptAllDevices: true`) avec un guide clair étape par étape sur la montre.

**Acceptance Scenarios**:
1. **Given** la montre diffusant son signal cardio, **When** l'utilisateur clique sur "Associer", **Then** Chrome liste tous les appareils BLE à proximité.
2. **Given** une erreur de détection, **When** l'utilisateur regarde le modal, **Then** les étapes exactes d'activation sur la montre (Fitbit / App Wear OS) sont expliquées clairement.

## Requirements

### Functional Requirements
- **FR-001**: L'application MUST implémenter `bluetoothManager.getPairedDevices()` via `navigator.bluetooth.getDevices()` pour proposer la reconnexion automatique.
- **FR-002**: L'application MUST supporter la reconnexion directe à un `BluetoothDevice` déjà autorisé sans déclencher `requestDevice()`.
- **FR-003**: Le composant `ConnectionModal.tsx` MUST afficher le statut des appareils mémorisés avec bouton de reconnexion en 1 clic.
- **FR-004**: Le modal MUST intégrer un assistant pas-à-pas pour vérifier que la diffusion BLE est active sur la Pixel Watch 4.

## Success Criteria

### Measurable Outcomes
- **SC-001**: Reconnexion en moins de 2 secondes pour les appareils déjà associés via `getDevices()`.
- **SC-002**: 100% de clarté diagnostique sur l'état de diffusion cardio de la montre.
