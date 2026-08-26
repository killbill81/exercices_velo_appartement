import { CompletedSession, UserProfile } from '../../types/user';

export interface FitbitAuthResult {
  accessToken: string;
  userId: string;
  expiresIn: number;
}

export interface FitbitSyncResult {
  success: boolean;
  activityId?: string;
  error?: string;
}

class FitbitService {
  private readonly DEFAULT_CLIENT_ID = '23PZ6L'; // Client ID standard pour PWA Domyos Trainer ou configurable par l'utilisateur
  private readonly FITBIT_API_URL = 'https://api.fitbit.com/1/user/-/activities.json';

  /**
   * Génère l'URL d'authentification OAuth 2.0 Fitbit (Implicit Grant)
   */
  public getAuthorizationUrl(clientId?: string, redirectUri?: string): string {
    const activeClientId = clientId?.trim() || this.DEFAULT_CLIENT_ID;
    const activeRedirectUri = redirectUri || (typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'https://domyos-velo-trainer.web.app/');
    const scope = encodeURIComponent('activity heartrate profile');
    
    return `https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=${activeClientId}&redirect_uri=${encodeURIComponent(activeRedirectUri)}&scope=${scope}&expires_in=2592000`;
  }

  /**
   * Analyse le fragment de l'URL (#access_token=...&user_id=...) après redirection Fitbit
   */
  public parseAuthCallback(hash: string): FitbitAuthResult | null {
    if (!hash || !hash.includes('access_token')) return null;

    try {
      const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
      const params = new URLSearchParams(cleanHash);
      
      const accessToken = params.get('access_token');
      const userId = params.get('user_id') || '';
      const expiresIn = parseInt(params.get('expires_in') || '2592000', 10);

      if (accessToken) {
        return { accessToken, userId, expiresIn };
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Formate les paramètres d'une séance pour l'API Fitbit
   */
  public formatActivityParams(session: CompletedSession): URLSearchParams {
    const startDate = new Date(session.startedAt);
    
    // Date formatée YYYY-MM-DD
    const dateStr = startDate.toISOString().split('T')[0];
    
    // Heure formatée HH:mm:ss
    const hours = startDate.getHours().toString().padStart(2, '0');
    const minutes = startDate.getMinutes().toString().padStart(2, '0');
    const seconds = startDate.getSeconds().toString().padStart(2, '0');
    const startTimeStr = `${hours}:${minutes}:${seconds}`;

    const params = new URLSearchParams();
    params.append('activityId', '90001'); // 90001 = Indoor Cycling / Vélo d'appartement
    params.append('activityName', session.workoutTitle || 'Vélo d\'appartement');
    params.append('date', dateStr);
    params.append('startTime', startTimeStr);
    params.append('durationMillis', (session.durationSeconds * 1000).toString());
    params.append('distance', (session.totalDistanceKm || 0.01).toFixed(2));
    params.append('distanceUnit', 'Kilometer');
    params.append('manualCalories', Math.round(session.totalCaloriesKcal || 1).toString());

    return params;
  }

  /**
   * Synchronise une séance avec l'API Web Fitbit
   */
  public async syncSession(session: CompletedSession, profile: UserProfile): Promise<FitbitSyncResult> {
    const token = profile.fitbitAccessToken;

    if (!token) {
      return {
        success: false,
        error: 'Compte Fitbit non connecté. Veuillez vous connecter dans les paramètres.',
      };
    }

    try {
      const params = this.formatActivityParams(session);

      const response = await fetch(this.FITBIT_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData?.errors?.[0]?.message || `Erreur API Fitbit (${response.status})`;
        
        // Token expiré ou invalide
        if (response.status === 401) {
          return {
            success: false,
            error: 'Session Fitbit expirée. Veuillez vous reconnecter.',
          };
        }

        return {
          success: false,
          error: errorMessage,
        };
      }

      const data = await response.json();
      const activityId = data?.activityLog?.activityId?.toString() || data?.activityLog?.logId?.toString();

      return {
        success: true,
        activityId,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur réseau lors de la synchronisation';
      return {
        success: false,
        error: message,
      };
    }
  }
}

export const fitbitService = new FitbitService();
