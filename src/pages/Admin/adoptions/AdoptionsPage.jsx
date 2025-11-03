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

  const [localFilters, setLocalFilters] = useState({
    termo: filters.termo,
    status: filters.status,
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
    findAdocoes();
  }, [findAdocoes]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      ...localFilters,
      page: 0,
    }));
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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

  const inputStyle =
    'h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelStyle = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <Panel>
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Adoções</h1>
      </header>

      <div className="py-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Filtros</h2>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor="termo" className={labelStyle}>
              Buscar
            </label>
            <div className="relative">
              <input
                type="text"
                id="termo"
                name="termo"
                placeholder="Pesquisar por pet, adotante ou e-mail..."
                value={localFilters.termo}
                onChange={handleFilterChange}
                onKeyDown={handleSearchKeyDown}
                className={`${inputStyle} w-full sm:w-96 pl-10 pr-4`}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg
                  className="h-5 w-5"
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
          </div>

          <div>
            <label htmlFor="status" className={labelStyle}>
              Status
            </label>
            <select
              id="status"
              name="status"
              value={localFilters.status}
              onChange={handleFilterChange}
              className={`${inputStyle} w-full sm:w-48`}
            >
              <option value="">Todos os Status</option>
              <option value="PENDENTE">PENDENTE</option>
              <option value="EM_ANALISE">EM ANÁLISE</option>
              <option value="APROVADO">APROVADO</option>
              <option value="RECUSADO">RECUSADO</option>
              <option value="FINALIZADO">FINALIZADO</option>
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="h-10 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            Buscar
          </button>
        </div>
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
