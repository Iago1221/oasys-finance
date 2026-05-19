import { useMemo } from 'react';
import { useDepositoContext } from '../context/DepositoContext';
import { useFinanceApi } from '../context/AuthContext';
import { mapProdutoSaldoToProductRow } from '../lib/mappers';
import type { ProductRow } from '../types/inventory';
import { useApiQuery } from './useApiQuery';

export function useProductCatalog() {
  const api = useFinanceApi();
  const { selectedDepositoId } = useDepositoContext();

  const query = useApiQuery(
    () => {
      if (selectedDepositoId == null) {
        return Promise.resolve([]);
      }
      return api.getEstoqueProdutosSaldo(selectedDepositoId);
    },
    [selectedDepositoId],
  );

  const products: ProductRow[] = useMemo(
    () => (query.data ?? []).map((p, i) => mapProdutoSaldoToProductRow(p, i)),
    [query.data],
  );

  return {
    products,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
