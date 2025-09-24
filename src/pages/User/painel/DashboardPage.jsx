import React, { useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import AdoptionsSection from './AdoptionsSection';
import AccountSettings from './AccountSettings';
import DashboardHome from './DashboardHome';
import NotFound from '../../NotFound';
import Breadcrumb from '../../../components/Breadcrumb';
import Layout from '../../../components/Layout';
import Sidebar from '../../../components/Sidebar';
import { GoSidebarExpand } from 'react-icons/go';

const DashboardPage = () => {
  document.title = 'Minha conta';
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const painelMenuItems = [
    { path: '/painel', label: 'Início', iconName: 'home' },
    { path: '/painel/adocoes', label: 'Minhas adoções', iconName: 'adoptions' },
    {
      path: '/painel/configuracoes',
      label: 'Editar conta',
      iconName: 'settings',
    },
  ];

  const findCurrentMenuItem = (pathname) => {
    return [...painelMenuItems]
      .reverse()
      .find((item) => pathname.includes(item.path));
  };

  const currentItem = findCurrentMenuItem(location.pathname);

  const ITEMS_BREADCRUMB = [
    { label: 'Painel', href: '/painel' },
    currentItem
      ? { label: currentItem.label }
      : { label: 'Página não encontrada' },
  ];

  return (
    <Layout className="w-screen">
      <div className="min-h-screen flex flex-col w-full">
        <div className="flex flex-1">
          <Sidebar
            title="Painel"
            navigationItems={painelMenuItems}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />

          <main className="flex-1 p-4 sm:p-6 transition-all duration-300 ease-in-out bg-gray-50">
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
            <div className="max-w-4xl mx-auto">
              {location.pathname !== '/painel' && (
                <Breadcrumb
                  items={ITEMS_BREADCRUMB}
                  onNavigate={(href) => navigate(href)}
                />
              )}

              <Routes>
                <Route index element={<DashboardHome />} />
                <Route path="adocoes" element={<AdoptionsSection />} />
                <Route path="configuracoes" element={<AccountSettings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
