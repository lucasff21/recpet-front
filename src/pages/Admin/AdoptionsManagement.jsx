import React, { useEffect, useState } from 'react';
import { showToast } from '../../utils/toast';
import Panel from '../../components/Panel';
import logo from '../../assets/logo-pet.png';
import { Link } from 'react-router-dom';
import ModalAdoptionDetails from '../../components/ModalAdoptionDetails';
import { getAllAdoptions, updateAdoptionStatus } from '../../services/ApiAdmin';

const AdoptionsManagement = () => {
  const [adocoes, setAdocoes] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const findAdocoes = async () => {
      try {
        const response = await getAllAdoptions();
        setAdocoes(response.data.content);
      } catch (error) {
        showToast('Erro ao buscar adoções', 'error');
      }
    };

    findAdocoes();
  }, []);

  const handleEdit = (id) => {};

  const openDetailsModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleUpdateStatus = (requestId, newStatus, adminNotes) => {
    if (!newStatus) return;

    updateAdoptionStatus(requestId, {
      status: newStatus,
      observacoes: adminNotes,
    })
      .then(() => {
        showToast(`Solicitação atualizada com sucesso`);
      })
      .catch(() => {
        showToast(`Erro ao atualizar as informações`, 'error');
      })
      .finally(() => {
        closeDetailsModal();
      });
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'PENDENTE':
        return (
          <span className="px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
            PENDENTE
          </span>
        );
      case 'EM_ANALISE':
        return (
          <span className="px-3 py-1 text-sm font-semibold text-yellow-800 bg-yellow-100 rounded-full">
            EM ANÁLISE
          </span>
        );
      case 'APROVADA':
        return (
          <span className="px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">
            APROVADA
          </span>
        );
      case 'RECUSADA':
        return (
          <span className="px-3 py-1 text-sm font-semibold text-red-800 bg-red-100 rounded-full">
            RECUSADA
          </span>
        );
      case 'ADOTADO':
        return (
          <span className="px-3 py-1 text-sm font-semibold text-purple-800 bg-purple-100 rounded-full">
            ADOTADO
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full">
            DESCONHECIDO
          </span>
        );
    }
  };

  return (
    <Panel>
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Adoções</h1>
      </header>
      <div className="text-end">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          + Nova Adoção
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar por pet, adotante ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todos os Status</option>
          <option value="PENDENTE">PENDENTE</option>
          <option value="EM_ANALISE">EM ANÁLISE</option>
          <option value="APROVADA">APROVADA</option>
          <option value="RECUSADA">RECUSADA</option>
          <option value="ADOTADO">ADOTADO</option>
        </select>
      </div>
      <div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  #
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Animal
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Adotante
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-nowrap"
                >
                  Data de conclusão
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adocoes.map(({ adocao }) => (
                <tr key={adocao.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {adocao.id ?? '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={adocao.animal?.imagemPath || logo}
                          alt={adocao.animal?.nome || 'Animal'}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          <Link to={`/pets/${adocao.animal.id}`}>
                            {adocao.animal?.nome ?? '-'}
                          </Link>
                        </div>
                        <div className="text-sm text-gray-500">
                          {adocao.animal?.idade ?? ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {adocao.user?.nome ?? '-'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {adocao.user?.email ?? ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {adocao.dataAdocao
                      ? new Date(adocao.dataAdocao).toLocaleDateString(
                          'pt-BR',
                          {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          }
                        )
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusDisplay(adocao.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => openDetailsModal(adocao)}
                    >
                      Ver mais
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedRequest && (
        <ModalAdoptionDetails
          isOpen={isModalOpen}
          onClose={closeDetailsModal}
          request={selectedRequest}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </Panel>
  );
};

export default AdoptionsManagement;
