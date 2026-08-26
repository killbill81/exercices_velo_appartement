import { describe, it, expect, vi, beforeEach } from 'vitest';
import { googleFitService } from '../googleFitService';
import { CompletedSession, UserProfile } from '../../../types/user';
import { DEFAULT_USER_PROFILE } from '../../storage/historyService';

describe('googleFitService', () => {
  const mockSession: CompletedSession = {
    sessionId: 'domyos-session-789',
    workoutId: 'workout-fatburn',
    workoutTitle: 'Brûleur de Graisse 45min',
    category: 'Endurance',
    startedAt: '2026-08-26T14:00:00.000Z',
    completedAt: '2026-08-26T14:45:00.000Z',
    durationSeconds: 2700,
    avgPowerWatts: 140,
    maxPowerWatts: 195,
    avgCadenceRpm: 82,
    maxCadenceRpm: 98,
    avgHeartRateBpm: 135,
    maxHeartRateBpm: 160,
    avgSpeedKmh: 26.2,
    maxSpeedKmh: 33.0,
    totalDistanceKm: 19.65,
    totalCaloriesKcal: 490,
    normalizedPowerWatts: 145,
    intensityFactor: 0.95,
    trainingStressScore: 55,
    timeInPowerZonesSeconds: [600, 1500, 600, 0, 0, 0, 0],
    timeInHeartRateZonesSeconds: [300, 1200, 1200, 0, 0],
    samples: [],
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should generate a valid Google OAuth authorization URL with fitness scopes', () => {
    const url = googleFitService.getAuthorizationUrl('TEST_CLIENT_ID', 'https://domyos-velo-trainer.web.app/');
    expect(url).toContain('https://accounts.google.com/o/oauth2/v2/auth');
    expect(url).toContain('client_id=TEST_CLIENT_ID');
    expect(url).toContain('response_type=token');
    expect(url).toContain('https%3A%2F%2Fwww.googleapis.com%2Fauth%2Ffitness.activity.write');
  });

  it('should parse access token from URL hash callback correctly', () => {
    const hash = '#access_token=google_mock_token_123&token_type=Bearer&expires_in=3600&scope=https://www.googleapis.com/auth/fitness.activity.write';
    const result = googleFitService.parseAuthCallback(hash);

    expect(result).not.toBeNull();
    expect(result?.accessToken).toBe('google_mock_token_123');
    expect(result?.expiresIn).toBe(3600);
  });

  it('should format workout session body matching Google Fitness API specifications', () => {
    const body = googleFitService.formatWorkoutSessionBody(mockSession);

    expect(body.id).toBe('domyos-session-789');
    expect(body.name).toBe('Brûleur de Graisse 45min');
    expect(body.activityType).toBe(1); // 1 = Biking in Google Fit
    expect(body.startTimeMillis).toBe(new Date('2026-08-26T14:00:00.000Z').getTime());
    expect(body.endTimeMillis).toBe(new Date('2026-08-26T14:45:00.000Z').getTime());
    expect(body.application.name).toBe('Domyos Velo Trainer');
  });

  it('should fail gracefully if no token is available', async () => {
    const profileWithoutToken: UserProfile = {
      ...DEFAULT_USER_PROFILE,
      googleFitAccessToken: undefined,
    };

    const result = await googleFitService.syncSession(mockSession, profileWithoutToken);
    expect(result.success).toBe(false);
    expect(result.error).toContain('non connecté');
  });

  it('should successfully call Google Fitness API when authenticated', async () => {
    const profileWithToken: UserProfile = {
      ...DEFAULT_USER_PROFILE,
      googleFitAccessToken: 'mock_google_valid_token',
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'domyos-session-789',
      }),
    });

    global.fetch = mockFetch;

    const result = await googleFitService.syncSession(mockSession, profileWithToken);
    expect(result.success).toBe(true);
    expect(result.sessionId).toBe('domyos-session-789');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
