import { useFinanceApi } from '../context/AuthContext';
import { useCompetencia } from '../context/CompetenciaContext';
import type { FinanceiroFluxoMes } from '../api/types';
import { useApiQuery } from './useApiQuery';

export function useFinanceFluxo() {
  const api = useFinanceApi();
  const { competencia } = useCompetencia();
  return useApiQuery<FinanceiroFluxoMes>(() => api.getFinanceiroFluxoMes(competencia), [competencia]);
}
