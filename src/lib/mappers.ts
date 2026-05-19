import type {
  FinanceAppConfig,
  MovimentacaoEstoque,
  MovimentacaoFinanceira,
  ParcelaFinanceira,
  PedidoRecente,
  ProdutoSaldo,
} from '../api/types';
import type { BankMovement } from '../types/finance';
import type { PayableRow, ReceivableRow } from '../types/finance';
import type { InventoryMovementDetail, InventoryMovementSummary, LowStockAlert, LowStockAlertFull, ProductRow } from '../types/inventory';
import type { PendingIssue } from '../types/pending';
import type { SalesHistoryOrder, SalesOrderPreview } from '../types/sales';

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const DEFAULT_FINANCE_APP_CONFIG: FinanceAppConfig = {
  oasysPay: false,
  logistica: false,
  oasysCrm: false,
};

/** Normaliza GET configuracao (info/data aninhado ou campos na raiz). */
export function normalizeFinanceAppConfig(raw: unknown): FinanceAppConfig {
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_FINANCE_APP_CONFIG;
  }
  const record = raw as Record<string, unknown>;

  for (const key of ['info', 'data'] as const) {
    const nested = record[key];
    if (nested !== undefined && nested !== null && typeof nested === 'object') {
      return normalizeFinanceAppConfig(nested);
    }
  }

  return {
    oasysPay: Boolean(record.oasysPay),
    logistica: Boolean(record.logistica),
    oasysCrm: Boolean(record.oasysCrm),
  };
}

function parcelaStatus(parcela: ParcelaFinanceira): { status: string; color: string } {
  if (parcela.saldo <= 0) {
    return { status: 'Pago', color: 'emerald' };
  }
  const due = new Date(parcela.dataVencimento);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (due < today) {
    return { status: 'Vencido', color: 'red' };
  }
  return { status: 'Pendente', color: 'amber' };
}

export function mapParcelaToPayable(parcela: ParcelaFinanceira): PayableRow {
  const { status, color } = parcelaStatus(parcela);
  return {
    id: parcela.parcelaId,
    entity: parcela.pessoa.razaoSocial ?? '—',
    type: parcela.tituloParcela,
    value: parcela.saldo > 0 ? parcela.saldo : parcela.valor,
    status,
    color,
  };
}

export function mapParcelaToReceivable(parcela: ParcelaFinanceira): ReceivableRow {
  const { status, color } = parcelaStatus(parcela);
  return {
    id: parcela.parcelaId,
    entity: parcela.pessoa.razaoSocial ?? '—',
    type: parcela.tituloParcela,
    value: formatCurrency(parcela.saldo > 0 ? parcela.saldo : parcela.valor),
    status,
    color,
  };
}

export function mapParcelaToPendingIssue(parcela: ParcelaFinanceira, kind: 'pagar' | 'receber'): PendingIssue {
  const { status, color } = parcelaStatus(parcela);
  const amount = parcela.saldo > 0 ? parcela.saldo : parcela.valor;
  return {
    id: parcela.parcelaId,
    client: parcela.pessoa.razaoSocial ?? '—',
    type: kind === 'pagar' ? 'Conta a Pagar' : 'Conta a Receber',
    value: formatCurrency(amount),
    numValue: amount,
    status,
    color,
    date: parcela.dataVencimento,
    details: parcela.tituloObservacao ?? parcela.tituloParcela,
  };
}

export function mapPedidoRecenteToPreview(pedido: PedidoRecente): SalesOrderPreview {
  const itemsSummary = pedido.itens
    .map((item) => `${item.quantidade}x ${item.produto.descricao}`)
    .join(', ');
  const faturado = pedido.valorTotal > 0;
  return {
    id: pedido.id,
    client: pedido.cliente.razaoSocial,
    time: pedido.tempoRelativo ?? pedido.dataEmissao,
    value: formatCurrency(pedido.valorTotal),
    status: faturado ? 'Faturado' : 'Pedido',
    items: itemsSummary || 'Sem itens',
    ref: `#${pedido.id}`,
    color: faturado ? 'emerald' : 'blue',
  };
}

