export type LowStockAlert = {
  id: number;
  name: string;
  sku: string;
  current: number;
  min: number;
  image: string;
};

export type InventoryMovementSummary = {
  id: number;
  type: string;
  origin: string;
  time: string;
  quantity: string;
  isEntry: boolean;
};

export type InventoryMovementDetail = {
  id: number;
  type: string;
  origin: string;
  time: string;
  date: string;
  quantity: string;
  unit: string;
  isEntry: boolean;
  ref: string;
  details: string;
};

export type LowStockAlertFull = LowStockAlert & {
  level: string;
  color: string;
};

export type ProductRow = {
  id: number;
  name: string;
  sku: string;
  category: string;
  balance: number;
  unit: string;
  image: string;
};
