import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { useSalesWorkspace } from '../hooks';
import { formatCurrency } from '../lib/mappers';
import type { SalesOrderPreview } from '../types/sales';

function barWidth(value: number, max: number): string {
  if (max <= 0) return '0%';
  return `${Math.max(8, Math.round((value / max) * 100))}%`;
}

export default function Sales() {
  const navigate = useNavigate();
  const { resumo, fiscal, highValueOrders, isLoading, error } = useSalesWorkspace();
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrderPreview | null>(null);

  const handlePrint = (order: SalesOrderPreview) => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>Pedido ${order.ref}</title>
      <style>body{font-family:sans-serif;padding:32px;color:#111}h2{margin-bottom:4px}p{margin:4px 0;font-size:14px}.label{font-size:11px;color:#888;text-transform:uppercase;margin-top:12px}</style>
      </head><body>
      <h2>Pedido ${order.ref}</h2>
      <p class="label">Cliente</p><p>${order.client}</p>
      <p class="label">Horário</p><p>${order.time}</p>
      <p class="label">Valor</p><p>${order.value}</p>
      <p class="label">Status</p><p>${order.status}</p>
      <p class="label">Itens</p><p>${order.items}</p>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  const maxPipeline = Math.max(
    resumo?.totalOrcamentos ?? 0,
    resumo?.totalPedidos ?? 0,
    resumo?.totalPedidosConcluidos ?? 0,
    resumo?.totalPedidosFaturados ?? 0,
    1,
  );

  const pipelineTotal =
    (resumo?.totalOrcamentos ?? 0) +
    (resumo?.totalPedidos ?? 0) +
    (resumo?.totalPedidosConcluidos ?? 0) +
    (resumo?.totalPedidosFaturados ?? 0);

  const growth = resumo?.crescimentoPedidosConcluidos;

  const pipelineRows = [
    { label: 'Orçamentos', value: resumo?.totalOrcamentos ?? 0 },
    { label: 'Pedidos', value: resumo?.totalPedidos ?? 0 },
    { label: 'Pedidos Concluídos', value: resumo?.totalPedidosConcluidos ?? 0 },
    { label: 'Pedidos Faturados', value: resumo?.totalPedidosFaturados ?? 0 },
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen">
      <div className="relative flex min-h-screen flex-col overflow-x-hidden pb-app">
        <Header title="Vendas & Faturamento" />

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
              <section className="p-4">
                <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Conversão de Pipeline
                      </p>
                      <h2 className="text-3xl font-black mt-1 leading-tight">{formatCurrency(pipelineTotal)}</h2>
                    </div>
                    {growth && (
                      <div
                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                          growth.percentual >= 0
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {growth.percentual >= 0 ? 'trending_up' : 'trending_down'}
                        </span>
                        {growth.percentual >= 0 ? '+' : ''}
                        {growth.percentual}%
                      </div>
                    )}
                  </div>

                  <div className="space-y-5">
                    {pipelineRows.map((row) => (
                      <div key={row.label} className="space-y-2">
                        <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          <span>{row.label}</span>
                          <span className="text-slate-900 dark:text-slate-100 italic">{formatCurrency(row.value)}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: barWidth(row.value, maxPipeline) }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="px-4 py-2">
                <h3 className="text-[10px] font-black text-slate-400 mb-4 px-1 uppercase tracking-widest">
                  Status de NFe
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
                    <p className="text-2xl font-black">{fiscal?.nfeAutorizadas ?? 0}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Autorizadas</p>
                  </div>
                  <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
                    <p className="text-2xl font-black">{fiscal?.xmlsPendentesManifestacao ?? 0}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">XML Manifesto Pendente</p>
                  </div>
                </div>
              </section>

              <section className="px-4 py-6">
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
                            <div
                              className={`size-10 rounded-full flex items-center justify-center ${
                                order.color === 'emerald' ? 'bg-emerald-500/10' : 'bg-blue-500/10'
                              }`}
                            >
                              <span
                                className={`material-symbols-outlined text-xl ${
                                  order.color === 'emerald' ? 'text-emerald-500' : 'text-blue-500'
                                }`}
                              >
                                {order.status === 'Faturado' ? 'check_circle' : 'receipt_long'}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-bold leading-tight">{order.client}</p>
                              <p className="text-[10px] text-slate-500 font-medium uppercase mt-0.5">
                                {order.ref} • {order.time}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <p className="text-sm font-black">{order.value}</p>
                            <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                          </div>
                        </div>

                        {expandedOrderId === order.id && (
                          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                            <p className="text-xs text-slate-600 dark:text-slate-300 italic">{order.items}</p>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedOrder(order)}
                                className="flex-1 border border-slate-200 dark:border-slate-700 py-2 rounded-xl text-[10px] font-bold uppercase"
                              >
                                Ver Detalhes
                              </button>
                              <button
                                type="button"
                                onClick={() => handlePrint(order)}
                                className="flex-1 border border-slate-200 dark:border-slate-700 py-2 rounded-xl text-[10px] font-bold uppercase"
                              >
                                Imprimir
                              </button>
                            </div>
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
                <h4 className="text-lg font-black">{selectedOrder.client}</h4>
                <button type="button" onClick={() => setSelectedOrder(null)} className="material-symbols-outlined">
                  close
                </button>
              </div>
              <p className="text-sm mb-4">{selectedOrder.items}</p>
              <button
                type="button"
                onClick={() => handlePrint(selectedOrder)}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm"
              >
                Imprimir Pedido
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
