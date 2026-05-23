/** Situação do pedido (API). */
export const SITUACAO_PENDENTE = 2;
export const SITUACAO_CONCLUIDO = 6;
export const SITUACAO_CANCELADO = 7;
export const SITUACAO_MIGRADO = 8;
export const SITUACAO_CONFIRMADO = 9;

export const PEDIDO_SITUACAO_LABELS: Record<number, string> = {
  [SITUACAO_PENDENTE]: 'Pendente',
  [SITUACAO_CONCLUIDO]: 'Concluído',
  [SITUACAO_CANCELADO]: 'Cancelado',
  [SITUACAO_MIGRADO]: 'Migrado',
  [SITUACAO_CONFIRMADO]: 'Confirmado',
};

/** Tipos de movimentação de estoque (API). */
export const TIPO_ENTRADA_NF = 1;
export const TIPO_SAIDA_NF = 2;
export const TIPO_ENTRADA_ACERTO = 3;
export const TIPO_SAIDA_ACERTO = 4;
export const TIPO_SAIDA_OS = 5;
export const TIPO_SAIDA_PEDIDO = 6;
export const TIPO_SAIDA_OP = 7;
export const TIPO_ENTRADA_OP = 8;
export const TIPO_ENTRADA_CANCELAMENTO_NF = 9;
export const TIPO_ENTRADA_CANCELAMENTO_PEDIDO = 10;
export const TIPO_AJUSTE_IMPORTACAO = 99;

export const ESTOQUE_TIPO_LABELS: Record<number, string> = {
  [TIPO_ENTRADA_NF]: 'Entrada NF',
  [TIPO_SAIDA_NF]: 'Saída NF',
  [TIPO_ENTRADA_ACERTO]: 'Entrada Acerto',
  [TIPO_SAIDA_ACERTO]: 'Saída Acerto',
  [TIPO_SAIDA_OS]: 'Saída OS',
  [TIPO_SAIDA_PEDIDO]: 'Saída Pedido',
  [TIPO_SAIDA_OP]: 'Saída OP',
  [TIPO_ENTRADA_OP]: 'Entrada OP',
  [TIPO_ENTRADA_CANCELAMENTO_NF]: 'Entrada Cancelamento NF',
  [TIPO_ENTRADA_CANCELAMENTO_PEDIDO]: 'Entrada Cancelamento Pedido',
  [TIPO_AJUSTE_IMPORTACAO]: 'Ajuste Importação',
};

const ESTOQUE_TIPOS_ENTRADA = new Set([
  TIPO_ENTRADA_NF,
  TIPO_ENTRADA_ACERTO,
  TIPO_ENTRADA_OP,
  TIPO_ENTRADA_CANCELAMENTO_NF,
  TIPO_ENTRADA_CANCELAMENTO_PEDIDO,
  TIPO_AJUSTE_IMPORTACAO,
]);

export function pedidoStatusLabel(status: number): string {
  return PEDIDO_SITUACAO_LABELS[status] ?? `Situação ${status}`;
}

export function pedidoStatusColor(status: number): string {
  switch (status) {
    case SITUACAO_CONCLUIDO:
      return 'emerald';
    case SITUACAO_CANCELADO:
      return 'red';
    case SITUACAO_MIGRADO:
      return 'slate';
    case SITUACAO_CONFIRMADO:
      return 'indigo';
    case SITUACAO_PENDENTE:
    default:
      return 'blue';
  }
}

export function estoqueTipoLabel(tipo: number): string {
  return ESTOQUE_TIPO_LABELS[tipo] ?? `Tipo ${tipo}`;
}

export function estoqueTipoIsEntrada(tipo: number): boolean {
  return ESTOQUE_TIPOS_ENTRADA.has(tipo);
}

export function pedidoStatusIcon(status: string): string {
  switch (status) {
    case 'Concluído':
      return 'check_circle';
    case 'Cancelado':
      return 'cancel';
    case 'Confirmado':
      return 'verified';
    case 'Migrado':
      return 'sync_alt';
    default:
      return 'receipt_long';
  }
}
