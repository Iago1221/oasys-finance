import { useFinanceApi } from '../context/AuthContext';
import { useCompetencia } from '../context/CompetenciaContext';
import type { RecebimentosPagamentosPorContaResponse } from '../api/types';
import { useApiQuery } from './useApiQuery';

/** Recebimentos e pagamentos (movimentações liquidadas) de cada conta financeira, na competência selecionada. */
export function useFinanceRecebimentosPagamentosPorConta() {
  const api = useFinanceApi();
  const { competencia } = useCompetencia();
  const query = useApiQuery<RecebimentosPagamentosPorContaResponse>(
    () => api.getFinanceiroRecebimentosPagamentosPorConta(competencia),
    [competencia],
  );

  return {
    contas: query.data?.contas ?? [],
    periodo: query.data?.periodo,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
