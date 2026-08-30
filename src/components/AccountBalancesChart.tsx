import type { SaldoConta } from '../api/types';
import { formatCurrency } from '../lib/mappers';

type Props = {
  contas: SaldoConta[];
  isLoading?: boolean;
  mask?: (value: string) => string;
};

/** Gráfico de barras horizontais com o saldo atual de cada conta financeira. */
export default function AccountBalancesChart({ contas, isLoading, mask = (v) => v }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-8 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
        ))}
      </div>
    );
  }

  if (contas.length === 0) {
    return <p className="text-sm text-slate-500">Nenhuma conta financeira cadastrada.</p>;
  }

  const maiorAbs = Math.max(1, ...contas.map((c) => Math.abs(c.saldo)));

  return (
    <div className="space-y-4">
      {contas.map((conta) => {
        const isNegativo = conta.saldo < 0;
        const largura = Math.max(2, (Math.abs(conta.saldo) / maiorAbs) * 100);

        return (
          <div key={conta.id} className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-bold truncate">{conta.descricao}</span>
              <span className={`font-black whitespace-nowrap ${isNegativo ? 'text-rose-500' : 'text-emerald-500'}`}>
                {mask(formatCurrency(conta.saldo))}
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full ${isNegativo ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${largura}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
