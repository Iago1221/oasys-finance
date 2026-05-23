import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import InstallAppButton, { canOfferAppInstall } from '../components/InstallAppButton';
import { useDashboardSummary } from '../hooks';
import { formatCurrency } from '../lib/mappers';

const Dashboard = () => {
  const navigate = useNavigate();
  const { resumo, fluxo, isLoading, error } = useDashboardSummary();

  const pipelineTotal =
    (resumo?.totalOrcamentos ?? 0) +
    (resumo?.totalPedidos ?? 0);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans min-h-screen">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden pb-app">
        <Header title="Painel Oasys" />

        <main className="flex-1 p-4 space-y-6">
          {canOfferAppInstall() && (
            <div className="flex justify-end">
              <InstallAppButton />
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 dark:bg-red-500/10 rounded-lg px-4 py-3">{error.message}</p>
          )}

          {isLoading ? (
            <p className="text-sm text-slate-500 text-center py-8">Carregando resumo…</p>
          ) : (
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-[10px] font-bold uppercase text-slate-500">Pedidos concluídos (mês)</p>
                <p className="text-2xl font-black mt-1">{formatCurrency(resumo?.totalPedidosConcluidos ?? 0)}</p>
                {resumo?.crescimentoPedidosConcluidos && (
                  <p
                    className={`text-[10px] font-bold mt-1 ${
                      resumo.crescimentoPedidosConcluidos.percentual >= 0 ? 'text-emerald-500' : 'text-red-500'
                    }`}
                  >
                    {resumo.crescimentoPedidosConcluidos.percentual >= 0 ? '+' : ''}
                    {resumo.crescimentoPedidosConcluidos.percentual}% vs mês anterior
                  </p>
                )}
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-[10px] font-bold uppercase text-slate-500">Recebimentos (mês)</p>
                <p className="text-2xl font-black mt-1">{formatCurrency(fluxo?.recebimentos.total ?? 0)}</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Pendente: {formatCurrency(fluxo?.recebimentos.pendente ?? 0)}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-[10px] font-bold uppercase text-slate-500">Pagamentos (mês)</p>
                <p className="text-2xl font-black mt-1">{formatCurrency(fluxo?.pagamentos.total ?? 0)}</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Pendente: {formatCurrency(fluxo?.pagamentos.pendente ?? 0)}
                </p>
              </div>
            </section>
          )}

          <section className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Acesso rápido</h2>
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => navigate('/sales')}
                className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <span className="font-bold">Vendas & Faturamento</span>
                <span className="material-symbols-outlined text-primary">chevron_right</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/finance')}
                className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <span className="font-bold">Operações Financeiras</span>
                <span className="material-symbols-outlined text-primary">chevron_right</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/inventory')}
                className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <span className="font-bold">Monitor de Estoque</span>
                <span className="material-symbols-outlined text-primary">chevron_right</span>
              </button>
            </div>
          </section>

          {!isLoading && resumo && (
            <p className="text-[10px] text-center text-slate-400 uppercase">
              Pipeline agregado: {formatCurrency(pipelineTotal)}
            </p>
          )}
        </main>

        <BottomNav />
      </div>
    </div>
  );
};

export default Dashboard;
