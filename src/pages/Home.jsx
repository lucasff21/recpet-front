import React, { useState, useEffect, useCallback } from 'react';
import { showToast } from '../utils/toast';
import { findAllAnimals, findAllCaracteristicas } from '../services/ApiAdocao';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PetCard from '../components/Cards/PetCard';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';
import { calculateAge } from '../utils/pet';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const Home = () => {
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [pageData, setPageData] = useState({
    totalPages: 0,
    number: 0,
  });

  const [allTemperaments, setAllTemperaments] = useState([]);
  const [temperamentsLoading, setTemperamentsLoading] = useState(true);
  const [temperamentsError, setTemperamentsError] = useState(null);

  const [filters, setFilters] = useState({
    name: '',
    size: '',
    ageGroup: '',
    gender: '',
    temperament: [],
    page: 0,
  });

  const [tempFilters, setTempFilters] = useState(filters);

  useEffect(() => {
    const fetchTemperaments = async () => {
      try {
        setTemperamentsLoading(true);
        const { data } = await findAllCaracteristicas();
        setAllTemperaments(data);
        setTemperamentsError(null);
      } catch (err) {
        setTemperamentsError('Não foi possível carregar as opções de filtro.');
        showToast('Erro ao carregar filtros', 'error');
      } finally {
        setTemperamentsLoading(false);
      }
    };
    fetchTemperaments();
  }, []);

  const openPageAnimal = useCallback(
    (id) => {
      navigate(`/pets/${id}`);
    },
    [navigate]
  );

  const handleTempFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleTemperamentChange = useCallback((temperamentId, isChecked) => {
    setTempFilters((prev) => {
      const currentTemperaments = prev.temperament;
      if (isChecked) {
        return {
          ...prev,
          temperament: [...currentTemperaments, temperamentId],
        };
      } else {
        return {
          ...prev,
          temperament: currentTemperaments.filter((id) => id !== temperamentId),
        };
      }
    });
  }, []);

  const applyFilters = useCallback(() => {
    setFilters({ ...tempFilters, page: 0 });
    setIsSidebarOpen(false);
  }, [tempFilters]);

  const clearFilters = useCallback(() => {
    const defaultFilters = {
      name: '',
      size: '',
      ageGroup: '',
      gender: '',
      temperament: [],
      page: 0,
    };
    setFilters(defaultFilters);
    setTempFilters(defaultFilters);
    setIsSidebarOpen(false);
  }, []);

  const handlePageChange = useCallback((page) => {
    setFilters((prevFilters) => ({ ...prevFilters, page: page - 1 }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const caracteristicasIds =
          filters.temperament.length > 0 ? filters.temperament.join(',') : null;
        const apiParams = {
          nome: filters.name,
          porte: filters.size,
          faixaEtaria: filters.ageGroup,
          sexo: filters.gender,
          caracteristicasIds: caracteristicasIds,
          page: filters.page,
        };

        Object.keys(apiParams).forEach(
          (key) =>
            (apiParams[key] === '' || apiParams[key] == null) &&
            delete apiParams[key]
        );

        const response = await findAllAnimals(apiParams);

        const animals = response.data.content.map((animal) => ({
          ...animal,
          idade: animal.dataNascimentoAproximada
            ? calculateAge(animal.dataNascimentoAproximada)
            : 'Desconhecida',
        }));

        setFilteredAnimals(animals);
        setPageData({
          totalPages: response.data.totalPages,
          number: response.data.number,
        });
      } catch (err) {
        setError('Erro ao carregar a lista de animais. Tente novamente.');
        showToast('Erro ao carregar animais', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  return (
    <Layout>
      <div className="pt-[80px] px-4 max-w-7xl mx-auto w-full sm:px-6 md:pt-6">
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

        <div className="flex flex-col lg:flex-row lg:space-x-6">
          <FilterSidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            tempFilters={tempFilters}
            handleTempFilterChange={handleTempFilterChange}
            handleTemperamentChange={handleTemperamentChange}
            applyFilters={applyFilters}
            clearFilters={clearFilters}
            allTemperaments={allTemperaments}
            temperamentsLoading={temperamentsLoading}
            temperamentsError={temperamentsError}
          />

          <div className="flex-1">
            <div className="flex justify-end pb-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-200 flex items-center justify-center space-x-2 lg:hidden sm:w-auto"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM4 10a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM4 16a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"
                  ></path>
                </svg>
                <span>Filtros</span>
              </button>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <AiOutlineLoading3Quarters className="animate-spin w-8 h-8" />
                <p className="ml-4 text-gray-600">Carregando animais...</p>
              </div>
            ) : error ? (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <strong className="font-bold">Erro:</strong>
                <span className="block sm:inline"> {error} </span>
              </div>
            ) : filteredAnimals.length === 0 ? (
              <p className="text-center text-gray-600 text-lg py-10">
                Nenhum animal encontrado com os filtros selecionados.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-0 justify-items-center">
                  {filteredAnimals.map((animal) => (
                    <PetCard
                      key={animal.id}
                      pet={animal}
                      openPagePet={openPageAnimal}
                    />
                  ))}
                </div>

                {pageData.totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <Pagination
                      currentPage={pageData.number + 1}
                      totalPageCount={pageData.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
