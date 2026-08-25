import { 
  BikeMetrics, 
  HeartRateData, 
  UnifiedBikeState, 
  BluetoothConnectionState 
} from '../../types/bluetooth';
import { decodeIndoorBikeData } from './ftmsDecoder';
import { decodeHeartRateMeasurement } from './heartRateDecoder';

// UUIDs standards Bluetooth SIG
export const BLE_SERVICES = {
  FTMS: 0x1826,                 // Fitness Machine Service
  CYCLING_POWER: 0x1818,        // Cycling Power Service
  CYCLING_SPEED_CADENCE: 0x1816,// Speed & Cadence
  HEART_RATE: 0x180D,           // Heart Rate Service
};

export const BLE_CHARACTERISTICS = {
  INDOOR_BIKE_DATA: 0x2AD2,              // FTMS Indoor Bike Data
  FITNESS_MACHINE_CONTROL_POINT: 0x2AD9,  // FTMS Control Point (Résistance/Puissance cible)
  FITNESS_MACHINE_STATUS: 0x2ADA,
  HEART_RATE_MEASUREMENT: 0x2A37,        // HR Measurement
};

export type UnifiedStateListener = (state: UnifiedBikeState) => void;
export type ConnectionStateListener = (state: BluetoothConnectionState) => void;

class BluetoothManager {
  // Périphérique Vélo (Domyos EB900 B)
  private bikeDevice: BluetoothDevice | null = null;
  private bikeControlChar: BluetoothRemoteGATTCharacteristic | null = null;
  private latestBikeMetrics: BikeMetrics | null = null;
  private hasControl = false;
  private currentTargetControlledWatts: number | null = null;

  // Périphérique Montre (Google Pixel Watch 4 / Ceinture cardio)
  private watchDevice: BluetoothDevice | null = null;
  private latestWatchHr: HeartRateData | null = null;

  // État de connexion & contrôle automatique
  private connectionState: BluetoothConnectionState = {
    bikeConnected: false,
    bikeConnecting: false,
    bikeError: null,
    bikeDeviceName: null,
    bikeControlSupported: false,

    watchConnected: false,
    watchConnecting: false,
    watchError: null,
    watchDeviceName: null,

    autoControlEnabled: true, // Activé par défaut pour piloter le vélo automatiquement
  };

  // Listeners
  private stateListeners: Set<UnifiedStateListener> = new Set();
  private connectionListeners: Set<ConnectionStateListener> = new Set();

