import { useMemo } from 'react';
import { useFinanceApi } from '../context/AuthContext';
import { mapMovimentacaoFinanceiraToBankMovement } from '../lib/mappers';
import type { BankMovement } from '../types/finance';
import { useApiQuery } from './useApiQuery';

/** Movimentações financeiras recentes (extrato) — sem saldo bancário na API. */
export function useWallet() {
  const api = useFinanceApi();
  const query = useApiQuery(() => api.getFinanceiroMovimentacoesRecentes(), []);

  const movements: BankMovement[] = useMemo(
    () => (query.data ?? []).map(mapMovimentacaoFinanceiraToBankMovement),
    [query.data],
  );

  return {
    balance: 0,
    movements,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
