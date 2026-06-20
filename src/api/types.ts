/** Envelope padrão OAsys: payload de sucesso em `info`. */
export type ApiResponse<T> = {
  success: boolean;
  status?: number;
  info?: T;
  /** Legado / ambientes que ainda usam `data`. */
  data?: T;
  error?: string;
};

export type Periodo = {
  inicio: string;
  fim: string;
};

export type VendaResumo = {
  periodo: Periodo;
  totalOrcamentos: number;
  totalPedidos: number;
  totalPedidosConcluidos: number;
  totalPedidosFaturados: number;
  countPedidos: number;
  countConcluidos: number;
  crescimentoPedidosConcluidos: {
    percentual: number;
    /** @deprecated use anoAnterior */
    mesAnterior?: number;
    anoAnterior: number;
    anoAnteriorFull: number;
    mesAtual: number;
    diasDecorridos: number;
    isProporcional: boolean;
  };
};

export type VendaDetalhada = {
  periodo: Periodo;
  countPedidos: number;
  countConcluidos: number;
  totalVendido: number;
  totalConcluidos: number;
  ticketMedio: number;
};

export type ProdutoRanking = {
  id: number;
  sku: string | null;
  descricao: string;
  qtdVendida: number;
  valorVendido: number;
};

export type VendaRankingProdutos = {
  periodo: Periodo;
  ranking: ProdutoRanking[];
};

export type CategoriaVenda = {
  categoria: string;
  valor: number;
  percentual: number;
};

export type VendasPorCategoria = {
  periodo: Periodo;
  total: number;
  categorias: CategoriaVenda[];
};

export type Vendedor = {
  id: number;
  nome: string;
};

export type VendaFiscal = {
  periodo: Periodo;
  nfeAutorizadas: number;
  nfceAutorizadas: number;
  countDfe: number;
  valorDfe: number;
  xmlsPendentesManifestacao: number;
  countPagamentoDigital: number;
  valorPagamentoDigital: number;
  diferencaFiscal: number;
};

export type PedidoRecente = {
  id: number;
  status: number;
  valorTotal: number;
  dataEmissao: string;
  tempoRelativo: string | null;
  cliente: {
    id: number;
    razaoSocial: string;
  };
  itens: Array<{
    id: number;
    quantidade: number;
    valor: number;
    produto: {
      id: number;
      sku: string | null;
      descricao: string;
    };
  }>;
};

export type Deposito = {
  id: number;
  descricao: string;
};

export type ItensAtivosTotal = {
  total: number;
};

export type MovimentacaoEstoque = {
  id: number;
  tipo: number;
  quantidade: number;
  data: string;
  tempoRelativo: string | null;
  observacao: string | null;
  depositoItem: number;
  produto: {
    id: number;
    sku: string | null;
    descricao: string;
  };
};

export type ProdutoSaldo = {
  depositoItem: number;
  sku: string | null;
  descricao: string;
  unidadeMedida: string | null;
  saldo: number;
};

export type FinanceiroFluxoMes = {
  periodo: Periodo;
  recebimentos: {
    total: number;
    recebido: number;
    pendente: number;
  };
  pagamentos: {
    total: number;
    pago: number;
    pendente: number;
  };
};

export type ParcelaFinanceira = {
  tituloId: number;
  parcelaId: number;
  numero: number;
  tituloParcela: string;
  dataEmissao: string;
  dataVencimento: string;
  tituloObservacao: string | null;
  pessoa: {
    id: number | null;
    documento: string | null;
    razaoSocial: string | null;
  };
  valor: number;
  valorPago: number;
  saldo: number;
  situacao: number;
};

export type ContasPagarResponse = {
  periodo: Periodo;
  parcelas: ParcelaFinanceira[];
  venceEm7Dias: number;
};

export type ContasReceberResponse = {
  periodo: Periodo;
  parcelas: ParcelaFinanceira[];
  previsto7Dias: number;
};

export type EstoqueValorCusto = {
  depositoId: number | null;
  valorCusto: number;
  porDeposito?: Array<{ depositoId: number; valor: number }>;
};

export type EstoqueValorVenda = {
  depositoId: number | null;
  tabelaPrecoId: number | null;
  valorVenda: number;
};

export type ProdutoSemMovimentacao = {
  id: number;
  sku: string | null;
  descricao: string;
  saldo: number;
  diasSemMovimentacao: number | null;
};

export type EstoqueProdutosSemMovimentacao = {
  periodo: Periodo;
  produtos: ProdutoSemMovimentacao[];
};

export type EstoqueEntradasSaidas = {
  periodo: Periodo;
  entradas: number;
  saidas: number;
};

export type MovimentacaoFinanceira = {
  id: number;
  valor: number;
  dataPagamento: string;
  dataLiquidacao: string | null;
  tempoRelativo: string | null;
  observacao: string | null;
  tipoTitulo: 1 | 2 | null;
  parcela: {
    id: number | null;
    numero: number | null;
  };
  titulo: {
    id: number | null;
  };
  pessoa: {
    id: number;
    razaoSocial: string;
  } | null;
};

export type FinanceAppConfig = {
  oasysPay: boolean;
  logistica: boolean;
  oasysCrm: boolean;
};

export type AppUsuario = {
  id: number;
  nome: string;
  email: string;
  acessoErp: boolean;
  acessoCrm: boolean;
  acessoGestao: boolean;
  acessoVarejo: boolean;
  acessoIndustria: boolean;
  acessoNeuron: boolean;
  situacao: number;
};
