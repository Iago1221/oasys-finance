import { useMemo } from 'react';
import { useFinanceApi } from '../context/AuthContext';
import { mapParcelaToPendingIssue } from '../lib/mappers';
import type { PendingIssue } from '../types/pending';
import { useApiQuery } from './useApiQuery';

export function usePendingIssuesData(kind: 'pagar' | 'receber') {
  const api = useFinanceApi();

  const query = useApiQuery(
    () => (kind === 'pagar' ? api.getFinanceiroContasPagar() : api.getFinanceiroContasReceber()),
    [kind],
  );

  const data: PendingIssue[] = useMemo(
    () => (query.data?.parcelas ?? []).map((p) => mapParcelaToPendingIssue(p, kind)),
    [query.data, kind],
  );

  return {
    data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
