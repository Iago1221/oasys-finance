import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import CompetenciaSelector from '../components/CompetenciaSelector';
import Header from '../components/Header';
import { useSalesWorkspace } from '../hooks';
import { pedidoStatusIcon } from '../lib/constants';
import { formatCurrency } from '../lib/mappers';
import type { SalesOrderPreview } from '../types/sales';
import type { CategoriaVenda } from '../api/types';

const PIE_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6b7280',
];

function PieChart({ categorias }: { categorias: CategoriaVenda[] }) {
  const top = categorias.slice(0, 8);
  let cumulative = 0;

  return (
    <div className="flex flex-col gap-3">
      <svg viewBox="0 0 200 200" className="w-40 h-40 mx-auto -rotate-90">
        {top.map((cat, i) => {
          const pct = cat.percentual / 100;
          const offset = cumulative;
          cumulative += pct;
          const r = 80;
          const circumference = 2 * Math.PI * r;
          return (
            <circle
              key={cat.categoria}
              cx="100"
              cy="100"
              r={r}
              fill="none"
              stroke={PIE_COLORS[i % PIE_COLORS.length]}
              strokeWidth="38"
              strokeDasharray={`${pct * circumference} ${circumference}`}
              strokeDashoffset={-offset * circumference}
            />
          );
        })}
      </svg>
      <div className="space-y-1.5">
        {top.map((cat, i) => (
          <div key={cat.categoria} className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="size-2.5 rounded-full flex-none" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
              <span className="text-slate-700 dark:text-slate-300 truncate">{cat.categoria}</span>
            </div>
            <div className="flex items-center gap-2 flex-none ml-2">
              <span className="text-slate-500 font-mono">{cat.percentual.toFixed(1)}%</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{formatCurrency(cat.valor)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Sales() {
  const navigate = useNavigate();
  const {
    fiscal,
    vendas,
    ranking,
    categorias,
    vendedores,
    vendedorId,
    setVendedorId,
    highValueOrders,
    isLoading,
    rankingLoading,
    categoriaLoading,
    error,
  } = useSalesWorkspace();
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrderPreview | null>(null);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden pb-app">
        <Header title="Vendas & Faturamento" />
        <CompetenciaSelector />

        {/* Filtro de Vendedor */}
        {vendedores.length > 0 && (
          <div className="px-4 pt-3 pb-1">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400 pointer-events-none">person</span>
              <select
                value={vendedorId ?? ''}
                onChange={(e) => setVendedorId(e.target.value === '' ? undefined : Number(e.target.value))}
                className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-[12px] font-bold text-slate-700 dark:text-slate-200 shadow-sm focus:outline-none"
              >
                <option value="">Todos os vendedores</option>
                {vendedores.map((v) => (
                  <option key={v.id} value={v.id}>{v.nome}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400 pointer-events-none">expand_more</span>
            </div>
          </div>
        )}

        <main className="flex-1">
          {error && (
            <p className="mx-4 mt-4 text-sm text-red-600 bg-red-50 dark:bg-red-500/10 rounded-lg px-4 py-3">
              {error.message}
            </p>
          )}

          {isLoading ? (
            <p className="text-sm text-slate-500 text-center py-12">Carregando vendas…</p>
          ) : (
            <Fragment>
              {/* Cards principais de vendas */}
              <section className="p-4 grid grid-cols-2 gap-4">
                <div className="col-span-2 rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Vendido</p>
                  <p className="text-3xl font-black mt-1">{formatCurrency(vendas?.totalVendido ?? 0)}</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Concluídos: {formatCurrency(vendas?.totalConcluidos ?? 0)}
                  </p>
                </div>

                <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Qtd. Pedidos</p>
                  <p className="text-2xl font-black mt-1">{vendas?.countPedidos ?? 0}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Concluídos: {vendas?.countConcluidos ?? 0}</p>
                </div>

                <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ticket Médio</p>
                  <p className="text-2xl font-black mt-1">{formatCurrency(vendas?.ticketMedio ?? 0)}</p>
                  <p className="text-[10px] text-slate-400 mt-1">por pedido</p>
                </div>
              </section>

              {/* Malha Fiscal */}
              <section className="px-4 pb-2">
                <h3 className="text-[10px] font-black text-slate-400 mb-3 px-1 uppercase tracking-widest">TOTAIS DF-E</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                    <p className="text-[13px] font-black leading-tight">{formatCurrency(fiscal?.valorPagamentoDigital ?? 0)}</p>
                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase leading-tight">Pgto Digital</p>
                    <p className="text-[8px] text-slate-400 mt-0.5">{fiscal?.countPagamentoDigital ?? 0} pedidos</p>
                  </div>
                  <div className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                    <p className="text-[13px] font-black leading-tight">{formatCurrency(fiscal?.valorDfe ?? 0)}</p>
                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase leading-tight">Total DF-e</p>
                    <p className="text-[8px] text-slate-400 mt-0.5">{fiscal?.nfeAutorizadas ?? 0} NF-e · {fiscal?.nfceAutorizadas ?? 0} NFC-e</p>
                  </div>
                  <div className={`rounded-2xl p-4 border shadow-sm text-center ${
                    (fiscal?.diferencaFiscal ?? 0) >= 0
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20'
                      : 'bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20'
                  }`}>
                    <p className={`text-[13px] font-black leading-tight ${(fiscal?.diferencaFiscal ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {(fiscal?.diferencaFiscal ?? 0) >= 0 ? '+' : ''}{formatCurrency(Math.abs(fiscal?.diferencaFiscal ?? 0))}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase leading-tight">Diferença</p>
                  </div>
                </div>
              </section>

              {/* Ranking de Produtos */}
              <section className="px-4 py-4">
                <h3 className="text-[10px] font-black text-slate-400 mb-3 px-1 uppercase tracking-widest">Top 10 Produtos</h3>
                {rankingLoading ? (
                  <p className="text-sm text-slate-500 text-center py-4">Carregando…</p>
                ) : !ranking?.ranking?.length ? (
                  <p className="text-sm text-slate-500 text-center py-4">Sem dados para o período.</p>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                    {ranking.ranking.map((p, i) => (
                      <div key={p.id} className="flex items-center gap-3 px-4 py-3 border-b last:border-0 border-slate-50 dark:border-slate-800/50">
                        <span className="text-[11px] font-black text-slate-400 w-5 text-center flex-none">{i + 1}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-bold truncate">{p.descricao}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{p.sku ?? '—'}</p>
                        </div>
                        <div className="text-right flex-none">
                          <p className="text-[12px] font-black">{p.qtdVendida} un.</p>
                          <p className="text-[10px] text-slate-400">{formatCurrency(p.valorVendido)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Vendas por Categoria */}
              <section className="px-4 py-2">
                <h3 className="text-[10px] font-black text-slate-400 mb-3 px-1 uppercase tracking-widest">Vendas por Categoria</h3>
                {categoriaLoading ? (
                  <p className="text-sm text-slate-500 text-center py-4">Carregando…</p>
                ) : !categorias?.categorias?.length ? (
                  <p className="text-sm text-slate-500 text-center py-4">Sem dados para o período.</p>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
                    <PieChart categorias={categorias.categorias} />
                  </div>
                )}
              </section>

              {/* NF-e Status */}
              <section className="px-4 py-4">
                <h3 className="text-[10px] font-black text-slate-400 mb-3 px-1 uppercase tracking-widest">XML Pendente</h3>
                <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
                  <p className="text-2xl font-black">{fiscal?.xmlsPendentesManifestacao ?? 0}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">XML Manifesto Pendente</p>
                </div>
              </section>

              {/* Últimos Pedidos */}
              <section className="px-4 py-4">
                <div className="flex items-center justify-between mb-4 px-1">
                  <div>
                    <h3 className="text-base font-black tracking-tight">Últimos Pedidos</h3>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5 uppercase">Últimas 24 horas</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/sales/history')}
                    className="text-[10px] font-black text-primary uppercase tracking-widest"
                  >
                    Ver Todos
                  </button>
                </div>

                {highValueOrders.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-6">Nenhum pedido recente.</p>
                ) : (
                  <div className="space-y-3">
                    {highValueOrders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800"
                      >
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              setExpandedOrderId(expandedOrderId === order.id ? null : order.id);
                            }
                          }}
                          className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`size-10 rounded-full flex items-center justify-center bg-${order.color}-500/10`}>
                              <span className={`material-symbols-outlined text-xl text-${order.color}-500`}>
                                {pedidoStatusIcon(order.status)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-bold leading-tight">{order.client}</p>
                              <p className="text-[10px] text-slate-500 font-medium uppercase mt-0.5">
                                {order.ref} · {order.time}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <div>
                              <p className="text-sm font-black">{order.value}</p>
                              <p className={`text-[9px] font-bold uppercase text-${order.color}-500`}>{order.status}</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                          </div>
                        </div>

                        {expandedOrderId === order.id && (
                          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                            <p className="text-xs text-slate-600 dark:text-slate-300 italic">{order.items}</p>
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              className="w-full border border-slate-200 dark:border-slate-700 py-2 rounded-xl text-[10px] font-bold uppercase"
                            >
                              Ver Detalhes
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </Fragment>
          )}
        </main>

        <BottomNav />

        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl">
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedOrder.ref}</p>
                  <h4 className="text-lg font-black">{selectedOrder.client}</h4>
                </div>
                <button type="button" onClick={() => setSelectedOrder(null)} className="material-symbols-outlined">
                  close
                </button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Valor</p>
                    <p className="text-sm font-black">{selectedOrder.value}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                    <p className={`text-sm font-black text-${selectedOrder.color}-500`}>{selectedOrder.status}</p>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Itens do Pedido</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 italic">{selectedOrder.items}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
