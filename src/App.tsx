/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Pages (lazy would be better for production, keeping sync for simplicity)
import { DashboardPage } from './pages/DashboardPage';
import { TrucksPage } from './pages/TrucksPage';
import { OrdersPage } from './pages/OrdersPage';
import { LoadingBoardPage } from './pages/LoadingBoardPage';
import { PalletTypesPage } from './pages/PalletTypesPage';
import { UsersPage } from './pages/UsersPage';
import { OrchestratorPage } from './pages/OrchestratorPage';

function RootRedirect() {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" replace />;
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RootRedirect />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute title="Dashboard" allowedRoles={['admin', 'dispatcher', 'operator']}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trucks"
        element={
          <ProtectedRoute title="Flota de Camiones" allowedRoles={['admin', 'dispatcher', 'operator']}>
            <TrucksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute title="Pedidos" allowedRoles={['admin', 'dispatcher']}>
            <OrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/loading"
        element={
          <ProtectedRoute title="Plancha de Carga" allowedRoles={['admin', 'dispatcher', 'operator']}>
            <LoadingBoardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/loading/:truckId"
        element={
          <ProtectedRoute title="Plancha de Carga" allowedRoles={['admin', 'dispatcher', 'operator']}>
            <LoadingBoardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pallets"
        element={
          <ProtectedRoute title="Tipos de Palet" allowedRoles={['admin']}>
            <PalletTypesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute title="Gestión de Usuarios" allowedRoles={['admin']}>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orchestrator"
        element={
          <ProtectedRoute title="AI Orchestrator" allowedRoles={['admin']}>
            <OrchestratorPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
