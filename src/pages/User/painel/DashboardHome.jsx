import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';

const DashboardCard = ({ title, description, color, onClick, buttonText }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 hover:border-blue-200',
    green: 'bg-green-50 text-green-600 hover:border-green-200',
  };

  return (
    <div
      className={`p-6 rounded-xl border border-transparent transition-all duration-200 cursor-pointer group ${colorClasses[color]}`}
      onClick={onClick}
    >
      <h3 className="text-lg font-bold mb-2 text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        {description}
      </p>

      <span className="text-sm font-semibold underline decoration-2 underline-offset-4 opacity-80 group-hover:opacity-100">
        {buttonText}
      </span>
    </div>
  );
};

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Olá, {user?.nome?.split(' ')[0] || 'Usuário'}!
        </h1>
        <p className="text-gray-500 mt-2">
          Bem-vindo ao seu painel. O que gostaria de fazer hoje?
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard
          title="Minhas Solicitações"
          description="Acompanhe o status dos seus pedidos de adoção e veja o histórico."
          color="blue"
          buttonText="Ver solicitações"
          onClick={() => navigate('/painel/adocoes')}
        />

        <DashboardCard
          title="Minha Conta"
          description="Atualize seus dados pessoais, endereço e preferências de contato."
          color="green"
          buttonText="Gerenciar perfil"
          onClick={() => navigate('/painel/configuracoes')}
        />
      </div>
    </div>
  );
};

export default DashboardHome;
