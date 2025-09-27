import { Route, Routes } from 'react-router-dom';
import '../../styles/AdminPages.css';
import UserManagement from './user/UserManagement';
import { ToastContainer } from 'react-toastify';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import AdoptionsTable from './adoptions/AdoptionsTable';
import Sidebar from '../../components/Sidebar';
import PetManagement from './pet/PetManagement';
import { GoSidebarExpand } from 'react-icons/go';

const AdminArea = () => {
  document.title = 'Painel Admin';
  const { logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const adminMenuItems = [
    { path: '/admin', label: 'Página Inicial', iconName: 'home' },
    { path: '/admin/usuarios', label: 'Usuários', iconName: 'user' },
    { path: '/admin/pets', label: 'Pets', iconName: 'paw' },
    { path: '/admin/adocoes', label: 'Solicitações', iconName: 'adoptions' },
    { label: 'Sair', iconName: 'logout', action: logout },
  ];

  return (
    <div className="flex bg-gray-50 h-screen">
      <ToastContainer />
      <Sidebar
        title="Painel Admin"
        navigationItems={adminMenuItems}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
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
          <Route path="pets/*" element={<PetManagement />} />
          <Route path="usuarios/*" element={<UserManagement />} />
          <Route path="adocoes/*" element={<AdoptionsTable />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminArea;
