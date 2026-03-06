import React, { useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';

const Sales = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Painel');
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    const tabs = ['Painel', 'Documentos', 'Impostos', 'Relatórios'];

    const highValueOrders = [
        { id: 8842, client: 'Tech Solutions Inc.', time: '2h atrás', value: 'R$ 12.450,00', status: 'Pendente', items: '15x Pro Watch Series X, 5x Audio-Z Headset', ref: '#SO-8842', color: 'blue' },
        { id: 8839, client: 'Global Logistics Ltd', time: '5h atrás', value: 'R$ 8.920,50', status: 'Pendente', items: '2x MacBook Pro M2, 10x Cabo USB-C', ref: '#SO-8839', color: 'blue' },
        { id: 8835, client: 'Petrobras Distrib.', time: '8h atrás', value: 'R$ 42.100,00', status: 'Faturado', items: '500x Carregador Turbo 20W', ref: '#SO-8835', color: 'emerald' },
    ];

    const toggleDetails = (id) => {
        setExpandedOrderId(expandedOrderId === id ? null : id);
    };

    const renderPainel = () => (
        <>
            {/* Conversion Overview Section */}
            <section className="p-4">
                <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Conversão de Pipeline</p>
                            <h2 className="text-3xl font-black mt-1 text-slate-900 dark:text-white leading-tight tracking-tight">R$ 450.200</h2>
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black text-emerald-500 uppercase">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span>
                            12.4%
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                <span>Orçamentos</span>
                                <span className="text-slate-900 dark:text-slate-100 italic">R$ 180.500</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                <div className="h-full bg-blue-500/30 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                <span>Pedidos</span>
                                <span className="text-slate-900 dark:text-slate-100 italic">R$ 142.300</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                <div className="h-full bg-blue-500/60 rounded-full" style={{ width: '78%' }}></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                <span>Faturado</span>
                                <span className="text-slate-900 dark:text-slate-100 italic">R$ 127.400</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.3)]" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tax Status Section */}
            <section className="px-4 py-2">
                <h3 className="text-[10px] font-black text-slate-400 mb-4 px-1 uppercase tracking-widest">Status de NFe</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center group hover:border-emerald-500/30 transition-all">
                        <div className="bg-emerald-500/10 p-3 rounded-full mb-3 text-emerald-500">
                            <span className="material-symbols-outlined text-2xl">check_circle</span>
                        </div>
                        <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">42</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Autorizadas</p>
                    </div>
                    <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center group hover:border-amber-500/30 transition-all">
                        <div className="bg-amber-500/10 p-3 rounded-full mb-3 text-amber-500">
                            <span className="material-symbols-outlined text-2xl">sync</span>
                        </div>
                        <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">18</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">XML com Manifesto Pendente</p>
                    </div>
                </div>
            </section>

            {/* High-Value Orders Section */}
            <section className="px-4 py-6">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">Pedidos de Alto Valor</h3>
                    <button
                        onClick={() => navigate('/sales/history')}
                        className="text-[10px] font-black text-primary uppercase tracking-widest"
                    >
                        Ver Todos
                    </button>
                </div>
                <div className="space-y-3">
                    {highValueOrders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800 transition-all duration-300">
                            <div
                                onClick={() => toggleDetails(order.id)}
                                className={`p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${expandedOrderId === order.id ? 'bg-slate-50 dark:bg-slate-800/80' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`size-10 rounded-full bg-${order.color}-500/10 flex items-center justify-center`}>
                                        <span className={`material-symbols-outlined text-${order.color}-500 text-xl`}>
                                            {order.status === 'Faturado' ? 'check_circle' : 'receipt_long'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{order.client}</p>
                                        <p className="text-[10px] text-slate-500 font-medium uppercase mt-0.5">{order.ref} • {order.time}</p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-3">
                                    <p className="text-sm font-black text-slate-900 dark:text-white">{order.value}</p>
                                    <span className={`material-symbols-outlined text-slate-300 transition-transform duration-300 ${expandedOrderId === order.id ? 'rotate-90 text-primary' : ''}`}>
                                        chevron_right
                                    </span>
                                </div>
                            </div>

                            {expandedOrderId === order.id && (
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="mb-1">
                                        <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-1.5">Resumo do Pedido</p>
                                        <div className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-3 rounded-xl">
                                            <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">{order.items}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <button className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-base">visibility</span>
                                            Ver Detalhes
                                        </button>
                                        <button className="flex-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-base">print</span>
                                            Imprimir
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </>
    );

    const [showErrors, setShowErrors] = useState(false);

    const errorNotes = [
        { id: 1, serie: '001', numero: '1241', emitente: 'Oasys Tech Ltda', destinatario: 'Global Logistics Ltd', valor: 'R$ 8.920,50', erro: 'Rejeição: Tributação do ICMS incompatível com a CFOP' },
        { id: 2, serie: '001', numero: '1245', emitente: 'Oasys Tech Ltda', destinatario: 'Hospital Santa Cruz', valor: 'R$ 5.600,00', erro: 'Rejeição: IE do destinatário não cadastrada' },
        { id: 3, serie: '003', numero: '8812', emitente: 'Oasys Tech Ltda', destinatario: 'Consumidor Final', valor: 'R$ 1.250,00', erro: 'Erro de comunicação com SEFAZ' },
    ];

    const issuedNotes = [
        { id: 1, type: 'NFe', ref: '001.242', client: 'Tech Solutions Inc.', value: 'R$ 12.450,00', status: 'Autorizada', time: '10:45 AM' },
        { id: 2, type: 'NFCe', ref: '003.882', client: 'Consumidor Final', value: 'R$ 890,00', status: 'Autorizada', time: '11:20 AM' },
        { id: 3, type: 'NFe', ref: '001.241', client: 'Global Logistics Ltd', value: 'R$ 8.920,50', status: 'Processando', time: 'Ontem' },
        { id: 4, type: 'NFCe', ref: '003.881', client: 'João Silva', value: 'R$ 145,00', status: 'Autorizada', time: 'Ontem' },
    ];

    const renderDocumentos = () => (
        <div className="space-y-6 pb-6">
            {/* Faturamento Analytics */}
            <section className="p-4 pt-6">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-500/10 p-2 rounded-lg text-primary">
                            <span className="material-symbols-outlined">analytics</span>
                        </div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Visão faturamento</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Total do Mês</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white leading-none">R$ 127.400</p>
                            <div className="flex items-center gap-1 mt-2">
                                <span className="text-[9px] font-black text-emerald-500">+8.2%</span>
                                <span className="text-[8px] text-slate-400">vs mês ant.</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Ticket Médio</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white leading-none">R$ 3.033</p>
                            <p className="text-[8px] text-slate-400 mt-2">Base: 42 notas</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Error Actions */}
            <section className="px-4">
                <button
                    onClick={() => setShowErrors(!showErrors)}
                    className={`w-full ${showErrors ? 'bg-red-500 text-white' : 'bg-red-500/10 text-red-500'} border border-red-500/20 py-4 rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all group shadow-sm`}
                >
                    <span className="material-symbols-outlined text-xl">warning</span>
                    <span className="text-[11px] font-black uppercase tracking-widest">{errorNotes.length} Notas com erro encontradas</span>
                    <span className={`material-symbols-outlined text-base transition-transform duration-300 ${showErrors ? 'rotate-90' : ''}`}>chevron_right</span>
                </button>

                {showErrors && (
                    <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
                        {errorNotes.map((note) => (
                            <div key={note.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border-l-4 border-l-red-500 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-5">
                                    <span className="material-symbols-outlined text-4xl">error</span>
                                </div>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-[10px] font-black text-red-500 uppercase">Série {note.serie} • Nº {note.numero}</p>
                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{note.destinatario}</h4>
                                    </div>
                                    <p className="text-xs font-black text-slate-900 dark:text-white">{note.valor}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] text-slate-400 font-medium tracking-tight truncate">EMITENTE: {note.emitente}</p>
                                    <p className="text-[10px] text-red-600 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-500/10 p-2 rounded-lg leading-tight mt-2">
                                        {note.erro}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Issued Notes Preview */}
            <section className="px-4">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notas Emitidas</h3>
                    <button
                        onClick={() => navigate('/sales/issued-notes')}
                        className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                    >
                        Ver Todos
                    </button>
                </div>
                <div className="space-y-3">
                    {issuedNotes.slice(0, 3).map((doc) => (
                        <div key={doc.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-xl">description</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{doc.client}</p>
                                        <span className={`text-[8px] font-black px-1 rounded ${doc.type === 'NFe' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600' : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600'}`}>
                                            {doc.type}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-medium uppercase mt-0.5">Nota {doc.ref} • {doc.time}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-slate-900 dark:text-white leading-none mb-1">{doc.value}</p>
                                <p className="text-[9px] font-bold uppercase text-emerald-500">{doc.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );

    const renderImpostos = () => (
        <div className="space-y-6 pb-6">
            {/* Impostos Overview */}
            <section className="p-4 pt-6">
                <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 size-32 bg-primary/20 blur-3xl rounded-full" />
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Total Impostos Pagos (Mês)</p>
                        <h2 className="text-3xl font-black text-white leading-tight mb-6">R$ 14.280,50</h2>

                        <div className="flex gap-3">
                            <div className="flex-1 bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                                <p className="text-[8px] font-black text-white/30 uppercase mb-1">FEDERAIS</p>
                                <p className="text-xs font-bold text-white leading-none">R$ 8.940</p>
                            </div>
                            <div className="flex-1 bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                                <p className="text-[8px] font-black text-white/30 uppercase mb-1">ESTADUAIS</p>
                                <p className="text-xs font-bold text-white leading-none">R$ 5.340</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impostos History */}
            <section className="px-4">
                <h3 className="text-[10px] font-black text-slate-400 mb-4 px-1 uppercase tracking-widest">Histórico de Pagamentos</h3>
                <div className="space-y-3">
                    {[
                        { id: 1, name: 'SIMPLES NACIONAL', date: '20/02/2026', value: 'R$ 4.220,10', status: 'PAGO', color: 'emerald' },
                        { id: 2, name: 'ICMS ST', date: '15/02/2026', value: 'R$ 1.150,00', status: 'PAGO', color: 'emerald' },
                        { id: 3, name: 'ISS FATURAMENTO', date: '10/02/2026', value: 'R$ 840,40', status: 'EM ABERTO', color: 'amber' },
                    ].map((tax) => (
                        <div key={tax.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`size-10 rounded-full bg-${tax.color}-500/10 text-${tax.color}-500 flex items-center justify-center`}>
                                    <span className="material-symbols-outlined text-xl">payments</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{tax.name}</p>
                                    <p className="text-[10px] text-slate-500 font-medium uppercase mt-0.5">Vencimento: {tax.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-slate-900 dark:text-white leading-none mb-1">{tax.value}</p>
                                <div className="flex items-center justify-end gap-1">
                                    <div className={`size-1.5 rounded-full bg-${tax.color}-500`} />
                                    <p className={`text-[9px] font-black text-${tax.color}-500 uppercase`}>{tax.status}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );

    const renderEmptyTab = (name) => (
        <div className="p-10 flex flex-col items-center justify-center text-center opacity-40 py-24">
            <span className="material-symbols-outlined text-7xl mb-4 text-slate-300">
                {name === 'Relatórios' ? 'analytics' : 'folder'}
            </span>
            <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">{name}</h4>
            <p className="text-sm font-medium text-slate-500 max-w-[200px]">Nenhum registro encontrado nesta categoria no momento.</p>
        </div>
    );

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-300">
            <div className="relative flex min-h-screen flex-col overflow-x-hidden">

                <Header title="Vendas & Faturamento" />

                {/* Tab Navigation */}
                <nav className="flex px-4 overflow-x-auto no-scrollbar bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-[72px] z-10">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-4 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all relative ${activeTab === tab ? 'text-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in slide-in-from-left duration-300" />
                            )}
                        </button>
                    ))}
                </nav>

                <main className="flex-1 pb-24 border-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {activeTab === 'Painel' && renderPainel()}
                    {activeTab === 'Documentos' && renderDocumentos()}
                    {activeTab === 'Impostos' && renderImpostos()}
                    {activeTab === 'Relatórios' && renderEmptyTab(activeTab)}
                </main>

                <BottomNav />
            </div>
        </div>
    );
};

export default Sales;
