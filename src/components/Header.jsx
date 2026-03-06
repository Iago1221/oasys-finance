import React from 'react';

const Header = ({ title }) => {
    return (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-center px-4 py-3 min-h-[56px]">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    {title}
                </h1>
            </div>
        </header>
    );
};

export default Header;
