import React from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    // Check if CRM integration is active
    const [isCRMActive, setIsCRMActive] = React.useState(() => {
        const saved = localStorage.getItem('isCRMActive');
        return saved !== null ? JSON.parse(saved) : false;
    });

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans min-h-screen">
            <div className="relative flex min-h-screen flex-col overflow-x-hidden pb-24">

                <Header title="Painel Oasys" />

                <main className="flex-1 p-4 space-y-6">

                    {/* KPI Horizontal Scroll */}
                    <section className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
                        <div className="min-w-[160px] flex-1 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-blue-600 text-sm">group</span>
                                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Usuários Ativos</span>
                            </div>
                            <p className="text-2xl font-bold">1.2k</p>
                            <p className="text-[10px] text-emerald-500 font-bold mt-1">+12% vs. semana passada</p>
                        </div>

                        {isCRMActive && (
                            <div className="min-w-[160px] flex-1 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-amber-500 text-sm">confirmation_number</span>
                                    <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Tickets Abertos</span>
                                </div>
                                <p className="text-2xl font-bold">4</p>
                                <p className="text-[10px] text-slate-400 mt-1">2 alta prioridade</p>
                            </div>
                        )}
                    </section>

                    {/* Global Revenue Card */}
                    <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Receita Global</h2>
                        <div className="flex flex-col items-center py-4">
                            <div className="relative size-48">
                                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100 dark:stroke-slate-700" strokeWidth="3"></circle>
                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-blue-600" strokeWidth="3" strokeDasharray="60, 100"></circle>
                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-blue-400" strokeWidth="3" strokeDasharray="15, 100" strokeDashoffset="-60"></circle>
                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-indigo-500" strokeWidth="3" strokeDasharray="10, 100" strokeDashoffset="-75"></circle>
                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-400" strokeWidth="3" strokeDasharray="5, 100" strokeDashoffset="-85"></circle>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold">R$ 142k</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-400">Mensal</span>
                                </div>
                            </div>
                            <div className="mt-6 grid grid-cols-2 gap-y-4 gap-x-6 w-full px-2">
                                <div className="text-left border-l-2 border-blue-600 pl-2">
                                    <p className="text-xs font-bold text-blue-600">75%</p>
                                    <p className="text-[10px] uppercase text-slate-500 dark:text-slate-400">Vendas B2B</p>
                                </div>
                                <div className="text-left border-l-2 border-blue-400 pl-2">
                                    <p className="text-xs font-bold text-blue-400">15%</p>
                                    <p className="text-[10px] uppercase text-slate-500 dark:text-slate-400">Vendas B2C</p>
                                </div>
                                <div className="text-left border-l-2 border-indigo-500 pl-2">
                                    <p className="text-xs font-bold text-indigo-500">7%</p>
                                    <p className="text-[10px] uppercase text-slate-500 dark:text-slate-400 tracking-tighter">Serviços</p>
                                </div>
                                <div className="text-left border-l-2 border-slate-400 pl-2">
                                    <p className="text-xs font-bold text-slate-400">3%</p>
                                    <p className="text-[10px] uppercase text-slate-500 dark:text-slate-400">Outros</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Pending Activities */}
                    {isCRMActive && (
                        <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Atividades Pendentes</h2>
                                <button
                                    onClick={() => navigate('/dashboard/activities')}
                                    className="text-[10px] font-bold text-blue-600 uppercase"
                                >
                                    Ver Tudo
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-l-4 border-red-500 pl-3 py-1">
                                    <div>
                                        <p className="text-sm font-bold">Aprovar Folha de Pagamento</p>
                                        <p className="text-[10px] text-slate-500 uppercase">Financeiro • Hoje</p>
                                    </div>
                                    <span className="px-2 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold uppercase">Alta</span>
                                </div>
                                <div className="flex items-center justify-between border-l-4 border-amber-500 pl-3 py-1">
                                    <div>
                                        <p className="text-sm font-bold">Reposição de Estoque - Armazém A</p>
                                        <p className="text-[10px] text-slate-500 uppercase">Estoque • Amanhã</p>
                                    </div>
                                    <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase">Média</span>
                                </div>
                            </div>
                        </section>
                    )}

                </main>

                <BottomNav />

            </div>
        </div>
    );
};

export default Dashboard;
