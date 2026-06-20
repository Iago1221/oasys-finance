import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type CompetenciaContextValue = {
  competencia: string;
  setCompetencia: (c: string) => void;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  isCurrentMonth: boolean;
  label: string;
};

const CompetenciaContext = createContext<CompetenciaContextValue | null>(null);

const COMPETENCIA_KEY = 'oasys-competencia';
const PT_MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function addMonths(yearMonth: string, delta: number): string {
  const [year, month] = yearMonth.split('-').map(Number);
  const d = new Date(year, month - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function formatLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split('-').map(Number);
  return `${PT_MONTHS[month - 1]} ${year}`;
}

export function CompetenciaProvider({ children }: { children: ReactNode }) {
  const [competencia, setCompetenciaState] = useState<string>(() => {
    return sessionStorage.getItem(COMPETENCIA_KEY) ?? getCurrentMonth();
  });

  const setCompetencia = useCallback((c: string) => {
    sessionStorage.setItem(COMPETENCIA_KEY, c);
    setCompetenciaState(c);
  }, []);

  const goToPrevMonth = useCallback(() => {
    setCompetencia(addMonths(competencia, -1));
  }, [competencia, setCompetencia]);

  const goToNextMonth = useCallback(() => {
    const next = addMonths(competencia, 1);
    if (next <= getCurrentMonth()) setCompetencia(next);
  }, [competencia, setCompetencia]);

  const isCurrentMonth = competencia === getCurrentMonth();
  const label = formatLabel(competencia);

  const value = useMemo<CompetenciaContextValue>(
    () => ({ competencia, setCompetencia, goToPrevMonth, goToNextMonth, isCurrentMonth, label }),
    [competencia, setCompetencia, goToPrevMonth, goToNextMonth, isCurrentMonth, label],
  );

  return <CompetenciaContext.Provider value={value}>{children}</CompetenciaContext.Provider>;
}

export function useCompetencia(): CompetenciaContextValue {
  const ctx = useContext(CompetenciaContext);
  if (!ctx) throw new Error('useCompetencia deve ser usado dentro de CompetenciaProvider');
  return ctx;
}
