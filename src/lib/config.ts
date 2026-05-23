/**
 * Domínio raiz do back-end (host[:porta], sem protocolo).
 * A API é montada como `{protocolo}://{tenant}.{BASE_URL}`.
 *
 * Ex.: dev → `localhost:8080` (front em `http://oasys.localhost:5173`)
 * Ex.: produção → `erp.cliente.com.br`
 */
export const BASE_URL = 'oasystecnologia.com';
