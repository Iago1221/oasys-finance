/** Evita múltiplos logouts quando várias requisições retornam 401 ao mesmo tempo. */
let unauthorizedHandled = false;

export function markUnauthorizedHandled(): boolean {
  if (unauthorizedHandled) {
    return false;
  }
  unauthorizedHandled = true;
  return true;
}

export function resetUnauthorizedHandled(): void {
  unauthorizedHandled = false;
}
