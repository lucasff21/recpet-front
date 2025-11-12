import React, { useEffect, useState, useCallback } from 'react';
import { getAdminMetrics, getAllAdoptions } from '../../../services/ApiAdmin';
import StatsCard from '../dashboard/StatsCard';
import { FaUser, FaDog, FaCat, FaUsers } from 'react-icons/fa';
import { MdOutlinePets } from 'react-icons/md';
import { PiFilesFill } from 'react-icons/pi';
import { IoTimeOutline, IoCheckmarkCircle, IoSearchOutline } from 'react-icons/io5';
import { showToast } from '../../../utils/toast';

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
  
  

  const [recentAdoptions, setRecentAdoptions] = useState([]);

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
      const [getAdminMetricsResponse, allAdoptions] = await Promise.all([
        getAdminMetrics(),
        fetchAllPages(getAllAdoptions, 50, { sortByDate: 'desc' }),
      ]);
      const adminMetrics = getAdminMetricsResponse.data
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
        showToast('Erro ao carregar dados do dashboard. Tente novamente.', 'error');
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 auto-rows-fr">
        <StatsCard
          title="Total de Usuários"
          value={stats.totalUsers}
          icon={<FaUser className="text-2xl" />}
          color="blue"
          link="/admin/usuarios"
        />
        <StatsCard
          title="Total de Animais"
          value={stats.totalPets}
          icon={<MdOutlinePets className="text-2xl" />}
          color="green"
          link="/admin/pets"
        />
        <StatsCard
          title="Adoções Pendentes"
          value={stats.pendingAdoptions}
          icon={<IoTimeOutline className="text-2xl" />}
          color="yellow"
          link="/admin/adocoes?status=PENDENTE"
        />
        <div className="hidden sm:block">
          <StatsCard
            title="Adoções Aprovadas"
            value={stats.approvedAdoptions}
            icon={<IoCheckmarkCircle className="text-2xl" />}
            color="purple"
            link="/admin/adocoes?status=APROVADO"
          />
        </div>
        <div className="hidden sm:block">
          <StatsCard
            title="Adoções Finalizadas"
            value={stats.finalizedAdoptions}
            icon={<PiFilesFill className="text-2xl" />}
            color="indigo"
            link="/admin/adocoes?status=FINALIZADO"
          />
        </div>
        <div className="hidden sm:block">
          <StatsCard
            title="Animais Disponíveis"
            value={stats.available}
            icon={<IoCheckmarkCircle className="text-2xl" />}
            color="green"
            link="/admin/pets?status=disponivel"
          />
        </div>
        <div className="hidden sm:block">
          <StatsCard
            title="Total de Cachorros"
            value={stats.totalDogs}
            icon={<FaDog className="text-2xl" />}
            color="blue"
            link="/admin/pets?tipo=CACHORRO"
          />
        </div>
        <div className="hidden sm:block">
          <StatsCard
            title="Total de Gatos"
            value={stats.totalCats}
            icon={<FaCat className="text-2xl" />}
            color="purple"
            link="/admin/pets?tipo=GATO"
          />
        </div>
        <div className="hidden sm:block">
          <StatsCard
            title="Adoções em Análise"
            value={stats.underReview}
            icon={<IoSearchOutline className="text-2xl" />}
            color="yellow"
            link="/admin/adocoes?status=EM_ANALISE"
          />
        </div>
        <div className="hidden sm:block">
          <StatsCard
            title="Total de Adotantes"
            value={stats.totalAdopters}
            icon={<FaUsers className="text-2xl" />}
            color="indigo"
            link="/admin/usuarios?tipo=adotante"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg  p-6">
        <h2 className="text-xl font-semibold mb-4">Solicitações Recentes</h2>
        <div className="max-h-[37.5rem] overflow-y-auto space-y-3 pr-2">
          {recentAdoptions.length > 0 ? (
            recentAdoptions.map((adoption) => (
              <div key={adoption.id} className="flex justify-between items-center p-3 border-b">
                <div className="flex items-center gap-3">
                  <img
                    src={adoption.animal?.imagemPath}
                    alt={adoption.animal?.nome || 'Pet'}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{adoption.animal?.nome || 'Pet'}</p>
                    <p className="text-sm text-gray-500">{adoption.usuario?.nome || 'Adotante'}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    adoption.status === 'PENDENTE'
                      ? 'bg-yellow-100 text-yellow-800'
                      : adoption.status === 'APROVADO'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {adoption.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Nenhuma adoção recente</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
