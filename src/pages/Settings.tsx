import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import InstallAppButton from '../components/InstallAppButton';
import { useIntegrations } from '../hooks';

const Settings = () => {
    // Inicializa o estado baseado na classe presente no documento
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return document.documentElement.classList.contains('dark');
    });

    const {
        isBankingActive,
        isLogisticsActive,
        isCRMActive,
        setIsBankingActive,
        setIsLogisticsActive,
        setIsCRMActive,
    } = useIntegrations();

    // Efeito para sincronizar o tema com o DOM
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }

        // Atualiza a cor da barra do browser / iPhone
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
            themeColorMeta.setAttribute('content', isDarkMode ? '#101022' : '#f6f7f8');
        }

        // Atualiza o estilo da barra de status do iOS (claro ou escuro)
        const iosBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        if (iosBarMeta) {
            iosBarMeta.setAttribute('content', isDarkMode ? 'black-translucent' : 'default');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen pb-app transition-colors duration-300">

            <Header title="Configurações do Sistema" />

            <main className="max-w-md mx-auto p-4 space-y-6">
                {/* User Profile Card (Refined) */}
                <section className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 flex items-center shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-800">
                            <img alt="Admin Avatar" className="w-full h-full object-cover" src="https://ui-avatars.com/api/?name=Admin&background=137fec&color=fff" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold leading-tight">Administrador</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Gestor Financeiro</p>
                        </div>
                    </div>
                </section>

                {/* App Settings Section */}
                <section className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">Ajustes do App</h3>
                    <div className="bg-white dark:bg-slate-900 rounded-lg divide-y divide-slate-100 dark:divide-slate-800 shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[20px]">download</span>
                                </div>
                                <span className="font-medium">Instalar aplicativo</span>
                            </div>
                            <InstallAppButton />
                        </div>
                        {/* Dark Mode Toggle */}
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-blue-600/10 text-blue-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[20px]">
                                        {isDarkMode ? 'dark_mode' : 'light_mode'}
                                    </span>
                                </div>
                                <span className="font-medium">Modo Escuro</span>
                            </div>
                            <button
                                onClick={toggleDarkMode}
                                className={`relative flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors duration-200 p-1 ${isDarkMode ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                                    }`}
                            >
                                <div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 transform ${isDarkMode ? 'translate-x-5' : 'translate-x-0'
                                    }`}></div>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Integrations Section */}
                <section className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">Integrações</h3>
                    <div className="bg-white dark:bg-slate-900 rounded-lg divide-y divide-slate-100 dark:divide-slate-800 shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
                        {/* Banking API */}
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                    <span className="material-symbols-outlined text-sm text-slate-600 dark:text-slate-400">account_balance</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium">Oasys Pay</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wide ${isBankingActive ? 'text-emerald-500' : 'text-slate-400'}`}>
                                        {isBankingActive ? 'Ativa' : 'Inativa'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsBankingActive(!isBankingActive)}
                                className={`relative flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors duration-200 p-1 ${isBankingActive ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                                    }`}
                            >
                                <div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 transform ${isBankingActive ? 'translate-x-5' : 'translate-x-0'
                                    }`}></div>
                            </button>
                        </div>
                        {/* Logistics */}
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                    <span className="material-symbols-outlined text-sm text-slate-600 dark:text-slate-400">local_shipping</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium">Logística</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wide ${isLogisticsActive ? 'text-emerald-500' : 'text-slate-400'}`}>
                                        {isLogisticsActive ? 'Ativa' : 'Inativa'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsLogisticsActive(!isLogisticsActive)}
                                className={`relative flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors duration-200 p-1 ${isLogisticsActive ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                                    }`}
                            >
                                <div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 transform ${isLogisticsActive ? 'translate-x-5' : 'translate-x-0'
                                    }`}></div>
                            </button>
                        </div>
                        {/* CRM */}
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                    <span className="material-symbols-outlined text-sm text-slate-600 dark:text-slate-400">hub</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium">Oasys CRM</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wide ${isCRMActive ? 'text-emerald-500' : 'text-slate-400'}`}>
                                        {isCRMActive ? 'Ativa' : 'Inativa'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsCRMActive(!isCRMActive)}
                                className={`relative flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors duration-200 p-1 ${isCRMActive ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                                    }`}
                            >
                                <div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 transform ${isCRMActive ? 'translate-x-5' : 'translate-x-0'
                                    }`}></div>
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <BottomNav />
        </div>
    );
};

export default Settings;
