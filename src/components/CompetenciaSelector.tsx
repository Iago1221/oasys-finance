import { useCompetencia } from '../context/CompetenciaContext';

export default function CompetenciaSelector() {
  const { label, goToPrevMonth, goToNextMonth, isCurrentMonth } = useCompetencia();

  return (
    <div className="flex items-center justify-between bg-white dark:bg-slate-800 px-4 py-2 border-b border-slate-100 dark:border-slate-700">
      <button
        type="button"
        onClick={goToPrevMonth}
        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
        aria-label="Mês anterior"
      >
        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
      </button>
      <span className="text-[11px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">
        {label}
      </span>
      <button
        type="button"
        onClick={goToNextMonth}
        disabled={isCurrentMonth}
        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Próximo mês"
      >
        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
      </button>
    </div>
  );
}
