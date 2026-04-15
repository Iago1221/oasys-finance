import { useCallback, useState } from 'react';
import { MOCK_ISSUED_NOTES_FULL } from '../data/mock/sales';
import type { IssuedNoteRow } from '../types/sales';

/** Notas fiscais emitidas (lista completa). */
export function useIssuedNotes() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [notes, setNotes] = useState<IssuedNoteRow[]>(MOCK_ISSUED_NOTES_FULL);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setNotes(MOCK_ISSUED_NOTES_FULL);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Falha ao carregar notas'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { notes, setNotes, isLoading, error, refetch };
}
