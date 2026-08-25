import { describe, it, expect } from 'vitest';
import { decodeHeartRateMeasurement } from '../heartRateDecoder';

describe('Heart Rate Measurement Decoder (0x2A37)', () => {
  it('should decode 8-bit Heart Rate from Pixel Watch 4', () => {
    // Flags: Bit 0 = 0 (8-bit heart rate format)
    const buffer = new ArrayBuffer(2);
    const view = new DataView(buffer);

    view.setUint8(0, 0x00); // 8-bit format
    view.setUint8(1, 148);  // 148 BPM

    const result = decodeHeartRateMeasurement(view);
    expect(result.heartRateBpm).toBe(148);
  });

  it('should decode 16-bit Heart Rate when format flag bit 0 is 1', () => {
    const buffer = new ArrayBuffer(3);
    const view = new DataView(buffer);

    view.setUint8(0, 0x01); // 16-bit format (bit 0 = 1)
    view.setUint16(1, 165, true); // 165 BPM

    const result = decodeHeartRateMeasurement(view);
    expect(result.heartRateBpm).toBe(165);
  });
});
