import React, { useState, useEffect } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { deletarAdocao, findAllAdocoes } from '../../../services/ApiAdocao';
import { showToast } from '../../../utils/toast';
import AdocaoStatusBadge from '../../../components/AdocaoStatusBadge';
import ConfirmModal from '../../../components/ConfirmModal';
import { useAdoptions } from '../../../contexts/AdoptionContext';
import { Link } from 'react-router-dom';
import { statusDetails, filterStatus, filterStatusOptions } from '../../../constants';
import StatusFilter from '../../../components/StatusFilter';

const Adoptions = () => {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, adoptionId: null });
  const { removeAdoption } = useAdoptions();
  const [filtroStatus, setFiltroStatus] = useState(filterStatus.TODOS);

  useEffect(() => {
    setLoading(true);
    findAllAdocoes()
      .then((response) => {
        setSolicitacoes(response.data);
      })
      .catch(() => {
        showToast('Erro ao carregar solicitações de adoção', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDelete = () => {
    setLoading(true);
    deletarAdocao(modal.adoptionId)
      .then(() => {
        showToast('Solicitação excluída com sucesso');
        removeAdoption(modal.adoptionId);
        window.location.reload();
      })
      .catch(() => {
        showToast('Erro ao carregar solicitações de adoção', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const openDeleteModal = (id) => {
    setModal({ isOpen: true, adoptionId: id });
  };

  const closeDeleteModal = () => {
    setModal({ isOpen: false, adoptionId: null });
  };

  const solicitacoesFiltradas = solicitacoes.filter((solicitacao) => {
    if (filtroStatus === filterStatus.TODOS) {
      return true;
    }
    return solicitacao.status === filtroStatus;
  });

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-ld shadow-sm">
      <div className="flex flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Minhas Solicitações de Adoção
        </h2>
        
        <StatusFilter value={filtroStatus} onChange={setFiltroStatus} />
      </div>

      {loading && (
        <div className="flex justify-center items-center h-48">
          <AiOutlineLoading3Quarters className="animate-spin w-8 h-8" />
          <p className="ml-4 text-gray-600">Carregando solicitações...</p>
        </div>
      )}

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {!loading && !error && solicitacoes.length === 0 && (
        <div className="text-center py-10 text-gray-600">
          <p className="mb-2">Você ainda não possui solicitações de adoção.</p>
          <p>
            Que tal explorar nossos{' '}
            <a href="/" className="text-blue-600 hover:underline">
              pets disponíveis
            </a>
            ?
          </p>
        </div>
      )}

      {!loading && !error && solicitacoes.length > 0 && solicitacoesFiltradas.length === 0 && (
        <div className="text-center py-10 text-gray-600">
          <p>Nenhuma solicitação encontrada com o status "{filterStatusOptions.find(opt => opt.value === filtroStatus)?.label}".</p>
        </div>
      )}

      {!loading && !error && solicitacoesFiltradas.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Animal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data da Solicitação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Observações
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {solicitacoesFiltradas.map((solicitacao) => (
                <tr key={solicitacao.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                        <img
                          className="h-10 w-10 object-cover"
                          src={solicitacao.animal.imagemPath}
                          alt={solicitacao.animal.nome}
                          onError={(e) =>
                            (e.target.src =
                              'https://placehold.co/60x60/a0aec0/ffffff?text=Pet')
                          }
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-blue-600">
                          <Link to={`/pets/${solicitacao.animal.id}`}>
                            {solicitacao.animal.nome}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {solicitacao.createdAt
                      ? new Date(solicitacao.createdAt).toLocaleDateString(
                          'pt-BR'
                        )
                      : 'Desconhecida'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <AdocaoStatusBadge status={solicitacao.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    {statusDetails[solicitacao.status]?.observation ||
                      statusDetails.DESCONHECIDO.observation}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => openDeleteModal(solicitacao.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal.isOpen && (
        <ConfirmModal
          message="Tem certeza que deseja excluir esta solicitação? Esta ação não pode ser desfeita."
          onConfirm={handleDelete}
          onCancel={closeDeleteModal}
        />
      )}
    </div>
  );
};

export default Adoptions;