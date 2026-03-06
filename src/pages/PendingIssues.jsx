import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useNavigate, useLocation } from 'react-router-dom';

const PendingIssues = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Detecta se é pagar ou receber via query param
    const searchParams = new URLSearchParams(location.search);
    const viewType = searchParams.get('type') || 'receber'; // default para receber

    const isPagar = viewType === 'pagar';

    // Estados de Interatividade
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [expandedIssueId, setExpandedIssueId] = useState(null);
    const [actionDoneIds, setActionDoneIds] = useState([]);
    const [isBankingActive, setIsBankingActive] = useState(() => {
        const saved = localStorage.getItem('isBankingActive');
        return saved !== null ? JSON.parse(saved) : true;
    });
    const [balance, setBalance] = useState(() => {
        const saved = localStorage.getItem('accountBalance');
        return saved !== null ? parseFloat(saved) : 12450.75;
    });

    const [movements, setMovements] = useState(() => {
        const saved = localStorage.getItem('movements');
        return saved !== null ? JSON.parse(saved) : [
            { id: 1, type: 'Transferência Recebida', method: 'PIX', time: '10:45 AM', value: '+R$ 450,00', isIncome: true },
            { id: 2, type: 'Pagamento Fornecedor', method: 'Débito', time: '08:20 AM', value: '-R$ 2.100,00', isIncome: false },
            { id: 3, type: 'Boleto Compensado', method: 'Sistema', time: 'Ontem', value: '+R$ 890,00', isIncome: true },
        ];
    });

    const dataReceber = [
        { id: 8842, client: 'Acme Corp', type: 'Fatura Venda', value: 'R$ 1.250,00', numValue: 1250, status: 'Atrasado', color: 'red', date: 'Venceu em 01/03', details: 'Fatura referente ao serviço de consultoria mensal. Pagamento em atraso há 4 dias.' },
        { id: 8859, client: 'Global Tech', type: 'Serviço Mensal', value: 'R$ 3.400,00', numValue: 3400, status: 'Pendente', color: 'yellow', date: 'Vence em 10/03', details: 'Compra de equipamentos de rede. Aguardando processamento bancário.' },
        { id: 8860, client: 'Inova Soft', type: 'Vencimento Hoje', value: 'R$ 890,00', numValue: 890, status: 'Pendente', color: 'yellow', date: 'Vence em 05/03', details: 'Assinatura de software anual. Lembrete de vencimento enviado.' },
    ];

    const dataPagar = [
        { id: 1021, client: 'Fornecedor Alpha', type: 'Matéria Prima', value: 'R$ 4.500,00', numValue: 4500, status: 'Atrasado', color: 'red', date: 'Vencido em 02/03', details: 'Compra de componentes eletrônicos para produção. Sujeito a multa por atraso.' },
        { id: 1022, client: 'Aluguel Galpão', type: 'Custo Fixo', value: 'R$ 12.000,00', numValue: 12000, status: 'Pendente', color: 'yellow', date: 'Vence em 10/03', details: 'Aluguel mensal da unidade principal de estoque.' },
        { id: 1023, client: 'Amazon AWS', type: 'Hospedagem', value: 'R$ 890,00', numValue: 890, status: 'Pendente', color: 'yellow', date: 'Vence em 15/03', details: 'Serviços de infraestrutura em nuvem.' },
    ];

    const currentData = isPagar ? dataPagar : dataReceber;

    // Estados de Pagamento
    const [showPaymentFlow, setShowPaymentFlow] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);
    const [paymentStep, setPaymentStep] = useState(1);

    const filteredIssues = activeFilter === 'Todos'
        ? currentData
        : currentData.filter(issue => issue.status === activeFilter);

    const handleAction = (item) => {
        if (isPagar) {
            setSelectedBill(item);
            setShowPaymentFlow(true);
            setPaymentStep(1);
        } else {
            if (!actionDoneIds.includes(item.id)) {
                setActionDoneIds([...actionDoneIds, item.id]);
            }
        }
    };

    const confirmPayment = () => {
        setPaymentStep(2);
        setTimeout(() => {
            const newBalance = balance - selectedBill.numValue;
            const newMovement = {
                id: Date.now(),
                type: `Pagamento: ${selectedBill.client}`,
                method: 'Débito',
                time: 'Agora',
                value: `-R$ ${selectedBill.numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                isIncome: false
            };
            const updatedMovements = [newMovement, ...movements];

            setBalance(newBalance);
            setMovements(updatedMovements);
            localStorage.setItem('accountBalance', newBalance.toString());
            localStorage.setItem('movements', JSON.stringify(updatedMovements));

            setActionDoneIds([...actionDoneIds, selectedBill.id]);
            setPaymentStep(3);
        }, 1500);
    };

    const toggleDetails = (id) => {
        setExpandedIssueId(expandedIssueId === id ? null : id);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen pb-24 transition-colors duration-300">
            <Header title={isPagar ? "Contas a Pagar" : "Recebimentos Pendentes"} />

            {/* Back Navigation */}
            <div className="px-4 py-2 flex items-center gap-2">
                <button
                    onClick={() => navigate('/finance')}
                    className="flex items-center gap-1 text-primary font-bold text-sm py-2 hover:opacity-80 transition-opacity"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Voltar para Financeiro
                </button>
            </div>

            {/* Filter Bar */}
            <div className="px-4 mb-4">
                <div className="bg-white dark:bg-slate-900 p-1 flex rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                    {['Todos', 'Atrasado', 'Pendente'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all duration-200 ${activeFilter === filter
                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <main className="px-4 space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Exibindo {filteredIssues.length} {filteredIssues.length === 1 ? 'item' : 'itens'}
                    </span>
                    <button className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">filter_alt</button>
                </div>

                {filteredIssues.map((issue) => (
                    <div
                        key={issue.id}
                        className={`flex flex-col bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 border-l-4 border-l-${issue.color}-500 overflow-hidden transition-all duration-300`}
                    >
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Fatura #{issue.id}</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{issue.client}</p>
                                </div>
                                <span className={`text-[10px] font-bold text-${issue.color}-500 bg-${issue.color}-500/10 px-2.5 py-1 rounded-full uppercase tracking-tighter`}>
                                    {issue.status}
                                </span>
                            </div>

                            <div className="flex justify-between items-end mt-3">
                                <div>
                                    <p className="text-xs text-slate-500 italic">{issue.type}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="material-symbols-outlined text-[12px] text-slate-400">calendar_today</span>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">{issue.date}</p>
                                    </div>
                                </div>
                                <p className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{issue.value}</p>
                            </div>

                            {/* Detalhes Expandidos */}
                            {expandedIssueId === issue.id && (
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                        {issue.details}
                                    </p>
                                </div>
                            )}

                            <div className="mt-4 flex gap-2 font-sans">
                                {/* Botão Pagar (Condicional para viewType='pagar') */}
                                {isPagar ? (
                                    isBankingActive && (
                                        <button
                                            onClick={() => handleAction(issue)}
                                            className={`flex-1 flex items-center justify-center gap-1.5 text-[10px] font-bold py-2.5 rounded-lg uppercase tracking-tight transition-all duration-200 ${actionDoneIds.includes(issue.id)
                                                ? 'bg-emerald-500 text-white cursor-default'
                                                : 'bg-[#fa6238] text-white hover:opacity-90 active:scale-95'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-[16px]">
                                                {actionDoneIds.includes(issue.id) ? 'check_circle' : 'account_balance_wallet'}
                                            </span>
                                            {actionDoneIds.includes(issue.id) ? 'Pago com Sucesso' : 'Pagar Agora'}
                                        </button>
                                    )
                                ) : (
                                    /* Botão Cobrar */
                                    <button
                                        onClick={() => handleAction(issue)}
                                        className={`flex-1 flex items-center justify-center gap-1.5 text-[10px] font-bold py-2.5 rounded-lg uppercase tracking-tight transition-all duration-200 ${actionDoneIds.includes(issue.id)
                                            ? 'bg-emerald-500 text-white cursor-default'
                                            : 'bg-primary text-white hover:opacity-90 active:scale-95'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">
                                            {actionDoneIds.includes(issue.id) ? 'check_circle' : 'mail'}
                                        </span>
                                        {actionDoneIds.includes(issue.id) ? 'E-mail enviado' : 'Cobrar'}
                                    </button>
                                )}

                                <button
                                    onClick={() => toggleDetails(issue.id)}
                                    className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold py-2.5 rounded-lg uppercase tracking-tight transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-[16px]">
                                        {expandedIssueId === issue.id ? 'expand_less' : 'expand_more'}
                                    </span>
                                    {expandedIssueId === issue.id ? 'Fechar' : 'Detalhes'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredIssues.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-center opacity-50">
                        <span className="material-symbols-outlined text-6xl mb-2 text-slate-300">search_off</span>
                        <p className="text-sm font-bold text-slate-400">Nada encontrado nesta categoria</p>
                    </div>
                )}
            </main>

            {/* Payment Flow Modal (Banking App Style) */}
            {showPaymentFlow && selectedBill && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-full duration-500">
                        <div className="p-8">
                            {paymentStep === 1 && (
                                <div className="animate-in fade-in slide-in-from-right-5 duration-300">
                                    <div className="flex justify-between items-center mb-8">
                                        <h4 className="text-xl font-black">Revisar Pagamento</h4>
                                        <button onClick={() => setShowPaymentFlow(false)} className="material-symbols-outlined text-slate-400">close</button>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl mb-8">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pagar para</p>
                                        <p className="text-lg font-bold mb-4">{selectedBill.client}</p>
                                        <div className="flex justify-between items-end border-t border-slate-200 dark:border-slate-700 pt-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Valor do Documento</p>
                                                <p className="text-2xl font-black leading-none">{selectedBill.value}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mb-8 px-2">
                                        <span className="text-xs text-slate-500 font-medium">Saldo após pagamento:</span>
                                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 italic">
                                            R$ {(balance - selectedBill.numValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <button
                                        onClick={confirmPayment}
                                        className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-4 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                                    >
                                        Confirmar e Pagar
                                    </button>
                                </div>
                            )}

                            {paymentStep === 2 && (
                                <div className="text-center py-12 animate-in zoom-in-95 duration-300">
                                    <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="material-symbols-outlined text-4xl text-slate-400 animate-spin">fingerprint</span>
                                    </div>
                                    <h4 className="text-lg font-black mb-2">Autorizando...</h4>
                                    <p className="text-xs text-slate-500">Aguarde a validação bancária</p>
                                </div>
                            )}

                            {paymentStep === 3 && (
                                <div className="text-center py-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
                                    <div className="size-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                                        <span className="material-symbols-outlined text-4xl text-white">check</span>
                                    </div>
                                    <h4 className="text-2xl font-black mb-2">Pagamento Realizado!</h4>
                                    <p className="text-xs text-slate-500 mb-8 px-6 text-balance">
                                        O pagamento para **{selectedBill.client}** foi concluído com sucesso e o comprovante foi enviado ao seu ERP.
                                    </p>
                                    <div className="bg-emerald-500/5 p-4 rounded-xl mb-8 border border-emerald-500/10 inline-block">
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Saldo Atualizado</p>
                                        <p className="text-xl font-black text-emerald-700">R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowPaymentFlow(false)}
                                        className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-4 rounded-2xl font-black text-sm shadow-xl"
                                    >
                                        Voltar ao Início
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
};

export default PendingIssues;
