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
  INDOOR_BIKE_DATA: 0x2AD2,     // FTMS Indoor Bike Data
  FITNESS_MACHINE_CONTROL_POINT: 0x2AD9, // FTMS Control Point (Résistance/Puissance cible)
  FITNESS_MACHINE_STATUS: 0x2ADA,
  HEART_RATE_MEASUREMENT: 0x2A37, // HR Measurement
};

export type UnifiedStateListener = (state: UnifiedBikeState) => void;
export type ConnectionStateListener = (state: BluetoothConnectionState) => void;

class BluetoothManager {
  // Périphérique Vélo (Domyos EB900 B)
  private bikeDevice: BluetoothDevice | null = null;
  private bikeControlChar: BluetoothRemoteGATTCharacteristic | null = null;
  private latestBikeMetrics: BikeMetrics | null = null;

  // Périphérique Montre (Google Pixel Watch 4 / Ceinture cardio)
  private watchDevice: BluetoothDevice | null = null;
  private latestWatchHr: HeartRateData | null = null;

  // État de connexion
  private connectionState: BluetoothConnectionState = {
    bikeConnected: false,
    bikeConnecting: false,
    bikeError: null,
    bikeDeviceName: null,
    watchConnected: false,
    watchConnecting: false,
    watchError: null,
    watchDeviceName: null,
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

  public getConnectionState(): BluetoothConnectionState {
    return { ...this.connectionState };
  }

  public subscribeState(listener: UnifiedStateListener): () => void {
    this.stateListeners.add(listener);
    // Émettre l'état actuel immédiatement
    listener(this.getUnifiedState());
    return () => this.stateListeners.delete(listener);
  }

  public subscribeConnection(listener: ConnectionStateListener): () => void {
    this.connectionListeners.add(listener);
    listener(this.getConnectionState());
    return () => this.connectionListeners.delete(listener);
  }

  private notifyConnectionChanged() {
    const state = this.getConnectionState();
    this.connectionListeners.forEach(fn => fn(state));
  }

  private notifyStateChanged() {
    const unified = this.getUnifiedState();
    this.stateListeners.forEach(fn => fn(unified));
  }

  /**
   * Calcule l'état agrégé avec priorisation du rythme cardiaque
   */
  public getUnifiedState(): UnifiedBikeState {
    const bike = this.latestBikeMetrics;
    const watch = this.latestWatchHr;

    // Priorité 1: Montre Pixel Watch 4
    let hrBpm = 0;
    let hrSource: UnifiedBikeState['heartRateSource'] = 'none';

    if (this.connectionState.watchConnected && watch && watch.heartRateBpm > 0) {
      hrBpm = watch.heartRateBpm;
      hrSource = 'watch';
    } else if (bike && bike.heartRateBpm && bike.heartRateBpm > 0) {
      // Priorité 2 (Fallback): Capteurs du guidon du vélo Domyos
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

      // S'abonner aux notifications
      await bikeDataChar.startNotifications();
      bikeDataChar.addEventListener('characteristicvaluechanged', (event: Event) => {
        const target = event.target as unknown as { value: DataView };
        if (target && target.value) {
          this.latestBikeMetrics = decodeIndoorBikeData(target.value);
          this.notifyStateChanged();
        }
      });

      // Tenter d'obtenir le point de contrôle (optionnel pour la résistance)
      try {
        this.bikeControlChar = await service.getCharacteristic(BLE_CHARACTERISTICS.FITNESS_MACHINE_CONTROL_POINT);
      } catch {
        console.warn('Contrôle FTMS non disponible ou protégé');
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

  public async disconnectBike(): Promise<void> {
    if (this.bikeDevice && this.bikeDevice.gatt?.connected) {
      this.bikeDevice.gatt.disconnect();
    }
    this.handleBikeDisconnected();
  }

  private handleBikeDisconnected() {
    this.connectionState.bikeConnected = false;
    this.connectionState.bikeConnecting = false;
    this.latestBikeMetrics = null;
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
        throw new Error("Le service Cardio (0x180D) n'est pas encore actif sur la montre. Activez la diffusion cardio sur votre Pixel Watch (ex: app 'Heart Rate to BLE' ou 'Heart for Bluetooth').");
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
  // Envoi de Résistance Cible (si supporté par le modèle)
  // ==========================================

  public async setTargetResistance(level: number): Promise<boolean> {
    if (!this.bikeControlChar || !this.connectionState.bikeConnected) {
      return false;
    }
    try {
      // FTMS OpCode 0x04: Set Target Resistance Level (unit 0.1)
      const clamped = Math.max(1, Math.min(15, Math.round(level)));
      const buffer = new Uint8Array([0x04, clamped * 10]);
      await this.bikeControlChar.writeValueWithResponse(buffer);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Injection manuelle de métriques (utilisée par le simulateur / mode démo)
   */
  public injectSimulatedMetrics(bike: Partial<BikeMetrics> | null, watchHr: number | null) {
    if (bike) {
      this.latestBikeMetrics = {
        instantSpeedKmh: bike.instantSpeedKmh ?? 25.0,
        instantCadenceRpm: bike.instantCadenceRpm ?? 85,
        instantPowerWatts: bike.instantPowerWatts ?? 150,
        totalDistanceMeters: (this.latestBikeMetrics?.totalDistanceMeters ?? 0) + ((bike.instantSpeedKmh ?? 25) / 3.6),
        totalEnergyKcal: (this.latestBikeMetrics?.totalEnergyKcal ?? 0) + 0.15,
        elapsedTimeSeconds: (this.latestBikeMetrics?.elapsedTimeSeconds ?? 0) + 1,
        resistanceLevel: bike.resistanceLevel ?? 6,
        heartRateBpm: bike.heartRateBpm,
      };
      this.connectionState.bikeConnected = true;
      this.connectionState.bikeDeviceName = 'Domyos EB900 B (Simulation)';
    }

    if (watchHr !== null) {
      this.latestWatchHr = {
        heartRateBpm: watchHr,
        contactDetected: true,
      };
      this.connectionState.watchConnected = true;
      this.connectionState.watchDeviceName = 'Pixel Watch 4 (Simulation)';
    } else if (watchHr === null && this.connectionState.watchDeviceName?.includes('Simulation')) {
      this.latestWatchHr = null;
      this.connectionState.watchConnected = false;
    }

    this.notifyConnectionChanged();
    this.notifyStateChanged();
  }
}

export const bluetoothManager = new BluetoothManager();
