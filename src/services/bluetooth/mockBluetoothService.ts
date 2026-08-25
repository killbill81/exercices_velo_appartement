import { bluetoothManager } from './bluetoothManager';

class MockBluetoothService {
  private timer: ReturnType<typeof setInterval> | null = null;
  private isSimulating = false;
  private currentWatts = 140;
  private targetWatts = 150;
  private currentRpm = 85;
  private targetRpm = 85;
  private currentHr = 135;
  private useWatchHr = true;

  public isRunning(): boolean {
    return this.isSimulating;
  }

  public setTargets(watts: number, rpm?: number) {
    this.targetWatts = watts;
    if (rpm) this.targetRpm = rpm;
  }

  public toggleWatchConnection(enabled: boolean) {
    this.useWatchHr = enabled;
  }

  public startSimulation() {
    if (this.isSimulating) return;
    this.isSimulating = true;

    this.timer = setInterval(() => {
      // Légère fluctuation naturelle (bruit)
      const noiseW = (Math.random() - 0.5) * 6;
      const noiseRpm = (Math.random() - 0.5) * 4;
      const noiseHr = (Math.random() - 0.5) * 2;

      // Convergence douce vers les cibles
      this.currentWatts += (this.targetWatts - this.currentWatts) * 0.15 + noiseW;
      this.currentRpm += (this.targetRpm - this.currentRpm) * 0.15 + noiseRpm;
      
      // Calcul FC corrélé aux Watts
      const idealHr = 90 + (this.currentWatts / 250) * 80;
      this.currentHr += (idealHr - this.currentHr) * 0.05 + noiseHr;

      const speed = Math.max(10, Math.sqrt(Math.max(10, this.currentWatts)) * 2.2);

      bluetoothManager.injectSimulatedMetrics(
        {
          instantPowerWatts: Math.round(Math.max(0, this.currentWatts)),
          instantCadenceRpm: Math.round(Math.max(0, this.currentRpm)),
          instantSpeedKmh: Number(speed.toFixed(1)),
          resistanceLevel: Math.min(15, Math.max(1, Math.round(this.currentWatts / 20))),
          heartRateBpm: !this.useWatchHr ? Math.round(this.currentHr) : undefined,
        },
        this.useWatchHr ? Math.round(this.currentHr) : null
      );
    }, 1000);
  }

  public stopSimulation() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isSimulating = false;
  }
}

export const mockBluetoothService = new MockBluetoothService();
