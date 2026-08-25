import { BikeMetrics } from '../../types/bluetooth';

/**
 * Décodeur pour le standard Bluetooth FTMS (Fitness Machine Service)
 * Caractéristique: Indoor Bike Data (0x2AD2)
 */
export function decodeIndoorBikeData(dataView: DataView): BikeMetrics {
  let offset = 0;
  
  if (dataView.byteLength < 2) {
    return {
      instantSpeedKmh: 0,
      instantCadenceRpm: 0,
      instantPowerWatts: 0,
      totalDistanceMeters: 0,
      totalEnergyKcal: 0,
      elapsedTimeSeconds: 0,
    };
  }

  // Flags sur 16 bits (2 octets)
  const flags = dataView.getUint16(offset, true); // Little endian
  offset += 2;

  let instantSpeedKmh = 0;
  let averageSpeedKmh: number | undefined;
  let instantCadenceRpm = 0;
  let averageCadenceRpm: number | undefined;
  let totalDistanceMeters = 0;
  let resistanceLevel: number | undefined;
  let instantPowerWatts = 0;
  let averagePowerWatts: number | undefined;
  let totalEnergyKcal = 0;
  let heartRateBpm: number | undefined;
  let elapsedTimeSeconds = 0;

  // Bit 0: Instantaneous Speed (si 0, présent sous forme uint16 en 0.01 km/h)
  const speedPresent = (flags & (1 << 0)) === 0;
  if (speedPresent && offset + 2 <= dataView.byteLength) {
    const rawSpeed = dataView.getUint16(offset, true);
    instantSpeedKmh = rawSpeed * 0.01;
    offset += 2;
  }

  // Bit 1: Average Speed
  const avgSpeedPresent = (flags & (1 << 1)) !== 0;
  if (avgSpeedPresent && offset + 2 <= dataView.byteLength) {
    averageSpeedKmh = dataView.getUint16(offset, true) * 0.01;
    offset += 2;
  }

  // Bit 2: Instantaneous Cadence (uint16, 0.5 RPM)
  const cadencePresent = (flags & (1 << 2)) !== 0;
  if (cadencePresent && offset + 2 <= dataView.byteLength) {
    const rawCadence = dataView.getUint16(offset, true);
    instantCadenceRpm = rawCadence * 0.5;
    offset += 2;
  }

  // Bit 3: Average Cadence
  const avgCadencePresent = (flags & (1 << 3)) !== 0;
  if (avgCadencePresent && offset + 2 <= dataView.byteLength) {
    averageCadenceRpm = dataView.getUint16(offset, true) * 0.5;
    offset += 2;
  }

  // Bit 4: Total Distance (uint24 sur 3 octets, en mètres)
  const distancePresent = (flags & (1 << 4)) !== 0;
  if (distancePresent && offset + 3 <= dataView.byteLength) {
    const b0 = dataView.getUint8(offset);
    const b1 = dataView.getUint8(offset + 1);
    const b2 = dataView.getUint8(offset + 2);
    totalDistanceMeters = b0 | (b1 << 8) | (b2 << 16);
    offset += 3;
  }

  // Bit 5: Resistance Level (sint16)
  const resistancePresent = (flags & (1 << 5)) !== 0;
  if (resistancePresent && offset + 2 <= dataView.byteLength) {
    resistanceLevel = dataView.getInt16(offset, true);
    offset += 2;
  }

  // Bit 6: Instantaneous Power (sint16, en Watts)
  const powerPresent = (flags & (1 << 6)) !== 0;
  if (powerPresent && offset + 2 <= dataView.byteLength) {
    instantPowerWatts = dataView.getInt16(offset, true);
    offset += 2;
  }

  // Bit 7: Average Power (sint16)
  const avgPowerPresent = (flags & (1 << 7)) !== 0;
  if (avgPowerPresent && offset + 2 <= dataView.byteLength) {
    averagePowerWatts = dataView.getInt16(offset, true);
    offset += 2;
  }

  // Bit 8: Expended Energy (total uint16 en kcal, energy/h uint16, energy/min uint8)
  const energyPresent = (flags & (1 << 8)) !== 0;
  if (energyPresent && offset + 2 <= dataView.byteLength) {
    totalEnergyKcal = dataView.getUint16(offset, true);
    offset += 2;
    // Sauter energy per hour (2 octets) et energy per minute (1 octet) si présents
    if (offset + 3 <= dataView.byteLength) {
      offset += 3;
    }
  }

  // Bit 9: Heart Rate (uint8 en BPM)
  const hrPresent = (flags & (1 << 9)) !== 0;
  if (hrPresent && offset + 1 <= dataView.byteLength) {
    heartRateBpm = dataView.getUint8(offset);
    offset += 1;
  }

  // Bit 10: METs (uint8)
  const metsPresent = (flags & (1 << 10)) !== 0;
  if (metsPresent && offset + 1 <= dataView.byteLength) {
    offset += 1;
  }

  // Bit 11: Elapsed Time (uint16 en secondes)
  const elapsedTimePresent = (flags & (1 << 11)) !== 0;
  if (elapsedTimePresent && offset + 2 <= dataView.byteLength) {
    elapsedTimeSeconds = dataView.getUint16(offset, true);
    offset += 2;
  }

  return {
    instantSpeedKmh: Math.max(0, instantSpeedKmh),
    averageSpeedKmh,
    instantCadenceRpm: Math.max(0, instantCadenceRpm),
    averageCadenceRpm,
    instantPowerWatts: Math.max(0, instantPowerWatts),
    averagePowerWatts,
    totalDistanceMeters: Math.max(0, totalDistanceMeters),
    resistanceLevel,
    totalEnergyKcal: Math.max(0, totalEnergyKcal),
    heartRateBpm: heartRateBpm && heartRateBpm > 30 && heartRateBpm < 240 ? heartRateBpm : undefined,
    elapsedTimeSeconds: Math.max(0, elapsedTimeSeconds),
    rawFlags: flags
  };
}
