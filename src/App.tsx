import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import TenantGate from './components/TenantGate';
import { AuthProvider } from './context/AuthContext';
import { DepositoProvider } from './context/DepositoContext';
import Dashboard from './pages/Dashboard';
import Finance from './pages/Finance';
import Inventory from './pages/Inventory';
import InventoryList from './pages/InventoryList';
import InventoryMovements from './pages/InventoryMovements';
import Login from './pages/Login';
import LowStock from './pages/LowStock';
import Movements from './pages/Movements';
import PendingIssues from './pages/PendingIssues';
import Sales from './pages/Sales';
import SalesHistory from './pages/SalesHistory';
import Settings from './pages/Settings';

function withDeposito(element: React.ReactNode) {
  return <DepositoProvider>{element}</DepositoProvider>;
}

function App() {
  return (
    <TenantGate>
      <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/finance" element={<Finance />} />
                    <Route path="/finance/pending" element={<PendingIssues />} />
                    <Route path="/finance/movements" element={<Movements />} />
                    <Route path="/sales" element={<Sales />} />
                    <Route path="/sales/history" element={<SalesHistory />} />
                    <Route path="/inventory" element={withDeposito(<Inventory />)} />
                    <Route path="/inventory/list" element={withDeposito(<InventoryList />)} />
                    <Route path="/inventory/movements" element={withDeposito(<InventoryMovements />)} />
                    <Route path="/inventory/low-stock" element={withDeposito(<LowStock />)} />
                    <Route path="/dashboard/activities" element={<Navigate to="/" replace />} />
                    <Route path="/sales/issued-notes" element={<Navigate to="/sales" replace />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
      </AuthProvider>
    </TenantGate>
  );
}

export default App;
