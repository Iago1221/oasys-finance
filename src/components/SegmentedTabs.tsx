type SegmentedTabsProps<T extends string> = {
  tabs: T[];
  activeTab: T;
  onChange: (tab: T) => void;
  className?: string;
};

const SegmentedTabs = <T extends string>({ tabs, activeTab, onChange, className = '' }: SegmentedTabsProps<T>) => {
  return (
    <div className={`bg-white dark:bg-slate-900 p-1 flex rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 w-full ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 ${
            activeTab === tab
              ? 'bg-primary text-white shadow-md shadow-primary/20'
              : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default SegmentedTabs;
