# Skill Observation Log

Observations captured during task-oriented work.

**Status key:** OPEN = not yet actioned | ACTIONED (YYYY-MM-DD) = skill updated/created | DECLINED (YYYY-MM-DD) = user decided not to pursue — resolved statuses always carry their resolution date

---

## 2026-08-25

### Observation 1: BLE multi-device heart rate prioritization pattern

**Status:** OPEN
**Date:** 2026-08-25
**Session context:** Conception et développement d'une application d'entraînement connectée pour vélo d'appartement et montre connectée
**Skill:** New skill candidate: ble-fitness-app-builder
**Type:** open-source
**Phase/Area:** Bluetooth connectivity & sensor fusion

**Issue:** Stationary fitness machines (like bikes or treadmills) have intermittent heart rate contact sensors when athletes move their hands, whereas smartwatches provide continuous wrist tracking. Handling both devices in a single Web Bluetooth app requires a unified state manager with transparent source priority and fallback.

**Suggested improvement:** Document and template the dual-BLE connection architecture with Web Bluetooth API in browser PWAs: primary continuous BLE Heart Rate Service (0x180D) and secondary FTMS Indoor Bike Data (0x2AD2) with automatic fallback and UI source badges.

**Principle:** In multi-sensor fitness applications, always decouple metric producers from UI consumers through a unified state aggregator that prioritizes continuous wearables over intermittent equipment contact points.

---

## 2026-08-26

### Observation 2: Client-side PWA OAuth auto-sync to health aggregator APIs (Fitbit / Health Connect)

**Status:** OPEN
**Date:** 2026-08-26
**Session context:** Intégration de la synchronisation automatique des séances d'entraînement vers Fitbit et Google Health Connect
**Skill:** New skill candidate: ble-fitness-app-builder
**Type:** open-source
**Phase/Area:** Cloud sync & Health ecosystems

**Issue:** Web PWAs operating without a dedicated backend server need to sync rich workout metrics (duration, distance, calories, watts, heart rate) to mobile health platforms like Google Health Connect and Fitbit upon session completion.

**Suggested improvement:** Implement client-side OAuth 2.0 flow with URL fragment parsing, encrypted/local token storage, and background REST API submission (`activities.json`) on session termination events with graceful offline fallback and TCX file download.

**Principle:** For serverless fitness web applications, leverage direct client-side OAuth to cloud health APIs (like Fitbit Web API) that natively bridge into OS-level health hubs (such as Google Health Connect on Android) to provide zero-effort auto-sync for users.
