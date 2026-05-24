import { FinanceApiClient } from './FinanceApiClient';
import type {
  ContasPagarResponse,
  ContasReceberResponse,
  Deposito,
  FinanceAppConfig,
  FinanceiroFluxoMes,
  ItensAtivosTotal,
  MovimentacaoEstoque,
  MovimentacaoFinanceira,
  PedidoRecente,
  ProdutoSaldo,
  VendaFiscal,
  VendaResumo,
} from './types';

export function createFinanceApi(
  token: string,
  baseUrl: string,
  onUnauthorized?: () => void,
) {
  const client = new FinanceApiClient({ baseUrl, token, onUnauthorized });

  return {
    getVendaResumo: () => client.get<VendaResumo>('vendaResumo'),
    getVendaFiscal: () => client.get<VendaFiscal>('vendaFiscal'),
    getVendaPedidosRecentes: () => client.get<PedidoRecente[]>('vendaPedidosRecentes'),
    getEstoqueDepositos: () => client.get<Deposito[]>('estoqueDepositos'),
    getEstoqueItensAtivos: () => client.get<ItensAtivosTotal>('estoqueItensAtivos'),
    getEstoqueMovimentacoesRecentes: (depositoId: number) =>
      client.get<MovimentacaoEstoque[]>('estoqueMovimentacoesRecentes', { deposito: depositoId }),
    getEstoqueProdutosSaldo: (depositoId: number) =>
      client.get<ProdutoSaldo[]>('estoqueProdutosSaldo', { deposito: depositoId }),
    getFinanceiroFluxoMes: () => client.get<FinanceiroFluxoMes>('financeiroFluxoMes'),
    getFinanceiroContasPagar: () => client.get<ContasPagarResponse>('financeiroContasPagar'),
    getFinanceiroContasReceber: () => client.get<ContasReceberResponse>('financeiroContasReceber'),
    getFinanceiroMovimentacoesRecentes: () =>
      client.get<MovimentacaoFinanceira[]>('financeiroMovimentacoesRecentes'),
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
