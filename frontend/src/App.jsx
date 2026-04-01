import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Layout from './components/common/Layout';
import Login from './components/auth/Login';
import UserManagement from './components/admin/UserManagement';
import Unauthorized from './pages/Unauthorized';
import { PERMISSIONS } from './utils/permissions';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_DASHBOARD}>
              <Layout title="Dashboard">
                <div className="dashboard-placeholder">Dashboard placeholder</div>
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_USERS}>
              <Layout title="User Management">
                <UserManagement />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route path="/403" element={<Unauthorized />} />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
