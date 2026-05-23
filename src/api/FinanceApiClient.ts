import type { ApiResponse } from './types';

export class FinanceApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly payload?: unknown,
  ) {
    super(message);
    this.name = 'FinanceApiError';
  }
}

export class UnauthorizedError extends FinanceApiError {
  constructor(message = 'Sessão expirada', payload?: unknown) {
    super(message, 401, payload);
    this.name = 'UnauthorizedError';
  }
}

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof UnauthorizedError || (error instanceof FinanceApiError && error.status === 401);
}

function resolveStatus(response: Response, payload: ApiResponse<unknown>): number {
  if (typeof payload.status === 'number') {
    return payload.status;
  }
  return response.status;
}

function isUnauthorizedStatus(status: number): boolean {
  return status === 401;
}

function extractErrorMessage(payload: ApiResponse<unknown>): string {
  if (typeof payload.error === 'string' && payload.error.length > 0) {
    return payload.error;
  }
  const info = payload.info;
  if (info && typeof info === 'object' && 'message' in info) {
    const message = (info as { message?: unknown }).message;
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
  }
  return 'Erro ao consultar API';
}

export type FinanceApiClientOptions = {
  baseUrl: string;
  token: string;
  onUnauthorized?: () => void;
};

export class FinanceApiClient {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly onUnauthorized?: () => void;

  constructor(options: FinanceApiClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.token = options.token;
    this.onUnauthorized = options.onUnauthorized;
  }

  private handleUnauthorized(payload: ApiResponse<unknown>): never {
    this.onUnauthorized?.();
    throw new UnauthorizedError(extractErrorMessage(payload), payload);
  }

  async get<T>(
    resource: string,
    params?: Record<string, string | number | boolean>,
    signal?: AbortSignal,
  ): Promise<T> {
    return this.request<T>('GET', resource, undefined, params, signal);
  }

  async post<T>(resource: string, body?: unknown, signal?: AbortSignal): Promise<T> {
    return this.request<T>('POST', resource, body, undefined, signal);
  }

  private async request<T>(
    method: 'GET' | 'POST',
    resource: string,
    body?: unknown,
    params?: Record<string, string | number | boolean>,
    signal?: AbortSignal,
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}/${resource}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, String(value));
      });
    }

    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'oasys-token': this.token,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });

    let payload: ApiResponse<T> | undefined;

    try {
      payload = (await response.json()) as ApiResponse<T>;
    } catch {
      if (isUnauthorizedStatus(response.status)) {
        this.onUnauthorized?.();
        throw new UnauthorizedError('Sessão expirada');
      }
      throw new FinanceApiError('Resposta inválida da API', response.status);
    }

    const status = resolveStatus(response, payload);

    if (isUnauthorizedStatus(status)) {
      this.handleUnauthorized(payload);
    }

    if (!response.ok || !payload.success) {
      throw new FinanceApiError(extractErrorMessage(payload), status, payload);
    }

    if (payload.info !== undefined && payload.info !== null) {
      return payload.info;
    }

    if (payload.data !== undefined && payload.data !== null) {
      return payload.data;
    }

    throw new FinanceApiError('Resposta da API sem dados em info', response.status, payload);
  }
}
