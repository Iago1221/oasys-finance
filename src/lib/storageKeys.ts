/** Chaves de persistência local — alinhar com a API quando existir backend */
export const STORAGE_KEYS = {
  theme: 'theme',
  isBankingActive: 'isBankingActive',
  isLogisticsActive: 'isLogisticsActive',
  isCRMActive: 'isCRMActive',
  accountBalance: 'accountBalance',
  movements: 'movements',
} as const;

export const INTEGRATIONS_CHANGED_EVENT = 'oasys-integrations-changed';
