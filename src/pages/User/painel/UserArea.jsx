import React, { useContext, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthContext } from '../../../contexts/AuthContext';
import Sidebar from '../../../components/Sidebar';
import Layout from '../../../components/Layout';
import { GoSidebarExpand } from 'react-icons/go';
import { TbLayoutDashboard } from 'react-icons/tb';
import { PiClipboardText, PiFilesFill } from 'react-icons/pi';
import { IoExitOutline, IoSettingsOutline } from 'react-icons/io5';

import DashboardHome from './DashboardHome';
import AdoptionsSection from './AdoptionsSection';
import AccountSettings from './AccountSettings';
import QuestionarioSection from './QuestionarioSection';

const UserArea = () => {
  document.title = 'Painel do Usuário';
  const { logout } = useContext(AuthContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const userMenuItems = [
    {
      path: '/painel',
      label: 'Início',
      icon: <TbLayoutDashboard className="h-5 w-5" />,
      end: true,
    },
    {
      path: '/painel/adocoes',
      label: 'Minhas Solicitações',
      icon: <PiFilesFill className="h-5 w-5" />,
    },
    {
      path: '/painel/questionario',
      label: 'Questionário de Adoção',
      icon: <PiClipboardText className="h-5 w-5" />,
    },
    {
      path: '/painel/configuracoes',
      label: 'Minha Conta',
      icon: <IoSettingsOutline className="h-5 w-5" />,
    },
    {
      label: 'Sair',
      icon: <IoExitOutline className="h-5 w-5" />,
      action: logout,
    },
  ];

  return (
    <Layout footer={true}>
      <ToastContainer />
      <div className="flex min-h-[calc(100vh-80px)] bg-gray-50 w-full">
        <Sidebar
          title="Painel"
          navigationItems={userMenuItems}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
        />

        <main
          className={`flex-1 p-4 md:p-8 font-sans transition-all duration-300 ${isCollapsed ? 'max-w-[calc(100%-80px)]' : 'max-w-[calc(100%-256px)]'}`}
        >
          <div className="flex">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="fixed top-24 left-0 lg:hidden bg-blue-600 text-white p-2 pl-3 rounded-r-full shadow-lg z-30 hover:bg-blue-700 transition-all duration-200 mt-2"
                aria-label="Abrir Menu"
              >
                <GoSidebarExpand size={20} />
              </button>
            )}
          </div>

          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="adocoes" element={<AdoptionsSection />} />
            <Route path="configuracoes" element={<AccountSettings />} />
            <Route path="questionario" element={<QuestionarioSection />} />
          </Routes>
        </main>
      </div>
    </Layout>
  );
};

export default UserArea;
