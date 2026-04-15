import React, { useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';
import SegmentedTabs from '../components/SegmentedTabs';
import { useSalesHistory } from '../hooks';
import type { SalesHistoryOrder } from '../types/sales';

const SalesHistory = () => {
    const { orders } = useSalesHistory();
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<SalesHistoryOrder | null>(null);

    const handlePrint = (order: SalesHistoryOrder) => {
        const win = window.open('', '_blank');
        win.document.write(`
            <html><head><title>Pedido ${order.ref}</title>
            <style>body{font-family:sans-serif;padding:32px;color:#111}h2{margin-bottom:4px}p{margin:4px 0;font-size:14px}.label{font-size:11px;color:#888;text-transform:uppercase;margin-top:12px}</style>
            </head><body>
            <h2>Pedido ${order.ref}</h2>
            <p class="label">Cliente</p><p>${order.client}</p>
            <p class="label">Data</p><p>${order.date} às ${order.time}</p>
            <p class="label">Valor</p><p>${order.value}</p>
            <p class="label">Status</p><p>${order.status}</p>
            <p class="label">Itens</p><p>${order.items}</p>
            <p class="label">Impostos</p><p>${order.tax}</p>
            </body></html>
        `);
        win.document.close();
        win.print();
    };

    const filteredOrders = orders.filter(order => {
        if (activeFilter === 'Todos') return true;
        if (activeFilter === 'Faturados') return order.status === 'Faturado';
        if (activeFilter === 'Pendentes') return order.status === 'Pendente';
        return true;
    });

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
                <div className="flex items-center justify-between mb-4">
                    <SegmentedTabs
                        tabs={['Todos', 'Faturados', 'Pendentes']}
                        activeTab={activeFilter}
                        onChange={setActiveFilter}
                    />
                </div>

                <div className="space-y-3">
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800 transition-all duration-300">
                            <div
                                onClick={() => toggleDetails(order.id)}
                                className={`p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${expandedOrderId === order.id ? 'bg-slate-50 dark:bg-slate-800/80' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`size-10 rounded-full bg-${order.color}-500/10 flex items-center justify-center`}>
                                        <span className={`material-symbols-outlined text-${order.color}-500 text-xl`}>
                                            {order.status === 'Faturado' ? 'check_circle' : order.status === 'Cancelado' ? 'cancel' : 'receipt_long'}
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
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-[9px] uppercase font-bold text-slate-400">Itens do Pedido</p>
                                            <p className="text-xs text-slate-600 dark:text-slate-300 italic">{order.items}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] uppercase font-bold text-slate-400">Impostos Computados</p>
                                            <p className="text-xs text-slate-600 dark:text-slate-300">{order.tax}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 py-2.5 rounded-lg text-[10px] font-bold uppercase hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-base">visibility</span>
                                            Ver Detalhes
                                        </button>
                                        <button
                                            onClick={() => handlePrint(order)}
                                            className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 py-2.5 rounded-lg text-[10px] font-bold uppercase hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-base">print</span>
                                            Imprimir
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>

            <BottomNav />

            {/* Modal Ver Detalhes */}
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
                                        <p className={`text-sm font-black ${selectedOrder.status === 'Faturado' ? 'text-emerald-500' :
                                                selectedOrder.status === 'Cancelado' ? 'text-red-500' : 'text-blue-500'
                                            }`}>{selectedOrder.status}</p>
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

                                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Impostos Computados</p>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{selectedOrder.tax}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => handlePrint(selectedOrder)}
                                className="w-full mt-5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">print</span>
                                Imprimir Pedido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesHistory;
