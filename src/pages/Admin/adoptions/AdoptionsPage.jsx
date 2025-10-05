import React, { useEffect, useState, useCallback } from 'react';
import { showToast } from '../../../utils/toast';
import Panel from '../../../components/Panel';
import ModalAdoptionDetails from '../../../components/ModalAdoptionDetails';
import Pagination from '../../../components/Pagination';
import {
  getAllAdoptions,
  updateAdoptionStatus,
} from '../../../services/ApiAdmin';
import AdoptionTable from '../../../components/AdoptionTable';

const AdoptionsPage = () => {
  const [adocoes, setAdocoes] = useState([]);
  const [pageData, setPageData] = useState({ totalPages: 0, number: 0 });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    termo: '',
    status: '',
    page: 0,
  });

  const findAdocoes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllAdoptions(filters);
      const pageResponse = response.data;
      setAdocoes(pageResponse.content);
      setPageData({
        totalPages: pageResponse.totalPages,
        number: pageResponse.number,
      });
    } catch (error) {
      showToast('Erro ao buscar adoções', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const handler = setTimeout(() => {
      findAdocoes();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [filters, findAdocoes]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 0 }));
  };

  const handlePageChange = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page: page - 1 }));
  }, []);

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
        findAdocoes();
      })
      .catch(() => {
        showToast(`Erro ao atualizar as informações`, 'error');
      })
      .finally(() => {
        closeDetailsModal();
      });
  };

  return (
    <Panel>
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Adoções</h1>
      </header>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            name="termo"
            placeholder="Buscar por pet, adotante ou e-mail..."
            value={filters.termo}
            onChange={handleFilterChange}
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
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todos os Status</option>
          <option value="PENDENTE">PENDENTE</option>
          <option value="EM_ANALISE">EM ANÁLISE</option>
          <option value="APROVADO">APROVADO</option>
          <option value="RECUSADO">RECUSADO</option>
          <option value="FINALIZADO">FINALIZADO</option>
        </select>
      </div>
      <div>
        <AdoptionTable
          adocoes={adocoes}
          loading={loading}
          openDetailsModal={openDetailsModal}
        />

        {pageData.totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination
              currentPage={pageData.number + 1}
              totalPageCount={pageData.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
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

export default AdoptionsPage;
