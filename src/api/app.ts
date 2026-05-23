import { FinanceApiClient } from './FinanceApiClient';
import type { AppUsuario } from './types';
import { getAppBaseUrl } from '../lib/tenant';

export function createAppApi(token: string, onUnauthorized?: () => void) {
  const client = new FinanceApiClient({ baseUrl: getAppBaseUrl(), token, onUnauthorized });

  return {
    getUsuario: (email: string) => client.get<AppUsuario>('usuario', { email }),
  };
}

export type AppApi = ReturnType<typeof createAppApi>;
