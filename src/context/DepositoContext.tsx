import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Deposito } from '../api/types';
import { useFinanceApi } from './AuthContext';

const STORAGE_KEY = 'oasys-deposito-id';

type DepositoContextValue = {
  depositos: Deposito[];
  selectedDepositoId: number | null;
  selectedDeposito: Deposito | null;
  setSelectedDepositoId: (id: number) => void;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

const DepositoContext = createContext<DepositoContextValue | null>(null);

export function DepositoProvider({ children }: { children: ReactNode }) {
  const api = useFinanceApi();
  const [depositos, setDepositos] = useState<Deposito[]>([]);
  const [selectedDepositoId, setSelectedDepositoIdState] = useState<number | null>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? Number(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const list = await api.getEstoqueDepositos();
      setDepositos(list);
      setSelectedDepositoIdState((current) => {
        if (current && list.some((d) => d.id === current)) {
          return current;
        }
        const first = list[0]?.id ?? null;
        if (first != null) {
          sessionStorage.setItem(STORAGE_KEY, String(first));
        }
        return first;
      });
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Falha ao carregar depósitos'));
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const setSelectedDepositoId = useCallback((id: number) => {
    setSelectedDepositoIdState(id);
    sessionStorage.setItem(STORAGE_KEY, String(id));
  }, []);

  const selectedDeposito = useMemo(
    () => depositos.find((d) => d.id === selectedDepositoId) ?? null,
    [depositos, selectedDepositoId],
  );

  const value = useMemo(
    () => ({
      depositos,
      selectedDepositoId,
      selectedDeposito,
      setSelectedDepositoId,
      isLoading,
      error,
      refetch,
    }),
    [depositos, selectedDepositoId, selectedDeposito, setSelectedDepositoId, isLoading, error, refetch],
  );

  return <DepositoContext.Provider value={value}>{children}</DepositoContext.Provider>;
}

export function useDepositoContext(): DepositoContextValue {
  const ctx = useContext(DepositoContext);
  if (!ctx) {
    throw new Error('useDepositoContext deve ser usado dentro de DepositoProvider');
  }
  return ctx;
}
