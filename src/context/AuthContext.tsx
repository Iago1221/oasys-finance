import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createAppApi } from '../api/app';
import { createFinanceApi, type FinanceApi } from '../api/finance';
import { isUnauthorizedError } from '../api/FinanceApiClient';
import { loginRequest } from '../api/login';
import type { AppUsuario } from '../api/types';
import { markUnauthorizedHandled, resetUnauthorizedHandled } from '../lib/authSession';
import { STORAGE_KEYS } from '../lib/storageKeys';
import { getFinanceBaseUrl } from '../lib/tenant';

type AuthContextValue = {
  token: string | null;
  api: FinanceApi | null;
  user: AppUsuario | null;
  userLoading: boolean;
  userError: Error | null;
  isAuthenticated: boolean;
  login: (login: string, password: string) => Promise<void>;
  logout: () => void;
  refetchUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredToken(): string | null {
  return sessionStorage.getItem(STORAGE_KEYS.token);
}

function readStoredEmail(): string | null {
  return sessionStorage.getItem(STORAGE_KEYS.userEmail);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readStoredToken);
  const [user, setUser] = useState<AppUsuario | null>(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState<Error | null>(null);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEYS.token);
    sessionStorage.removeItem(STORAGE_KEYS.userEmail);
    setToken(null);
    setUser(null);
    setUserError(null);
  }, []);

  const logoutRef = useRef(logout);
  logoutRef.current = logout;

  const handleUnauthorized = useCallback(() => {
    if (!markUnauthorizedHandled()) return;
    logoutRef.current();
  }, []);

  const api = useMemo(() => {
    if (!token) return null;
    return createFinanceApi(token, getFinanceBaseUrl(), handleUnauthorized);
  }, [token, handleUnauthorized]);

  const fetchUser = useCallback(
    async (authToken: string, email: string) => {
      setUserLoading(true);
      setUserError(null);
      try {
        const appApi = createAppApi(authToken, handleUnauthorized);
        const usuario = await appApi.getUsuario(email);
        setUser(usuario);
      } catch (e) {
        if (isUnauthorizedError(e)) {
          return;
        }
        setUser(null);
        setUserError(e instanceof Error ? e : new Error('Falha ao carregar dados do usuário'));
      } finally {
        setUserLoading(false);
      }
    },
    [handleUnauthorized],
  );

  const refetchUser = useCallback(async () => {
    const currentToken = readStoredToken();
    const email = readStoredEmail();
    if (!currentToken || !email) return;
    await fetchUser(currentToken, email);
  }, [fetchUser]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setUserError(null);
      return;
    }
    const email = readStoredEmail();
    if (!email) return;
    void fetchUser(token, email);
  }, [token, fetchUser]);

  const login = useCallback(async (userLogin: string, password: string) => {
    const email = userLogin.trim();
    const newToken = await loginRequest({ usuario: email, senha: password });
    resetUnauthorizedHandled();
    sessionStorage.setItem(STORAGE_KEYS.token, newToken);
    sessionStorage.setItem(STORAGE_KEYS.userEmail, email);
    setToken(newToken);
  }, []);

  const logoutWithReset = useCallback(() => {
    resetUnauthorizedHandled();
    logout();
  }, [logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      api,
      user,
      userLoading,
      userError,
      isAuthenticated: Boolean(token && api),
      login,
      logout: logoutWithReset,
      refetchUser,
    }),
    [token, api, user, userLoading, userError, login, logoutWithReset, refetchUser],
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
