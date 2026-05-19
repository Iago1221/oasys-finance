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

export type FinanceApiClientOptions = {
  baseUrl: string;
  token: string;
};

export class FinanceApiClient {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor(options: FinanceApiClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.token = options.token;
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
      throw new FinanceApiError('Resposta inválida da API Finance', response.status);
    }

    if (!response.ok || !payload.success) {
      throw new FinanceApiError(
        payload.error ?? 'Erro ao consultar API Finance',
        response.status,
        payload,
      );
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
