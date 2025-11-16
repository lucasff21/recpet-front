import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { showToast } from '../../../utils/toast';
import Panel from '../../../components/Panel';
import ModalAdoptionDetails from '../../../components/ModalAdoptionDetails';
import Pagination from '../../../components/Pagination';
import AdoptionTable from '../../../components/AdoptionTable';
import {
  findUserById,
  getAdocoesByUserId,
  updateAdoptionStatus,
} from '../../../services/ApiAdmin';
import logo from '../../../assets/logo-pet.png';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaEnvelope, FaPhone, FaCalendarAlt } from 'react-icons/fa';
import Breadcrumb from '../../../components/Breadcrumb';

const UserDetails = () => {
  const { id: userId } = useParams();
  document.title = 'Usuário | ADMIN';

  const [user, setUser] = useState(null);
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
        const response = await getAdocoesByUserId(userId, {
          page: filters.page,
        });
        const pageResponse = response.data;
        setAdoptions(pageResponse?.content);
        setPageData({
          totalPages: pageResponse?.totalPages,
          number: pageResponse?.pageable?.pageNumber,
          totalElements: pageResponse?.totalElements,
        });
      } catch (err) {
        showToast('Erro ao buscar as adoções do usuário.', 'error');
        setError('Erro ao buscar as adoções.');
      }
    },
    [userId, filters]
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
        const userResponse = await findUserById(userId);
        setUser(userResponse.data);
        document.title = `${userResponse?.data?.nome || 'Usuário'} | ADMIN `;
        await findAdoptions();
      } catch (err) {
        showToast('Usuário não encontrado.', 'error');
        setError('Usuário não encontrado.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, findAdoptions]);

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
                  className="h-20 w-20 rounded-full object-cover bg-gray-200"
                  src={logo}
                  alt={user?.nome || 'Usuário'}
                />
                <div className="flex flex-col justify-around gap-2">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {user?.nome}
                  </h1>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                    {user?.tipoUsuario || 'USUARIO'}
                  </span>
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="Informações de Contato">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
              <div>
                <p className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                  <FaEnvelope /> E-mail
                </p>
                <p className="text-gray-800">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                  <FaPhone /> Telefone
                </p>
                <p className="text-gray-800">
                  {user.telefone || 'Não informado'}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                  <FaCalendarAlt /> Data de Nascimento
                </p>
                <p className="text-gray-600">
                  {user.dataNascimento
                    ? new Date(user.dataNascimento).toLocaleDateString('pt-BR')
                    : 'Não informada'}
                </p>
              </div>
            </div>
          </Panel>

          <Panel>
            <h2 className="font-semibold m-0 text-center text-gray-800 mb-2">
              Solicitações de Adoção Feitas ({pageData.totalElements})
            </h2>
            {adoptions?.length === 0 && !loading ? (
              <p className="text-center text-gray-600 py-10">
                Nenhuma solicitação de adoção feita por este usuário.
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
          { label: 'Usuários', href: '/admin/usuarios' },
          { label: user?.nome || 'Detalhes' },
        ]}
      />
      {renderContent()}
    </>
  );
};

export default UserDetails;
