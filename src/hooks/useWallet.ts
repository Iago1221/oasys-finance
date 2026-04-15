import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_BANK_MOVEMENTS } from '../data/mock/finance';
import { STORAGE_KEYS } from '../lib/storageKeys';
import type { BankMovement } from '../types/finance';

const DEFAULT_BALANCE = 12450.75;

function readBalance(): number {
  const saved = localStorage.getItem(STORAGE_KEYS.accountBalance);
  return saved !== null ? parseFloat(saved) : DEFAULT_BALANCE;
}

function readMovements(): BankMovement[] {
  const saved = localStorage.getItem(STORAGE_KEYS.movements);
  if (saved === null) return [...DEFAULT_BANK_MOVEMENTS];
  try {
    const parsed = JSON.parse(saved) as BankMovement[];
    return Array.isArray(parsed) ? parsed : [...DEFAULT_BANK_MOVEMENTS];
  } catch {
    return [...DEFAULT_BANK_MOVEMENTS];
  }
}

type UseWalletOptions = {
  /** Sincroniza com localStorage periodicamente (outras abas / mesma origem). */
  syncIntervalMs?: number;
};

/**
 * Saldo e movimentações bancárias (mock + localStorage).
 * Substituir leituras por `fetch`/React Query quando a API existir.
 */
export function useWallet(options: UseWalletOptions = {}) {
  const { syncIntervalMs = 1000 } = options;
  const [balance, setBalanceState] = useState(readBalance);
  const [movements, setMovementsState] = useState(readMovements);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.accountBalance || e.key === null) {
        setBalanceState(readBalance());
      }
      if (e.key === STORAGE_KEYS.movements || e.key === null) {
        setMovementsState(readMovements());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (syncIntervalMs <= 0) return;
    const id = window.setInterval(() => {
      setBalanceState(readBalance());
      setMovementsState(readMovements());
    }, syncIntervalMs);
    return () => window.clearInterval(id);
  }, [syncIntervalMs]);

  const setBalance = useCallback((next: number) => {
    setBalanceState(next);
    localStorage.setItem(STORAGE_KEYS.accountBalance, String(next));
  }, []);

  const setMovements = useCallback((next: BankMovement[]) => {
    setMovementsState(next);
    localStorage.setItem(STORAGE_KEYS.movements, JSON.stringify(next));
  }, []);

  const applyBalanceAndMovements = useCallback((nextBalance: number, nextMovements: BankMovement[]) => {
    setBalanceState(nextBalance);
    setMovementsState(nextMovements);
    localStorage.setItem(STORAGE_KEYS.accountBalance, String(nextBalance));
    localStorage.setItem(STORAGE_KEYS.movements, JSON.stringify(nextMovements));
  }, []);

  return {
    balance,
    movements,
    setBalance,
    setMovements,
    applyBalanceAndMovements,
  };
}
