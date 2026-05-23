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
  crescimentoPedidosConcluidos: {
    percentual: number;
    mesAnterior: number;
    mesAtual: number;
  };
};

export type VendaFiscal = {
  periodo: Periodo;
  nfeAutorizadas: number;
  xmlsPendentesManifestacao: number;
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

export type ItemAtivo = {
  id: number;
  sku: string | null;
  descricao: string;
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
};

export type ContasReceberResponse = {
  periodo: Periodo;
  parcelas: ParcelaFinanceira[];
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
