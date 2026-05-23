export type SalesOrderPreview = {
  id: number;
  client: string;
  time: string;
  value: string;
  status: string;
  items: string;
  ref: string;
  color: string;
};

export type SalesNoteError = {
  id: number;
  serie: string;
  numero: string;
  emitente: string;
  destinatario: string;
  valor: string;
  erro: string;
};

export type IssuedNotePreview = {
  id: number;
  type: string;
  ref: string;
  client: string;
  value: string;
  status: string;
  time: string;
};

export type IssuedNoteRow = IssuedNotePreview & {
  date: string;
};

export type SalesHistoryOrder = SalesOrderPreview & {
  date: string;
};

export type ActivityItem = {
  id: number;
  title: string;
  category: string;
  deadline: string;
  priority: string;
  color: string;
  description: string;
};
