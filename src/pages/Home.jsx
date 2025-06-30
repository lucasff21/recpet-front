import React, { useState, useEffect, useCallback } from 'react';
import { showToast } from '../utils/toast';
import { cachorroFindAll } from '../services/ApiAdocao';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import PetCard from '../components/Cards/PetCard';
import { calculateAge } from '../utils/pet';
import FilterAccordion from '../components/FilterAccordion';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const TEMPERAMENT_CHARACTERISTICS = [
  'Brincalhão',
  'Calmo',
  'Sociável',
  'Tímido',
  'Gosta de crianças',
  'Muita Energia',
  'Late Bastante',
  'Protetor',
  'Quieto',
  'Hipoalergênico',
  'Necessidade de Correr',
  'Queda de Pelo',
  'Tende a Latir',
];

const Home = () => {
  const [filteredDogs, setFilteredDogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    name: '',
    size: '',
    ageGroup: '',
    gender: '',
    temperament: [],
    page: 0,
  });

  const [tempFilters, setTempFilters] = useState(filters);

  const [accordionOpen, setAccordionOpen] = useState({
    nome: false,
    porte: true,
    idade: true,
    genero: true,
    temperamento: true,
  });

  const toggleAccordion = (key) => {
    setAccordionOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const openPagePet = useCallback(
    (id) => {
      const pet = filteredDogs.find((p) => p.id === id);
      if (pet) {
        navigate(`/pets/${pet.id}`);
      }
    },
    [filteredDogs, navigate]
  );

  const handleTempFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleTemperamentChange = useCallback((e) => {
    const { id, checked } = e.target;
    const temperamentName = id.replace('temperament-', '');

    setTempFilters((prev) => {
      const currentTemperaments = Array.isArray(prev.temperament)
        ? prev.temperament
        : [];
      if (checked) {
        return {
          ...prev,
          temperament: [...currentTemperaments, temperamentName],
        };
      } else {
        return {
          ...prev,
          temperament: currentTemperaments.filter(
            (temp) => temp !== temperamentName
          ),
        };
      }
    });
  }, []);

  const applyFilters = useCallback(() => {
    setFilters((prevFilters) => ({
      ...tempFilters,
      page: 0,
    }));
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

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        let caracteristicas = null;

        if (filters.temperament.length > 0) {
          caracteristicas = filters.temperament.join(',');
        }

        const apiParams = {
          nome: filters.name,
          porte: filters.size,
          faixaEtaria: filters.ageGroup,
          sexo: filters.gender,
          caracteristicas: caracteristicas,
          page: filters.page,
        };

        Object.keys(apiParams).forEach(
          (key) =>
            (apiParams[key] === '' ||
              apiParams[key] === undefined ||
              apiParams[key] === null) &&
            delete apiParams[key]
        );

        const response = await cachorroFindAll(apiParams);

        if (!ignore) {
          const dogs = response.data.content.map((pet) => ({
            ...pet,
            idade: pet.dataNascimentoAproximada
              ? calculateAge(pet.dataNascimentoAproximada)
              : 'Desconhecida',
          }));

          setFilteredDogs(dogs);
        }
      } catch (err) {
        if (!ignore) {
          setError('Erro ao carregar a lista de cães. Tente novamente.');
          showToast('Erro ao carregar pets', 'error');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [filters]);

  return (
    <Layout>
      <div className="pt-[80px] px-4 max-w-7xl mx-auto w-full sm:px-6 md:pt-6">
        <div className="bg-blue-50 p-6 rounded-lg mb-8 mx-auto max-w-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center sm:text-2xl md:text-3xl">
            Cãezinhos à Espera de um Lar
          </h2>
          <p className="text-center text-gray-600 m-0 text-sm sm:text-base">
            Aqui você encontra todos os nossos cãezinhos disponíveis para
            adoção. Cada um com sua história, seu jeitinho único e esperando a
            chance de fazer parte da sua vida. Conheça, se encante e transforme
            o mundo de um peludo — e o seu também.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-6">
          <aside
            className={`fixed inset-y-0 left-0 z-40 w-64 bg-white p-6 lg:p-2 transform ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:relative lg:translate-x-0 lg:flex-shrink-0 transition-transform duration-300 ease-in-out overflow-y-auto`}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 hidden lg:block">
              FILTRE POR
            </h2>
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h2 className="text-xl font-bold text-gray-800">FILTRE POR</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="space-y-0">
              <FilterAccordion
                title="NOME"
                isOpen={accordionOpen.nome}
                toggleOpen={() => toggleAccordion('nome')}
              >
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={tempFilters.name}
                  onChange={handleTempFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 mt-2"
                  placeholder="Buscar por nome..."
                />
              </FilterAccordion>
              <FilterAccordion
                title="PORTE"
                isOpen={accordionOpen.porte}
                toggleOpen={() => toggleAccordion('porte')}
              >
                <select
                  id="size"
                  name="size"
                  value={tempFilters.size}
                  onChange={handleTempFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 mt-2"
                >
                  <option value="">Todos</option>
                  <option value="PEQUENO">Pequeno</option>
                  <option value="MEDIO">Médio</option>
                  <option value="GRANDE">Grande</option>
                  <option value="GIGANTE">Gigante</option>
                </select>
              </FilterAccordion>
              <FilterAccordion
                title="IDADE"
                isOpen={accordionOpen.idade}
                toggleOpen={() => toggleAccordion('idade')}
              >
                <select
                  id="ageGroup"
                  name="ageGroup"
                  value={tempFilters.ageGroup}
                  onChange={handleTempFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 mt-2"
                >
                  <option value="">Todos</option>
                  {/* Os valores devem corresponder exatamente aos esperados pela API */}
                  <option value="FILHOTE">Filhote (0-1 ano)</option>
                  <option value="ADOLESCENTE">Adolescente (1-3 anos)</option>
                  <option value="ADULTO">Adulto (3-8 anos)</option>
                  <option value="IDOSO">Idoso (8+ anos)</option>
                </select>
              </FilterAccordion>
              <FilterAccordion
                title="GÊNERO"
                isOpen={accordionOpen.genero}
                toggleOpen={() => toggleAccordion('genero')}
              >
                <select
                  id="gender"
                  name="gender"
                  value={tempFilters.gender}
                  onChange={handleTempFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 mt-2"
                >
                  <option value="">Todos</option>
                  <option value="MACHO">Macho</option>
                  <option value="FEMEA">Fêmea</option>
                </select>
              </FilterAccordion>
              <FilterAccordion
                title="TEMPERAMENTO"
                isOpen={accordionOpen.temperamento}
                toggleOpen={() => toggleAccordion('temperamento')}
              >
                <div className="space-y-2 mt-2">
                  {TEMPERAMENT_CHARACTERISTICS.map((charName) => (
                    <div key={charName} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`temperament-${charName}`}
                        name={`temperament-${charName}`}
                        checked={tempFilters.temperament.includes(charName)}
                        onChange={handleTemperamentChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`temperament-${charName}`}
                        className="ml-2 text-sm text-gray-900"
                      >
                        {charName}
                      </label>
                    </div>
                  ))}
                </div>
              </FilterAccordion>
            </div>
            <div className="mt-8 flex flex-col space-y-3">
              <button
                onClick={applyFilters}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-semibold"
              >
                Aplicar Filtros
              </button>
              <button
                onClick={clearFilters}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200"
              >
                Limpar Filtros
              </button>
            </div>
          </aside>

          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}

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
            {loading && (
              <div className="flex justify-center items-center h-48">
                <AiOutlineLoading3Quarters className="animate-spin w-8 h-8" />
                <p className="ml-4 text-gray-600">Carregando cãezinhos...</p>
              </div>
            )}
            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <strong className="font-bold">Erro:</strong>
                <span className="block sm:inline"> {error} </span>
              </div>
            )}
            {!loading && !error && filteredDogs.length === 0 ? (
              <p className="text-center text-gray-600 text-lg py-10">
                Nenhum cãozinho encontrado com os filtros selecionados.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-0 justify-items-center">
                {filteredDogs.map((dog) => (
                  <PetCard key={dog.id} pet={dog} openPagePet={openPagePet} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
