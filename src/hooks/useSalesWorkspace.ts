import { useMemo } from 'react';
import { useFinanceApi } from '../context/AuthContext';
import type { VendaFiscal, VendaResumo } from '../api/types';
import { mapPedidoRecenteToPreview } from '../lib/mappers';
import type { SalesOrderPreview } from '../types/sales';
import { useApiQuery } from './useApiQuery';

export const SALES_TABS = ['Painel'] as const;

export function useSalesWorkspace() {
  const api = useFinanceApi();

  const resumoQuery = useApiQuery<VendaResumo>(() => api.getVendaResumo(), []);
  const fiscalQuery = useApiQuery<VendaFiscal>(() => api.getVendaFiscal(), []);
  const pedidosQuery = useApiQuery(() => api.getVendaPedidosRecentes(), []);

  const highValueOrders: SalesOrderPreview[] = useMemo(
    () => (pedidosQuery.data ?? []).map(mapPedidoRecenteToPreview),
    [pedidosQuery.data],
  );

  const isLoading = resumoQuery.isLoading || fiscalQuery.isLoading || pedidosQuery.isLoading;
  const error = resumoQuery.error ?? fiscalQuery.error ?? pedidosQuery.error;

  const refetch = async () => {
    await Promise.all([resumoQuery.refetch(), fiscalQuery.refetch(), pedidosQuery.refetch()]);
  };

  return {
    resumo: resumoQuery.data,
    fiscal: fiscalQuery.data,
    highValueOrders,
    isLoading,
    error,
    refetch,
  };
}
