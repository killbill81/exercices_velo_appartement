class SoundPlayer {
  private audioCtx: AudioContext | null = null;
  private isMuted = false;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  /**
   * Joue un bip net avec fréquence et durée personnalisées
   */
  public playTone(frequency: number, durationMs: number, type: OscillatorType = 'sine', volume = 0.3) {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Enveloppe d'attaque et relâchement sans clic
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000 + 0.05);
    } catch (err) {
      console.warn('Audio tone error:', err);
    }
  }

  /**
   * Bip d'avertissement pour les 3 secondes avant changement (3, 2, 1)
   */
  public playCountdownBeep(secondsRemaining: number) {
    if (secondsRemaining > 0 && secondsRemaining <= 3) {
      // 880 Hz (La5) court
      this.playTone(880, 150, 'sine', 0.4);
    }
  }

  /**
   * Tonalité de début de bloc (GO !)
   */
  public playStartBeep() {
    // 1760 Hz (La6) aigu et motivant
    this.playTone(1760, 400, 'triangle', 0.5);
  }

  /**
   * Son de fin d'entraînement (Arpège de victoire)
   */
  public playFinishFanfare() {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // Do, Mi, Sol, Do
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 350, 'triangle', 0.4);
      }, idx * 180);
    });
  }
}

export const soundPlayer = new SoundPlayer();
