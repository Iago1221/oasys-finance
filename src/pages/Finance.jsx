import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';

const Finance = () => {
    const navigate = useNavigate();

    // Estado global de integração (vindo do localStorage)
    const [isBankingActive, setIsBankingActive] = useState(() => {
        const saved = localStorage.getItem('isBankingActive');
        return saved !== null ? JSON.parse(saved) : true;
    });

    // Saldo Bancário (Persistido)
    const [balance, setBalance] = useState(() => {
        const saved = localStorage.getItem('accountBalance');
        return saved !== null ? parseFloat(saved) : 12450.75;
    });

    useEffect(() => {
        const handleStorageChange = () => {
            const savedBalance = localStorage.getItem('accountBalance');
            if (savedBalance !== null) setBalance(parseFloat(savedBalance));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Estados para Modais e Visibilidade
    const [showPixModal, setShowPixModal] = useState(false);
    const [showBoletoModal, setShowBoletoModal] = useState(false);
    const [isValuesVisible, setIsValuesVisible] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [amount, setAmount] = useState('');

    const handleAddFunds = () => {
        const value = parseFloat(amount.replace(',', '.'));
        if (isNaN(value) || value <= 0) return;

        const newBalance = balance + value;
        const newMovement = {
            id: Date.now(),
            type: 'Aporte de Capital',
            method: 'PIX',
            time: 'Agora',
            value: `+R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            isIncome: true
        };
        const updatedMovements = [newMovement, ...movements];

        setBalance(newBalance);
        setMovements(updatedMovements);
        localStorage.setItem('accountBalance', newBalance.toString());
        localStorage.setItem('movements', JSON.stringify(updatedMovements));
        setShowAddModal(false);
        setAmount('');
    };

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

        setBalance(newBalance);
        setMovements(updatedMovements);
        localStorage.setItem('accountBalance', newBalance.toString());
        localStorage.setItem('movements', JSON.stringify(updatedMovements));
        setShowTransferModal(false);
        setAmount('');
    };

    // Cadastro Simulado ERP
    const contacts = [
        { id: 1, name: 'Fornecedor Alpha LTDA', document: '12.345.678/0001-90' },
        { id: 2, name: 'Global Tech Solution', document: '98.765.432/0001-10' },
        { id: 3, name: 'Mecânica Rio S.A.', document: '00.111.222/0001-33' },
    ];
    const [selectedPerson, setSelectedPerson] = useState('');

    // Dados para Contas a Pagar
    const payables = [
        { id: 1021, entity: 'Fornecedor Alpha', type: 'Materia Prima', value: 4500.00, status: 'Atrasado', color: 'red' },
        { id: 1022, entity: 'Aluguel Galpão', type: 'Custo Fixo', value: 12000.00, status: 'Pendente', color: 'yellow' },
    ];

    // Dados para Recebimentos
    const receivables = [
        { id: 8842, entity: 'Acme Corp', type: 'Fatura Venda', value: 'R$ 1.250,00', status: 'Atrasado', color: 'red' },
        { id: 8859, entity: 'Global Tech', type: 'Serviço Mensal', value: 'R$ 3.400,00', status: 'Pendente', color: 'yellow' },
    ];

    const [movements, setMovements] = useState(() => {
        const saved = localStorage.getItem('movements');
        return saved !== null ? JSON.parse(saved) : [
            { id: 1, type: 'Transferência Recebida', method: 'PIX', time: '10:45 AM', value: '+R$ 450,00', isIncome: true },
            { id: 2, type: 'Pagamento Fornecedor', method: 'Débito', time: '08:20 AM', value: '-R$ 2.100,00', isIncome: false },
            { id: 3, type: 'Boleto Compensado', method: 'Sistema', time: 'Ontem', value: '+R$ 890,00', isIncome: true },
        ];
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const saved = localStorage.getItem('movements');
            if (saved !== null) setMovements(JSON.parse(saved));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-300">
            <div className="relative flex min-h-screen flex-col overflow-x-hidden pb-20">

                <Header title="Operações Financeiras" />

                {/* Summary Cards */}
                <div className="flex flex-wrap gap-4 p-4">
                    {/* Account Balance (Banking White Label) */}
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
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">add_circle</span> Adicionar
                            </button>
                            <button
                                onClick={() => setShowTransferModal(true)}
                                className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">send</span> Transferir
                            </button>
                        </div>
                    </div>

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

                {/* Conditional Quick Actions */}
                {isBankingActive && (
                    <div className="px-4 py-2 flex gap-3 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setShowPixModal(true)}
                            className="flex items-center gap-2 bg-primary text-white px-4 py-3 rounded-xl font-semibold text-sm whitespace-nowrap shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                        >
                            <span className="material-symbols-outlined text-lg">qr_code_2</span>
                            Gerar Cobrança PIX
                        </button>
                        <button
                            onClick={() => setShowBoletoModal(true)}
                            className="flex items-center gap-2 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-3 rounded-xl font-semibold text-sm whitespace-nowrap hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">description</span>
                            Emitir Boleto
                        </button>
                    </div>
                )}

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
                                        {/* Removida ação Pagar daqui, movida para página pendentes */}
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

                {/* Extrato Bancário Section */}
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

                {/* Modais de PIX e Boleto permanecem aqui */}
                <BottomNav />
                {/* PIX Modal UI */}
                {showPixModal && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-lg font-black text-slate-900 dark:text-slate-100">Gerar Cobrança PIX</h4>
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
                                    <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl mb-6 relative group text-center">
                                        <img
                                            src="/C:/Users/gy243/.gemini/antigravity/brain/9f7434b7-3964-46ad-b1b2-d5d47c5e920b/pix_qr_code_placeholder_1772753454642.png"
                                            alt="PIX QR Code"
                                            className="w-40 h-40 mx-auto mix-blend-multiply dark:mix-blend-normal opacity-90"
                                        />
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

                {/* Boleto Modal UI */}
                {showBoletoModal && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-lg font-black text-slate-900 dark:text-slate-100">Emitir Boleto</h4>
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

                {/* Add Funds Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-lg font-black text-slate-900 dark:text-slate-100">Adicionar Saldo</h4>
                                    <button onClick={() => setShowAddModal(false)} className="material-symbols-outlined text-slate-400">close</button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Valor do Aporte</label>
                                        <input
                                            type="text"
                                            placeholder="R$ 0,00"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                    <button
                                        onClick={handleAddFunds}
                                        className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-emerald-500/20"
                                    >
                                        Confirmar Depósito
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Transfer Modal */}
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
