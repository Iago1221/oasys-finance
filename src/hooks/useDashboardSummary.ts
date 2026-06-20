import { useFinanceApi } from '../context/AuthContext';
import { useCompetencia } from '../context/CompetenciaContext';
import type { ContasPagarResponse, ContasReceberResponse, FinanceiroFluxoMes, VendaResumo } from '../api/types';
import { useApiQuery } from './useApiQuery';

export function useDashboardSummary() {
  const api = useFinanceApi();
  const { competencia } = useCompetencia();

  const vendaQuery = useApiQuery<VendaResumo>(() => api.getVendaResumo(competencia), [competencia]);
  const fluxoQuery = useApiQuery<FinanceiroFluxoMes>(() => api.getFinanceiroFluxoMes(competencia), [competencia]);
  const pagarQuery = useApiQuery<ContasPagarResponse>(() => api.getFinanceiroContasPagar(competencia), [competencia]);
  const receberQuery = useApiQuery<ContasReceberResponse>(() => api.getFinanceiroContasReceber(competencia), [competencia]);

  return {
    resumo: vendaQuery.data,
    fluxo: fluxoQuery.data,
    contasPagar: pagarQuery.data,
    contasReceber: receberQuery.data,
    isLoading: vendaQuery.isLoading || fluxoQuery.isLoading || pagarQuery.isLoading || receberQuery.isLoading,
    error: vendaQuery.error ?? fluxoQuery.error ?? pagarQuery.error ?? receberQuery.error,
    refetch: async () => {
      await Promise.all([vendaQuery.refetch(), fluxoQuery.refetch(), pagarQuery.refetch(), receberQuery.refetch()]);
    },
  };
}
