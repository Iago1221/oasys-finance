import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import CompetenciaSelector from '../components/CompetenciaSelector';
import { useNavigate } from 'react-router-dom';
import { useDepositoContext } from '../context/DepositoContext';
import { useInventoryMonitor } from '../hooks';
import { formatCurrency } from '../lib/mappers';

function BarChart({ entradas, saidas }: { entradas: number; saidas: number }) {
  const max = Math.max(entradas, saidas, 1);
  const wEntradas = Math.max(6, Math.round((entradas / max) * 100));
  const wSaidas = Math.max(6, Math.round((saidas / max) * 100));

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <span>Entradas</span>
          <span className="text-blue-600 dark:text-blue-400 font-black">{entradas.toLocaleString('pt-BR')} un.</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${wEntradas}%` }} />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <span>Saídas</span>
          <span className="text-orange-500 font-black">{saidas.toLocaleString('pt-BR')} un.</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${wSaidas}%` }} />
        </div>
      </div>
    </div>
  );
}

export default function Inventory() {
  const navigate = useNavigate();
  const {
    depositos,
    selectedDepositoId,
    setSelectedDepositoId,
    isLoading: depositosLoading,
    error: depositosError,
  } = useDepositoContext();
  const {
    lowStockAlerts,
    recentMovements,
    activeItemsCount,
    valorCusto,
    valorVenda,
    produtosSemMovimentacao,
    entradasSaidas,
    valorCustoLoading,
    valorVendaLoading,
    isLoading,
    error,
  } = useInventoryMonitor();

  const loading = depositosLoading || isLoading;
  const loadError = depositosError ?? error;

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-app">
        <Header title="Monitor de Estoque" />
        <CompetenciaSelector />

        <div className="px-4 pt-3 pb-1">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">Depósitos</h3>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {depositos.map((deposito) => (
              <button
                key={deposito.id}
                type="button"
                onClick={() => setSelectedDepositoId(deposito.id)}
                className={`flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border ${
                  selectedDepositoId === deposito.id
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-transparent shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-100 dark:border-slate-800'
                }`}
              >
                {deposito.descricao}
              </button>
            ))}
          </div>
        </div>

        {loadError && (
          <p className="mx-4 text-sm text-red-600 bg-red-50 dark:bg-red-500/10 rounded-lg px-4 py-3">{loadError.message}</p>
        )}

        {loading ? (
          <p className="text-sm text-slate-500 text-center py-8">Carregando estoque…</p>
        ) : (
          <div>
            {/* Cards de valor */}
            <section className="px-4 py-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Produtos Ativos</span>
                <p className="text-2xl font-black">{activeItemsCount.toLocaleString('pt-BR')}</p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">no cadastro</p>
              </div>

              <div className="flex flex-col p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Valor de Custo</span>
                {valorCustoLoading ? (
                  <p className="text-sm text-slate-400">…</p>
                ) : (
                  <p className="text-2xl font-black">{formatCurrency(valorCusto?.valorCusto ?? 0)}</p>
                )}
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">custo médio em estoque</p>
              </div>

              <div className="flex flex-col p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Valor de Venda</span>
                {valorVendaLoading ? (
                  <p className="text-sm text-slate-400">…</p>
                ) : (
                  <p className="text-2xl font-black">{formatCurrency(valorVenda?.valorVenda ?? 0)}</p>
                )}
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">pela tabela de preço</p>
              </div>
            </section>

            {/* Entradas x Saídas */}
            <section className="px-4 pt-2 pb-4">
              <h3 className="text-[10px] font-black text-slate-400 mb-3 px-1 uppercase tracking-widest">Entradas x Saídas no Período</h3>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
                {entradasSaidas ? (
                  <BarChart entradas={entradasSaidas.entradas} saidas={entradasSaidas.saidas} />
                ) : (
                  <p className="text-sm text-slate-500 text-center">Selecione um depósito.</p>
                )}
              </div>
            </section>

            {/* Estoque Baixo */}
            <section className="px-4 pt-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold">Estoque Baixo</h3>
                <button type="button" onClick={() => navigate('/inventory/low-stock')} className="text-primary text-[10px] font-black uppercase">Ver Todas</button>
              </div>
              <div className="space-y-3">
                {lowStockAlerts.length === 0 ? (
                  <p className="text-sm text-slate-500">Nenhum alerta de estoque baixo.</p>
                ) : (
                  lowStockAlerts.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        <img className="h-11 w-11 rounded-xl object-cover" src={item.image} alt={item.name} />
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate">{item.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{item.sku}</p>
                        </div>
                      </div>
                      <div className="text-right flex-none">
                        <p className="text-sm font-black text-red-500">{item.current} uni</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Mín: {item.min}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Produtos Sem Movimentação */}
            <section className="px-4 pt-8">
              <h3 className="text-base font-bold mb-4">Produtos sem Movimentação</h3>
              {!produtosSemMovimentacao?.produtos?.length ? (
                <p className="text-sm text-slate-500">Todos os produtos foram movimentados no período.</p>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                  {produtosSemMovimentacao.produtos.map((p, i) => (
                    <div key={p.id} className="flex items-center gap-3 px-4 py-3 border-b last:border-0 border-slate-50 dark:border-slate-800/50">
                      <span className="text-[11px] font-black text-slate-400 w-5 text-center flex-none">{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-bold truncate">{p.descricao}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{p.sku ?? '—'}</p>
                      </div>
                      <div className="text-right flex-none">
                        <p className="text-[12px] font-black">{p.saldo.toLocaleString('pt-BR')} un.</p>
                        {p.diasSemMovimentacao != null && (
                          <p className="text-[10px] text-amber-500 font-bold">{p.diasSemMovimentacao}d sem mov.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Movimentações Recentes */}
            <section className="px-4 pt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold">Movimentações Recentes</h3>
                <button type="button" onClick={() => navigate('/inventory/movements')} className="text-primary text-[10px] font-black uppercase">Ver Todas</button>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-50 dark:divide-slate-800/50">
                {recentMovements.length === 0 ? (
                  <p className="p-4 text-sm text-slate-500">Sem movimentações nas últimas 24h.</p>
                ) : (
                  recentMovements.slice(0, 3).map((mov) => (
                    <div key={mov.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`size-10 rounded-full flex items-center justify-center ${
                          mov.isEntry ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'
                        }`}>
                          <span className="material-symbols-outlined text-xl">
                            {mov.isEntry ? 'download' : 'upload'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold leading-tight">{mov.type}</p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {mov.origin} · {mov.time}
                          </p>
                        </div>
                      </div>
                      <p className={`text-sm font-black ${mov.isEntry ? 'text-blue-500' : 'text-orange-500'}`}>{mov.quantity}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}

        <BottomNav />
      </div>
    </div>
  );
}
