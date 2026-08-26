import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fitbitService } from '../fitbitService';
import { CompletedSession, UserProfile } from '../../../types/user';
import { DEFAULT_USER_PROFILE } from '../../storage/historyService';

describe('fitbitService', () => {
  const mockSession: CompletedSession = {
    sessionId: 'test-session-123',
    workoutId: 'workout-1',
    workoutTitle: 'Intervalles Puissance',
    category: 'Cardio',
    startedAt: '2026-08-26T10:00:00.000Z',
    completedAt: '2026-08-26T10:30:00.000Z',
    durationSeconds: 1800,
    avgPowerWatts: 160,
    maxPowerWatts: 220,
    avgCadenceRpm: 85,
    maxCadenceRpm: 105,
    avgHeartRateBpm: 145,
    maxHeartRateBpm: 172,
    avgSpeedKmh: 28.5,
    maxSpeedKmh: 36.2,
    totalDistanceKm: 14.25,
    totalCaloriesKcal: 380,
    normalizedPowerWatts: 165,
    intensityFactor: 1.1,
    trainingStressScore: 42,
    timeInPowerZonesSeconds: [300, 600, 600, 300, 0, 0, 0],
    timeInHeartRateZonesSeconds: [100, 300, 800, 600, 0],
    samples: [],
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should generate valid OAuth authorization URL', () => {
    const url = fitbitService.getAuthorizationUrl('MY_CLIENT_ID', 'https://example.com/callback');
    expect(url).toContain('https://www.fitbit.com/oauth2/authorize');
    expect(url).toContain('client_id=MY_CLIENT_ID');
    expect(url).toContain('response_type=token');
    expect(url).toContain('redirect_uri=https%3A%2F%2Fexample.com%2Fcallback');
  });

  it('should parse access token from URL hash callback correctly', () => {
    const hash = '#access_token=mock_fitbit_token_123&user_id=FITBIT_USER_456&scope=activity+heartrate&expires_in=2592000';
    const result = fitbitService.parseAuthCallback(hash);

    expect(result).not.toBeNull();
    expect(result?.accessToken).toBe('mock_fitbit_token_123');
    expect(result?.userId).toBe('FITBIT_USER_456');
    expect(result?.expiresIn).toBe(2592000);
  });

  it('should return null when parsing invalid hash', () => {
    expect(fitbitService.parseAuthCallback('')).toBeNull();
    expect(fitbitService.parseAuthCallback('#error=access_denied')).toBeNull();
  });

  it('should format activity parameters matching Fitbit API specifications', () => {
    const params = fitbitService.formatActivityParams(mockSession);

    expect(params.get('activityId')).toBe('90001');
    expect(params.get('activityName')).toBe('Intervalles Puissance');
    expect(params.get('durationMillis')).toBe('1800000');
    expect(params.get('distance')).toBe('14.25');
    expect(params.get('distanceUnit')).toBe('Kilometer');
    expect(params.get('manualCalories')).toBe('380');
  });

  it('should return error if Fitbit account is not connected', async () => {
    const profileWithoutToken: UserProfile = {
      ...DEFAULT_USER_PROFILE,
      fitbitAccessToken: undefined,
    };

    const result = await fitbitService.syncSession(mockSession, profileWithoutToken);
    expect(result.success).toBe(false);
    expect(result.error).toContain('non connecté');
  });

  it('should successfully post activity when token is present', async () => {
    const profileWithToken: UserProfile = {
      ...DEFAULT_USER_PROFILE,
      fitbitAccessToken: 'valid_mock_token',
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        activityLog: {
          activityId: 99887766,
        },
      }),
    });

    global.fetch = mockFetch;

    const result = await fitbitService.syncSession(mockSession, profileWithToken);
    expect(result.success).toBe(true);
    expect(result.activityId).toBe('99887766');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
