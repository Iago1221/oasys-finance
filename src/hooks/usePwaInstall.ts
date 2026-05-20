import { useSyncExternalStore } from 'react';
import {
  getPwaInstallSnapshot,
  initPwaInstall,
  subscribePwaInstall,
  triggerPwaInstall,
} from '../lib/pwaInstall';

const getSnapshot = getPwaInstallSnapshot;

export function usePwaInstall() {
  initPwaInstall();

  const { installed, canOffer, canPrompt } = useSyncExternalStore(
    subscribePwaInstall,
    getSnapshot,
    () => ({ installed: false, canOffer: true, canPrompt: false }),
  );

  return {
    installed,
    canOffer,
    canPrompt,
    install: triggerPwaInstall,
  };
}
