import { useCallback, useEffect, useState } from 'react';
import type { FinanceAppConfig } from '../api/types';
import { useFinanceApi } from '../context/AuthContext';
import { normalizeFinanceAppConfig } from '../lib/mappers';
import { INTEGRATIONS_CHANGED_EVENT } from '../lib/storageKeys';

function dispatchIntegrationsChanged() {
  window.dispatchEvent(new Event(INTEGRATIONS_CHANGED_EVENT));
}

const DEFAULT_CONFIG: FinanceAppConfig = {
  oasysPay: false,
  logistica: false,
  oasysCrm: false,
};

export function useIntegrations() {
  const api = useFinanceApi();
  const [config, setConfig] = useState<FinanceAppConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const applyConfig = useCallback((raw: unknown) => {
    setConfig(normalizeFinanceAppConfig(raw));
    dispatchIntegrationsChanged();
  }, []);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getConfiguracao();
      applyConfig(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Falha ao carregar configurações'));
    } finally {
      setIsLoading(false);
    }
  }, [api, applyConfig]);

  useEffect(() => {
    void load();
  }, [load]);

  const setIsBankingActive = useCallback(
    async (value: boolean) => {
      const data = await api.setOasysPay(value);
      applyConfig(data);
    },
    [api, applyConfig],
  );

  const setIsLogisticsActive = useCallback(
    async (value: boolean) => {
      const data = await api.setLogistica(value);
      applyConfig(data);
    },
    [api, applyConfig],
  );

  const setIsCRMActive = useCallback(
    async (value: boolean) => {
      const data = await api.setOasysCrm(value);
      applyConfig(data);
    },
    [api, applyConfig],
  );

  return {
    isBankingActive: config.oasysPay,
    isLogisticsActive: config.logistica,
    isCRMActive: config.oasysCrm,
    setIsBankingActive,
    setIsLogisticsActive,
    setIsCRMActive,
    isLoading,
    error,
    refetch: load,
  };
}

export function useIntegrationsReadOnly() {
  const { isBankingActive, isLogisticsActive, isCRMActive } = useIntegrations();
  return { isBankingActive, isLogisticsActive, isCRMActive };
}
