import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { useDepositoContext } from '../context/DepositoContext';
import { useInventoryMonitor } from '../hooks';

export default function Inventory() {
  const navigate = useNavigate();
  const {
    depositos,
    selectedDepositoId,
    setSelectedDepositoId,
    isLoading: depositosLoading,
    error: depositosError,
  } = useDepositoContext();
  const { lowStockAlerts, recentMovements, activeItemsCount, isLoading, error } = useInventoryMonitor();

  const loading = depositosLoading || isLoading;
  const loadError = depositosError ?? error;

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-app">
        <Header title="Monitor de Estoque" />

        {/* <div className="p-4">
          <button
            type="button"
            onClick={() => navigate('/inventory/list')}
            className="w-full bg-primary text-white p-5 rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-between group hover:scale-[1.02] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <span className="material-symbols-outlined text-3xl">inventory_2</span>
              </div>
              <div className="text-left">
                <p className="text-lg font-black leading-tight">Consultar Produtos</p>
                <p className="text-xs text-white/70 font-medium">Ver saldo e SKU por depósito</p>
              </div>
            </div>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div> */}

        <div className="px-4 py-2">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">Depósitos</h3>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
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
            <section className="px-4 py-4">
              <div className="flex flex-col p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm max-w-xs">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Itens Ativos</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {activeItemsCount.toLocaleString('pt-BR')}
                </p>
              </div>
            </section>

            <section className="px-4 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold">Estoque Baixo</h3>
                <button type="button" onClick={() => navigate('/inventory/low-stock')} className="text-primary text-[10px] font-black uppercase">Ver Todas</button>
              </div>
              <div className="space-y-3">
                {lowStockAlerts.length === 0 ? (
                  <p className="text-sm text-slate-500">Nenhum alerta de estoque baixo.</p>
                ) : (
                  lowStockAlerts.map((item) => (
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

            <section className="px-4 pt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold">Movimentações Recentes</h3>
                <button type="button" onClick={() => navigate('/inventory/movements')} className="text-primary text-[10px] font-black uppercase">Ver Todas</button>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-50 dark:divide-slate-800/50">
                {recentMovements.length === 0 ? (
                  <p className="p-4 text-sm text-slate-500">Sem movimentações nas últimas 24h.</p>
                ) : (
                  recentMovements.map((mov) => (
                    <div key={mov.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-10 rounded-full flex items-center justify-center ${
                            mov.isEntry ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'
                          }`}
                        >
                          <span className="material-symbols-outlined text-xl">
                            {mov.isEntry ? 'download' : 'upload'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold leading-tight">{mov.type}</p>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {mov.origin} • {mov.time}
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
