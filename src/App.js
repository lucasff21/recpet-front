import React from 'react';
import AppRoutes from './AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