  /**
   * Vérifie si le navigateur supporte Web Bluetooth
   */
  public isWebBluetoothSupported(): boolean {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  /**
   * S'abonne aux changements d'état unifié (Watts, Cadence, Cardio unifié, etc.)
   */
  public subscribeState(listener: UnifiedStateListener): () => void {
    this.stateListeners.add(listener);
    listener(this.getUnifiedState());
    return () => this.stateListeners.delete(listener);
  }

  /**
   * S'abonne aux changements d'état de connexion Bluetooth
   */
  public subscribeConnection(listener: ConnectionStateListener): () => void {
    this.connectionListeners.add(listener);
    listener(this.getConnectionState());
    return () => this.connectionListeners.delete(listener);
  }

  public getConnectionState(): BluetoothConnectionState {
    return { ...this.connectionState };
  }

  public setAutoControlEnabled(enabled: boolean) {
    this.connectionState.autoControlEnabled = enabled;
    this.notifyConnectionChanged();
    this.notifyStateChanged();
  }

  /**
   * Retourne l'état consolidé en temps réel avec PRIORISATION cardio
   */
  public getUnifiedState(): UnifiedBikeState {
    const bike = this.latestBikeMetrics;
    const watch = this.latestWatchHr;

    // Priorisation Cardio :
    // 1. Pixel Watch 4 en priorité (cardio continu au poignet)
    // 2. Capteurs guidon du vélo Domyos en repli
    // 3. Aucun capteur
    let hrBpm = 0;
    let hrSource: 'watch' | 'bike' | 'none' = 'none';

    if (watch && watch.heartRateBpm > 0) {
      hrBpm = watch.heartRateBpm;
      hrSource = 'watch';
    } else if (bike && bike.heartRateBpm && bike.heartRateBpm > 0) {
      hrBpm = bike.heartRateBpm;
      hrSource = 'bike';
    }

    return {
      powerWatts: bike?.instantPowerWatts || 0,
      cadenceRpm: bike?.instantCadenceRpm || 0,
      speedKmh: bike?.instantSpeedKmh || 0,
      distanceKm: bike ? Number((bike.totalDistanceMeters / 1000).toFixed(2)) : 0,
      caloriesKcal: bike?.totalEnergyKcal || 0,
      elapsedTimeSeconds: bike?.elapsedTimeSeconds || 0,
      resistanceLevel: bike?.resistanceLevel || 1,
      heartRateBpm: hrBpm,
      heartRateSource: hrSource,
      isWatchConnected: this.connectionState.watchConnected,
      isBikeConnected: this.connectionState.bikeConnected,
      isAutoControlSupported: this.connectionState.bikeControlSupported,
      isAutoControlActive: this.connectionState.autoControlEnabled && (this.connectionState.bikeControlSupported || this.connectionState.bikeConnected),
      targetControlledWatts: this.currentTargetControlledWatts,
      bikeDeviceName: this.connectionState.bikeDeviceName,
      watchDeviceName: this.connectionState.watchDeviceName,
    };
  }

  // ==========================================
  // Connexion Vélo Domyos EB900 B (BLE FTMS)
  // ==========================================

  public async connectBike(): Promise<boolean> {
    if (!this.isWebBluetoothSupported()) {
      this.connectionState.bikeError = "Web Bluetooth n'est pas supporté par votre navigateur (Utilisez Chrome ou Edge sur Pixel 10).";
      this.notifyConnectionChanged();
      return false;
    }

    try {
      this.connectionState.bikeConnecting = true;
      this.connectionState.bikeError = null;
      this.notifyConnectionChanged();

      // Scanner les appareils FTMS (Domyos EB900 B)
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: [BLE_SERVICES.FTMS] },
          { namePrefix: 'DOMYOS' },
          { namePrefix: 'Domyos' },
          { namePrefix: 'EB900' },
          { namePrefix: 'EB' },
        ],
        optionalServices: [
          BLE_SERVICES.FTMS,
          BLE_SERVICES.CYCLING_POWER,
          BLE_SERVICES.CYCLING_SPEED_CADENCE,
          BLE_SERVICES.HEART_RATE
        ]
      });

      this.bikeDevice = device;
      this.connectionState.bikeDeviceName = device.name || 'Domyos EB900 B';

      device.addEventListener('gattserverdisconnected', this.handleBikeDisconnected.bind(this));

      if (!device.gatt) {
        throw new Error('Serveur GATT introuvable sur le vélo');
      }

      const server = await device.gatt.connect();

      // Obtenir le service FTMS
      const service = await server.getPrimaryService(BLE_SERVICES.FTMS);

      // Obtenir la caractéristique Indoor Bike Data
      const bikeDataChar = await service.getCharacteristic(BLE_CHARACTERISTICS.INDOOR_BIKE_DATA);

      // S'abonner aux notifications de télémétrie (Watts, Cadence, etc.)
      await bikeDataChar.startNotifications();
      bikeDataChar.addEventListener('characteristicvaluechanged', (event: Event) => {
        const target = event.target as unknown as { value: DataView };
        if (target && target.value) {
          this.latestBikeMetrics = decodeIndoorBikeData(target.value);
          this.notifyStateChanged();
        }
      });

      // Tenter d'obtenir la caractéristique FTMS Control Point (0x2AD9) pour piloter la résistance
      try {
        this.bikeControlChar = await service.getCharacteristic(BLE_CHARACTERISTICS.FITNESS_MACHINE_CONTROL_POINT);
        this.connectionState.bikeControlSupported = true;
        // Prendre la main sur la machine
        await this.requestControl();
      } catch (controlErr) {
        console.warn('Contrôle FTMS Control Point non accessible ou non exposé:', controlErr);
        this.bikeControlChar = null;
        this.connectionState.bikeControlSupported = false;
      }

      this.connectionState.bikeConnected = true;
      this.connectionState.bikeConnecting = false;
      this.notifyConnectionChanged();
      this.notifyStateChanged();
      return true;

    } catch (err: unknown) {
      console.error('Erreur connexion vélo Domyos:', err);
      const message = err instanceof Error ? err.message : 'Échec de connexion Bluetooth au vélo';
      this.connectionState.bikeConnected = false;
      this.connectionState.bikeConnecting = false;
      this.connectionState.bikeError = message;
      this.notifyConnectionChanged();
      return false;
    }
  }

  // ==========================================
  // Pilotage Automatique FTMS (Résistance / ERG)
  // ==========================================

  /**
   * Demande le contrôle de la console du vélo (Opcode 0x00)
   */
  public async requestControl(): Promise<boolean> {
    if (!this.bikeControlChar) return false;
    try {
      const data = new Uint8Array([0x00]); // 0x00: Request Control
      await this.bikeControlChar.writeValueWithResponse(data);
      this.hasControl = true;
      return true;
    } catch (err) {
      console.warn("Échec de la prise de contrôle FTMS (Request Control):", err);
      return false;
    }
  }

  /**
   * Règle la puissance cible en Watts (Mode ERG - Opcode 0x05)
   */
  public async setTargetPower(targetWatts: number): Promise<boolean> {
    this.currentTargetControlledWatts = Math.round(targetWatts);
    this.notifyStateChanged();

    if (!this.bikeControlChar || !this.connectionState.autoControlEnabled) {
      return false;
    }

    try {
      if (!this.hasControl) {
        await this.requestControl();
      }

      // Opcode 0x05: Set Target Power (sint16 little endian)
      const buffer = new ArrayBuffer(3);
      const view = new DataView(buffer);
      view.setUint8(0, 0x05);
      view.setInt16(1, Math.max(20, Math.min(800, Math.round(targetWatts))), true);
      
      await this.bikeControlChar.writeValueWithResponse(buffer);
      return true;
    } catch (err) {
      console.warn("Échec de l'envoi de consigne de puissance FTMS:", err);
      return false;
    }
  }

  /**
   * Règle le niveau de résistance direct (Niveau 1 à 15 - Opcode 0x04)
   */
  public async setTargetResistance(level: number): Promise<boolean> {
    if (!this.bikeControlChar || !this.connectionState.autoControlEnabled) {
      return false;
    }

    try {
      if (!this.hasControl) {
        await this.requestControl();
      }

      // Opcode 0x04: Set Target Resistance Level (uint8, échelle 1-15)
      const buffer = new ArrayBuffer(2);
      const view = new DataView(buffer);
      view.setUint8(0, 0x04);
      view.setUint8(1, Math.max(1, Math.min(15, Math.round(level))));
      
      await this.bikeControlChar.writeValueWithResponse(buffer);
      return true;
    } catch (err) {
      console.warn("Échec de l'envoi du niveau de résistance FTMS:", err);
      return false;
    }
  }

  /**
   * Libère le contrôle de la console du vélo (Opcode 0x01: Reset)
   */
  public async resetControl(): Promise<void> {
    this.currentTargetControlledWatts = null;
    this.notifyStateChanged();

    if (!this.bikeControlChar) return;
    try {
      const data = new Uint8Array([0x01]);
      await this.bikeControlChar.writeValueWithResponse(data);
      this.hasControl = false;
    } catch {
      // Ignorer
    }
  }

  public async disconnectBike(): Promise<void> {
    if (this.bikeDevice && this.bikeDevice.gatt?.connected) {
      await this.resetControl();
      this.bikeDevice.gatt.disconnect();
    }
    this.handleBikeDisconnected();
  }

  private handleBikeDisconnected() {
    this.connectionState.bikeConnected = false;
    this.connectionState.bikeConnecting = false;
    this.connectionState.bikeControlSupported = false;
    this.bikeControlChar = null;
    this.hasControl = false;
    this.latestBikeMetrics = null;
    this.currentTargetControlledWatts = null;
    this.notifyConnectionChanged();
    this.notifyStateChanged();
  }

  // ==========================================
  // Connexion Montre (Google Pixel Watch 4)
  // ==========================================

  public async connectWatch(): Promise<boolean> {
    if (!this.isWebBluetoothSupported()) {
      this.connectionState.watchError = "Web Bluetooth n'est pas supporté par votre navigateur.";
      this.notifyConnectionChanged();
      return false;
    }

    try {
      this.connectionState.watchConnecting = true;
      this.connectionState.watchError = null;
      this.notifyConnectionChanged();

      // Scanner tous les appareils BLE à proximité pour trouver la montre
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          BLE_SERVICES.HEART_RATE,
          BLE_SERVICES.FTMS,
          0x1800,
          0x1801,
          0x180A,
        ]
      });

      this.watchDevice = device;
      this.connectionState.watchDeviceName = device.name || 'Google Pixel Watch 4';

      device.addEventListener('gattserverdisconnected', this.handleWatchDisconnected.bind(this));

      if (!device.gatt) {
        throw new Error('Serveur GATT introuvable sur la montre');
      }

      const server = await device.gatt.connect();

      let service: BluetoothRemoteGATTService | null = null;
      try {
        service = await server.getPrimaryService(BLE_SERVICES.HEART_RATE);
      } catch {
        throw new Error("Le service Cardio (0x180D) n'est pas encore actif sur la montre. Activez le partage cardio sur votre Pixel Watch (volet rapide ou paramètres Bluetooth).");
      }
      const hrChar = await service.getCharacteristic(BLE_CHARACTERISTICS.HEART_RATE_MEASUREMENT);

      await hrChar.startNotifications();
      hrChar.addEventListener('characteristicvaluechanged', (event: Event) => {
        const target = event.target as unknown as { value: DataView };
        if (target && target.value) {
          this.latestWatchHr = decodeHeartRateMeasurement(target.value);
          this.notifyStateChanged();
        }
      });

      this.connectionState.watchConnected = true;
      this.connectionState.watchConnecting = false;
      this.notifyConnectionChanged();
      this.notifyStateChanged();
      return true;

    } catch (err: unknown) {
      console.error('Erreur connexion montre Pixel Watch:', err);
      const message = err instanceof Error ? err.message : 'Échec de connexion Bluetooth à la montre';
      this.connectionState.watchConnected = false;
      this.connectionState.watchConnecting = false;
      this.connectionState.watchError = message;
      this.notifyConnectionChanged();
      return false;
    }
  }

  public async disconnectWatch(): Promise<void> {
    if (this.watchDevice && this.watchDevice.gatt?.connected) {
      this.watchDevice.gatt.disconnect();
    }
    this.handleWatchDisconnected();
  }

  private handleWatchDisconnected() {
    this.connectionState.watchConnected = false;
    this.connectionState.watchConnecting = false;
    this.latestWatchHr = null;
    this.notifyConnectionChanged();
    this.notifyStateChanged();
  }

  // ==========================================
  // Injection Données Simulées (Mode Démo)
  // ==========================================

  public injectSimulatedMetrics(bike: Partial<BikeMetrics>, watchHrBpm: number | null) {
    this.latestBikeMetrics = {
      instantSpeedKmh: bike.instantSpeedKmh || 25,
      instantCadenceRpm: bike.instantCadenceRpm || 80,
      instantPowerWatts: bike.instantPowerWatts || 150,
      totalDistanceMeters: (this.latestBikeMetrics?.totalDistanceMeters || 0) + ((bike.instantSpeedKmh || 25) / 3.6),
      totalEnergyKcal: (this.latestBikeMetrics?.totalEnergyKcal || 0) + 0.15,
      elapsedTimeSeconds: (this.latestBikeMetrics?.elapsedTimeSeconds || 0) + 1,
      resistanceLevel: bike.resistanceLevel || 6,
      heartRateBpm: bike.heartRateBpm,
    };

    if (watchHrBpm !== null) {
      this.latestWatchHr = { heartRateBpm: watchHrBpm };
    }

    this.connectionState.bikeConnected = true;
    this.connectionState.bikeDeviceName = 'Domyos EB900 B (Simulé)';
    this.connectionState.bikeControlSupported = true;

    if (watchHrBpm !== null) {
      this.connectionState.watchConnected = true;
      this.connectionState.watchDeviceName = 'Pixel Watch 4 (Simulé)';
    }

    this.notifyStateChanged();
  }

  private notifyStateChanged() {
    const state = this.getUnifiedState();
    this.stateListeners.forEach(listener => listener(state));
  }

  private notifyConnectionChanged() {
    const state = this.getConnectionState();
    this.connectionListeners.forEach(listener => listener(state));
  }
}

export const bluetoothManager = new BluetoothManager();
