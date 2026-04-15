import React, { useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { useLowStockItems } from '../hooks';

const LowStock = () => {
    const navigate = useNavigate();
    const { items: lowStockItems } = useLowStockItems();
    const [actionDoneIds, setActionDoneIds] = useState<number[]>([]);

    const handleAction = (id: number) => {
        if (!actionDoneIds.includes(id)) {
            setActionDoneIds([...actionDoneIds, id]);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen pb-app transition-colors duration-300">
            <Header title="Alertas de Estoque" />

            <div className="px-4 py-2 flex items-center gap-2">
                <BackButton to="/inventory" label="Voltar para Estoque" />
            </div>

            <main className="px-4 space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Identificamos {lowStockItems.length} itens abaixo do mínimo
                    </span>
                </div>

                {lowStockItems.map((item) => (
                    <div key={item.id} className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 border-l-4 border-l-${item.color}-500 overflow-hidden shadow-sm`}>
                        <div className="p-4">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-lg overflow-hidden flex-none">
                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold truncate">{item.name}</h4>
                                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{item.sku}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full bg-${item.color === 'red' ? 'red' : 'yellow'}-500 transition-all duration-500`}
                                                style={{ width: `${Math.min((item.current / item.min) * 100, 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400">{Math.round((item.current / item.min) * 100)}%</span>
                                    </div>
                                </div>
                                <div className="text-right flex-none">
                                    <p className={`text-sm font-black text-${item.color === 'red' ? 'red' : 'yellow'}-500`}>{item.current} uni</p>
                                    <p className="text-[10px] text-slate-400 font-medium">Mínimo: {item.min}</p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex gap-2">
                                <button
                                    onClick={() => handleAction(item.id)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-200 ${actionDoneIds.includes(item.id)
                                        ? 'bg-emerald-500 text-white cursor-default'
                                        : 'bg-primary text-white hover:opacity-90 active:scale-95'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">
                                        {actionDoneIds.includes(item.id) ? 'check_circle' : 'shopping_cart_checkout'}
                                    </span>
                                    {actionDoneIds.includes(item.id) ? 'Pedido Realizado' : 'Solicitar Reposição'}
                                </button>
                                <button
                                    onClick={() => navigate('/inventory/movements')}
                                    className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold py-2.5 rounded-lg uppercase hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[16px]">history</span>
                                    Histórico
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </main>

            <BottomNav />
        </div>
    );
};

export default LowStock;
