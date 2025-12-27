import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GoSearch } from 'react-icons/go';
import { FaFilter } from 'react-icons/fa6';
import { showToast } from '../../../utils/toast';
import Panel from '../../../components/Panel';
import ModalAdoptionDetails from '../../../components/ModalAdoptionDetails';
import Pagination from '../../../components/Pagination';
import { getAllAdoptions } from '../../../services/ApiAdmin';
import AdoptionTable from '../../../components/AdoptionTable';

const AdoptionsPage = () => {
  document.title = 'Adoções | ADMIN';
  const [searchParams, setSearchParams] = useSearchParams();

  const urlStatus = searchParams.get('status') || '';
  const urlTermo = searchParams.get('termo') || '';
  const urlPage = searchParams.get('page')
    ? Number(searchParams.get('page')) - 1
    : 0;

  const [adocoes, setAdocoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState({
    totalPages: 0,
    number: 0,
    totalElements: 0,
  });

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    termo: urlTermo,
    status: urlStatus,
    page: urlPage,
  });

  const [localFilters, setLocalFilters] = useState({
    termo: urlTermo,
    status: urlStatus,
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
        totalElements: pageResponse.totalElements,
      });
    } catch (error) {
      showToast('Erro ao buscar adoções', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const paramsToSet = {};
    if (filters.termo) paramsToSet.termo = filters.termo;
    if (filters.status) paramsToSet.status = filters.status;
    if (filters.page > 0) paramsToSet.page = filters.page + 1;

    setSearchParams(paramsToSet, { replace: true });
    findAdocoes();
  }, [findAdocoes, filters, setSearchParams]);

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
    if (e.key === 'Enter') handleSearch();
  };

  const clearFilters = () => {
    setLocalFilters({ termo: '', status: '' });
    setFilters({ termo: '', status: '', page: 0 });
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

  const handleModalUpdateSuccess = () => {
    findAdocoes();
    closeDetailsModal();
  };

  return (
    <Panel className="bg-transparent">
      <div className="mx-auto pb-10">
        <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Solicitações de Adoção
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Total de {pageData.totalElements} solicitações encontradas
            </p>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-visible relative z-10">
          <div className="p-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:w-96">
              <GoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="termo"
                value={localFilters.termo}
                onChange={handleFilterChange}
                onKeyDown={handleSearchKeyDown}
                placeholder="Buscar por pet, adotante ou email..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex w-full lg:w-auto items-center gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
                <select
                  name="status"
                  value={localFilters.status}
                  onChange={handleFilterChange}
                  className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-8 p-2 min-w-[180px]"
                >
                  <option value="">Todos os Status</option>
                  <option value="PENDENTE">Pendente</option>
                  <option value="EM_ANALISE">Em Análise</option>
                  <option value="APROVADO">Aprovado</option>
                  <option value="RECUSADO">Recusado</option>
                  <option value="FINALIZADO">Finalizado</option>
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="bg-gray-900 text-white font-medium px-6 py-2 rounded-lg hover:bg-black transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                Filtrar
              </button>

              {(localFilters.termo || localFilters.status) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-blue-600 underline whitespace-nowrap px-2"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative z-0">
          <AdoptionTable
            adocoes={adocoes}
            loading={loading}
            openDetailsModal={openDetailsModal}
            clearFilters={clearFilters}
          />

          {pageData.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex justify-center bg-gray-50">
              <Pagination
                currentPage={pageData.number + 1}
                totalPageCount={pageData.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {isModalOpen && selectedRequest && (
        <ModalAdoptionDetails
          isOpen={isModalOpen}
          onClose={closeDetailsModal}
          request={selectedRequest}
          onSuccess={handleModalUpdateSuccess}
        />
      )}
    </Panel>
  );
};

export default AdoptionsPage;
