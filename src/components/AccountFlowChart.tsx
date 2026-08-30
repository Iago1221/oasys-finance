import type { RecebimentoPagamentoConta } from '../api/types';
import { formatCurrency } from '../lib/mappers';

type Props = {
  contas: RecebimentoPagamentoConta[];
  isLoading?: boolean;
  mask?: (value: string) => string;
};

/** Gráfico de barras pareadas (recebimentos x pagamentos) por conta financeira, na competência selecionada. */
export default function AccountFlowChart({ contas, isLoading, mask = (v) => v }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-14 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
        ))}
      </div>
    );
  }

  if (contas.length === 0) {
    return <p className="text-sm text-slate-500">Nenhuma conta financeira cadastrada.</p>;
  }

  const maior = Math.max(1, ...contas.flatMap((c) => [c.recebimentos, c.pagamentos]));

  return (
    <div className="space-y-5">
      {contas.map((conta) => (
        <div key={conta.id} className="space-y-2">
          <span className="text-xs font-bold truncate block">{conta.descricao}</span>

          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <span className="text-slate-500">Recebimentos</span>
              <span className="font-black text-emerald-500 whitespace-nowrap">
                {mask(formatCurrency(conta.recebimentos))}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${Math.max(2, (conta.recebimentos / maior) * 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <span className="text-slate-500">Pagamentos</span>
              <span className="font-black text-rose-500 whitespace-nowrap">
                {mask(formatCurrency(conta.pagamentos))}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-rose-500"
                style={{ width: `${Math.max(2, (conta.pagamentos / maior) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
