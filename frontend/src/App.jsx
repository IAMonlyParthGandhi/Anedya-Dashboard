import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
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
              <div style={{ padding: '2rem' }}>Dashboard placeholder</div>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_USERS}>
              <div style={{ padding: '2rem' }}>Admin placeholder</div>
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
