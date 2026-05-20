type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installed = false;
let initialized = false;
const listeners = new Set<() => void>();

function notify() {
  refreshSnapshot();
  listeners.forEach((listener) => listener());
}

export function isAppInstalled(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/** Registra listeners uma vez por sessão — o evento não dispara de novo ao trocar de rota. */
export function initPwaInstall(): void {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  installed = isAppInstalled();
  refreshSnapshot();

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    notify();
  });

  window.addEventListener('appinstalled', () => {
    installed = true;
    deferredPrompt = null;
    notify();
  });
}

export function subscribePwaInstall(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getInstalled(): boolean {
  return installed || isAppInstalled();
}

export function canOfferAppInstall(): boolean {
  return !getInstalled();
}

export function hasDeferredInstallPrompt(): boolean {
  return deferredPrompt != null;
}

type PwaInstallSnapshot = {
  installed: boolean;
  canOffer: boolean;
  canPrompt: boolean;
};

let cachedSnapshot: PwaInstallSnapshot = {
  installed: false,
  canOffer: true,
  canPrompt: false,
};

function computeSnapshot(): PwaInstallSnapshot {
  const isInstalled = getInstalled();
  return {
    installed: isInstalled,
    canOffer: !isInstalled,
    canPrompt: !isInstalled && deferredPrompt != null,
  };
}

function refreshSnapshot(): PwaInstallSnapshot {
  const next = computeSnapshot();
  if (
    cachedSnapshot.installed === next.installed &&
    cachedSnapshot.canOffer === next.canOffer &&
    cachedSnapshot.canPrompt === next.canPrompt
  ) {
    return cachedSnapshot;
  }
  cachedSnapshot = next;
  return cachedSnapshot;
}

export function getPwaInstallSnapshot(): PwaInstallSnapshot {
  return refreshSnapshot();
}

export async function triggerPwaInstall(): Promise<void> {
  if (!deferredPrompt) return;
  await deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    installed = true;
    deferredPrompt = null;
    notify();
  }
}

initPwaInstall();
