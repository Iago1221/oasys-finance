import { getLoginUrl } from '../lib/tenant';
import { FinanceApiError } from './FinanceApiClient';

type LoginPayload = {
  usuario: string;
  senha: string;
};

/** Formato OAsys: { success, status, info: { token } } */
function extractToken(data: unknown): string {
  if (typeof data === 'string' && data.length > 0) {
    return data;
  }
  if (!data || typeof data !== 'object') {
    throw new FinanceApiError('Token não encontrado na resposta de login');
  }

  const record = data as Record<string, unknown>;

  const info = record.info;
  if (info && typeof info === 'object') {
    const token = (info as Record<string, unknown>).token;
    if (typeof token === 'string' && token.length > 0) {
      return token;
    }
  }

  for (const key of ['token', 'oasys-token', 'oasysToken', 'accessToken']) {
    const value = record[key];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }

  throw new FinanceApiError('Token não encontrado na resposta de login');
}

export async function loginRequest(credentials: LoginPayload): Promise<string> {
  const response = await fetch(getLoginUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  let payload: Record<string, unknown> | undefined;

  try {
    payload = (await response.json()) as Record<string, unknown>;
  } catch {
    throw new FinanceApiError('Resposta inválida do login', response.status);
  }

  if (!response.ok) {
    const error =
      payload && 'error' in payload && typeof payload.error === 'string'
        ? payload.error
        : 'Falha na autenticação';
    throw new FinanceApiError(error, response.status, payload);
  }

  if (payload && 'success' in payload) {
    if (!payload.success) {
      const message =
        typeof payload.error === 'string' ? payload.error : 'Falha na autenticação';
      throw new FinanceApiError(message, response.status, payload);
    }
    return extractToken(payload.info ?? payload.data ?? payload);
  }

  return extractToken(payload);
}
