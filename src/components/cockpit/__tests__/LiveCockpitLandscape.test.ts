import { describe, it, expect } from 'vitest';
import { isFullscreen } from '../../../utils/fullscreen';

describe('Cockpit Landscape & Fullscreen Infrastructure', () => {
  it('should evaluate isFullscreen safely in test environment', () => {
    expect(isFullscreen()).toBe(false);
  });
});
