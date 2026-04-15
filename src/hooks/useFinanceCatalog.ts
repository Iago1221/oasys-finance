import { useCallback, useState } from 'react';
import {
  MOCK_FINANCE_CONTACTS,
  MOCK_PAYABLES,
  MOCK_RECEIVABLES,
} from '../data/mock/finance';
import type { FinanceContact, PayableRow, ReceivableRow } from '../types/finance';

/**
 * Contatos ERP, contas a pagar e recebimentos (mock).
 * `refetch` ficará como ponto único para `GET` na API.
 */
export function useFinanceCatalog() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [contacts, setContacts] = useState<FinanceContact[]>(MOCK_FINANCE_CONTACTS);
  const [payables, setPayables] = useState<PayableRow[]>(MOCK_PAYABLES);
  const [receivables, setReceivables] = useState<ReceivableRow[]>(MOCK_RECEIVABLES);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // await api.finance.catalog()
      setContacts(MOCK_FINANCE_CONTACTS);
      setPayables(MOCK_PAYABLES);
      setReceivables(MOCK_RECEIVABLES);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Falha ao carregar catálogo financeiro'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    contacts,
    payables,
    receivables,
    setContacts,
    setPayables,
    setReceivables,
    isLoading,
    error,
    refetch,
  };
}
