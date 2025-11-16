import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { showToast } from '../../../utils/toast';
import Panel from '../../../components/Panel';
import ModalAdoptionDetails from '../../../components/ModalAdoptionDetails';
import Pagination from '../../../components/Pagination';
import AdoptionTable from '../../../components/AdoptionTable';
import {
  getAdocoesByAnimalId,
  updateAdoptionStatus,
} from '../../../services/ApiAdmin';
import logo from '../../../assets/logo-pet.png';
import { findAnimalById } from '../../../services/ApiAdocao';
import { calculateAge } from '../../../utils/pet';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaEdit } from 'react-icons/fa';
import { LuExternalLink } from 'react-icons/lu';
import Breadcrumb from '../../../components/Breadcrumb';

const PetDetails = () => {
  const { id: petId } = useParams();

  const [pet, setPet] = useState(null);
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageData, setPageData] = useState({
    totalPages: 0,
    number: 0,
    totalElements: 0,
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    page: 0,
  });

  const findAdoptions = useCallback(
    async (page = 0) => {
      try {
        const response = await getAdocoesByAnimalId(petId, filters);
        const pageResponse = response.data;
        setAdoptions(pageResponse?.content);
        setPageData({
          totalPages: pageResponse?.totalPages,
          number: pageResponse?.pageable?.pageNumber,
          totalElements: pageResponse?.totalElements,
        });
      } catch (err) {
        showToast('Erro ao buscar as adoções do pet.', 'error');
        setError('Erro ao buscar as adoções.');
      }
    },
    [petId, filters]
  );

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
    findAdoptions(pageData.number);
  };

  const handleModalUpdateSuccess = () => {
    findAdoptions(pageData.number);
    closeDetailsModal();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const petResponse = await findAnimalById(petId);
        setPet(petResponse.data);
        document.title = `${petResponse?.data?.nome || 'Pet'} | ADMIN `;
        await findAdoptions();
      } catch (err) {
        showToast('Pet não encontrado.', 'error');
        setError('Pet não encontrado.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [petId, findAdoptions]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <AiOutlineLoading3Quarters className="animate-spin w-8 h-8 text-gray-500" />
        </div>
      );
    }

    if (error) {
      return (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline"> {error}</span>
        </div>
      );
    }

    return (
      <>
        <div className="space-y-6">
          <Panel>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  className="h-20 w-20 rounded-full object-cover"
                  src={pet?.imagemPath || logo}
                  alt={pet?.nome || 'Animal'}
                />
                <div className="flex flex-col justify-around gap-2">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {pet?.nome}
                  </h1>
                  {pet?.disponivelParaAdocao ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                      Disponível para adoção
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                      Indisponível para adoção
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <a
                  href={`/admin/pets/${pet.id}/editar`}
                  rel="noopener noreferrer"
                  className="font-semibold flex gap-2 items-center text-blue-600 hover:underline"
                  title="Ver Perfil Público"
                >
                  Editar <FaEdit className="inline w-5 h-5" />
                </a>
                <span className="text-gray-300">|</span>
                <a
                  href={`/pets/${pet.id}`}
                  rel="noopener noreferrer"
                  className="font-semibold flex gap-2 items-center text-blue-600 hover:underline"
                  title="Ver Perfil Público"
                >
                  Ver perfil público{' '}
                  <LuExternalLink className="inline w-5 h-5" />
                </a>
              </div>
            </div>
          </Panel>

          <Panel title="Informações Detalhadas">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
              <div>
                <p className="text-sm font-semibold text-gray-500">Sexo</p>
                <p className="text-gray-800">{pet.sexo}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Porte</p>
                <p className="text-gray-800">{pet.porte}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Pelagem</p>
                <p className="text-gray-800">{pet.pelagem}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Tipo</p>
                <p className="text-gray-800">{pet.tipo}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Idade Aproximada
                </p>
                <p className="text-gray-600">
                  {calculateAge(pet.dataNascimentoAproximada)}
                </p>
              </div>
            </div>
          </Panel>

          <Panel>
            <h2 className="font-semibold m-0 text-center text-gray-800">
              Descrição e características
            </h2>
            <p className="mb-4 pt-0">{pet.descricao}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {pet.caracteristicas?.map((char) => (
                <span
                  key={char.id}
                  className="px-3 py-1 text-xs font-semibold text-indigo-800 bg-indigo-100 rounded-full"
                >
                  {char.nome}
                </span>
              ))}
            </div>
          </Panel>

          <Panel>
            <h2 className="font-semibold m-0 text-center text-gray-800 mb-2">
              Solicitações de Adoção ({pageData.totalElements})
            </h2>
            {adoptions?.length === 0 && !loading ? (
              <p className="text-center text-gray-600 py-10">
                Nenhuma solicitação de adoção para este pet.
              </p>
            ) : (
              <div>
                <AdoptionTable
                  adocoes={adoptions}
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
            )}
          </Panel>
        </div>
        {isModalOpen && selectedRequest && (
          <ModalAdoptionDetails
            isOpen={isModalOpen}
            onClose={closeDetailsModal}
            request={selectedRequest}
            onSuccess={handleModalUpdateSuccess}
          />
        )}
      </>
    );
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Pets', href: '/admin/pets' },
          { label: pet?.nome || 'Detalhes' },
        ]}
      />
      {renderContent()}
    </>
  );
};

export default PetDetails;
