import { useCallback, useMemo, useState } from 'react';
import { MOCK_PRODUCTS } from '../data/mock/inventory';
import type { ProductRow } from '../types/inventory';

/** Catálogo de produtos para consulta / busca local. */
export function useProductCatalog() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [products, setProducts] = useState<ProductRow[]>(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    const q = searchTerm.toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [products, searchTerm]);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // const list = await api.inventory.products()
      setProducts(MOCK_PRODUCTS);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Falha ao carregar produtos'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    products,
    filteredProducts,
    searchTerm,
    setSearchTerm,
    setProducts,
    isLoading,
    error,
    refetch,
  };
}
