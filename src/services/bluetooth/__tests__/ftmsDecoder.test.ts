import { describe, it, expect } from 'vitest';
import { decodeIndoorBikeData } from '../ftmsDecoder';

describe('FTMS Indoor Bike Data Decoder (0x2AD2)', () => {
  it('should return default values when buffer is empty or short', () => {
    const buffer = new ArrayBuffer(1);
    const view = new DataView(buffer);
    const result = decodeIndoorBikeData(view);
    expect(result.instantPowerWatts).toBe(0);
    expect(result.instantCadenceRpm).toBe(0);
  });

  it('should decode speed, cadence, and power correctly from raw FTMS binary payload', () => {
    // Flags:
    // Bit 0 = 0 (Instant speed present)
    // Bit 2 = 1 (Instant cadence present) -> 0x04
    // Bit 6 = 1 (Instant power present) -> 0x40
    // Total Flags = 0x0044 = 68
    const buffer = new ArrayBuffer(10);
    const view = new DataView(buffer);

    view.setUint16(0, 0x0044, true); // Flags (Speed + Cadence + Power)
    view.setUint16(2, 2550, true);   // Speed: 25.50 km/h (resolution 0.01)
    view.setUint16(4, 180, true);    // Cadence: 90 RPM (resolution 0.5)
    view.setInt16(6, 210, true);     // Power: 210 Watts (sint16)

    const result = decodeIndoorBikeData(view);

    expect(result.instantSpeedKmh).toBeCloseTo(25.50);
    expect(result.instantCadenceRpm).toBe(90);
    expect(result.instantPowerWatts).toBe(210);
  });

  it('should decode heart rate from bike handlebar sensors if present in FTMS frame', () => {
    // Flags: Bit 9 = 1 (0x0200) Heart rate present
    const buffer = new ArrayBuffer(10);
    const view = new DataView(buffer);

    // Flags: Speed present (bit 0=0) + Heart rate present (bit 9=1 -> 0x0200)
    view.setUint16(0, 0x0200, true);
    view.setUint16(2, 2000, true); // Speed: 20 km/h
    view.setUint8(4, 142);         // Heart rate: 142 BPM

    const result = decodeIndoorBikeData(view);
    expect(result.instantSpeedKmh).toBe(20);
    expect(result.heartRateBpm).toBe(142);
  });
});
