import { useCallback, useEffect, useState } from 'react';
import { INTEGRATIONS_CHANGED_EVENT, STORAGE_KEYS } from '../lib/storageKeys';

function readBanking(): boolean {
  const saved = localStorage.getItem(STORAGE_KEYS.isBankingActive);
  return saved !== null ? JSON.parse(saved) : true;
}

function readLogistics(): boolean {
  const saved = localStorage.getItem(STORAGE_KEYS.isLogisticsActive);
  return saved !== null ? JSON.parse(saved) : false;
}

function readCRM(): boolean {
  const saved = localStorage.getItem(STORAGE_KEYS.isCRMActive);
  return saved !== null ? JSON.parse(saved) : false;
}

function dispatchIntegrationsChanged() {
  window.dispatchEvent(new Event(INTEGRATIONS_CHANGED_EVENT));
}

/**
 * Integrações persistidas (Oasys Pay, Logística, CRM).
 * Troque a implementação interna por chamadas à API mantendo a mesma interface.
 */
export function useIntegrations() {
  const [isBankingActive, setIsBankingActiveState] = useState(readBanking);
  const [isLogisticsActive, setIsLogisticsActiveState] = useState(readLogistics);
  const [isCRMActive, setIsCRMActiveState] = useState(readCRM);

  useEffect(() => {
    const sync = () => {
      setIsBankingActiveState(readBanking());
      setIsLogisticsActiveState(readLogistics());
      setIsCRMActiveState(readCRM());
    };
    window.addEventListener('storage', sync);
    window.addEventListener(INTEGRATIONS_CHANGED_EVENT, sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(INTEGRATIONS_CHANGED_EVENT, sync);
    };
  }, []);

  const setIsBankingActive = useCallback((value: boolean) => {
    setIsBankingActiveState(value);
    localStorage.setItem(STORAGE_KEYS.isBankingActive, JSON.stringify(value));
    dispatchIntegrationsChanged();
  }, []);

  const setIsLogisticsActive = useCallback((value: boolean) => {
    setIsLogisticsActiveState(value);
    localStorage.setItem(STORAGE_KEYS.isLogisticsActive, JSON.stringify(value));
    dispatchIntegrationsChanged();
  }, []);

  const setIsCRMActive = useCallback((value: boolean) => {
    setIsCRMActiveState(value);
    localStorage.setItem(STORAGE_KEYS.isCRMActive, JSON.stringify(value));
    dispatchIntegrationsChanged();
  }, []);

  return {
    isBankingActive,
    isLogisticsActive,
    isCRMActive,
    setIsBankingActive,
    setIsLogisticsActive,
    setIsCRMActive,
  };
}

/** Somente leitura — útil em telas que não alteram integrações */
export function useIntegrationsReadOnly() {
  const { isBankingActive, isLogisticsActive, isCRMActive } = useIntegrations();
  return { isBankingActive, isLogisticsActive, isCRMActive };
}
