import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createFinanceApi, type FinanceApi } from '../api/finance';
import { loginRequest } from '../api/login';
import { getFinanceBaseUrl } from '../lib/tenant';

const TOKEN_KEY = 'oasys-token';

type AuthContextValue = {
  token: string | null;
  api: FinanceApi | null;
  isAuthenticated: boolean;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readStoredToken);

  const api = useMemo(() => {
    if (!token) return null;
    return createFinanceApi(token, getFinanceBaseUrl());
  }, [token]);

  const login = useCallback(async (userLogin: string, password: string) => {
    const newToken = await loginRequest({ usuario: userLogin, senha: password });
    sessionStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      api,
      isAuthenticated: Boolean(token && api),
      login,
      logout,
    }),
    [token, api, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return ctx;
}

export function useFinanceApi(): FinanceApi {
  const { api } = useAuth();
  if (!api) {
    throw new Error('API Finance indisponível — usuário não autenticado');
  }
  return api;
}
