import { usePwaInstall } from '../hooks/usePwaInstall';

export { canOfferAppInstall, isAppInstalled } from '../lib/pwaInstall';

const InstallAppButton = () => {
  const { canPrompt, install } = usePwaInstall();

  if (!canPrompt) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => void install()}
      className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-primary/20"
    >
      <span className="material-symbols-outlined text-sm">download</span>
      Instalar app
    </button>
  );
};

export default InstallAppButton;
