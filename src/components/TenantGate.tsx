import type { ReactNode } from 'react';
import { hasTenantInUrl } from '../lib/tenant';
import NotFound from '../pages/NotFound';

export default function TenantGate({ children }: { children: ReactNode }) {
  if (!hasTenantInUrl()) {
    return <NotFound />;
  }
  return children;
}
