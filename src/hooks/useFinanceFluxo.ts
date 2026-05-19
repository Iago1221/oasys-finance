import { useFinanceApi } from '../context/AuthContext';
import type { FinanceiroFluxoMes } from '../api/types';
import { useApiQuery } from './useApiQuery';

export function useFinanceFluxo() {
  const api = useFinanceApi();
  return useApiQuery<FinanceiroFluxoMes>(() => api.getFinanceiroFluxoMes(), []);
}
