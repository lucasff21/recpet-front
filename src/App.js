import React from 'react';
import AppRoutes from './AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import { AdoptionProvider } from './contexts/AdoptionContext';

const App = () => (
  <AuthProvider>
    <AdoptionProvider>
      <AppRoutes />
    </AdoptionProvider>
  </AuthProvider>
);

export default App;
