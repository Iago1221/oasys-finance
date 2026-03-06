import React, { useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';

const Inventory = () => {
    const navigate = useNavigate();
    const [activeWarehouse, setActiveWarehouse] = useState('Matriz');

    const lowStockAlerts = [
        { id: 1, name: 'Pro Watch Series X', sku: 'PW-992-B', current: 2, min: 15, image: 'https://ui-avatars.com/api/?name=Watch&background=ef4444&color=fff' },
        { id: 2, name: 'Fone Audio-Z', sku: 'AZ-440-S', current: 5, min: 20, image: 'https://ui-avatars.com/api/?name=Headset&background=ef4444&color=fff' },
    ];

    const recentMovements = [
        { id: 1, type: 'Entrada de Mercadoria', origin: 'Fornecedor Alpha', time: '10:45 AM', quantity: '+150 uni', isEntry: true },
        { id: 2, type: 'Saída por Venda', origin: 'Pedido #SO-442', time: '08:20 AM', quantity: '-12 uni', isEntry: false },
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-300">
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24">

                <Header title="Monitor de Estoque" />

                {/* Main Action: Consultation */}
                <div className="p-4">
                    <button
                        onClick={() => navigate('/inventory/list')}
                        className="w-full bg-primary text-white p-5 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-between group hover:scale-[1.02] transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-xl">
                                <span className="material-symbols-outlined text-3xl">inventory_2</span>
                            </div>
                            <div className="text-left">
                                <p className="text-lg font-black leading-tight">Consultar Produtos</p>
                                <p className="text-xs text-white/70 font-medium">Ver saldo, SKU e categorias</p>
                            </div>
                        </div>
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                </div>

                {/* Warehouse Selector (Renamed to Depósitos) */}
                <div className="px-4 py-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">Depósitos</h3>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {['Matriz', 'Filial Sul', 'Outlet Oeste', 'Logística'].map((warehouse) => (
                            <button
                                key={warehouse}
                                onClick={() => setActiveWarehouse(warehouse)}
                                className={`flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border ${activeWarehouse === warehouse
                                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-transparent shadow-md'
                                        : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-100 dark:border-slate-800'
                                    }`}
                            >
                                {warehouse}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Summary Metrics */}
                <div className="grid grid-cols-2 gap-4 px-4 py-4">
                    <div className="flex flex-col p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Valor Total</span>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">R$ 1.24M</p>
                        <div className="mt-2 flex items-center text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit">
                            <span className="material-symbols-outlined text-[12px] mr-1">trending_up</span>
                            +4.2%
                        </div>
                    </div>
                    <div className="flex flex-col p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Itens Ativos</span>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">1.854</p>
                        <div className="mt-2 flex items-center text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full w-fit">
                            <span className="material-symbols-outlined text-[12px] mr-1">inventory</span>
                            Estável
                        </div>
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="px-4 pt-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Estoque Baixo</h3>
                        <button
                            onClick={() => navigate('/inventory/low-stock')}
                            className="text-primary text-[10px] font-black uppercase tracking-widest"
                        >
                            Ver Todas
                        </button>
                    </div>
                    <div className="space-y-3">
                        {lowStockAlerts.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-red-500/30 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="h-11 w-11 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                                        <img className="h-full w-full object-cover" src={item.image} alt={item.name} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold truncate pr-2">{item.name}</p>
                                        <p className="text-[10px] text-slate-500 font-mono">{item.sku}</p>
                                    </div>
                                </div>
                                <div className="text-right flex-none">
                                    <p className="text-sm font-black text-red-500">{item.current} uni</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Mín: {item.min}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Movements Summary */}
                <div className="px-4 pt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Movimentações Recentes</h3>
                        <button
                            onClick={() => navigate('/inventory/movements')}
                            className="text-primary text-[10px] font-black uppercase tracking-widest"
                        >
                            Ver Todas
                        </button>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800 divide-y divide-slate-50 dark:divide-slate-800/50">
                        {recentMovements.map((mov) => (
                            <div key={mov.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`size-10 rounded-full ${mov.isEntry ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'} flex items-center justify-center`}>
                                        <span className="material-symbols-outlined text-xl">
                                            {mov.isEntry ? 'download' : 'upload'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{mov.type}</p>
                                        <p className="text-[10px] text-slate-500 font-medium">{mov.origin} • {mov.time}</p>
                                    </div>
                                </div>
                                <p className={`text-sm font-black ${mov.isEntry ? 'text-blue-500' : 'text-orange-500'}`}>
                                    {mov.quantity}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <BottomNav />
            </div>
        </div>
    );
};

export default Inventory;
