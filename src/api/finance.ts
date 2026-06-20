import { FinanceApiClient } from './FinanceApiClient';
import type {
  ContasPagarResponse,
  ContasReceberResponse,
  Deposito,
  EstoqueEntradasSaidas,
  EstoqueProdutosSemMovimentacao,
  EstoqueValorCusto,
  EstoqueValorVenda,
  FinanceAppConfig,
  FinanceiroFluxoMes,
  ItensAtivosTotal,
  MovimentacaoEstoque,
  MovimentacaoFinanceira,
  PedidoRecente,
  ProdutoSaldo,
  VendaDetalhada,
  VendaFiscal,
  VendaRankingProdutos,
  VendasPorCategoria,
  VendaResumo,
  Vendedor,
} from './types';

export function createFinanceApi(
  token: string,
  baseUrl: string,
  onUnauthorized?: () => void,
) {
  const client = new FinanceApiClient({ baseUrl, token, onUnauthorized });

  return {
    // --- Venda ---
    getVendaResumo: (competencia?: string) =>
      client.get<VendaResumo>('vendaResumo', competencia ? { competencia } : undefined),
    getVendaFiscal: (competencia?: string) =>
      client.get<VendaFiscal>('vendaFiscal', competencia ? { competencia } : undefined),
    getVendaPedidosRecentes: () => client.get<PedidoRecente[]>('vendaPedidosRecentes'),
    getVendas: (competencia?: string, vendedor?: number) =>
      client.get<VendaDetalhada>('vendas', {
        ...(competencia ? { competencia } : {}),
        ...(vendedor != null ? { vendedor } : {}),
      }),
    getVendaRankingProdutos: (competencia?: string, vendedor?: number) =>
      client.get<VendaRankingProdutos>('vendaRankingProdutos', {
        ...(competencia ? { competencia } : {}),
        ...(vendedor != null ? { vendedor } : {}),
      }),
    getVendaVendasPorCategoria: (competencia?: string, vendedor?: number) =>
      client.get<VendasPorCategoria>('vendaVendasPorCategoria', {
        ...(competencia ? { competencia } : {}),
        ...(vendedor != null ? { vendedor } : {}),
      }),
    getVendaVendedores: () => client.get<Vendedor[]>('vendaVendedores'),

    // --- Estoque ---
    getEstoqueDepositos: () => client.get<Deposito[]>('estoqueDepositos'),
    getEstoqueItensAtivos: () => client.get<ItensAtivosTotal>('estoqueItensAtivos'),
    getEstoqueMovimentacoesRecentes: (depositoId: number) =>
      client.get<MovimentacaoEstoque[]>('estoqueMovimentacoesRecentes', { deposito: depositoId }),
    getEstoqueProdutosSaldo: (depositoId: number) =>
      client.get<ProdutoSaldo[]>('estoqueProdutosSaldo', { deposito: depositoId }),
    getEstoqueValorCusto: (depositoId?: number) =>
      client.get<EstoqueValorCusto>('estoqueValorCusto', depositoId != null ? { deposito: depositoId } : undefined),
    getEstoqueValorVenda: (depositoId?: number) =>
      client.get<EstoqueValorVenda>('estoqueValorVenda', depositoId != null ? { deposito: depositoId } : undefined),
    getEstoqueProdutosSemMovimentacao: (depositoId: number, competencia?: string) =>
      client.get<EstoqueProdutosSemMovimentacao>('estoqueProdutosSemMovimentacao', {
        deposito: depositoId,
        ...(competencia ? { competencia } : {}),
      }),
    getEstoqueEntradasSaidas: (depositoId: number, competencia?: string) =>
      client.get<EstoqueEntradasSaidas>('estoqueEntradasSaidas', {
        deposito: depositoId,
        ...(competencia ? { competencia } : {}),
      }),

    // --- Financeiro ---
    getFinanceiroFluxoMes: (competencia?: string) =>
      client.get<FinanceiroFluxoMes>('financeiroFluxoMes', competencia ? { competencia } : undefined),
    getFinanceiroContasPagar: (competencia?: string) =>
      client.get<ContasPagarResponse>('financeiroContasPagar', competencia ? { competencia } : undefined),
    getFinanceiroContasReceber: (competencia?: string) =>
      client.get<ContasReceberResponse>('financeiroContasReceber', competencia ? { competencia } : undefined),
    getFinanceiroMovimentacoesRecentes: () =>
      client.get<MovimentacaoFinanceira[]>('financeiroMovimentacoesRecentes'),

    // --- Configuração ---
    getConfiguracao: () => client.get<FinanceAppConfig>('configuracao'),
    updateConfiguracao: (config: FinanceAppConfig) =>
      client.post<FinanceAppConfig>('configuracao', config),
    setOasysPay: (ativo: boolean) =>
      client.post<FinanceAppConfig>('configuracaoOasysPay', { ativo }),
    setLogistica: (ativo: boolean) =>
      client.post<FinanceAppConfig>('configuracaoLogistica', { ativo }),
    setOasysCrm: (ativo: boolean) => client.post<FinanceAppConfig>('configuracaoOasysCrm', { ativo }),
  };
}

export type FinanceApi = ReturnType<typeof createFinanceApi>;