export function mapPedidoRecenteToHistory(pedido: PedidoRecente): SalesHistoryOrder {
  const preview = mapPedidoRecenteToPreview(pedido);
  const datePart = pedido.dataEmissao.split(' ')[0] ?? pedido.dataEmissao;
  return {
    ...preview,
    date: datePart,
    tax: '—',
  };
}

export function mapMovimentacaoFinanceiraToBankMovement(mov: MovimentacaoFinanceira): BankMovement {
  const isIncome = mov.tipoTitulo === 1;
  const signed = isIncome ? mov.valor : -mov.valor;
  return {
    id: mov.id,
    type: mov.pessoa?.razaoSocial ?? (isIncome ? 'Recebimento' : 'Pagamento'),
    method: mov.parcela.numero != null ? `Parcela ${mov.parcela.numero}` : 'Movimentação',
    time: mov.tempoRelativo ?? mov.dataPagamento,
    value: formatCurrency(Math.abs(signed)),
    isIncome,
    date: mov.dataPagamento,
    ref: mov.titulo.id != null ? `Título ${mov.titulo.id}` : undefined,
    details: mov.observacao ?? undefined,
  };
}

const STOCK_TYPE_LABELS: Record<number, string> = {
  1: 'Entrada',
  2: 'Saída',
  3: 'Ajuste',
};

export function mapMovimentacaoEstoqueToSummary(mov: MovimentacaoEstoque): InventoryMovementSummary {
  const isEntry = mov.tipo === 1;
  const sign = isEntry ? '+' : '-';
  return {
    id: mov.id,
    type: STOCK_TYPE_LABELS[mov.tipo] ?? `Tipo ${mov.tipo}`,
    origin: mov.produto.descricao,
    time: mov.tempoRelativo ?? mov.data,
    quantity: `${sign}${mov.quantidade}`,
    isEntry,
  };
}

export function mapMovimentacaoEstoqueToDetail(mov: MovimentacaoEstoque): InventoryMovementDetail {
  const summary = mapMovimentacaoEstoqueToSummary(mov);
  return {
    ...summary,
    date: mov.data,
    unit: 'un',
    ref: mov.produto.sku ?? `SKU-${mov.produto.id}`,
    details: mov.observacao ?? mov.produto.descricao,
  };
}

export function mapProdutoSaldoToProductRow(produto: ProdutoSaldo, index: number): ProductRow {
  return {
    id: produto.depositoItem || index,
    name: produto.descricao,
    sku: produto.sku ?? '—',
    category: 'Estoque',
    balance: produto.saldo,
    unit: produto.unidadeMedida ?? 'un',
    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(produto.descricao.slice(0, 2))}&background=e2e8f0&color=475569`,
  };
}

const LOW_STOCK_THRESHOLD = 10;

export function mapProdutoSaldoToLowStockAlert(produto: ProdutoSaldo, index: number): LowStockAlert | null {
  if (produto.saldo > LOW_STOCK_THRESHOLD) {
    return null;
  }
  return {
    id: produto.depositoItem || index,
    name: produto.descricao,
    sku: produto.sku ?? '—',
    current: produto.saldo,
    min: LOW_STOCK_THRESHOLD,
    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(produto.descricao.slice(0, 2))}&background=fee2e2&color=b91c1c`,
  };
}

export function mapProdutoSaldoToLowStockFull(produto: ProdutoSaldo, index: number): LowStockAlertFull | null {
  const base = mapProdutoSaldoToLowStockAlert(produto, index);
  if (!base) return null;
  const level = base.current <= 0 ? 'Crítico' : 'Baixo';
  const color = base.current <= 0 ? 'red' : 'amber';
  return { ...base, level, color };
}
