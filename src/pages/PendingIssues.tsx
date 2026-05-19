import { useState } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useLocation } from 'react-router-dom';
import BackButton from '../components/BackButton';
import SegmentedTabs from '../components/SegmentedTabs';
import { usePendingIssuesData } from '../hooks';

export default function PendingIssues() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const viewType = searchParams.get('type') || 'receber';
  const isPagar = viewType === 'pagar';

  const { data: currentData, isLoading, error } = usePendingIssuesData(isPagar ? 'pagar' : 'receber');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [expandedIssueId, setExpandedIssueId] = useState<number | null>(null);

  const filteredIssues =
    activeFilter === 'Todos' ? currentData : currentData.filter((issue) => issue.status === activeFilter);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen pb-app">
      <Header title={isPagar ? 'Contas a Pagar' : 'Recebimentos Pendentes'} />
      <div className="px-4 py-2">
        <BackButton to="/finance" label="Voltar para Financeiro" />
      </div>
      <div className="px-4 mb-2">
        <SegmentedTabs tabs={['Todos', 'Vencido', 'Pendente']} activeTab={activeFilter} onChange={setActiveFilter} />
      </div>
      {error && <p className="mx-4 text-sm text-red-600">{error.message}</p>}
      {isLoading ? (
        <p className="text-center text-slate-500 py-8">Carregando…</p>
      ) : (
        <main className="px-4 space-y-4 mt-4">
          {filteredIssues.length === 0 ? (
            <p className="text-sm text-slate-500 text-center">Nenhuma parcela encontrada.</p>
          ) : (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 border-l-4 border-l-amber-500 p-4"
              >
                <div className="flex justify-between items-start w-full">
                  <div>
                    <p className="text-sm font-bold">{issue.client}</p>
                    <p className="text-xs text-slate-500">{issue.type}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{issue.date}</p>
                  </div>
                  <p className="text-xl font-black">{issue.value}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setExpandedIssueId(expandedIssueId === issue.id ? null : issue.id)}
                  className="mt-3 text-[10px] font-bold text-primary uppercase"
                >
                  {expandedIssueId === issue.id ? 'Ocultar' : 'Detalhes'}
                </button>
                {expandedIssueId === issue.id && (
                  <p className="mt-2 text-xs text-slate-600 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">{issue.details}</p>
                )}
              </div>
            ))
          )}
        </main>
      )}
      <BottomNav />
    </div>
  );
}
