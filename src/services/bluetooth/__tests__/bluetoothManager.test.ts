import { describe, it, expect } from 'vitest';
import { bluetoothManager } from '../bluetoothManager';

describe('BluetoothManager & FTMS Control Point', () => {
  it('should initialize with auto-control enabled by default', () => {
    const conn = bluetoothManager.getConnectionState();
    expect(conn.autoControlEnabled).toBe(true);
  });

  it('should allow toggling auto-control state', () => {
    bluetoothManager.setAutoControlEnabled(false);
    expect(bluetoothManager.getConnectionState().autoControlEnabled).toBe(false);

    bluetoothManager.setAutoControlEnabled(true);
    expect(bluetoothManager.getConnectionState().autoControlEnabled).toBe(true);
  });

  it('should report unified state correctly with simulated metrics', () => {
    bluetoothManager.injectSimulatedMetrics(
      {
        instantPowerWatts: 175,
        instantCadenceRpm: 88,
        instantSpeedKmh: 28.4,
        resistanceLevel: 8,
        heartRateBpm: 140,
      },
      142 // Watch HR priority
    );

    const state = bluetoothManager.getUnifiedState();
    expect(state.powerWatts).toBe(175);
    expect(state.cadenceRpm).toBe(88);
    expect(state.resistanceLevel).toBe(8);
    expect(state.heartRateBpm).toBe(142); // Priorité à la montre
    expect(state.heartRateSource).toBe('watch');
    expect(state.isAutoControlActive).toBe(true);
  });
});
