import React, { useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { useFinanceCatalog, useIntegrationsReadOnly, useWallet } from '../hooks';

const Finance = () => {
    const navigate = useNavigate();
    const { isBankingActive } = useIntegrationsReadOnly();
    const { balance, movements, applyBalanceAndMovements } = useWallet();
    const { contacts, payables, receivables } = useFinanceCatalog();

    // Estados para Modais e Visibilidade
    const [showPixModal, setShowPixModal] = useState(false);
    const [showBoletoModal, setShowBoletoModal] = useState(false);
    const [showNfcModal, setShowNfcModal] = useState(false);
    const [isValuesVisible, setIsValuesVisible] = useState(true);
    const [showReceberModal, setShowReceberModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [amount, setAmount] = useState('');
    const [nfcStatus, setNfcStatus] = useState('idle'); // idle | scanning | success | error

    const handleTransfer = () => {
        const value = parseFloat(amount.replace(',', '.'));
        if (isNaN(value) || value <= 0) return;

        const newBalance = balance - value;
        const newMovement = {
            id: Date.now(),
            type: 'Transferência Enviada',
            method: 'TED',
            time: 'Agora',
            value: `-R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            isIncome: false
        };
        const updatedMovements = [newMovement, ...movements];

        applyBalanceAndMovements(newBalance, updatedMovements);
        setShowTransferModal(false);
        setAmount('');
    };

    // Simula leitura NFC
    const handleNfcScan = () => {
        setNfcStatus('scanning');
        setTimeout(() => {
            setNfcStatus('success');
            setTimeout(() => {
                setNfcStatus('idle');
                setShowNfcModal(false);
            }, 2000);
        }, 3000);
    };

    const [selectedPerson, setSelectedPerson] = useState('');

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-300">
            <div className="relative flex min-h-screen flex-col overflow-x-hidden pb-app">

                <Header title="Operações Financeiras" />

                {/* Summary Cards */}
                <div className="flex flex-wrap gap-4 p-4">

                    {/* Account Balance — somente se API Bancária estiver ativa */}
                    {isBankingActive && (
                        <div className="flex min-w-full flex-col gap-3 rounded-2xl p-6 bg-slate-900 border border-slate-800 shadow-xl text-white">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Saldo Disponível</span>
                                <button
                                    onClick={() => setIsValuesVisible(!isValuesVisible)}
                                    className="flex items-center justify-center size-8 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-slate-400"
                                >
                                    <span className="material-symbols-outlined text-sm">
                                        {isValuesVisible ? 'visibility' : 'visibility_off'}
                                    </span>
                                </button>
                            </div>
                            <div>
                                <p className={`text-4xl font-black tracking-tight leading-tight ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {isValuesVisible ? `R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ ••••••'}
                                </p>
                            </div>
                            <div className="flex gap-4 mt-4 text-[10px] font-bold uppercase">
                                {/* Botão Receber — abre modal com opções PIX / Boleto / NFC */}
                                <button
                                    onClick={() => setShowReceberModal(true)}
                                    className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">download</span> Receber
                                </button>
                                <button
                                    onClick={() => setShowTransferModal(true)}
                                    className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">send</span> Transferir
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex min-w-[158px] flex-1 flex-col gap-3 rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                                <span className="material-symbols-outlined text-lg">trending_up</span>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">+12%</span>
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Recebimentos no Mês</p>
                            <p className="text-slate-900 dark:text-slate-100 text-2xl font-black leading-tight mt-1">
                                {isValuesVisible ? 'R$ 45.200' : 'R$ •••••'}
                            </p>
                        </div>
                        <div className="pt-3 border-t border-slate-50 dark:border-slate-800 space-y-1">
                            <div className="flex justify-between items-center text-[11px]">
                                <span className="text-slate-500 font-medium">Já Recebido:</span>
                                <span className="text-emerald-500 font-bold tracking-tight">
                                    {isValuesVisible ? 'R$ 28.400' : 'R$ •••'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                                <span className="text-slate-500 font-medium">Previsto Entrar:</span>
                                <span className="text-blue-500 font-bold tracking-tight">
                                    {isValuesVisible ? 'R$ 16.800' : 'R$ •••'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex min-w-[158px] flex-1 flex-col gap-3 rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
                                <span className="material-symbols-outlined text-lg">trending_down</span>
                            </div>
                            <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">-5%</span>
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Contas a Pagar no Mês</p>
                            <p className="text-slate-900 dark:text-slate-100 text-2xl font-black leading-tight mt-1">
                                {isValuesVisible ? 'R$ 28.150' : 'R$ •••••'}
                            </p>
                        </div>
                        <div className="pt-3 border-t border-slate-50 dark:border-slate-800 space-y-1">
                            <div className="flex justify-between items-center text-[11px]">
                                <span className="text-slate-500 font-medium">Já Pago:</span>
                                <span className="text-slate-900 dark:text-slate-100 font-bold tracking-tight">
                                    {isValuesVisible ? 'R$ 12.000' : 'R$ •••'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                                <span className="text-slate-500 font-medium">Previsto Sair:</span>
                                <span className="text-rose-500 font-bold tracking-tight">
                                    {isValuesVisible ? 'R$ 16.150' : 'R$ •••'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contas a Pagar Section */}
                <div className="px-4 pt-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-slate-900 dark:text-slate-100 text-base font-bold">Próximas Contas a Pagar</h3>
                        <button
                            onClick={() => navigate('/finance/pending?type=pagar')}
                            className="text-primary text-xs font-bold outline-none"
                        >
                            Ver Todas
                        </button>
                    </div>
                    <div className="space-y-3">
                        {payables.map((item) => (
                            <div key={item.id} className={`flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border-l-4 border-${item.color}-500`}>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.entity}</p>
                                            <p className="text-[10px] text-slate-500 mt-0.5 italic">{item.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end mt-2">
                                        <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                            {isValuesVisible ? `R$ ${item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ •••'}
                                        </p>
                                        <span className={`text-[9px] font-bold text-${item.color}-500 bg-${item.color}-500/10 px-2 py-0.5 rounded-full uppercase`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recebimentos Section */}
                <div className="px-4 pt-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-slate-900 dark:text-slate-100 text-base font-bold">Recebimentos Pendentes</h3>
                        <button
                            onClick={() => navigate('/finance/pending?type=receber')}
                            className="text-primary text-xs font-bold outline-none"
                        >
                            Ver Todas
                        </button>
                    </div>
                    <div className="space-y-3">
                        {receivables.map((item) => (
                            <div key={item.id} className={`flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border-l-4 border-${item.color}-500`}>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.entity}</p>
                                        <span className={`text-[10px] font-bold text-${item.color}-500 bg-${item.color}-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 italic">{item.type}</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                                        {isValuesVisible ? item.value : 'R$ •••'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Extrato Bancário (API ativa) ou Últimas Movimentações 24h (API inativa) */}
                {isBankingActive ? (
                    <div className="p-4 mt-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-slate-900 dark:text-slate-100 text-base font-bold">Extrato Bancário</h3>
                            <button
                                onClick={() => navigate('/finance/movements')}
                                className="text-primary text-xs font-bold outline-none"
                            >
                                Ver Todas
                            </button>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 transition-all duration-300 border border-slate-100 dark:border-slate-800">
                            {movements.map((mov) => (
                                <div key={mov.id} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-10 rounded-full ${mov.isIncome ? 'bg-green-500/10' : 'bg-red-500/10'} flex items-center justify-center`}>
                                            <span className={`material-symbols-outlined ${mov.isIncome ? 'text-green-500' : 'text-red-500'} text-xl`}>
                                                {mov.isIncome ? (mov.method === 'PIX' ? 'payments' : 'account_balance_wallet') : 'shopping_cart'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{mov.type}</p>
                                            <p className="text-[9px] text-slate-500 uppercase font-medium">{mov.method} • {mov.time}</p>
                                        </div>
                                    </div>
                                    <p className={`text-sm font-bold ${mov.isIncome ? 'text-green-500' : 'text-slate-900 dark:text-slate-100'}`}>
                                        {isValuesVisible ? mov.value : 'R$ •••'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Últimas Movimentações 24h — exibido quando API Bancária está inativa */
                    <div className="p-4 mt-6">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-slate-900 dark:text-slate-100 text-base font-bold">Últimas Movimentações</h3>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 uppercase tracking-wide">Últimas 24 horas</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">link_off</span> Sem API
                                </span>
                                <button
                                    onClick={() => navigate('/finance/movements')}
                                    className="text-primary text-xs font-bold outline-none"
                                >
                                    Ver Todas
                                </button>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800">
                            {movements.map((mov) => (
                                <div key={mov.id} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-10 rounded-full ${mov.isIncome ? 'bg-green-500/10' : 'bg-red-500/10'} flex items-center justify-center`}>
                                            <span className={`material-symbols-outlined ${mov.isIncome ? 'text-green-500' : 'text-red-500'} text-xl`}>
                                                {mov.isIncome ? 'arrow_downward' : 'arrow_upward'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{mov.type}</p>
                                            <p className="text-[9px] text-slate-500 uppercase font-medium tracking-wide">{mov.time}</p>
                                        </div>
                                    </div>
                                    <p className={`text-sm font-bold ${mov.isIncome ? 'text-green-500' : 'text-slate-900 dark:text-slate-100'}`}>
                                        {isValuesVisible ? mov.value : 'R$ •••'}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 mt-3">
                            Ative a <span className="font-bold">API Bancária</span> em Configurações para ver o extrato completo
                        </p>
                    </div>
                )}

                <BottomNav />

                {/* ============================================================
                    MODAL: Receber — escolha de método
                ============================================================ */}
                {showReceberModal && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-lg font-black text-slate-900 dark:text-slate-100">Receber Pagamento</h4>
                                    <button onClick={() => setShowReceberModal(false)} className="material-symbols-outlined text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">close</button>
                                </div>

                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Escolha a forma de recebimento:</p>

                                <div className="space-y-3">
                                    {/* PIX */}
                                    <button
                                        onClick={() => { setShowReceberModal(false); setShowPixModal(true); }}
                                        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/20 transition-colors text-left"
                                    >
                                        <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-primary text-2xl">qr_code_2</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">Gerar Cobrança PIX</p>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">QR Code instantâneo via API Bancária</p>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 ml-auto">chevron_right</span>
                                    </button>

                                    {/* Boleto */}
                                    <button
                                        onClick={() => { setShowReceberModal(false); setShowBoletoModal(true); }}
                                        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-left"
                                    >
                                        <div className="size-11 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 text-2xl">description</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">Emitir Boleto</p>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Gera PDF com código de barras</p>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 ml-auto">chevron_right</span>
                                    </button>

                                    {/* NFC */}
                                    <button
                                        onClick={() => { setShowReceberModal(false); setShowNfcModal(true); }}
                                        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 transition-colors text-left"
                                    >
                                        <div className="size-11 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-emerald-500 text-2xl">tap_and_play</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">Receber via NFC</p>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Aproxime o dispositivo para receber</p>
                                        </div>
                                        <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 ml-auto">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ============================================================
                    MODAL: PIX
                ============================================================ */}
                {showPixModal && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => { setShowPixModal(false); setShowReceberModal(true); }} className="material-symbols-outlined text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">arrow_back</button>
                                        <h4 className="text-lg font-black text-slate-900 dark:text-slate-100">Gerar Cobrança PIX</h4>
                                    </div>
                                    <button onClick={() => setShowPixModal(false)} className="material-symbols-outlined text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">close</button>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Selecionar Pagador (ERP)</label>
                                        <select
                                            value={selectedPerson}
                                            onChange={(e) => setSelectedPerson(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        >
                                            <option value="">Selecione um contato...</option>
                                            {contacts.map(c => (
                                                <option key={c.id} value={c.name}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Valor da Cobrança</label>
                                        <input type="text" placeholder="R$ 0,00" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-300" />
                                    </div>
                                </div>

                                {selectedPerson && (
                                    <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl mb-6 text-center">
                                        <div className="w-40 h-40 mx-auto bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center border-2 border-dashed border-primary/30">
                                            <span className="material-symbols-outlined text-primary text-6xl">qr_code_2</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-4">Pix gerado para {selectedPerson}</p>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <button
                                        disabled={!selectedPerson}
                                        className="w-full bg-primary disabled:opacity-50 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20"
                                    >
                                        Compartilhar QR Code
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ============================================================
                    MODAL: Boleto
                ============================================================ */}
                {showBoletoModal && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => { setShowBoletoModal(false); setShowReceberModal(true); }} className="material-symbols-outlined text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">arrow_back</button>
                                        <h4 className="text-lg font-black text-slate-900 dark:text-slate-100">Emitir Boleto</h4>
                                    </div>
                                    <button onClick={() => setShowBoletoModal(false)} className="material-symbols-outlined text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">close</button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Selecionar Sacado (ERP)</label>
                                        <select
                                            value={selectedPerson}
                                            onChange={(e) => setSelectedPerson(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                        >
                                            <option value="">Selecione um contato...</option>
                                            {contacts.map(c => (
                                                <option key={c.id} value={c.name}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Valor do Boleto</label>
                                        <input type="text" placeholder="R$ 0,00" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-300" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Vencimento</label>
                                        <input type="date" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-primary/20 transition-all" />
                                    </div>
                                    <div className="pt-2">
                                        <button
                                            disabled={!selectedPerson}
                                            className="w-full bg-slate-900 dark:bg-slate-100 disabled:opacity-50 text-white dark:text-slate-900 py-4 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                                            Gerar PDF do Boleto
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ============================================================
                    MODAL: NFC
                ============================================================ */}
                {showNfcModal && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => { setShowNfcModal(false); setShowReceberModal(true); setNfcStatus('idle'); }}
                                            className="material-symbols-outlined text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                        >arrow_back</button>
                                        <h4 className="text-lg font-black text-slate-900 dark:text-slate-100">Receber via NFC</h4>
                                    </div>
                                    <button
                                        onClick={() => { setShowNfcModal(false); setNfcStatus('idle'); }}
                                        className="material-symbols-outlined text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                    >close</button>
                                </div>

                                {/* Valor */}
                                <div className="mb-6">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Valor a Receber</label>
                                    <input
                                        type="text"
                                        placeholder="R$ 0,00"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-slate-900 dark:text-slate-100 font-bold text-xl focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-300"
                                    />
                                </div>

                                {/* Área de leitura NFC */}
                                <div className={`rounded-3xl p-10 text-center mb-6 transition-all duration-500 ${nfcStatus === 'idle' ? 'bg-slate-50 dark:bg-slate-800' :
                                    nfcStatus === 'scanning' ? 'bg-emerald-50 dark:bg-emerald-900/20' :
                                        nfcStatus === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/40' :
                                            'bg-rose-50 dark:bg-rose-900/20'
                                    }`}>
                                    <div className={`mx-auto mb-4 size-20 rounded-full flex items-center justify-center transition-all duration-300 ${nfcStatus === 'scanning' ? 'animate-pulse bg-emerald-500/20' :
                                        nfcStatus === 'success' ? 'bg-emerald-500/20' :
                                            'bg-slate-200/80 dark:bg-slate-700'
                                        }`}>
                                        <span className={`material-symbols-outlined text-4xl transition-all duration-300 ${nfcStatus === 'idle' ? 'text-slate-400' :
                                            nfcStatus === 'scanning' ? 'text-emerald-500' :
                                                nfcStatus === 'success' ? 'text-emerald-500' :
                                                    'text-rose-500'
                                            }`}>
                                            {nfcStatus === 'success' ? 'check_circle' : 'tap_and_play'}
                                        </span>
                                    </div>
                                    <p className={`font-bold text-sm transition-all duration-300 ${nfcStatus === 'idle' ? 'text-slate-500 dark:text-slate-400' :
                                        nfcStatus === 'scanning' ? 'text-emerald-600 dark:text-emerald-400' :
                                            nfcStatus === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
                                                'text-rose-600'
                                        }`}>
                                        {nfcStatus === 'idle' && 'Aguardando aproximação...'}
                                        {nfcStatus === 'scanning' && 'Lendo dispositivo NFC...'}
                                        {nfcStatus === 'success' && 'Pagamento recebido!'}
                                        {nfcStatus === 'error' && 'Erro na leitura. Tente novamente.'}
                                    </p>
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                                        {nfcStatus === 'idle' && 'Aproxime o cartão ou dispositivo do pagador'}
                                        {nfcStatus === 'scanning' && 'Mantenha o dispositivo próximo'}
                                        {nfcStatus === 'success' && 'Transação registrada com sucesso'}
                                    </p>
                                </div>

                                <button
                                    onClick={handleNfcScan}
                                    disabled={nfcStatus === 'scanning' || nfcStatus === 'success'}
                                    className="w-full bg-emerald-500 disabled:opacity-60 text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                                >
                                    <span className="material-symbols-outlined text-lg">tap_and_play</span>
                                    {nfcStatus === 'scanning' ? 'Aguardando...' : nfcStatus === 'success' ? 'Recebido!' : 'Iniciar Leitura NFC'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ============================================================
                    MODAL: Transferir
                ============================================================ */}
                {showTransferModal && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-lg font-black text-slate-900 dark:text-slate-100">Transferir Recurso</h4>
                                    <button onClick={() => setShowTransferModal(false)} className="material-symbols-outlined text-slate-400">close</button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Valor da Transferência</label>
                                        <input
                                            type="text"
                                            placeholder="R$ 0,00"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                    <button
                                        onClick={handleTransfer}
                                        className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-4 rounded-xl font-bold text-sm shadow-xl"
                                    >
                                        Executar Transferência
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Finance;
