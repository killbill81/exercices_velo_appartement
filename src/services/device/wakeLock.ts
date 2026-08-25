class ScreenWakeLockService {
  private wakeLock: WakeLockSentinel | null = null;
  private isRequested = false;

  public async requestWakeLock(): Promise<boolean> {
    this.isRequested = true;
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
      console.warn('Screen Wake Lock API non supportée');
      return false;
    }

    try {
      this.wakeLock = await navigator.wakeLock.request('screen');
      
      this.wakeLock.addEventListener('release', () => {
        this.wakeLock = null;
      });

      // Réactivation automatique si l'utilisateur revient sur l'onglet
      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
      }
      return true;
    } catch (err) {
      console.warn('Impossible de verrouiller la mise en veille:', err);
      return false;
    }
  }

  public releaseWakeLock() {
    this.isRequested = false;
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
    if (this.wakeLock) {
      this.wakeLock.release().catch(() => {});
      this.wakeLock = null;
    }
  }

  private handleVisibilityChange = async () => {
    if (typeof document !== 'undefined' && this.isRequested && document.visibilityState === 'visible' && !this.wakeLock) {
      await this.requestWakeLock();
    }
  };
}

export const screenWakeLockService = new ScreenWakeLockService();
