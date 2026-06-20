import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import CompetenciaSelector from '../components/CompetenciaSelector';
import Header from '../components/Header';
import InstallAppButton, { canOfferAppInstall } from '../components/InstallAppButton';
import { useDashboardSummary } from '../hooks';
import { formatCurrency } from '../lib/mappers';

const Dashboard = () => {
  const navigate = useNavigate();
  const { resumo, fluxo, contasPagar, contasReceber, isLoading, error } = useDashboardSummary();

  const growth = resumo?.crescimentoPedidosConcluidos;

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans min-h-screen">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden pb-app">
        <Header title="Painel Oasys" />
        <CompetenciaSelector />

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
            <>
              {/* Fila 1: Pedidos Concluídos, Recebimentos, Pagamentos */}
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Pedidos concluídos (mês)</p>
                  <p className="text-2xl font-black mt-1">{formatCurrency(resumo?.totalPedidosConcluidos ?? 0)}</p>
                  {growth && (
                    <p className={`text-[10px] font-bold mt-1 ${growth.percentual >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {growth.percentual >= 0 ? '+' : ''}{growth.percentual}%
                      {growth.isProporcional ? ` vs ${growth.diasDecorridos}d mesmo mês ano ant.` : ' vs mesmo mês ano ant.'}
                    </p>
                  )}
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Recebimentos (mês)</p>
                  <p className="text-2xl font-black mt-1">{formatCurrency(fluxo?.recebimentos.total ?? 0)}</p>
                  {contasReceber?.previsto7Dias != null && contasReceber.previsto7Dias > 0 && (
                    <p className="text-[10px] text-emerald-500 font-bold mt-1">
                      Previsto em 7 dias: {formatCurrency(contasReceber.previsto7Dias)}
                    </p>
                  )}
                </div>

                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Pagamentos (mês)</p>
                  <p className="text-2xl font-black mt-1">{formatCurrency(fluxo?.pagamentos.total ?? 0)}</p>
                  {contasPagar?.venceEm7Dias != null && contasPagar.venceEm7Dias > 0 && (
                    <p className="text-[10px] text-amber-500 font-bold mt-1">
                      Vence em 7 dias: {formatCurrency(contasPagar.venceEm7Dias)}
                    </p>
                  )}
                </div>
              </section>

              {/* Fila 2: Qtd Pedidos */}
              {resumo && (
                <section className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p className="text-[10px] font-bold uppercase text-slate-500">Qtd. Pedidos</p>
                    <p className="text-2xl font-black mt-1">{resumo.countPedidos ?? 0}</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Concluídos: {resumo.countConcluidos ?? 0}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p className="text-[10px] font-bold uppercase text-slate-500">Pendente</p>
                    <p className="text-2xl font-black mt-1">{formatCurrency(fluxo?.recebimentos.pendente ?? 0)}</p>
                    <p className="text-[10px] text-slate-400 mt-1">a receber</p>
                  </div>
                </section>
              )}

              {/* Acesso rápido */}
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
            </>
          )}
        </main>

        <BottomNav />
      </div>
    </div>
  );
};

export default Dashboard;
