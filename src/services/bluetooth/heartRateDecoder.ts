import { HeartRateData } from '../../types/bluetooth';

/**
 * Décodeur standard Bluetooth Heart Rate Service (0x180D)
 * Caractéristique : Heart Rate Measurement (0x2A37)
 * Utilisé pour la montre Google Pixel Watch 4 et les ceintures cardio BLE.
 */
export function decodeHeartRateMeasurement(dataView: DataView): HeartRateData {
  if (dataView.byteLength < 2) {
    return { heartRateBpm: 0 };
  }

  let offset = 0;
  const flags = dataView.getUint8(offset);
  offset += 1;

  // Bit 0 : Format de la fréquence cardiaque (0 = UINT8, 1 = UINT16)
  const is16BitHeartRate = (flags & 0x01) !== 0;
  let heartRateBpm = 0;

  if (is16BitHeartRate) {
    if (offset + 2 <= dataView.byteLength) {
      heartRateBpm = dataView.getUint16(offset, true); // Little endian
      offset += 2;
    }
  } else {
    if (offset + 1 <= dataView.byteLength) {
      heartRateBpm = dataView.getUint8(offset);
      offset += 1;
    }
  }

  // Bits 1-2 : Statut de contact du capteur
  // Bit 1 = Support de détection, Bit 2 = Contact détecté
  const contactSupported = (flags & 0x04) !== 0;
  const contactDetected = contactSupported ? (flags & 0x02) !== 0 : true;

  // Bit 3 : Dépense énergétique présente (UINT16 en kJ)
  const energyPresent = (flags & 0x08) !== 0;
  let energyExpendedKcal: number | undefined;
  if (energyPresent && offset + 2 <= dataView.byteLength) {
    const energyKJ = dataView.getUint16(offset, true);
    energyExpendedKcal = Math.round(energyKJ * 0.239006);
    offset += 2;
  }

  // Bit 4 : Intervalles RR présents (UINT16 en 1/1024 secondes)
  const rrPresent = (flags & 0x10) !== 0;
  const rrIntervalsMs: number[] = [];
  if (rrPresent) {
    while (offset + 2 <= dataView.byteLength) {
      const rawRR = dataView.getUint16(offset, true);
      const rrMs = Math.round((rawRR / 1024) * 1000);
      rrIntervalsMs.push(rrMs);
      offset += 2;
    }
  }

  return {
    heartRateBpm: Math.max(0, heartRateBpm),
    contactDetected,
    energyExpendedKcal,
    rrIntervalsMs: rrIntervalsMs.length > 0 ? rrIntervalsMs : undefined,
  };
}
