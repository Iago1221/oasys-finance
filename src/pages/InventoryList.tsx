import React from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';
import { useProductCatalog } from '../hooks';

const InventoryList = () => {
    const { filteredProducts, searchTerm, setSearchTerm } = useProductCatalog();

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen pb-app transition-colors duration-300">
            <Header title="Consulta de Produtos" />

            <div className="px-4 py-2 flex items-center gap-2">
                <BackButton to="/inventory" label="Voltar para Estoque" />
            </div>

            {/* Search Bar - Moved from Dashboard */}
            <div className="px-4 pb-4">
                <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                    <input
                        type="text"
                        placeholder="Buscar por nome, SKU ou categoria..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            <main className="px-4 space-y-3">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Total: {filteredProducts.length} itens encontrados
                    </span>
                </div>

                {filteredProducts.map((p) => (
                    <div key={p.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all group overflow-hidden">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg overflow-hidden flex-none">
                                <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{p.name}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-slate-500 uppercase">{p.sku}</span>
                                    <span className="text-[10px] text-slate-400 font-medium capitalize">• Unid: {p.unit}</span>
                                </div>
                            </div>
                            <div className="text-right flex-none">
                                <p className="text-[9px] uppercase font-bold text-slate-400 mb-0.5 tracking-tighter">Saldo Atual</p>
                                <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{p.balance}</p>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800 flex justify-end">
                            <button className="flex items-center gap-1.5 text-[10px] font-black uppercase text-primary tracking-widest hover:opacity-80 transition-opacity">
                                <span className="material-symbols-outlined text-[16px]">print</span>
                                Imprimir Etiqueta
                            </button>
                        </div>
                    </div>
                ))}

                {filteredProducts.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-center opacity-50">
                        <span className="material-symbols-outlined text-6xl mb-2 text-slate-300">search_off</span>
                        <p className="text-sm font-bold text-slate-400">Nenhum produto encontrado</p>
                    </div>
                )}
            </main>

            <BottomNav />
        </div>
    );
};

export default InventoryList;
