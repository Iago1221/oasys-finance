import { useState, useMemo } from 'react';
import { useFinanceApi } from '../context/AuthContext';
import { useCompetencia } from '../context/CompetenciaContext';
import type { VendaDetalhada, VendaFiscal, VendaRankingProdutos, VendasPorCategoria, VendaResumo, Vendedor } from '../api/types';
import { mapPedidoRecenteToPreview } from '../lib/mappers';
import type { SalesOrderPreview } from '../types/sales';
import { useApiQuery } from './useApiQuery';

export const SALES_TABS = ['Painel'] as const;

export function useSalesWorkspace() {
  const api = useFinanceApi();
  const { competencia } = useCompetencia();
  const [vendedorId, setVendedorId] = useState<number | undefined>(undefined);

  const resumoQuery = useApiQuery<VendaResumo>(() => api.getVendaResumo(competencia), [competencia]);
  const fiscalQuery = useApiQuery<VendaFiscal>(() => api.getVendaFiscal(competencia), [competencia]);
  const vendasQuery = useApiQuery<VendaDetalhada>(() => api.getVendas(competencia, vendedorId), [competencia, vendedorId]);
  const rankingQuery = useApiQuery<VendaRankingProdutos>(() => api.getVendaRankingProdutos(competencia, vendedorId), [competencia, vendedorId]);
  const categoriaQuery = useApiQuery<VendasPorCategoria>(() => api.getVendaVendasPorCategoria(competencia, vendedorId), [competencia, vendedorId]);
  const vendedoresQuery = useApiQuery<Vendedor[]>(() => api.getVendaVendedores(), []);
  const pedidosQuery = useApiQuery(() => api.getVendaPedidosRecentes(), []);

  const highValueOrders: SalesOrderPreview[] = useMemo(
    () => (pedidosQuery.data ?? []).map(mapPedidoRecenteToPreview),
    [pedidosQuery.data],
  );

  const isLoading = resumoQuery.isLoading || fiscalQuery.isLoading || vendasQuery.isLoading;
  const error = resumoQuery.error ?? fiscalQuery.error ?? vendasQuery.error ?? rankingQuery.error ?? categoriaQuery.error;

  return {
    resumo: resumoQuery.data,
    fiscal: fiscalQuery.data,
    vendas: vendasQuery.data,
    ranking: rankingQuery.data,
    categorias: categoriaQuery.data,
    vendedores: vendedoresQuery.data ?? [],
    vendedorId,
    setVendedorId,
    highValueOrders,
    isLoading,
    rankingLoading: rankingQuery.isLoading,
    categoriaLoading: categoriaQuery.isLoading,
    error,
  };
}
