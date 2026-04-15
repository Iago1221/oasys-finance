import { useCallback, useState } from 'react';
import {
  MOCK_HIGH_VALUE_ORDERS,
  MOCK_ISSUED_NOTES_PREVIEW,
  MOCK_SALES_NOTE_ERRORS,
} from '../data/mock/sales';
import type { IssuedNotePreview, SalesNoteError, SalesOrderPreview } from '../types/sales';

export const SALES_TABS = ['Painel', 'Documentos', 'Impostos'] as const;

/** Dados das abas de Vendas & Faturamento. */
export function useSalesWorkspace() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [highValueOrders, setHighValueOrders] =
    useState<SalesOrderPreview[]>(MOCK_HIGH_VALUE_ORDERS);
  const [errorNotes, setErrorNotes] = useState<SalesNoteError[]>(MOCK_SALES_NOTE_ERRORS);
  const [issuedNotesPreview, setIssuedNotesPreview] =
    useState<IssuedNotePreview[]>(MOCK_ISSUED_NOTES_PREVIEW);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setHighValueOrders(MOCK_HIGH_VALUE_ORDERS);
      setErrorNotes(MOCK_SALES_NOTE_ERRORS);
      setIssuedNotesPreview(MOCK_ISSUED_NOTES_PREVIEW);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Falha ao carregar vendas'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    highValueOrders,
    errorNotes,
    issuedNotesPreview,
    setHighValueOrders,
    setErrorNotes,
    setIssuedNotesPreview,
    isLoading,
    error,
    refetch,
  };
}
