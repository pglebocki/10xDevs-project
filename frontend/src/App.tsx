import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import RepositoriesPage from './pages/RepositoriesPage';
import DevelopersPage from './pages/DevelopersPage';
import TimelinePage from './pages/TimelinePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/repositories" replace />} />
        <Route path="repositories" element={<RepositoriesPage />} />
        <Route path="repositories/:repoId/developers" element={<DevelopersPage />} />
        <Route path="repositories/:repoId/metrics/:metricType" element={<TimelinePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;