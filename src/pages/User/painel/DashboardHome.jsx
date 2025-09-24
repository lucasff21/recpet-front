import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Bem-vinda ao seu Painel, {user.nome}!
      </h2>
      <p className="text-gray-600 mb-4">
        Aqui você pode gerenciar suas informações e acompanhar suas solicitações
        de adoção.
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
            onClick={() => navigate('/painel/adocoes')} // Navegação direta
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
            onClick={() => navigate('/painel/configuracoes')}
            className="mt-2 text-green-600 hover:underline"
          >
            Gerenciar conta
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
