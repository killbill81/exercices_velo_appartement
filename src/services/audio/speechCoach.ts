class SpeechCoach {
  private enabled = true;
  private frenchVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => this.initVoices();
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    this.frenchVoice = voices.find(v => v.lang.startsWith('fr')) || null;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public speak(text: string, priority = false) {
    if (!this.enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      if (priority) {
        window.speechSynthesis.cancel();
      }
      const utterance = new SpeechSynthesisUtterance(text);
      if (this.frenchVoice) {
        utterance.voice = this.frenchVoice;
      }
      utterance.lang = 'fr-FR';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech coach error:', e);
    }
  }

  public announceStep(stepName: string, targetWatts: number, durationSeconds: number) {
    const min = Math.floor(durationSeconds / 60);
    const sec = durationSeconds % 60;
    let durationText = '';
    if (min > 0) durationText += `${min} minute${min > 1 ? 's' : ''} `;
    if (sec > 0) durationText += `${sec} seconde${sec > 1 ? 's' : ''}`;

    const text = `${stepName}, ${targetWatts} Watts, ${durationText.trim()}.`;
    this.speak(text, true);
  }

  public announceHalfway() {
    this.speak('À mi-parcours, tenez bon !', false);
  }

  public announceFinish() {
    this.speak('Séance terminée ! Excellent travail !', true);
  }
}

export const speechCoach = new SpeechCoach();
