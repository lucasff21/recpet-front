import Breadcrumb from '../../../components/Breadcrumb';
import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdoptionsSection from './AdoptionsSection';
import AccountSettings from './AccountSettings';
import Layout from '../../../components/Layout';
import { AuthContext } from '../../../contexts/AuthContext';
import Sidebar from '../../../components/Sidebar';
import Icon from '../../../components/Icon';

const DashboardPage = () => {
  document.title = 'Minha conta';
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const getInitialView = () => {
    const params = new URLSearchParams(location.search);
    return params.get('aba') || 'inicio';
  };

  const [activeView, setActiveView] = useState(getInitialView);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const viewFromUrl = params.get('aba');
    if (viewFromUrl && viewFromUrl !== activeView) {
      setActiveView(viewFromUrl);
    }
  }, [location.search, activeView]);

  const handleNavigate = (viewName) => {
    navigate(`?aba=${viewName}`);
    setActiveView(viewName);
    setIsSidebarOpen(false);
  };

  const painelMenuItems = [
    { viewName: 'inicio', label: 'Início', iconName: 'home' },
    { viewName: 'adocoes', label: 'Minhas adoções', iconName: 'adoptions' },
    { viewName: 'configuracoes', label: 'Editar conta', iconName: 'settings' },
  ];

  const findMenuItem = (viewName) => {
    return painelMenuItems.find((item) => item.viewName === viewName);
  };

  const ITEMS_BREADCRUMB = [
    { label: 'Painel', href: '/painel?aba=inicio' },
    findMenuItem(activeView) || {
      label: 'Página não encontrada',
    },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'inicio':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Bem-vinda ao seu Painel, {user.nome} !
            </h2>
            <p className="text-gray-600 mb-4">
              Aqui você pode gerenciar suas informações e acompanhar suas
              solicitações de adoção.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-md shadow-sm">
                <h3 className="text-lg font-semibold text-blue-800">
                  Minhas Solicitações
                </h3>
                <p className="text-gray-700">
                  Acompanhe o status das suas solicitações de adoção.
                </p>
                <button
                  onClick={() => handleNavigate('adocoes')}
                  className="mt-2 text-blue-600 hover:underline"
                >
                  Ver solicitações
                </button>
              </div>
              <div className="bg-green-50 p-4 rounded-md shadow-sm">
                <h3 className="text-lg font-semibold text-green-800">
                  Configurações da Conta
                </h3>
                <p className="text-gray-700">
                  Atualize suas informações de perfil e segurança.
                </p>
                <button
                  onClick={() => handleNavigate('configuracoes')}
                  className="mt-2 text-green-600 hover:underline"
                >
                  Gerenciar conta
                </button>
              </div>
            </div>
          </div>
        );
      case 'adocoes':
        return <AdoptionsSection />;
      case 'configuracoes':
        return <AccountSettings />;
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Página não encontrada!
            </h2>
            <p className="text-gray-600">
              A página solicitada não existe. Volte ao{' '}
              <button
                onClick={() => handleNavigate('inicio')}
                className="text-blue-600 hover:underline"
              >
                Painel
              </button>
              .
            </p>
          </div>
        );
    }
  };

  const handleItemClick = (item) => {
    if (item.viewName) {
      handleNavigate(item.viewName);
    } else if (item.action) {
      item.action();
    }
    setIsSidebarOpen(false);
  };

  return (
    <Layout className="w-screen">
      <div className="min-h-screen flex flex-col w-full">
        <div className="flex flex-1">
          <Sidebar
            title="Painel do Usuário"
            navigationItems={painelMenuItems}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            activeView={activeView}
            handleItemClick={handleItemClick}
          ></Sidebar>

          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}

          <main className="flex-1 p-4 sm:p-6 transition-all duration-300 ease-in-out bg-gray-50">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="fixed top-16 left-0 lg:hidden bg-blue-600 text-white p-3 pl-4 rounded-r-full shadow-lg z-50 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform -translate-x-1/2"
                aria-label="Abrir Menu"
              >
                <Icon name="menu" className="h-6 w-6" />
              </button>
            )}
            <div className="max-w-4xl mx-auto">
              {activeView !== 'inicio' && (
                <Breadcrumb
                  items={ITEMS_BREADCRUMB}
                  onNavigate={handleNavigate}
                />
              )}

              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
