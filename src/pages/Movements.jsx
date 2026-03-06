import React, { useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';

const Movements = () => {
    const navigate = useNavigate();

    // Estados de Interatividade
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [expandedMovId, setExpandedMovId] = useState(null);

    const movements = [
        { id: 1, type: 'Transferência Recebida', method: 'PIX', time: '10:45 AM', date: 'Hoje', value: '+R$ 450,00', isIncome: true, ref: '#TX-88221', details: 'Venda de produto avulso (Unidade Centro). Pagamento instantâneo via QR Code.' },
        { id: 2, type: 'Pagamento Fornecedor', method: 'Débito', time: '08:20 AM', date: 'Hoje', value: '-R$ 2.100,00', isIncome: false, ref: '#CP-11042', details: 'Compra de suprimentos de escritório e papelaria técnica. Nota Fiscal #8821.' },
        { id: 3, type: 'Boleto Compensado', method: 'Sistema', time: 'Ontem', date: '04/03', value: '+R$ 890,00', isIncome: true, ref: '#BL-99032', details: 'Compensação automática de boleto bancário (Cliente: Inova Soft).' },
        { id: 4, type: 'Venda de Balcão', method: 'Crédito', time: 'Ontem', date: '04/03', value: '+R$ 1.200,00', isIncome: true, ref: '#VB-44210', details: 'Venda presencial. Parcelado em 2x sem juros no cartão de crédito.' },
        { id: 5, type: 'Tarifa Bancária', method: 'Débito', time: 'Anteontem', date: '03/03', value: '-R$ 15,90', isIncome: false, ref: '#TF-001', details: 'Taxa de manutenção de conta empresarial - Ciclo Março/2026.' },
        { id: 6, type: 'Estorno de Venda', method: 'Crédito', time: 'Anteontem', date: '03/03', value: '-R$ 120,00', isIncome: false, ref: '#ES-221', details: 'Devolução de produto por arrependimento. Estorno processado via operadora.' },
        { id: 7, type: 'Recebimento API', method: 'Stripe', time: '3 dias atrás', date: '02/03', value: '+R$ 3.450,00', isIncome: true, ref: '#ST-7732', details: 'Integração e-commerce. Lote de vendas internacionais processado com sucesso.' },
    ];

    const filteredMovements = movements.filter(mov => {
        if (activeFilter === 'Todos') return true;
        if (activeFilter === 'Entradas') return mov.isIncome;
        if (activeFilter === 'Saídas') return !mov.isIncome;
        return true;
    });

    const toggleDetails = (id) => {
        setExpandedMovId(expandedMovId === id ? null : id);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen pb-24 transition-colors duration-300">
            <Header title="Histórico de Movimentações" />

            <div className="px-4 py-2 flex items-center gap-2">
                <button
                    onClick={() => navigate('/finance')}
                    className="flex items-center gap-1 text-primary font-bold text-sm py-2 hover:opacity-80 transition-opacity"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Voltar para Financeiro
                </button>
            </div>

            <main className="px-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-white dark:bg-slate-900 p-1 flex rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 w-full lg:w-auto">
                        {['Todos', 'Entradas', 'Saídas'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${activeFilter === filter
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
                                    <div className={`size-10 rounded-full ${mov.isIncome ? 'bg-green-500/10' : 'bg-red-500/10'} flex items-center justify-center`}>
                                        <span className={`material-symbols-outlined ${mov.isIncome ? 'text-green-500' : 'text-red-500'} text-xl`}>
                                            {mov.isIncome ? (mov.method === 'PIX' ? 'payments' : 'account_balance_wallet') : 'shopping_cart'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">{mov.type}</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-medium mt-0.5">{mov.method} • {mov.date} • {mov.time}</p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-3">
                                    <p className={`text-sm font-black ${mov.isIncome ? 'text-green-500' : 'text-slate-900 dark:text-slate-100'}`}>
                                        {mov.value}
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
                                            <p className="text-[9px] uppercase font-bold text-slate-400">Data e Hora</p>
                                            <p className="text-xs text-slate-600 dark:text-slate-300">{mov.date} às {mov.time}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Descrição</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                                            {mov.details}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const printWindow = window.open('', '_blank');
                                                printWindow.document.write(`
                                                    <html>
                                                        <head>
                                                            <title>Comprovante - ${mov.ref}</title>
                                                            <style>
                                                                body { font-family: sans-serif; padding: 40px; color: #333; }
                                                                .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; text-align: center; }
                                                                .row { display: flex; justify-content: space-between; margin-bottom: 15px; }
                                                                .label { font-weight: bold; color: #666; }
                                                                .value { font-family: monospace; }
                                                                .total { margin-top: 30px; border-top: 2px solid #eee; pt-20px; text-align: right; font-size: 24px; font-weight: bold; }
                                                            </style>
                                                        </head>
                                                        <body>
                                                            <div class="header">
                                                                <h1>Oasys ERP</h1>
                                                                <p>Comprovante de Movimentação</p>
                                                            </div>
                                                            <div class="row"><span class="label">Operação:</span> <span>${mov.type}</span></div>
                                                            <div class="row"><span class="label">Método:</span> <span>${mov.method}</span></div>
                                                            <div class="row"><span class="label">Referência:</span> <span class="value">${mov.ref}</span></div>
                                                            <div class="row"><span class="label">Data:</span> <span>${mov.date} às ${mov.time}</span></div>
                                                            <div class="row"><span class="label">Descrição:</span> <span>${mov.details}</span></div>
                                                            <div class="total">${mov.value}</div>
                                                            <script>window.print(); window.close();</script>
                                                        </body>
                                                    </html>
                                                `);
                                                printWindow.document.close();
                                            }}
                                            className="w-full bg-primary text-white py-3 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-sm">print</span>
                                            Imprimir Comprovante
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {filteredMovements.length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center text-center opacity-50">
                            <span className="material-symbols-outlined text-6xl mb-2 text-slate-300">history</span>
                            <p className="text-sm font-bold text-slate-400">Nenhum registro encontrado</p>
                        </div>
                    )}
                </div>
            </main>

            <BottomNav />
        </div>
    );
};

export default Movements;
