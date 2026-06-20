import { useMemo } from 'react';
import { useDepositoContext } from '../context/DepositoContext';
import { useCompetencia } from '../context/CompetenciaContext';
import { useFinanceApi } from '../context/AuthContext';
import {
  mapMovimentacaoEstoqueToSummary,
  mapProdutoSaldoToLowStockAlert,
} from '../lib/mappers';
import type { InventoryMovementSummary, LowStockAlert } from '../types/inventory';
import type { EstoqueEntradasSaidas, EstoqueProdutosSemMovimentacao, EstoqueValorCusto, EstoqueValorVenda } from '../api/types';
import { useApiQuery } from './useApiQuery';

export function useInventoryMonitor() {
  const api = useFinanceApi();
  const { selectedDepositoId } = useDepositoContext();
  const { competencia } = useCompetencia();

  const movQuery = useApiQuery(
    () => {
      if (selectedDepositoId == null) return Promise.resolve([]);
      return api.getEstoqueMovimentacoesRecentes(selectedDepositoId);
    },
    [selectedDepositoId],
  );

  const saldoQuery = useApiQuery(
    () => {
      if (selectedDepositoId == null) return Promise.resolve([]);
      return api.getEstoqueProdutosSaldo(selectedDepositoId);
    },
    [selectedDepositoId],
  );

  const itensQuery = useApiQuery(() => api.getEstoqueItensAtivos(), []);

  const valorCustoQuery = useApiQuery<EstoqueValorCusto>(
    () => api.getEstoqueValorCusto(selectedDepositoId ?? undefined),
    [selectedDepositoId],
  );

  const valorVendaQuery = useApiQuery<EstoqueValorVenda>(
    () => api.getEstoqueValorVenda(selectedDepositoId ?? undefined),
    [selectedDepositoId],
  );

  const semMovimentacaoQuery = useApiQuery<EstoqueProdutosSemMovimentacao>(
    () => {
      if (selectedDepositoId == null) return Promise.resolve({ periodo: { inicio: '', fim: '' }, produtos: [] });
      return api.getEstoqueProdutosSemMovimentacao(selectedDepositoId, competencia);
    },
    [selectedDepositoId, competencia],
  );

  const entradasSaidasQuery = useApiQuery<EstoqueEntradasSaidas>(
    () => {
      if (selectedDepositoId == null) return Promise.resolve({ periodo: { inicio: '', fim: '' }, entradas: 0, saidas: 0 });
      return api.getEstoqueEntradasSaidas(selectedDepositoId, competencia);
    },
    [selectedDepositoId, competencia],
  );

  const recentMovements: InventoryMovementSummary[] = useMemo(
    () => (movQuery.data ?? []).map(mapMovimentacaoEstoqueToSummary),
    [movQuery.data],
  );

  const lowStockAlerts: LowStockAlert[] = useMemo(
    () => (saldoQuery.data ?? []).map((p, i) => mapProdutoSaldoToLowStockAlert(p, i)),
    [saldoQuery.data],
  );

  const activeItemsCount = itensQuery.data?.total ?? 0;

  const isLoading = movQuery.isLoading || saldoQuery.isLoading || itensQuery.isLoading;
  const error = movQuery.error ?? saldoQuery.error ?? itensQuery.error;

  return {
    lowStockAlerts,
    recentMovements,
    activeItemsCount,
    valorCusto: valorCustoQuery.data,
    valorVenda: valorVendaQuery.data,
    produtosSemMovimentacao: semMovimentacaoQuery.data,
    entradasSaidas: entradasSaidasQuery.data,
    valorCustoLoading: valorCustoQuery.isLoading,
    valorVendaLoading: valorVendaQuery.isLoading,
    isLoading,
    error,
    refetch: async () => {
      await Promise.all([movQuery.refetch(), saldoQuery.refetch(), itensQuery.refetch()]);
    },
  };
}
