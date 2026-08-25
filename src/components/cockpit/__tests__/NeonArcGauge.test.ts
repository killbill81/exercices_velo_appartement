import { describe, it, expect } from 'vitest';
import { getZoneTheme, getCadenceFeedback } from '../../../types/uiTheme';

describe('UI Theme & Coggan Zone Aesthetics', () => {
  it('should map Coggan zones 1 to 7 correctly to distinct neon visual themes', () => {
    const z1 = getZoneTheme(1);
    expect(z1.code).toBe('Z1');
    expect(z1.color).toBe('#94a3b8');

    const z4 = getZoneTheme(4);
    expect(z4.code).toBe('Z4');
    expect(z4.name).toContain('Seuil');
    expect(z4.color).toBe('#fbbf24');

    const z7 = getZoneTheme(7);
    expect(z7.code).toBe('Z7');
    expect(z7.color).toBe('#c084fc');
  });

  it('should clamp out-of-bounds zone requests safely', () => {
    expect(getZoneTheme(0).code).toBe('Z1');
    expect(getZoneTheme(99).code).toBe('Z7');
  });

  it('should evaluate cadence feedback correctly', () => {
    const idle = getCadenceFeedback(0, 90);
    expect(idle.status).toBe('idle');

    const onTarget = getCadenceFeedback(90, 90);
    expect(onTarget.status).toBe('on-target');

    const slow = getCadenceFeedback(75, 90);
    expect(slow.status).toBe('slow');
    expect(slow.message).toContain('Accélérez');

    const fast = getCadenceFeedback(105, 90);
    expect(fast.status).toBe('fast');
    expect(fast.message).toContain('Ralentissez');
  });
});
