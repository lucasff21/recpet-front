import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/AdminPages.css';
import UserManagement from './user/UserManagement';
import { ToastContainer } from 'react-toastify';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import AdoptionsTable from './adoptions/AdoptionsTable';
import Sidebar from '../../components/Sidebar';
import PetManagement from './pet/PetManagement';
import { GoSidebarExpand } from 'react-icons/go';

const AdminArea = () => {
  document.title = 'Painel Admin';
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('adocoes');

  const adminMenuItems = [
    { viewName: '/', label: 'Página Inicial', iconName: 'home' },
    { viewName: 'usuarios', label: 'Usuários', iconName: 'user' },
    { viewName: 'pets', label: 'Pets', iconName: 'paw' },
    { viewName: 'adocoes', label: 'Solicitações', iconName: 'adoptions' },
    { label: 'Sair', iconName: 'logout', action: logout },
  ];

  const handleItemClick = (item) => {
    if (item.viewName) {
      setActiveView(item.viewName);
      navigate(item.viewName);
    } else if (item.action) {
      item.action();
    }
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    let currentView = 'adocoes';

    if (pathSegments.includes('pets')) {
      currentView = 'pets';
    } else if (pathSegments.includes('usuarios')) {
      currentView = 'usuarios';
    } else if (pathSegments.includes('adocoes')) {
      currentView = 'adocoes';
    }

    setActiveView(currentView);
  }, [location.pathname]);

  return (
    <div className="flex bg-gray-50 h-screen">
      <ToastContainer />
      <Sidebar
        title="Painel Admin"
        navigationItems={adminMenuItems}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeView={activeView}
        handleItemClick={handleItemClick}
      ></Sidebar>

      <main className="flex-1 p-8 font-sans overflow-auto">
        <div className="flex">
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="fixed top-16 left-0 lg:hidden bg-blue-600 text-white p-3 pl-4 rounded-r-full shadow-lg z-50 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform -translate-x-1/2"
              aria-label="Abrir Menu"
            >
              <GoSidebarExpand onClick={() => setIsSidebarOpen(true)} />
            </button>
          )}
        </div>
        <Routes>
          <Route
            path="/*"
            element={
              <Routes>
                <Route path="pets/*" element={<PetManagement />} />
                <Route path="usuarios/*" element={<UserManagement />} />
                <Route path="adocoes" element={<AdoptionsTable />} />
              </Routes>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default AdminArea;
