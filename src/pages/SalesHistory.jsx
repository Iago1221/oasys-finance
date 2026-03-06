import React, { useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';

const SalesHistory = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    const orders = [
        { id: 1, client: 'Tech Solutions Inc.', date: 'Hoje', time: '14:20', value: 'R$ 12.450,00', status: 'Pendente', ref: '#SO-8842', items: '15x Pro Watch Series X, 5x Audio-Z Headset', tax: 'R$ 1.120,50 (ICMS)', color: 'blue' },
        { id: 2, client: 'Global Logistics Ltd', date: 'Hoje', time: '11:05', value: 'R$ 8.920,50', status: 'Pendente', ref: '#SO-8839', items: '2x MacBook Pro M2, 10x Cabo USB-C', tax: 'R$ 802,84 (ICMS)', color: 'blue' },
        { id: 3, client: 'Petrobras Distrib.', date: 'Ontem', time: '16:45', value: 'R$ 42.100,00', status: 'Faturado', ref: '#SO-8835', items: '500x Carregador Turbo 20W', tax: 'R$ 3.789,00 (ICMS)', color: 'emerald' },
        { id: 4, client: 'Hospital Santa Cruz', date: 'Ontem', time: '09:30', value: 'R$ 5.600,00', status: 'Cancelado', ref: '#SO-8830', items: '40x Teclado Mecânico RGB', tax: 'R$ 504,00 (ICMS)', color: 'red' },
        { id: 5, client: 'Universidade Federal', date: '03/03', time: '15:20', value: 'R$ 15.800,00', status: 'Faturado', ref: '#SO-8825', items: '10x MacBook Pro M2', tax: 'R$ 1.422,00 (ICMS)', color: 'emerald' },
    ];

    const filteredOrders = orders.filter(order => {
        if (activeFilter === 'Todos') return true;
        if (activeFilter === 'Faturados') return order.status === 'Faturado';
        if (activeFilter === 'Pendentes') return order.status === 'Pendente';
        return true;
    });

    const toggleDetails = (id) => {
        setExpandedOrderId(expandedOrderId === id ? null : id);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen pb-24 transition-colors duration-300">
            <Header title="Histórico de Vendas" />

            <div className="px-4 py-2 flex items-center gap-2">
                <button
                    onClick={() => navigate('/sales')}
                    className="flex items-center gap-1 text-primary font-bold text-sm py-2 hover:opacity-80 transition-opacity"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Voltar para Vendas
                </button>
            </div>

            <main className="px-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-white dark:bg-slate-900 p-1 flex rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 w-full">
                        {['Todos', 'Faturados', 'Pendentes'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 ${activeFilter === filter
                                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
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
                                        <button className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 py-2.5 rounded-lg text-[10px] font-bold uppercase hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                                            Exportar PDF
                                        </button>
                                        {order.status === 'Pendente' && (
                                            <button className="flex-1 bg-primary text-white py-2.5 rounded-lg text-[10px] font-bold uppercase hover:opacity-90 transition-opacity">
                                                Faturar Agora
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>

            <BottomNav />
        </div>
    );
};

export default SalesHistory;
