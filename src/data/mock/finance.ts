import type { BankMovement, FinanceContact, PayableRow, ReceivableRow } from '../../types/finance';

/** Seed do extrato quando não há dados persistidos */
export const DEFAULT_BANK_MOVEMENTS: BankMovement[] = [
  {
    id: 1,
    type: 'Transferência Recebida',
    method: 'PIX',
    time: '10:45 AM',
    date: 'Hoje',
    value: '+R$ 450,00',
    isIncome: true,
    ref: '#TX-88221',
    details:
      'Venda de produto avulso (Unidade Centro). Pagamento instantâneo via QR Code.',
  },
  {
    id: 2,
    type: 'Pagamento Fornecedor',
    method: 'Débito',
    time: '08:20 AM',
    date: 'Hoje',
    value: '-R$ 2.100,00',
    isIncome: false,
    ref: '#CP-11042',
    details: 'Compra de suprimentos de escritório e papelaria técnica. Nota Fiscal #8821.',
  },
  {
    id: 3,
    type: 'Boleto Compensado',
    method: 'Sistema',
    time: 'Ontem',
    date: '04/03',
    value: '+R$ 890,00',
    isIncome: true,
    ref: '#BL-99032',
    details: 'Compensação automática de boleto bancário (Cliente: Inova Soft).',
  },
  {
    id: 4,
    type: 'Venda de Balcão',
    method: 'Crédito',
    time: 'Ontem',
    date: '04/03',
    value: '+R$ 1.200,00',
    isIncome: true,
    ref: '#VB-44210',
    details: 'Venda presencial. Parcelado em 2x sem juros no cartão de crédito.',
  },
  {
    id: 5,
    type: 'Tarifa Bancária',
    method: 'Débito',
    time: 'Anteontem',
    date: '03/03',
    value: '-R$ 15,90',
    isIncome: false,
    ref: '#TF-001',
    details: 'Taxa de manutenção de conta empresarial - Ciclo Março/2026.',
  },
  {
    id: 6,
    type: 'Estorno de Venda',
    method: 'Crédito',
    time: 'Anteontem',
    date: '03/03',
    value: '-R$ 120,00',
    isIncome: false,
    ref: '#ES-221',
    details: 'Devolução de produto por arrependimento. Estorno processado via operadora.',
  },
  {
    id: 7,
    type: 'Recebimento API',
    method: 'Stripe',
    time: '3 dias atrás',
    date: '02/03',
    value: '+R$ 3.450,00',
    isIncome: true,
    ref: '#ST-7732',
    details:
      'Integração e-commerce. Lote de vendas internacionais processado com sucesso.',
  },
];

export const MOCK_FINANCE_CONTACTS: FinanceContact[] = [
  { id: 1, name: 'Fornecedor Alpha LTDA', document: '12.345.678/0001-90' },
  { id: 2, name: 'Global Tech Solution', document: '98.765.432/0001-10' },
  { id: 3, name: 'Mecânica Rio S.A.', document: '00.111.222/0001-33' },
];

export const MOCK_PAYABLES: PayableRow[] = [
  {
    id: 1021,
    entity: 'Fornecedor Alpha',
    type: 'Materia Prima',
    value: 4500.0,
    status: 'Atrasado',
    color: 'red',
  },
  {
    id: 1022,
    entity: 'Aluguel Galpão',
    type: 'Custo Fixo',
    value: 12000.0,
    status: 'Pendente',
    color: 'yellow',
  },
];

export const MOCK_RECEIVABLES: ReceivableRow[] = [
  {
    id: 8842,
    entity: 'Acme Corp',
    type: 'Fatura Venda',
    value: 'R$ 1.250,00',
    status: 'Atrasado',
    color: 'red',
  },
  {
    id: 8859,
    entity: 'Global Tech',
    type: 'Serviço Mensal',
    value: 'R$ 3.400,00',
    status: 'Pendente',
    color: 'yellow',
  },
];
