import React, { useState } from 'react';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { useActivities } from '../hooks';

const PendingActivities = () => {
    const navigate = useNavigate();
    const { activities } = useActivities();
    const [filter, setFilter] = useState('Todas');

    const filteredActivities = filter === 'Todas' ? activities : activities.filter(act => act.priority === filter);

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-300">
            <div className="relative flex min-h-screen flex-col overflow-x-hidden pb-app">

                <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-900 px-4 py-4 max-w-md mx-auto flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="size-10 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 flex items-center justify-center active:scale-95 transition-transform"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                        <h1 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Atividades</h1>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{activities.length} Atitividades Pendentes</p>
                    </div>
                </header>

                <main className="mt-24 px-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Filter Section */}
                    <section className="bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex gap-1.5 sticky top-24 z-30 overflow-x-auto no-scrollbar">
                        {['Todas', 'Alta', 'Média', 'Baixa'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`flex-1 py-3 px-4 text-[10px] font-black uppercase rounded-xl transition-all whitespace-nowrap ${filter === f
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </section>

                    {/* Listing Section */}
                    <section className="space-y-4">
                        {filteredActivities.map((act) => (
                            <div key={act.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all active:scale-[0.98]">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-2 rounded-full bg-${act.color}-500 shadow-[0_0_8px_rgba(0,0,0,0.1)]`} />
                                        <span className={`text-[10px] font-black uppercase tracking-widest text-${act.color}-500`}>{act.priority} Prioridade</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{act.category}</span>
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-tight">{act.title}</h3>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{act.description}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800/50">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px] text-slate-400">calendar_today</span>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Prazo: {act.deadline}</span>
                                    </div>
                                    <button className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-[10px] font-black uppercase active:bg-primary active:text-white transition-colors">
                                        Concluir
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredActivities.length === 0 && (
                            <div className="py-20 text-center opacity-40">
                                <span className="material-symbols-outlined text-6xl mb-4 text-slate-300">task_alt</span>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Tudo em dia!</p>
                            </div>
                        )}
                    </section>
                </main>

                <BottomNav />
            </div>
        </div>
    );
};

export default PendingActivities;
