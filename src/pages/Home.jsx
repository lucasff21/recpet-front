import React, { useState, useEffect, useCallback } from 'react';
import { showToast } from '../utils/toast';
import { findAllAnimals, getFiltros } from '../services/ApiAdocao';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import PetCard from '../components/Cards/PetCard';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';
import { calculateAge } from '../utils/pet';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useAdoptions } from '../contexts/AdoptionContext';

const createParamsFromFilters = (filters) => {
  const params = {
    nome: filters.name,
    porte: filters.size.join(','),
    faixaEtaria: filters.ageGroup.join(','),
    sexo: filters.gender.join(','),
    caracteristicasIds: filters.temperament.join(','),
    tipo: filters.species,
    castrado: filters.castrado,
    vacinado: filters.vacinado,
    microchip: filters.microchip,
    racaId: filters.racaId.join(','),
    corId: filters.corId.join(','),
    page: filters.page.toString(),
  };

  Object.keys(params).forEach((key) => !params[key] && delete params[key]);
  if (params.page === '0') delete params.page;
  return params;
};

const getFiltersFromParams = (searchParams) => ({
  name: searchParams.get('nome') || '',
  size: searchParams.get('porte') ? searchParams.get('porte').split(',') : [],
  ageGroup: searchParams.get('faixaEtaria')
    ? searchParams.get('faixaEtaria').split(',')
    : [],
  gender: searchParams.get('sexo') ? searchParams.get('sexo').split(',') : [],
  temperament: searchParams.get('caracteristicasIds')
    ? searchParams.get('caracteristicasIds').split(',').map(Number)
    : [],
  species: searchParams.get('tipo') || '',
  castrado: searchParams.get('castrado') || '',
  vacinado: searchParams.get('vacinado') || '',
  microchip: searchParams.get('microchip') || '',
  racaId: searchParams.get('racaId')
    ? searchParams.get('racaId').split(',').map(Number)
    : [],
  corId: searchParams.get('corId')
    ? searchParams.get('corId').split(',').map(Number)
    : [],
  page: Number(searchParams.get('page')) || 0,
});

const Home = () => {
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState({
    caracteristicas: [],
    racas: [],
    cores: [],
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageData, setPageData] = useState({ totalPages: 0, number: 0 });
  const navigate = useNavigate();
  const { pendingAnimalIds } = useAdoptions();

  const [tempFilters, setTempFilters] = useState(() =>
    getFiltersFromParams(searchParams)
  );

  useEffect(() => {
    getFiltros()
      .then((res) => setMetadata(res.data))
      .catch(() => showToast('Erro ao carregar filtros', 'error'));
  }, []);

  useEffect(() => {
    setTempFilters(getFiltersFromParams(searchParams));
  }, [searchParams]);

  const handleTempFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleMultiSelectChange = useCallback((name, id, checked) => {
    setTempFilters((prev) => {
      const current = prev[name];
      const next = checked
        ? [...current, id]
        : current.filter((item) => item !== id);
      return { ...prev, [name]: next };
    });
  }, []);

  const handleBooleanChange = useCallback((name, checked) => {
    setTempFilters((prev) => ({
      ...prev,
      [name]: checked ? 'true' : '',
    }));
  }, []);

  const applyFilters = () => {
    setSearchParams(createParamsFromFilters({ ...tempFilters, page: 0 }));
    setIsSidebarOpen(false);
  };

  const clearFilters = () => {
    const empty = {
      name: '',
      size: [],
      ageGroup: [],
      gender: [],
      temperament: [],
      species: '',
      castrado: '',
      vacinado: '',
      microchip: '',
      racaId: [],
      corId: [],
      page: 0,
    };
    setTempFilters(empty);
    setSearchParams({});
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = Object.fromEntries([...searchParams]);
        const response = await findAllAnimals(params);

        setFilteredAnimals(
          response.data.content.map((a) => ({
            ...a,
            idade: a.dataNascimentoAproximada
              ? calculateAge(a.dataNascimentoAproximada)
              : 'Desconhecida',
          }))
        );
        setPageData({
          totalPages: response.data.totalPages,
          number: response.data.number,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  return (
    <Layout>
      <div className="pt-[80px] sm:pt-[40px] px-4 max-w-[1400px] mx-auto w-full">
        <div className="bg-blue-50 p-6 rounded-lg mb-8 mx-auto max-w-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center sm:text-2xl md:text-3xl">
            Animais à Espera de um Lar
          </h2>
          <p className="text-center text-gray-600 m-0 text-sm sm:text-base">
            Aqui você encontra todos os nossos animais disponíveis para adoção.
            Cada um com sua história, seu jeitinho único e esperando a chance de
            fazer parte da sua vida.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-6">
          <FilterSidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            tempFilters={tempFilters}
            handleTempFilterChange={handleTempFilterChange}
            handleMultiSelectChange={handleMultiSelectChange}
            handleBooleanChange={handleBooleanChange}
            applyFilters={applyFilters}
            clearFilters={clearFilters}
            metadata={metadata}
          />
          <div className="flex-1">
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin mx-auto mt-20" />
            ) : filteredAnimals.length === 0 ? (
              <p className="text-center mt-20 text-gray-600">
                Nenhum animal encontrado com os filtros selecionados.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAnimals.map((animal) => (
                  <PetCard
                    key={animal.id}
                    pet={animal}
                    openPagePet={(id) => navigate(`/pets/${id}`)}
                    isPending={pendingAnimalIds.has(animal.id)}
                  />
                ))}
              </div>
            )}
            <Pagination
              currentPage={pageData.number + 1}
              totalPageCount={pageData.totalPages}
              onPageChange={(p) =>
                setSearchParams(
                  createParamsFromFilters({ ...tempFilters, page: p - 1 })
                )
              }
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Home;
