import React, { useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { useIssuedNotes } from '../hooks';

const SalesIssuedNotes = () => {
    const navigate = useNavigate();
    const { notes: issuedNotes } = useIssuedNotes();
    const [docFilter, setDocFilter] = useState('Todos');

    const filteredNotes = docFilter === 'Todos' ? issuedNotes : issuedNotes.filter(note => note.type === docFilter);

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
                        <h1 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Notas Emitidas</h1>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{issuedNotes.length} Documentos fiscais</p>
                    </div>
                </header>

                <main className="mt-24 px-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Filter Section */}
                    <section className="bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex gap-1.5 sticky top-24 z-30">
                        {['Todos', 'NFe', 'NFCe'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setDocFilter(filter)}
                                className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${docFilter === filter
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </section>

                    {/* Listing Section */}
                    <section className="space-y-3">
                        {filteredNotes.map((doc) => (
                            <div key={doc.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all active:scale-[0.98]">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-slate-400 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                                        <span className="material-symbols-outlined text-2xl">description</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{doc.client}</p>
                                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${doc.type === 'NFe' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600' : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600'}`}>
                                                {doc.type}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-medium uppercase mt-1 tracking-tighter">Nota {doc.ref} • {doc.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-slate-900 dark:text-white mb-1.5 leading-none">{doc.value}</p>
                                    <div className="flex items-center justify-end gap-1.5">
                                        <div className={`size-1.5 rounded-full ${doc.status === 'Autorizada' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        <p className={`text-[9px] font-black uppercase ${doc.status === 'Autorizada' ? 'text-emerald-500' : 'text-amber-500'}`}>{doc.status}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredNotes.length === 0 && (
                            <div className="py-20 text-center opacity-40">
                                <span className="material-symbols-outlined text-6xl mb-4 text-slate-300">search_off</span>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Nenhuma nota {docFilter} encontrada</p>
                            </div>
                        )}
                    </section>
                </main>

                <BottomNav />
            </div>
        </div>
    );
};

export default SalesIssuedNotes;
