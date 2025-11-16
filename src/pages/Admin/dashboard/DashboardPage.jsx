import React, { useEffect, useState, useCallback } from 'react';
import { getAdminMetrics, getAllAdoptions } from '../../../services/ApiAdmin';
import StatsCard from '../dashboard/StatsCard';
import { FaDog, FaCat, FaUsers } from 'react-icons/fa';
import { MdOutlinePets } from 'react-icons/md';
import { PiFilesFill } from 'react-icons/pi';
import {
  IoTimeOutline,
  IoCheckmarkCircle,
  IoSearchOutline,
} from 'react-icons/io5';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { showToast } from '../../../utils/toast';
import ModalAdoptionDetails from '../../../components/ModalAdoptionDetails';
import AdocaoStatusBadge from '../../../components/AdocaoStatusBadge';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPets: 0,
    pendingAdoptions: 0,
    approvedAdoptions: 0,
    finalizedAdoptions: 0,
    totalAnimals: 0,
    available: 0,
    totalDogs: 0,
    totalCats: 0,
    totalRequests: 0,
    pending: 0,
    underReview: 0,
    approved: 0,
    completed: 0,
    totalAdopters: 0,
  });

  const navigate = useNavigate();
  const [recentAdoptions, setRecentAdoptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  const openDetailsModal = (adoption) => {
    setSelectedRequest(adoption);
    setIsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleModalUpdateSuccess = () => {
    fetchDashboardData();
    closeDetailsModal();
  };

  const fetchAllPages = async (fetchFn, size = 50, extraParams = {}) => {
    let page = 0;
    let allData = [];
    let last = false;

    while (!last) {
      const response = await fetchFn({ page, size, ...extraParams });
      const data = response.data;
      allData = [...allData, ...data.content];
      last = data.last;
      page++;
    }

    return allData;
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [getAdminMetricsResponse, allAdoptions] = await Promise.all([
        getAdminMetrics(),
        fetchAllPages(getAllAdoptions, 50, { sortByDate: 'desc' }),
      ]);
      const adminMetrics = getAdminMetricsResponse.data;
      setStats({
        totalUsers: adminMetrics.usuarios?.totalUsuarios || 0,
        totalPets: adminMetrics.animais?.totalAnimais || 0,
        pendingAdoptions: adminMetrics.adocoes?.pendentes || 0,
        approvedAdoptions: adminMetrics.adocoes?.aprovadas || 0,
        finalizedAdoptions: adminMetrics.adocoes?.finalizadas || 0,

        totalAnimals: adminMetrics.animais?.totalAnimais || 0,
        available: adminMetrics.animais?.disponiveis || 0,
        totalDogs: adminMetrics.animais?.totalCachorros || 0,
        totalCats: adminMetrics.animais?.totalGatos || 0,

        totalRequests: adminMetrics.adocoes?.totalSolicitacoes || 0,
        pending: adminMetrics.adocoes?.pendentes || 0,
        underReview: adminMetrics.adocoes?.emAnalise || 0,
        approved: adminMetrics.adocoes?.aprovadas || 0,
        completed: adminMetrics.adocoes?.finalizadas || 0,

        totalAdopters: adminMetrics.usuarios?.totalAdotantes || 0,
      });

      setRecentAdoptions(allAdoptions.slice(0, 15));
    } catch (error) {
      showToast(
        'Erro ao carregar dados do dashboard. Tente novamente.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const loadingSpinner = (
    <AiOutlineLoading3Quarters className="animate-spin w-5 h-5" />
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 auto-rows-fr">
        <div className="hidden sm:block">
          <StatsCard
            title="Total de Adotantes"
            value={loading ? loadingSpinner : stats.totalAdopters}
            icon={<FaUsers className="text-2xl" />}
            color="indigo"
            link="/admin/usuarios?tipo=ADOTANTE"
          />
        </div>
        <StatsCard
          title="Adoções Pendentes"
          value={loading ? loadingSpinner : stats.pendingAdoptions}
          icon={<IoTimeOutline className="text-2xl" />}
          color="yellow"
          link="/admin/adocoes?status=PENDENTE"
        />
        <div className="hidden sm:block">
          <StatsCard
            title="Adoções Aprovadas"
            value={loading ? loadingSpinner : stats.approvedAdoptions}
            icon={<IoCheckmarkCircle className="text-2xl" />}
            color="purple"
            link="/admin/adocoes?status=APROVADO"
          />
        </div>
        <div className="hidden sm:block">
          <StatsCard
            title="Adoções Finalizadas"
            value={loading ? loadingSpinner : stats.finalizedAdoptions}
            icon={<PiFilesFill className="text-2xl" />}
            color="indigo"
            link="/admin/adocoes?status=FINALIZADO"
          />
        </div>
        <div className="hidden sm:block">
          <StatsCard
            title="Adoções em Análise"
            value={loading ? loadingSpinner : stats.underReview}
            icon={<IoSearchOutline className="text-2xl" />}
            color="yellow"
            link="/admin/adocoes?status=EM_ANALISE"
          />
        </div>
        <StatsCard
          title="Total de Animais"
          value={loading ? loadingSpinner : stats.totalPets}
          icon={<MdOutlinePets className="text-2xl" />}
          color="green"
          link="/admin/pets"
        />
        <div className="hidden sm:block">
          <StatsCard
            title="Animais Disponíveis"
            value={loading ? loadingSpinner : stats.available}
            icon={<IoCheckmarkCircle className="text-2xl" />}
            color="green"
            link="/admin/pets?status=disponivel"
          />
        </div>
        <div className="hidden sm:block">
          <StatsCard
            title="Total de Cachorros"
            value={loading ? loadingSpinner : stats.totalDogs}
            icon={<FaDog className="text-2xl" />}
            color="blue"
            link="/admin/pets?tipo=CACHORRO"
          />
        </div>
        <div className="hidden sm:block">
          <StatsCard
            title="Total de Gatos"
            value={loading ? loadingSpinner : stats.totalCats}
            icon={<FaCat className="text-2xl" />}
            color="purple"
            link="/admin/pets?tipo=GATO"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg  p-6">
        <h2 className="text-xl font-semibold mb-4">Solicitações Recentes</h2>
        <div className="max-h-[37.5rem] overflow-y-auto space-y-3 pr-2">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <AiOutlineLoading3Quarters className="animate-spin w-6 h-6 text-gray-500" />
            </div>
          ) : recentAdoptions.length > 0 ? (
            recentAdoptions.map((adoption) => (
              <div
                key={adoption.id}
                className="flex justify-between items-center p-3 border-b cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(`/admin/adocoes/${adoption.id}`)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={adoption.animal?.imagemPath}
                    alt={adoption.animal?.nome || 'Pet'}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">
                      {adoption.animal?.nome || 'Pet'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {adoption.usuario?.nome || 'Adotante'}
                    </p>
                  </div>
                </div>
                <AdocaoStatusBadge status={adoption.status} />
              </div>
            ))
          ) : (
            <p className="text-gray-500">Nenhuma adoção recente</p>
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
    </div>
  );
};

export default AdminDashboard;
