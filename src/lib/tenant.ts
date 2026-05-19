const BARE_HOSTS = new Set(['localhost', '127.0.0.1']);

function readEnv(key: string): string | undefined {
  const value = import.meta.env[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function isIpAddress(hostname: string): boolean {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname) || hostname.includes(':');
}

function isLocalDevHost(hostname: string): boolean {
  return hostname === 'localhost' || hostname.endsWith('.localhost') || hostname === '127.0.0.1';
}

/**
 * Resolve o tenant pelo primeiro segmento do host.
 * Ex.: oasys.localhost → "oasys"
 * Retorna null quando não há subdomínio (localhost, IP ou domínio sem prefixo).
 */
export function resolveTenantPrefix(): string | null {
  const hostname = window.location.hostname;

  if (BARE_HOSTS.has(hostname) || isIpAddress(hostname)) {
    return null;
  }

  const parts = hostname.split('.').filter(Boolean);
  if (parts.length < 2) {
    return null;
  }

  const prefix = parts[0];
  if (!prefix) {
    return null;
  }

  return prefix;
}

export function hasTenantInUrl(): boolean {
  return resolveTenantPrefix() !== null;
}

export class TenantNotFoundError extends Error {
  constructor() {
    super('Tenant não identificado na URL.');
    this.name = 'TenantNotFoundError';
  }
}

/** Primeiro segmento do host do front-end (tenant). */
export function getTenantPrefix(): string {
  const prefix = resolveTenantPrefix();
  if (!prefix) {
    throw new TenantNotFoundError();
  }
  return prefix;
}

function getApiRootDomain(): string {
  const domain = readEnv('VITE_API_ROOT_DOMAIN');
  if (!domain) {
    throw new Error('VITE_API_ROOT_DOMAIN não configurado.');
  }
  return domain;
}

function getProtocol(): string {
  const fromEnv = readEnv('VITE_API_PROTOCOL');
  if (fromEnv) {
    return fromEnv.replace(/:$/, '');
  }
  if (isLocalDevHost(window.location.hostname)) {
    return 'http';
  }
  return 'https';
}

/** Origin do back-end: {protocol}://{tenant}.{VITE_API_ROOT_DOMAIN} */
export function getApiOrigin(): string {
  const prefix = getTenantPrefix();
  return `${getProtocol()}://${prefix}.${getApiRootDomain()}`;
}

export function getFinanceBaseUrl(): string {
  return `${getApiOrigin()}/api/finance`;
}

export function getLoginUrl(): string {
  return `${getApiOrigin()}/api/login`;
}
