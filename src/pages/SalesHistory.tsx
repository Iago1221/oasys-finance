import React, { useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';
import { useSalesHistory } from '../hooks';
import { pedidoStatusIcon } from '../lib/constants';
import type { SalesHistoryOrder } from '../types/sales';

function statusTextColor(status: string): string {
    switch (status) {
        case 'Concluído':
            return 'text-emerald-500';
        case 'Cancelado':
            return 'text-red-500';
        case 'Confirmado':
            return 'text-indigo-500';
        case 'Migrado':
            return 'text-slate-500';
        default:
            return 'text-blue-500';
    }
}

const SalesHistory = () => {
    const { orders, isLoading, error } = useSalesHistory();
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<SalesHistoryOrder | null>(null);

    const toggleDetails = (id: number) => {
        setExpandedOrderId(expandedOrderId === id ? null : id);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen pb-app transition-colors duration-300">
            <Header title="Histórico de Vendas" />

            <div className="px-4 py-2 flex items-center gap-2">
                <BackButton to="/sales" label="Voltar para Vendas" />
            </div>

            <main className="px-4">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-4">Últimas 24 horas</p>
                {error && <p className="text-sm text-red-600 mb-4">{error.message}</p>}
                {isLoading ? (
                    <p className="text-sm text-slate-500 text-center py-8">Carregando pedidos…</p>
                ) : (
                <div className="space-y-3">
                    {orders.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-8">Nenhum pedido recente.</p>
                    ) : orders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800 transition-all duration-300">
                            <div
                                onClick={() => toggleDetails(order.id)}
                                className={`p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${expandedOrderId === order.id ? 'bg-slate-50 dark:bg-slate-800/80' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`size-10 rounded-full bg-${order.color}-500/10 flex items-center justify-center`}>
                                        <span className={`material-symbols-outlined text-${order.color}-500 text-xl`}>
                                            {pedidoStatusIcon(order.status)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">{order.client}</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-medium mt-0.5">{order.ref} • {order.date}</p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-3">
                                    <div>
                                        <p className="text-sm font-black text-slate-900 dark:text-slate-100">{order.value}</p>
                                        <p className={`text-[9px] font-bold uppercase text-${order.color}-500`}>{order.status}</p>
                                    </div>
                                    <span className={`material-symbols-outlined text-slate-300 transition-transform duration-300 ${expandedOrderId === order.id ? 'rotate-90 text-primary' : ''}`}>
                                        chevron_right
                                    </span>
                                </div>
                            </div>

                            {expandedOrderId === order.id && (
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="mb-4">
                                        <p className="text-[9px] uppercase font-bold text-slate-400">Itens do Pedido</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 italic">{order.items}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 py-2.5 rounded-lg text-[10px] font-bold uppercase hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-base">visibility</span>
                                        Ver Detalhes
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                )}
            </main>

            <BottomNav />

            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedOrder.ref}</p>
                                    <h4 className="text-lg font-black text-slate-900 dark:text-slate-100 leading-tight mt-1">{selectedOrder.client}</h4>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="material-symbols-outlined text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">close</button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Valor</p>
                                        <p className="text-sm font-black text-slate-900 dark:text-slate-100">{selectedOrder.value}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                                        <p className={`text-sm font-black ${statusTextColor(selectedOrder.status)}`}>{selectedOrder.status}</p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Data e Horário</p>
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{selectedOrder.date} às {selectedOrder.time}</p>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Itens do Pedido</p>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">{selectedOrder.items}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesHistory;
