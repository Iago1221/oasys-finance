export default function NotFound() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display flex flex-col items-center justify-center p-6 text-center">
      <p className="text-6xl font-black text-slate-300 dark:text-slate-700">404</p>
      <h1 className="text-xl font-bold mt-4">Tenant não encontrado</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
        Acesse o painel pelo subdomínio do cliente, por exemplo{' '}
        <span className="font-mono text-slate-700 dark:text-slate-300">https://cliente.seudominio.com</span>
      </p>
    </div>
  );
}
