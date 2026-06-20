import { useMemo } from 'react';
import { useFinanceApi } from '../context/AuthContext';
import { useCompetencia } from '../context/CompetenciaContext';
import { mapParcelaToPayable, mapParcelaToReceivable } from '../lib/mappers';
import type { PayableRow, ReceivableRow } from '../types/finance';
import { useApiQuery } from './useApiQuery';

export function useFinanceCatalog() {
  const api = useFinanceApi();
  const { competencia } = useCompetencia();

  const pagarQuery = useApiQuery(() => api.getFinanceiroContasPagar(competencia), [competencia]);
  const receberQuery = useApiQuery(() => api.getFinanceiroContasReceber(competencia), [competencia]);

  const payables: PayableRow[] = useMemo(
    () => (pagarQuery.data?.parcelas ?? []).map(mapParcelaToPayable),
    [pagarQuery.data],
  );

  const receivables: ReceivableRow[] = useMemo(
    () => (receberQuery.data?.parcelas ?? []).map(mapParcelaToReceivable),
    [receberQuery.data],
  );

  const isLoading = pagarQuery.isLoading || receberQuery.isLoading;
  const error = pagarQuery.error ?? receberQuery.error;

  const refetch = async () => {
    await Promise.all([pagarQuery.refetch(), receberQuery.refetch()]);
  };

  return {
    contacts: [],
    payables,
    receivables,
    isLoading,
    error,
    refetch,
  };
}
