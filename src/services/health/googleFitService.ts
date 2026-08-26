import { CompletedSession, UserProfile } from '../../types/user';

export interface GoogleFitAuthResult {
  accessToken: string;
  expiresIn: number;
  email?: string;
}

export interface GoogleFitSyncResult {
  success: boolean;
  sessionId?: string;
  error?: string;
}

class GoogleFitService {
  // Client ID OAuth Web Google (configurable ou pré-configuré pour domyos-velo-trainer)
  private readonly DEFAULT_CLIENT_ID = '938459203914-domyos-velo-trainer.apps.googleusercontent.com';
  private readonly GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
  private readonly GOOGLE_FIT_SESSIONS_URL = 'https://fitness.googleapis.com/fitness/v1/users/me/sessions';

  /**
   * Génère l'URL d'autorisation Google OAuth 2.0 pour Google Fit (Scopes Fitness)
   */
  public getAuthorizationUrl(clientId?: string, redirectUri?: string): string {
    const activeClientId = clientId?.trim() || this.DEFAULT_CLIENT_ID;
    const activeRedirectUri = redirectUri || (typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'https://domyos-velo-trainer.web.app/');
    
    const scopes = [
      'https://www.googleapis.com/auth/fitness.activity.write',
      'https://www.googleapis.com/auth/fitness.body.write',
      'https://www.googleapis.com/auth/fitness.location.write',
      'https://www.googleapis.com/auth/fitness.heart_rate.write',
      'email',
    ].join(' ');

    const params = new URLSearchParams({
      client_id: activeClientId,
      redirect_uri: activeRedirectUri,
      response_type: 'token',
      scope: scopes,
      include_granted_scopes: 'true',
      prompt: 'select_account',
    });

    return `${this.GOOGLE_AUTH_URL}?${params.toString()}`;
  }

  /**
   * Analyse le fragment de retour Google OAuth (#access_token=...&expires_in=...)
   */
  public parseAuthCallback(hash: string): { accessToken: string; expiresIn: number } | null {
    if (!hash || !hash.includes('access_token')) return null;

    try {
      const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
      const params = new URLSearchParams(cleanHash);
      
      const accessToken = params.get('access_token');
      const expiresIn = parseInt(params.get('expires_in') || '3600', 10);

      // Si le token est de Google (vérification scope fitness ou state)
      if (accessToken && (params.get('scope')?.includes('fitness') || params.get('token_type') === 'Bearer')) {
        return { accessToken, expiresIn };
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Récupère l'email de l'utilisateur Google connecté
   */
  public async fetchUserEmail(accessToken: string): Promise<string | undefined> {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data.email;
      }
    } catch {
      // Ignorer si échec
    }
    return undefined;
  }

  /**
   * Construit le corps de session de cyclisme pour l'API Google Fit
   */
  public formatWorkoutSessionBody(session: CompletedSession) {
    const startTimeMillis = new Date(session.startedAt).getTime();
    const endTimeMillis = session.completedAt ? new Date(session.completedAt).getTime() : startTimeMillis + (session.durationSeconds * 1000);

    return {
      id: session.sessionId,
      name: session.workoutTitle || "Séance Vélo d'appartement",
      description: `Entraînement Domyos EB900 B : ${session.avgPowerWatts}W moy, ${session.totalCaloriesKcal} kcal, ${session.totalDistanceKm.toFixed(2)} km, FC moy ${session.avgHeartRateBpm || '--'} BPM`,
      startTimeMillis,
      endTimeMillis,
      activityType: 1, // 1 = Biking / Cycling dans Google Fit Activity Types
      application: {
        name: 'Domyos Velo Trainer',
        version: '1.0',
      },
    };
  }

  /**
   * Envoie la séance vers Google Fit via l'API REST Google Fitness
   */
  public async syncSession(session: CompletedSession, profile: UserProfile): Promise<GoogleFitSyncResult> {
    const token = profile.googleFitAccessToken;

    if (!token) {
      return {
        success: false,
        error: 'Compte Google Fit non connecté. Veuillez vous connecter dans les paramètres.',
      };
    }

    try {
      const sessionBody = this.formatWorkoutSessionBody(session);
      const url = `${this.GOOGLE_FIT_SESSIONS_URL}/${encodeURIComponent(session.sessionId)}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionBody),
      });

      if (!response.ok) {
        if (response.status === 401) {
          return {
            success: false,
            error: 'Session Google expirée. Veuillez vous reconnecter dans les paramètres.',
          };
        }
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData?.error?.message || `Erreur API Google Fit (${response.status})`;
        return {
          success: false,
          error: errorMessage,
        };
      }

      return {
        success: true,
        sessionId: session.sessionId,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur réseau lors de la synchronisation Google Fit';
      return {
        success: false,
        error: message,
      };
    }
  }
}

export const googleFitService = new GoogleFitService();
