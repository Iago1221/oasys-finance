import { useMemo } from 'react';
import { useDepositoContext } from '../context/DepositoContext';
import { useFinanceApi } from '../context/AuthContext';
import { mapMovimentacaoEstoqueToDetail } from '../lib/mappers';
import type { InventoryMovementDetail } from '../types/inventory';
import { useApiQuery } from './useApiQuery';

export function useStockMovements() {
  const api = useFinanceApi();
  const { selectedDepositoId } = useDepositoContext();

  const query = useApiQuery(
    () => {
      if (selectedDepositoId == null) {
        return Promise.resolve([]);
      }
      return api.getEstoqueMovimentacoesRecentes(selectedDepositoId);
    },
    [selectedDepositoId],
  );

  const movements: InventoryMovementDetail[] = useMemo(
    () => (query.data ?? []).map(mapMovimentacaoEstoqueToDetail),
    [query.data],
  );

  return {
    movements,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
