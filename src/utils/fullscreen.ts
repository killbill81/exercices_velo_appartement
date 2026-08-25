/**
 * Utilitaire de gestion du mode Plein Écran (Fullscreen API)
 * Compatible navigateurs Web modernes (Chrome Android, Desktop, Safari, Edge)
 */

export function isFullscreen(): boolean {
  if (typeof document === 'undefined') return false;
  return !!(
    document.fullscreenElement ||
    (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
    (document as unknown as { mozFullScreenElement?: Element }).mozFullScreenElement ||
    (document as unknown as { msFullscreenElement?: Element }).msFullscreenElement
  );
}

export async function requestFullscreen(element?: HTMLElement): Promise<boolean> {
  if (typeof document === 'undefined') return false;
  const target = element || document.documentElement;
  try {
    if (target.requestFullscreen) {
      await target.requestFullscreen();
      return true;
    }
    const elemWithPrefix = target as unknown as {
      webkitRequestFullscreen?: () => Promise<void>;
      mozRequestFullScreen?: () => Promise<void>;
      msRequestFullscreen?: () => Promise<void>;
    };
    if (elemWithPrefix.webkitRequestFullscreen) {
      await elemWithPrefix.webkitRequestFullscreen();
      return true;
    }
    if (elemWithPrefix.mozRequestFullScreen) {
      await elemWithPrefix.mozRequestFullScreen();
      return true;
    }
    if (elemWithPrefix.msRequestFullscreen) {
      await elemWithPrefix.msRequestFullscreen();
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Erreur lors du passage en plein écran:', err);
    return false;
  }
}

export async function exitFullscreen(): Promise<boolean> {
  if (typeof document === 'undefined') return false;
  try {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
      return true;
    }
    const docWithPrefix = document as unknown as {
      webkitExitFullscreen?: () => Promise<void>;
      mozCancelFullScreen?: () => Promise<void>;
      msExitFullscreen?: () => Promise<void>;
    };
    if (docWithPrefix.webkitExitFullscreen) {
      await docWithPrefix.webkitExitFullscreen();
      return true;
    }
    if (docWithPrefix.mozCancelFullScreen) {
      await docWithPrefix.mozCancelFullScreen();
      return true;
    }
    if (docWithPrefix.msExitFullscreen) {
      await docWithPrefix.msExitFullscreen();
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Erreur lors de la sortie du plein écran:', err);
    return false;
  }
}

export async function toggleFullscreen(element?: HTMLElement): Promise<boolean> {
  if (isFullscreen()) {
    await exitFullscreen();
    return false;
  } else {
    await requestFullscreen(element);
    return true;
  }
}

export function subscribeFullscreenChange(callback: (fullscreen: boolean) => void): () => void {
  if (typeof document === 'undefined') return () => {};

  const handler = () => {
    callback(isFullscreen());
  };
  document.addEventListener('fullscreenchange', handler);
  document.addEventListener('webkitfullscreenchange', handler);
  document.addEventListener('mozfullscreenchange', handler);
  document.addEventListener('MSFullscreenChange', handler);

  return () => {
    document.removeEventListener('fullscreenchange', handler);
    document.removeEventListener('webkitfullscreenchange', handler);
    document.removeEventListener('mozfullscreenchange', handler);
    document.removeEventListener('MSFullscreenChange', handler);
  };
}
