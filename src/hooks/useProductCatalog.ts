import { useMemo, useState } from 'react';
import { useDepositoContext } from '../context/DepositoContext';
import { useFinanceApi } from '../context/AuthContext';
import { mapProdutoSaldoToProductRow } from '../lib/mappers';
import type { ProductRow } from '../types/inventory';
import { useApiQuery } from './useApiQuery';

export function useProductCatalog() {
  const api = useFinanceApi();
  const { selectedDepositoId } = useDepositoContext();
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [products, searchTerm]);

  return {
    products,
    filteredProducts,
    searchTerm,
    setSearchTerm,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
