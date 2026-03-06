import React, { useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';

const InventoryMovements = () => {
    const navigate = useNavigate();

    // Estados de Interatividade
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [expandedMovId, setExpandedMovId] = useState(null);

    const movements = [
        { id: 1, type: 'Entrada de Mercadoria', origin: 'Fornecedor Alpha', time: '10:45 AM', date: 'Hoje', quantity: '+150', unit: 'uni', isEntry: true, ref: '#NF-88221', details: 'Importação de componentes para Pro Watch Series X. Recebido via Logística Expresso.' },
        { id: 2, type: 'Saída por Venda', origin: 'Pedido #SO-442', time: '08:20 AM', date: 'Hoje', quantity: '-12', unit: 'uni', isEntry: false, ref: '#VB-44210', details: 'Baixa de estoque por venda direta em balcão. Cliente final: João Silva.' },
        { id: 3, type: 'Ajuste de Inventário', origin: 'Contagem Matriz', time: 'Ontem', date: '04/03', quantity: '+5', unit: 'uni', isEntry: true, ref: '#AJ-99032', details: 'Correção manual após auditoria física trimestral.' },
        { id: 4, type: 'Transferência entre Depósitos', origin: 'Matriz → Filial Sul', time: 'Ontem', date: '04/03', quantity: '-50', unit: 'uni', isEntry: false, ref: '#TR-44210', details: 'Reposição de estoque para a unidade regional Filial Sul.' },
        { id: 5, type: 'Saída por Avaria', origin: 'Armazém Matriz', time: 'Anteontem', date: '03/03', quantity: '-2', unit: 'uni', isEntry: false, ref: '#AV-001', details: 'Item danificado durante manuseio interno no estoque.' },
    ];

    const filteredMovements = movements.filter(mov => {
        if (activeFilter === 'Todos') return true;
        if (activeFilter === 'Entradas') return mov.isEntry;
        if (activeFilter === 'Saídas') return !mov.isEntry;
        return true;
    });

    const toggleDetails = (id) => {
        setExpandedMovId(expandedMovId === id ? null : id);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen pb-24 transition-colors duration-300">
            <Header title="Movimentações de Estoque" />

            <div className="px-4 py-2 flex items-center gap-2">
                <button
                    onClick={() => navigate('/inventory')}
                    className="flex items-center gap-1 text-primary font-bold text-sm py-2 hover:opacity-80 transition-opacity"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Voltar para Estoque
                </button>
            </div>

            <main className="px-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-white dark:bg-slate-900 p-1 flex rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 w-full">
                        {['Todos', 'Entradas', 'Saídas'].map((filter) => (
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

                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800">
                    {filteredMovements.map((mov) => (
                        <div key={mov.id} className="transition-all duration-300">
                            <div
                                onClick={() => toggleDetails(mov.id)}
                                className={`p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${expandedMovId === mov.id ? 'bg-slate-50 dark:bg-slate-800/80' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`size-10 rounded-full ${mov.isEntry ? 'bg-blue-500/10' : 'bg-orange-500/10'} flex items-center justify-center`}>
                                        <span className={`material-symbols-outlined ${mov.isEntry ? 'text-blue-500' : 'text-orange-500'} text-xl`}>
                                            {mov.isEntry ? 'download' : 'upload'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">{mov.type}</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-medium mt-0.5">{mov.origin} • {mov.date}</p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-3">
                                    <p className={`text-sm font-black ${mov.isEntry ? 'text-blue-500' : 'text-orange-500'}`}>
                                        {mov.quantity}
                                    </p>
                                    <span className={`material-symbols-outlined text-slate-300 transition-transform duration-300 ${expandedMovId === mov.id ? 'rotate-90 text-primary' : ''}`}>
                                        chevron_right
                                    </span>
                                </div>
                            </div>

                            {/* Detalhes Expandidos */}
                            {expandedMovId === mov.id && (
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="grid grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <p className="text-[9px] uppercase font-bold text-slate-400">Referência</p>
                                            <p className="text-xs font-mono text-slate-600 dark:text-slate-300">{mov.ref}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] uppercase font-bold text-slate-400">Unid. Medida</p>
                                            <p className="text-xs text-slate-600 dark:text-slate-300 capitalize">{mov.unit}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Descrição Detalhada</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                                            {mov.details}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {filteredMovements.length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center text-center opacity-50">
                            <span className="material-symbols-outlined text-6xl mb-2 text-slate-300">inventory_2</span>
                            <p className="text-sm font-bold text-slate-400">Nenhuma movimentação encontrada</p>
                        </div>
                    )}
                </div>
            </main>

            <BottomNav />
        </div>
    );
};

export default InventoryMovements;
