import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { showToast } from '../../../utils/toast';
import Panel from '../../../components/Panel';
import ModalAdoptionDetails from '../../../components/ModalAdoptionDetails';
import Pagination from '../../../components/Pagination';
import AdoptionTable from '../../../components/AdoptionTable';
import { findUserById, getAdocoesByUserId } from '../../../services/ApiAdmin';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import {
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaIdCard,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import Breadcrumb from '../../../components/Breadcrumb';
import { calculateHumanAge } from '../../../utils/usuario';
import AdoptionQuestionnaire from '../../../components/AdoptionQuestionnaire';

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

  const questionario = user?.questionario || null;

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
            <div className="flex items-center justify-between w-full">
              <h1 className="text-3xl font-bold text-gray-800">{user?.nome}</h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                {user?.tipoUsuario || 'USUARIO'}
              </span>
            </div>
          </Panel>

          <Panel title="Dados Pessoais e Contato">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-6">
              <div>
                <p className="text-sm font-semibold text-gray-500 flex items-center gap-2 mb-1">
                  <FaIdCard /> CPF
                </p>
                <p className="text-gray-800 font-medium font-mono">
                  {user.cpf || 'Não informado'}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500 flex items-center gap-2 mb-1">
                  <FaCalendarAlt /> Idade
                </p>
                <p className="text-gray-800">
                  {user.dataNascimento
                    ? `${calculateHumanAge(user.dataNascimento)} anos`
                    : 'Não informada'}
                  {user.dataNascimento && (
                    <span className="text-xs text-gray-500 block">
                      {new Date(
                        user.dataNascimento + 'T00:00:00'
                      ).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </p>
              </div>

              <div className="lg:col-span-2">
                <p className="text-sm font-semibold text-gray-500 flex items-center gap-2 mb-1">
                  <FaEnvelope /> E-mail
                </p>
                <a
                  href={`mailto:${user.email}`}
                  className="text-gray-800 hover:text-blue-600 hover:underline break-all"
                >
                  {user.email}
                </a>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500 flex items-center gap-2 mb-1">
                  <FaPhone /> Telefone
                </p>
                <p className="text-gray-800">
                  {user.telefone ? (
                    <a
                      href={`https://api.whatsapp.com/send?phone=55${user.telefone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 hover:text-blue-600 hover:underline"
                    >
                      {user.telefone}
                    </a>
                  ) : (
                    <p className="text-gray-800">Não informado</p>
                  )}
                </p>
              </div>

              <div className="md:col-span-2 lg:col-span-2">
                <p className="text-sm font-semibold text-gray-500 flex items-center gap-2 mb-1">
                  <FaMapMarkerAlt /> Endereço
                </p>
                <p className="text-gray-800 text-sm">
                  {user.endereco ? (
                    <>
                      {user.endereco.logradouro}, {user.endereco.numero}
                      {user.endereco.complemento &&
                        ` - ${user.endereco.complemento}`}
                      , {user.endereco.bairro}, {user.endereco.localidade} -{' '}
                      {user.endereco.uf}
                    </>
                  ) : (
                    <span className="italic text-gray-500">
                      Endereço não cadastrado
                    </span>
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500 flex items-center gap-2 mb-1">
                  <FaMapMarkerAlt /> CEP
                </p>
                <p className="text-gray-800 text-sm">
                  {user.endereco?.cep || 'Não informado'}
                </p>
              </div>
            </div>
          </Panel>

          <Panel title="Questionário de Adoção">
            <AdoptionQuestionnaire questionario={questionario} />
          </Panel>

          <Panel
            title={`Solicitações de Adoção Feitas (${pageData.totalElements})`}
          >
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
