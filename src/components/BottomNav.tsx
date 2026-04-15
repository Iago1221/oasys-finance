import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const BottomNav = () => {
    const location = useLocation();

    const navItems = [
        { label: 'Início', path: '/', icon: 'home' },
        { label: 'Vendas', path: '/sales', icon: 'bar_chart' },
        { label: 'Estoque', path: '/inventory', icon: 'inventory_2' },
        { label: 'Financeiro', path: '/finance', icon: 'account_balance_wallet' },
        { label: 'Sistema', path: '/settings', icon: 'settings' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex min-h-[4.5rem] items-center justify-around border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-2 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
            {navItems.map((item) => {
                const isActive =
                    location.pathname === item.path ||
                    (item.path === '/' &&
                        (location.pathname === '/' || location.pathname === '/dashboard'));
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 dark:text-slate-500 hover:text-blue-600'
                            }`}
                    >
                        <span className={`material-symbols-outlined ${isActive ? 'active-fill' : ''}`}>
                            {item.icon}
                        </span>
                        <span className={`text-[10px] uppercase tracking-tighter ${isActive ? 'font-bold' : 'font-medium'}`}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
};

export default BottomNav;
