import React, { useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { useFinanceCatalog, useFinanceFluxo, useWallet } from '../hooks';
import { formatCurrency } from '../lib/mappers';

const borderColorClass: Record<string, string> = {
  emerald: 'border-emerald-500',
  amber: 'border-amber-500',
  red: 'border-red-500',
};

const statusColorClass: Record<string, string> = {
  emerald: 'text-emerald-500 bg-emerald-500/10',
  amber: 'text-amber-500 bg-amber-500/10',
  red: 'text-red-500 bg-red-500/10',
};

export default function Finance() {
  const navigate = useNavigate();
  const { payables, receivables, isLoading: catalogLoading, error: catalogError } = useFinanceCatalog();
  const { data: fluxo, isLoading: fluxoLoading, error: fluxoError } = useFinanceFluxo();
  const { movements, isLoading: movLoading, error: movError } = useWallet();
  const [isValuesVisible, setIsValuesVisible] = useState(true);

  const isLoading = catalogLoading || fluxoLoading || movLoading;
  const error = catalogError ?? fluxoError ?? movError;

  const mask = (value: string) => (isValuesVisible ? value : 'R$ •••••');

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden pb-app">
        <Header title="Operações Financeiras" />

        {error && (
          <p className="mx-4 mt-4 text-sm text-red-600 bg-red-50 dark:bg-red-500/10 rounded-lg px-4 py-3">{error.message}</p>
        )}

        <div className="flex flex-wrap gap-4 p-4">
          <div className="flex min-w-[158px] flex-1 flex-col gap-3 rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 w-fit">
              <span className="material-symbols-outlined text-lg">trending_up</span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Recebimentos no Mês</p>
            <p className="text-2xl font-black leading-tight">
              {isLoading ? '…' : mask(formatCurrency(fluxo?.recebimentos.total ?? 0))}
            </p>
            <div className="pt-3 border-t border-slate-50 dark:border-slate-800 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Já Recebido:</span>
                <span className="text-emerald-500 font-bold">{mask(formatCurrency(fluxo?.recebimentos.recebido ?? 0))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pendente:</span>
                <span className="text-blue-500 font-bold">{mask(formatCurrency(fluxo?.recebimentos.pendente ?? 0))}</span>
              </div>
            </div>
          </div>

          <div className="flex min-w-[158px] flex-1 flex-col gap-3 rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 w-fit">
              <span className="material-symbols-outlined text-lg">trending_down</span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Contas a Pagar no Mês</p>
            <p className="text-2xl font-black leading-tight">
              {isLoading ? '…' : mask(formatCurrency(fluxo?.pagamentos.total ?? 0))}
            </p>
            <div className="pt-3 border-t border-slate-50 dark:border-slate-800 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Já Pago:</span>
                <span className="font-bold">{mask(formatCurrency(fluxo?.pagamentos.pago ?? 0))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pendente:</span>
                <span className="text-rose-500 font-bold">{mask(formatCurrency(fluxo?.pagamentos.pendente ?? 0))}</span>
              </div>
            </div>
          </div>
        </div>


        <div className="px-4 pt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold">Próximas Contas a Pagar</h3>
            <button type="button" onClick={() => navigate('/finance/pending?type=pagar')} className="text-primary text-xs font-bold">Ver Todas</button>
          </div>

          <div className="space-y-3">
            {payables.slice(0, 3).map((item) => (
              <div key={item.id} className={`flex gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border-l-4 ${borderColorClass[item.color] ?? 'border-slate-300'}`}>
                <div className="flex-1">
                  <p className="text-sm font-bold">{item.entity}</p>
                  {/* <p className="text-[10px] text-slate-500 italic">{item.type}</p> */}
                  <p className="text-lg font-bold mt-2">{mask(formatCurrency(item.value))}</p>
                </div>
                <span className={`text-[9px] font-bold h-fit px-2 py-0.5 rounded-full uppercase ${statusColorClass[item.color] ?? ''}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 pt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold">Recebimentos Pendentes</h3>
            <button type="button" onClick={() => navigate('/finance/pending?type=receber')} className="text-primary text-xs font-bold">Ver Todas</button>
          </div>
          <div className="space-y-3">
            {receivables.slice(0, 3).map((item) => (
              <div key={item.id} className={`flex gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border-l-4 ${borderColorClass[item.color] ?? 'border-slate-300'}`}>
                <div className="flex-1">
                  <p className="text-sm font-bold">{item.entity}</p>
                  {/* <p className="text-xs text-slate-500 italic">{item.type}</p> */}
                  <p className="text-lg font-bold mt-1">{mask(item.value)}</p>
                </div>
                <span className={`text-[10px] font-bold h-fit px-2 py-0.5 rounded-full uppercase ${statusColorClass[item.color] ?? ''}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold">Movimentações Recentes</h3>
            <button type="button" onClick={() => navigate('/finance/movements')} className="text-primary text-xs font-bold">Ver Todas</button>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800">
            {movements.length === 0 ? (
              <p className="p-4 text-sm text-slate-500">Sem movimentações nas últimas 24h.</p>
            ) : (
              movements.slice(0, 3).map((mov) => (
                <div key={mov.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold">{mov.type}</p>
                    <p className="text-[9px] text-slate-500 uppercase">{mov.method} • {mov.time}</p>
                  </div>
                  <p className={`text-sm font-bold ${mov.isIncome ? 'text-green-500' : 'text-slate-900'}`}>{mask(mov.value)}</p>
                </div>
              ))
            )}
          </div>
        </div>


        <BottomNav />
      </div>
    </div>
  );
}
