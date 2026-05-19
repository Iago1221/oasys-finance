import { useFinanceApi } from '../context/AuthContext';
import type { FinanceiroFluxoMes, VendaResumo } from '../api/types';
import { useApiQuery } from './useApiQuery';

export function useDashboardSummary() {
  const api = useFinanceApi();

  const vendaQuery = useApiQuery<VendaResumo>(() => api.getVendaResumo(), []);
  const fluxoQuery = useApiQuery<FinanceiroFluxoMes>(() => api.getFinanceiroFluxoMes(), []);

  return {
    resumo: vendaQuery.data,
    fluxo: fluxoQuery.data,
    isLoading: vendaQuery.isLoading || fluxoQuery.isLoading,
    error: vendaQuery.error ?? fluxoQuery.error,
    refetch: async () => {
      await Promise.all([vendaQuery.refetch(), fluxoQuery.refetch()]);
    },
  };
}
