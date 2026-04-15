/** Movimentação bancária exibida no extrato / histórico */
export type BankMovement = {
  id: number;
  type: string;
  method: string;
  time: string;
  value: string;
  isIncome: boolean;
  date?: string;
  ref?: string;
  details?: string;
};

export type FinanceContact = {
  id: number;
  name: string;
  document: string;
};

export type PayableRow = {
  id: number;
  entity: string;
  type: string;
  value: number;
  status: string;
  color: string;
};

export type ReceivableRow = {
  id: number;
  entity: string;
  type: string;
  value: string;
  status: string;
  color: string;
};
