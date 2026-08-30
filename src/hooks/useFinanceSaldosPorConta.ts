import { useFinanceApi } from '../context/AuthContext';
import type { SaldoConta } from '../api/types';
import { useApiQuery } from './useApiQuery';

/** Saldo atual (último fechamento + movimentações) de cada conta financeira. */
export function useFinanceSaldosPorConta() {
  const api = useFinanceApi();
  const query = useApiQuery<SaldoConta[]>(() => api.getFinanceiroSaldosPorConta(), []);

  return {
    contas: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
