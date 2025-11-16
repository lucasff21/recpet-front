import React, { useContext, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import '../../styles/AdminPages.css';
import UserManagement from './user/UserManagement';
import { ToastContainer } from 'react-toastify';
import { AuthContext } from '../../contexts/AuthContext';
import AdminDashboard from './dashboard/DashboardPage';
import Sidebar from '../../components/Sidebar';
import PetManagement from './pet/PetManagement';
import { GoSidebarExpand } from 'react-icons/go';
import ContentManagement from './content/ContentManagement';
import CharacteristicsManagement from './characteristics/CharacteristicsManagement';
import { FiFileText } from 'react-icons/fi';
import { MdOutlinePets } from 'react-icons/md';
import { TbLayoutDashboard } from 'react-icons/tb';
import { PiFilesFill } from 'react-icons/pi';
import { FaUser } from 'react-icons/fa';
import { IoMdHome } from 'react-icons/io';
import { AiOutlineTags } from 'react-icons/ai';
import { IoExitOutline } from 'react-icons/io5';
import AdoptionManagement from './adoptions/AdoptionManagement';

const AdminArea = () => {
  document.title = 'Painel Admin';
  const { logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const adminMenuItems = [
    {
      path: '/',
      label: 'Página Inicial',
      icon: <IoMdHome className="h-5 w-5 mr-3" />,
    },
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: <TbLayoutDashboard className="h-5 w-5 mr-3" />,
    },
    {
      path: '/admin/usuarios',
      label: 'Usuários',
      icon: <FaUser className="h-5 w-5 mr-3" />,
    },
    {
      path: '/admin/pets',
      label: 'Pets',
      icon: <MdOutlinePets className="h-5 w-5 mr-3" />,
    },
    {
      path: '/admin/adocoes',
      label: 'Solicitações',
      icon: <PiFilesFill className="h-5 w-5 mr-3" />,
    },
    {
      path: '/admin/conteudos',
      label: 'Conteúdos',
      icon: <FiFileText className="h-5 w-5 mr-3" />,
    },
    {
      path: '/admin/temperamentos',
      label: 'Temperamentos',
      icon: <AiOutlineTags className="h-5 w-5 mr-3" />,
    },
    {
      label: 'Sair',
      icon: <IoExitOutline className="h-5 w-5 mr-3" />,
      action: logout,
    },
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
          <Route path="dashboard/*" element={<AdminDashboard />} />
          <Route path="pets/*" element={<PetManagement />} />
          <Route path="usuarios/*" element={<UserManagement />} />
          <Route path="adocoes/*" element={<AdoptionManagement />} />
          <Route path="conteudos/*" element={<ContentManagement />} />
          <Route
            path="temperamentos/*"
            element={<CharacteristicsManagement />}
          />
        </Routes>
      </main>
    </div>
  );
};

export default AdminArea;
