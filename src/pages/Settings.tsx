import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import InstallAppButton, { canOfferAppInstall } from '../components/InstallAppButton';
import { useAuth } from '../context/AuthContext';
import { useIntegrations } from '../hooks/useIntegrations';
import { useNavigate } from 'react-router-dom';
import { applyTheme, getStoredTheme } from '../lib/theme';

const MODULOS_ACESSO = [
  { key: 'acessoErp' as const, label: 'ERP', icon: 'business' },
  { key: 'acessoCrm' as const, label: 'CRM', icon: 'hub' },
  { key: 'acessoGestao' as const, label: 'Gestão', icon: 'analytics' },
  { key: 'acessoVarejo' as const, label: 'Varejo', icon: 'storefront' },
  { key: 'acessoIndustria' as const, label: 'Indústria', icon: 'factory' },
  { key: 'acessoNeuron' as const, label: 'Neuron', icon: 'psychology' },
];

function usuarioAtivo(situacao: number): boolean {
  return situacao === 1;
}

const Settings = () => {
    const navigate = useNavigate();
    const { logout, user, userLoading, userError } = useAuth();
    const {
        isBankingActive,
        isLogisticsActive,
        isCRMActive,
        isLoading: integrationsLoading,
    } = useIntegrations();
    const [isDarkMode, setIsDarkMode] = useState(() => getStoredTheme() === 'dark');

    const showInstallApp = canOfferAppInstall();

    const modulosAtivos = useMemo(() => {
        if (!user) return [];
        return MODULOS_ACESSO.filter((m) => user[m.key]);
    }, [user]);

    const avatarUrl = user
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nome)}&background=137fec&color=fff`
        : 'https://ui-avatars.com/api/?name=Usuario&background=137fec&color=fff';

    useEffect(() => {
        applyTheme(isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen pb-app transition-colors duration-300">

            <Header title="Configurações do Sistema" />

            <main className="max-w-md mx-auto p-4 space-y-6">
                <section className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="min-w-0 flex-1">
                            {userLoading ? (
                                <p className="text-sm text-slate-500">Carregando perfil…</p>
                            ) : user ? (
                                <>
                                    <h2 className="text-lg font-bold leading-tight truncate">{user.nome}</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                                    <span
                                        className={`inline-block mt-2 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                                            usuarioAtivo(user.situacao)
                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                                        }`}
                                    >
                                        {usuarioAtivo(user.situacao) ? 'Ativo' : 'Inativo'}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-lg font-bold leading-tight">Usuário</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {userError?.message ?? 'Perfil indisponível'}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {user && modulosAtivos.length === 0 && !userLoading && (
                    <p className="text-xs text-slate-500 px-1">Nenhum módulo habilitado para este usuário.</p>
                )}

                <section className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">Ajustes do App</h3>
                    <div className="bg-white dark:bg-slate-900 rounded-lg divide-y divide-slate-100 dark:divide-slate-800 shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
                        {showInstallApp && (
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[20px]">download</span>
                                    </div>
                                    <span className="font-medium">Instalar aplicativo</span>
                                </div>
                                <InstallAppButton />
                            </div>
                        )}
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
                                type="button"
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

                <section className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">Integrações</h3>
                    <div className="bg-white dark:bg-slate-900 rounded-lg divide-y divide-slate-100 dark:divide-slate-800 shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                    <span className="material-symbols-outlined text-sm text-slate-600 dark:text-slate-400">account_balance</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium">Oasys Pay</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wide ${isBankingActive ? 'text-emerald-500' : 'text-slate-400'}`}>
                                        {integrationsLoading ? '…' : isBankingActive ? 'Ativa' : 'Inativa'}
                                    </span>
                                </div>
                            </div>
                            <div
                                className={`relative flex h-6 w-11 items-center rounded-full p-1 ${isBankingActive ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                                aria-hidden
                            >
                                <div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${isBankingActive ? 'translate-x-5' : 'translate-x-0'}`} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                    <span className="material-symbols-outlined text-sm text-slate-600 dark:text-slate-400">local_shipping</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium">Logística</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wide ${isLogisticsActive ? 'text-emerald-500' : 'text-slate-400'}`}>
                                        {integrationsLoading ? '…' : isLogisticsActive ? 'Ativa' : 'Inativa'}
                                    </span>
                                </div>
                            </div>
                            <div
                                className={`relative flex h-6 w-11 items-center rounded-full p-1 ${isLogisticsActive ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                                aria-hidden
                            >
                                <div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${isLogisticsActive ? 'translate-x-5' : 'translate-x-0'}`} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                    <span className="material-symbols-outlined text-sm text-slate-600 dark:text-slate-400">hub</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium">Oasys CRM</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wide ${isCRMActive ? 'text-emerald-500' : 'text-slate-400'}`}>
                                        {integrationsLoading ? '…' : isCRMActive ? 'Ativa' : 'Inativa'}
                                    </span>
                                </div>
                            </div>
                            <div
                                className={`relative flex h-6 w-11 items-center rounded-full p-1 ${isCRMActive ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                                aria-hidden
                            >
                                <div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${isCRMActive ? 'translate-x-5' : 'translate-x-0'}`} />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">Sessão</h3>
                    <button
                        type="button"
                        onClick={() => {
                            logout();
                            navigate('/login');
                        }}
                        className="w-full bg-red-500/10 text-red-600 dark:text-red-400 font-bold py-4 rounded-xl border border-red-500/20"
                    >
                        Sair da conta
                    </button>
                </section>
            </main>

            <BottomNav />
        </div>
    );
};

export default Settings;
