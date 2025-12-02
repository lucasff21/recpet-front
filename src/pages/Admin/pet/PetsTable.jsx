import React, { useEffect, useState, useCallback } from 'react';
import { findAllAnimals } from '../../../services/ApiAdmin';
import { findAllCaracteristicas } from '../../../services/ApiAdocao';
import { showToast } from '../../../utils/toast';
import logo from '../../../assets/logo-pet.png';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { calculateAge } from '../../../utils/pet';
import Pagination from '../../../components/Pagination';
import { GoPlus } from 'react-icons/go';
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Panel from '../../../components/Panel';

const PetsTable = () => {
  document.title = 'Pets | ADMIN';
  const [pets, setPets] = useState([]);
  const [pageData, setPageData] = useState({
    totalPages: 0,
    number: 0,
    totalElements: 0,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const urlNome = searchParams.get('nome') || '';
  const urlSexo = searchParams.get('sexo') || '';
  const urlPorte = searchParams.get('porte') || '';
  const urlTipo = searchParams.get('tipo') || '';
  const urlFaixaEtaria = searchParams.get('faixaEtaria') || '';
  const urlCaracteristicas = searchParams.getAll('caracteristicas');
  const urlDisponivel = searchParams.get('disponivelParaAdocao') || '';
  const urlPage = searchParams.get('page')
    ? Number(searchParams.get('page')) - 1
    : 0;

  const urlCastrado = searchParams.get('castrado') || '';
  const urlVacinado = searchParams.get('vacinado') || '';
  const urlVermifugado = searchParams.get('vermifugado') || '';

  const [filters, setFilters] = useState({
    nome: urlNome,
    sexo: urlSexo,
    porte: urlPorte,
    tipo: urlTipo,
    faixaEtaria: urlFaixaEtaria,
    caracteristicas: urlCaracteristicas,
    disponivelParaAdocao: urlDisponivel,
    page: urlPage,

    castrado: urlCastrado,
    vacinado: urlVacinado,
    vermifugado: urlVermifugado,
  });

  const [localFilters, setLocalFilters] = useState({
    nome: urlNome,
    sexo: urlSexo,
    porte: urlPorte,
    tipo: urlTipo,
    faixaEtaria: urlFaixaEtaria,
    caracteristicas: urlCaracteristicas,
    disponivelParaAdocao: urlDisponivel,

    castrado: urlCastrado,
    vacinado: urlVacinado,
    vermifugado: urlVermifugado,
  });

  const [caracteristicasOptions, setCaracteristicasOptions] = useState([]);
  const [loadingCaracteristicas, setLoadingCaracteristicas] = useState(true);

  useEffect(() => {
    const fetchCaracteristicas = async () => {
      try {
        setLoadingCaracteristicas(true);
        const { data } = await findAllCaracteristicas();
        setCaracteristicasOptions(data);
      } catch (error) {
        showToast('Erro ao carregar características.', 'error');
      } finally {
        setLoadingCaracteristicas(false);
      }
    };
    fetchCaracteristicas();
  }, []);

  const fetchPets = useCallback((currentFilters) => {
    setLoading(true);

    const apiParams = {
      page: currentFilters.page,
      nome: currentFilters.nome,
      sexo: currentFilters.sexo,
      porte: currentFilters.porte,
      tipo: currentFilters.tipo,
      faixaEtaria: currentFilters.faixaEtaria,
      caracteristicas: currentFilters.caracteristicas,
      disponivelParaAdocao: currentFilters.disponivelParaAdocao,

      castrado: currentFilters.castrado,
      vacinado: currentFilters.vacinado,
      vermifugado: currentFilters.vermifugado,
    };

    Object.keys(apiParams).forEach((key) => {
      if (
        (apiParams[key] === '' ||
          apiParams[key] === null ||
          (Array.isArray(apiParams[key]) && apiParams[key].length === 0)) &&
        key !== 'page'
      ) {
        delete apiParams[key];
      }
    });

    findAllAnimals(apiParams)
      .then((response) => {
        const pageResponse = response.data;
        const petsData = pageResponse.content.map((pet) => ({
          ...pet,
          idade: pet.dataNascimentoAproximada
            ? calculateAge(pet.dataNascimentoAproximada)
            : 'Desconhecido',
        }));
        setPets(petsData);
        setPageData({
          totalPages: pageResponse.totalPages,
          number: pageResponse.number,
          totalElements: pageResponse.totalElements,
        });
      })
      .catch(() => {
        showToast('Erro ao carregar pets', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const paramsToSet = {};
    if (filters.nome) paramsToSet.nome = filters.nome;
    if (filters.sexo) paramsToSet.sexo = filters.sexo;
    if (filters.porte) paramsToSet.porte = filters.porte;
    if (filters.tipo) paramsToSet.tipo = filters.tipo;
    if (filters.faixaEtaria) paramsToSet.faixaEtaria = filters.faixaEtaria;
    if (filters.disponivelParaAdocao)
      paramsToSet.disponivelParaAdocao = filters.disponivelParaAdocao;
    if (filters.page > 0) paramsToSet.page = filters.page + 1;

    if (filters.castrado) paramsToSet.castrado = filters.castrado;
    if (filters.vacinado) paramsToSet.vacinado = filters.vacinado;
    if (filters.vermifugado) paramsToSet.vermifugado = filters.vermifugado;

    if (filters.caracteristicas && filters.caracteristicas.length > 0) {
      paramsToSet.caracteristicas = filters.caracteristicas;
    }

    setSearchParams(paramsToSet, { replace: true });
    fetchPets(filters);
  }, [filters, fetchPets, setSearchParams]);

  const handlePageChange = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page: page - 1 }));
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/pets/${id}/editar`);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setLocalFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleCaracteristicasChange = (event) => {
    const { value, checked } = event.target;
    setLocalFilters((prev) => {
      const currentCaracteristicas = prev.caracteristicas || [];
      if (checked) {
        return {
          ...prev,
          caracteristicas: [...currentCaracteristicas, value],
        };
      } else {
        return {
          ...prev,
          caracteristicas: currentCaracteristicas.filter((id) => id !== value),
        };
      }
    });
  };

  const applyFilters = () => {
    setFilters((prev) => ({
      ...prev,
      ...localFilters,
      page: 0,
    }));
  };

  const clearFilters = () => {
    const emptyFilters = {
      nome: '',
      sexo: '',
      porte: '',
      tipo: '',
      faixaEtaria: '',
      caracteristicas: [],
      disponivelParaAdocao: '',
      page: 0,

      castrado: '',
      vacinado: '',
      vermifugado: '',
    };
    setLocalFilters(emptyFilters);
    setFilters(emptyFilters);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  const inputStyle =
    'h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelStyle = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <Panel>
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Pets ({pageData.totalElements})
        </h1>
      </header>

      <div className="py-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Filtros</h2>
          <Link
            to="../criar"
            className="list-group-item list-group-item-action"
          >
            <button className="h-10 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <GoPlus className="h-5 w-5" />
              Adicionar PET
            </button>
          </Link>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="nome" className={labelStyle}>
                Nome
              </label>
              <input
                type="text"
                placeholder="Buscar pelo nome..."
                id="nome"
                name="nome"
                value={localFilters.nome}
                onChange={handleFilterChange}
                onKeyDown={handleSearchKeyDown}
                className={`${inputStyle} w-full`}
              />
            </div>


            <div>
              <label htmlFor="tipo" className={labelStyle}>
                Espécie
              </label>
              <select
                id="tipo"
                name="tipo"
                value={localFilters.tipo}
                onChange={handleFilterChange}
                className={`${inputStyle} w-full`}
              >
                <option value="">Todos</option>
                <option value="CACHORRO">Cachorro</option>
                <option value="GATO">Gato</option>
              </select>
            </div>

            <div>
              <label htmlFor="sexo" className={labelStyle}>
                Sexo
              </label>
              <select
                id="sexo"
                name="sexo"
                value={localFilters.sexo}
                onChange={handleFilterChange}
                className={`${inputStyle} w-full`}
              >
                <option value="">Todos</option>
                <option value="MACHO">Macho</option>
                <option value="FEMEA">Fêmea</option>
              </select>
            </div>

            <div>
              <label htmlFor="porte" className={labelStyle}>
                Porte
              </label>
              <select
                id="porte"
                name="porte"
                value={localFilters.porte}
                onChange={handleFilterChange}
                className={`${inputStyle} w-full`}
              >
                <option value="">Todos</option>
                <option value="PEQUENO">Pequeno</option>
                <option value="MEDIO">Médio</option>
                <option value="GRANDE">Grande</option>
                <option value="GIGANTE">Gigante</option>
              </select>
            </div>

            <div>
              <label htmlFor="faixaEtaria" className={labelStyle}>
                Faixa Etária
              </label>
              <select
                id="faixaEtaria"
                name="faixaEtaria"
                value={localFilters.faixaEtaria}
                onChange={handleFilterChange}
                className={`${inputStyle} w-full`}
              >
                <option value="">Todos</option>
                <option value="FILHOTE">Filhote (0-1 ano)</option>
                <option value="ADOLESCENTE">Adolescente (1-3 anos)</option>
                <option value="ADULTO">Adulto (3-8 anos)</option>
                <option value="IDOSO">Idoso (8+ anos)</option>
              </select>
            </div>

            <div>
              <label htmlFor="disponivelParaAdocao" className={labelStyle}>
                Disponibilidade
              </label>
              <select
                id="disponivelParaAdocao"
                name="disponivelParaAdocao"
                value={localFilters.disponivelParaAdocao}
                onChange={handleFilterChange}
                className={`${inputStyle} w-full`}
              >
                <option value="">Todos</option>
                <option value="true">Disponível</option>
                <option value="false">Não Disponível</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            <div>
              <label htmlFor="castrado" className={labelStyle}>
                Castrado
              </label>
              <select
                id="castrado"
                name="castrado"
                value={localFilters.castrado}
                onChange={handleFilterChange}
                className={`${inputStyle} w-full`}
              >
                <option value="">Todos</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
            <div>
              <label htmlFor="vacinado" className={labelStyle}>
                Vacinado
              </label>
              <select
                id="vacinado"
                name="vacinado"
                value={localFilters.vacinado}
                onChange={handleFilterChange}
                className={`${inputStyle} w-full`}
              >
                <option value="">Todos</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
            <div>
              <label htmlFor="vermifugado" className={labelStyle}>
                Vermifugado
              </label>
              <select
                id="vermifugado"
                name="vermifugado"
                value={localFilters.vermifugado}
                onChange={handleFilterChange}
                className={`${inputStyle} w-full`}
              >
                <option value="">Todos</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t">
            <label className="text-base font-semibold text-gray-700">
              Características
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2 p-4 mt-2 max-h-48 overflow-y-auto">
              {loadingCaracteristicas ? (
                <div className="flex items-center justify-center h-20 col-span-full">
                  <AiOutlineLoading3Quarters className="animate-spin text-xl text-gray-600" />
                  <span className="ml-2">Carregando características...</span>
                </div>
              ) : caracteristicasOptions.length > 0 ? (
                caracteristicasOptions.map((caracteristica) => (
                  <div key={caracteristica.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`caracteristica-filter-${caracteristica.id}`}
                      name="caracteristicas"
                      value={String(caracteristica.id)}
                      checked={localFilters.caracteristicas.includes(
                        String(caracteristica.id)
                      )}
                      onChange={handleCaracteristicasChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`caracteristica-filter-${caracteristica.id}`}
                      className="ml-2 text-sm text-gray-900"
                    >
                      {caracteristica.nome}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 col-span-full">
                  Nenhuma característica disponível.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 pt-4">
            <button
              onClick={applyFilters}
              className="h-10 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
            >
              Aplicar Filtros
            </button>
            <button
              onClick={clearFilters}
              className="h-10 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                #
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nome
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Idade
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Raça
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Sexo
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Disponível para adoção
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ações
              </th>
            </tr>
          </thead>
          {!loading ? (
            <tbody className="bg-white divide-y divide-gray-200">
              {pets.length > 0 ? (
                pets.map((pet) => (
                  <tr
                    key={pet.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/admin/pets/${pet.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {pet.id ?? '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={pet.imagemPath || logo}
                          alt={pet.nome || 'Animal'}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-blue-600">
                            <Link to={`/admin/pets/${pet.id}`}>{pet.nome}</Link>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{pet.idade}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pet.raca || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`${pet.sexo.toLowerCase() === 'macho' ? 'bg-sky-100 text-sky-800' : 'bg-pink-50 text-pink-800'} rounded-full px-3 py-1 text-xs font-bold`}
                      >
                        {pet.sexo.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="flex justify-center">
                        {pet.disponivelParaAdocao ? (
                          <FaCircleCheck color="green" />
                        ) : (
                          <FaCircleXmark color="red" />
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/pets/${pet.id}`);
                        }}
                      >
                        Ver mais
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(pet.id);
                        }}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-gray-500">
                    Nenhum animal encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="9" className="py-10">
                  <div className="flex justify-center items-center">
                    <AiOutlineLoading3Quarters className="animate-spin w-8 h-8 text-gray-500" />
                  </div>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      {pageData.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={pageData.number + 1}
            totalPageCount={pageData.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </Panel>
  );
};

export default PetsTable;
