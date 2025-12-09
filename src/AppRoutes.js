import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';

import AdminArea from './pages/Admin/AdminArea';
import { AuthContext } from './contexts/AuthContext';
import Login from './pages/User/Login';
import CreateAccountForm from './pages/User/CreateAccount';
import AboutUs from './pages/AboutUs';
import PetProfilePage from './pages/PetProfilePage';
import DashboardPage from './pages/User/painel/DashboardPage';
import Contact from './pages/Contact';
import RecoveryPassword from './pages/User/RecoveryPassword';
import ResetPassword from './pages/User/ResetPassword';
import Faq from './pages/Faq';

const PrivateRoute = ({ element: Element }) => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? <Element /> : <Navigate to="/" />;
};

const AdminRoute = ({ element: Element }) => {
  const { isAuthenticated, role, loading } = useContext(AuthContext);

  if (!loading) {
    return isAuthenticated && role === 'ADMIN' ? (
      <Element />
    ) : (
      <Navigate to="/" />
    );
  }
};

const PublicRoute = ({ element: Element }) => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? <Navigate to="/" /> : <Element />;
};

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quem-somos" element={<AboutUs />} />
      <Route path="/contato" element={<Contact />} />
      <Route path="/pets/:id" element={<PetProfilePage />} />
      <Route path="/faq" element={<Faq />} />
      {/* ROTAS PROTEGIDAS PARA USUÁRIO LOGADO */}
      <Route path="/login" element={<PublicRoute element={Login} />} />
      <Route
        path="/criar-conta"
        element={<PublicRoute element={CreateAccountForm} />}
      />

      <Route
        path="/solicitar-senha"
        element={<PublicRoute element={RecoveryPassword} />}
      />

      <Route
        path="/recuperar-senha"
        element={<PublicRoute element={ResetPassword} />}
      />

      {/* ROTAS PROTEGIDA */}
      <Route
        path="/painel/*"
        element={<PrivateRoute element={DashboardPage} />}
      />

      {/* ROTAS PROTEGIDA ADMIN */}
      <Route path="/admin/*" element={<AdminRoute element={AdminArea} />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
