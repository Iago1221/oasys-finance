import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import Settings from './pages/Settings';
import Finance from './pages/Finance';
import Sales from './pages/Sales';
import SalesHistory from './pages/SalesHistory';
import SalesIssuedNotes from './pages/SalesIssuedNotes';
import Inventory from './pages/Inventory';
import InventoryList from './pages/InventoryList';
import InventoryMovements from './pages/InventoryMovements';
import LowStock from './pages/LowStock';
import Dashboard from './pages/Dashboard';
import PendingIssues from './pages/PendingIssues';
import PendingActivities from './pages/PendingActivities';
import Movements from './pages/Movements';

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark =
      savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

    document.documentElement.classList.toggle('dark', isDark);

    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', isDark ? '#101022' : '#f6f7f8');
    }

    const iosBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (iosBarMeta) {
      iosBarMeta.setAttribute('content', isDark ? 'black-translucent' : 'default');
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/sales/history" element={<SalesHistory />} />
          <Route path="/sales/issued-notes" element={<SalesIssuedNotes />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/list" element={<InventoryList />} />
          <Route path="/inventory/movements" element={<InventoryMovements />} />
          <Route path="/inventory/low-stock" element={<LowStock />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/finance/pending" element={<PendingIssues />} />
          <Route path="/finance/movements" element={<Movements />} />
          <Route path="/dashboard/activities" element={<PendingActivities />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
