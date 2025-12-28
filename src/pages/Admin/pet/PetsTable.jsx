import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { GoSearch, GoPlus, GoChevronDown } from 'react-icons/go';
import { FaFilter, FaDog, FaCat } from 'react-icons/fa6';
import { findAllAnimals } from '../../../services/ApiAdmin';
import { getFiltros } from '../../../services/ApiAdocao';
import { showToast } from '../../../utils/toast';
import { calculateAge } from '../../../utils/pet';
import Pagination from '../../../components/Pagination';
import Panel from '../../../components/Panel';
import logo from '../../../assets/logo-pet.png';

const PetsTable = () => {
  document.title = 'Pets | ADMIN';
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [pageData, setPageData] = useState({
    totalPages: 0,
    number: 0,
    totalElements: 0,
  });

  const [metadata, setMetadata] = useState({
    caracteristicas: [],
    racas: [],
    cores: [],
  });

  const [localFilters, setLocalFilters] = useState({
    nome: searchParams.get('nome') || '',
    microchip: searchParams.get('microchip') || '',
    rg: searchParams.get('rg') || '',
    tipo: searchParams.get('tipo') || '',
    sexo: searchParams.get('sexo') || '',
    disponivelParaAdocao: searchParams.get('disponivelParaAdocao') || '',
    castrado: searchParams.get('castrado') || '',
    vacinado: searchParams.get('vacinado') || '',
    vermifugado: searchParams.get('vermifugado') || '',
    porte: searchParams.get('porte')
      ? searchParams.get('porte').split(',')
      : [],
    faixaEtaria: searchParams.get('faixaEtaria')
      ? searchParams.get('faixaEtaria').split(',')
      : [],
    caracteristicas: searchParams.get('caracteristicas')
      ? searchParams.get('caracteristicas').split(',').map(Number)
      : [],
    racaId: searchParams.get('racaId')
      ? searchParams.get('racaId').split(',').map(Number)
      : [],
    corId: searchParams.get('corId')
      ? searchParams.get('corId').split(',').map(Number)
      : [],
  });

  useEffect(() => {
    getFiltros()
      .then((res) => setMetadata(res.data))
      .catch(() => showToast('Erro ao carregar metadados', 'error'));
  }, []);

  const fetchPets = useCallback(() => {
    setLoading(true);
    const params = Object.fromEntries([...searchParams]);
    findAllAnimals(params)
      .then((response) => {
        const pageResponse = response.data;
        setPets(
          pageResponse.content.map((p) => ({
            ...p,
            idade: p.dataNascimentoAproximada
              ? calculateAge(p.dataNascimentoAproximada)
              : 'Desconhecido',
          }))
        );
        setPageData({
          totalPages: pageResponse.totalPages,
          number: pageResponse.number,
          totalElements: pageResponse.totalElements,
        });
      })
      .catch(() => showToast('Erro ao carregar pets', 'error'))
      .finally(() => setLoading(false));
  }, [searchParams]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name, id, checked) => {
    setLocalFilters((prev) => ({
      ...prev,
      [name]: checked
        ? [...prev[name], id]
        : prev[name].filter((item) => item !== id),
    }));
  };

  const handleToggle = (name, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [name]: prev[name] === value ? '' : value,
    }));
  };

  const applyFilters = () => {
    const params = {};
    Object.keys(localFilters).forEach((key) => {
      if (Array.isArray(localFilters[key])) {
        if (localFilters[key].length > 0)
          params[key] = localFilters[key].join(',');
      } else if (localFilters[key] !== '') {
        params[key] = localFilters[key];
      }
    });
    setSearchParams(params);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') applyFilters();
  };

  const clearFilters = () => {
    const empty = {
      nome: '',
      microchip: '',
      rg: '',
      tipo: '',
      sexo: '',
      disponivelParaAdocao: '',
      castrado: '',
      vacinado: '',
      vermifugado: '',
      porte: [],
      faixaEtaria: [],
      caracteristicas: [],
      racaId: [],
      corId: [],
    };
    setLocalFilters(empty);
    setSearchParams({});
  };

  const getFaixaEtariaLabel = (key) => {
    switch (key) {
      case 'FILHOTE':
        return 'Filhote (0-1 ano)';
      case 'ADOLESCENTE':
        return 'Adolescente (1-3 anos)';
      case 'ADULTO':
        return 'Adulto (3-8 anos)';
      case 'IDOSO':
        return 'Idoso (8+ anos)';
      default:
        return key;
    }
  };

  const Badge = ({ active, children, onClick }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all shadow-sm ${
        active
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
      }`}
    >
      {children}
    </button>
  );

  return (
    <Panel className="bg-transparent">
      <div className="mx-auto pb-10">
        <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Pets Registrados
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Total de {pageData.totalElements} animais encontrados
            </p>
          </div>
          <Link to="../criar">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition-all font-medium text-sm w-full md:w-auto justify-center">
              <GoPlus size={18} />
              Adicionar Novo Pet
            </button>
          </Link>
        </header>

        <div className="bg-white rounded-xl border border-gray-300 mb-6 overflow-visible relative z-10">
          <div className="p-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:w-96">
              <GoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
              <input
                type="text"
                name="nome"
                value={localFilters.nome}
                onChange={handleFilterChange}
                onKeyDown={handleSearchKeyDown}
                placeholder="Buscar por nome..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-400 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-500"
              />
            </div>

            <div className="flex w-full lg:w-auto items-center gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              <select
                name="tipo"
                value={localFilters.tipo}
                onChange={handleFilterChange}
                className="bg-white border border-gray-400 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 min-w-[120px] font-medium cursor-pointer"
              >
                <option value="">Todas Espécies</option>
                <option value="CACHORRO">Cachorro</option>
                <option value="GATO">Gato</option>
              </select>

              <select
                name="disponivelParaAdocao"
                value={localFilters.disponivelParaAdocao}
                onChange={handleFilterChange}
                className="bg-white border border-gray-400 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 min-w-[140px] font-medium cursor-pointer"
              >
                <option value="">Todos</option>
                <option value="true">Disponível</option>
                <option value="false">Indisponível</option>
              </select>

              <button
                onClick={applyFilters}
                className="bg-blue-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
              >
                Filtrar
              </button>

              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-bold rounded-lg border transition-all whitespace-nowrap ${
                  showAdvancedFilters
                    ? 'bg-blue-600 border-blue-700 text-white'
                    : 'bg-white border-gray-400 text-black hover:bg-gray-100'
                }`}
              >
                <FaFilter size={14} />
                <GoChevronDown
                  size={14}
                  className={`transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
          </div>

          {showAdvancedFilters && (
            <div className="p-5 border-gray-300 animate-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                    Identificação & Saúde
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="microchip"
                      value={localFilters.microchip}
                      onChange={handleFilterChange}
                      placeholder="Microchip"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-400 text-black rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-500"
                    />
                    <input
                      type="text"
                      name="rg"
                      value={localFilters.rg}
                      onChange={handleFilterChange}
                      placeholder="RG"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-400 text-black rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-500"
                    />

                    <div>
                      <label className="text-xs text-black font-bold mb-1.5 block">
                        Sexo
                      </label>
                      <div className="flex gap-2">
                        <Badge
                          active={localFilters.sexo === 'MACHO'}
                          onClick={() => handleToggle('sexo', 'MACHO')}
                        >
                          Macho
                        </Badge>
                        <Badge
                          active={localFilters.sexo === 'FEMEA'}
                          onClick={() => handleToggle('sexo', 'FEMEA')}
                        >
                          Fêmea
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-black font-bold mb-1.5 block">
                        Saúde
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          active={localFilters.castrado === 'true'}
                          onClick={() => handleToggle('castrado', 'true')}
                        >
                          Castrado
                        </Badge>
                        <Badge
                          active={localFilters.castrado === 'false'}
                          onClick={() => handleToggle('castrado', 'false')}
                        >
                          Não Castrado
                        </Badge>

                        <Badge
                          active={localFilters.vacinadoAntirrabica === 'true'}
                          onClick={() =>
                            handleToggle('vacinadoAntirrabica', 'true')
                          }
                        >
                          Antirrábica
                        </Badge>
                        <Badge
                          active={localFilters.vacinadoAntirrabica === 'false'}
                          onClick={() =>
                            handleToggle('vacinadoAntirrabica', 'false')
                          }
                        >
                          Não Antirrábica
                        </Badge>

                        <Badge
                          active={localFilters.vacinadoMultipla === 'true'}
                          onClick={() =>
                            handleToggle('vacinadoMultipla', 'true')
                          }
                        >
                          Múltipla
                        </Badge>
                        <Badge
                          active={localFilters.vacinadoMultipla === 'false'}
                          onClick={() =>
                            handleToggle('vacinadoMultipla', 'false')
                          }
                        >
                          Não Múltipla
                        </Badge>

                        <Badge
                          active={localFilters.vermifugado === 'true'}
                          onClick={() => handleToggle('vermifugado', 'true')}
                        >
                          Vermifugado
                        </Badge>
                        <Badge
                          active={localFilters.vermifugado === 'false'}
                          onClick={() => handleToggle('vermifugado', 'false')}
                        >
                          Não Vermifugado
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-black uppercase tracking-widest">
                    Características & Comportamento
                  </h3>

                  <div>
                    <label className="text-xs text-black font-bold mb-1 block">
                      Porte
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['PEQUENO', 'MEDIO', 'GRANDE', 'GIGANTE'].map((p) => (
                        <Badge
                          key={p}
                          active={localFilters.porte.includes(p)}
                          onClick={() =>
                            handleCheckboxChange(
                              'porte',
                              p,
                              !localFilters.porte.includes(p)
                            )
                          }
                        >
                          {p.charAt(0) + p.slice(1).toLowerCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-black font-bold mb-1 block">
                      Faixa Etária
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['FILHOTE', 'ADOLESCENTE', 'ADULTO', 'IDOSO'].map(
                        (f) => (
                          <Badge
                            key={f}
                            active={localFilters.faixaEtaria.includes(f)}
                            onClick={() =>
                              handleCheckboxChange(
                                'faixaEtaria',
                                f,
                                !localFilters.faixaEtaria.includes(f)
                              )
                            }
                          >
                            {getFaixaEtariaLabel(f)}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-black font-bold mb-1 block">
                      Temperamento
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                      {metadata.caracteristicas.map((c) => (
                        <Badge
                          key={c.id}
                          active={localFilters.caracteristicas.includes(c.id)}
                          onClick={() =>
                            handleCheckboxChange(
                              'caracteristicas',
                              c.id,
                              !localFilters.caracteristicas.includes(c.id)
                            )
                          }
                        >
                          {c.nome}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-4">
                      Aparência
                    </h3>

                    <div className="mb-4">
                      <label className="text-xs text-black font-bold mb-1 block">
                        Raças
                      </label>
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                        {!localFilters.tipo ? (
                          <p className="text-xs text-red-600 font-bold italic w-full">
                            Selecione a Espécie primeiro
                          </p>
                        ) : (
                          metadata.racas
                            .filter((r) => r.especie === localFilters.tipo)
                            .map((r) => (
                              <Badge
                                key={r.id}
                                active={localFilters.racaId.includes(r.id)}
                                onClick={() =>
                                  handleCheckboxChange(
                                    'racaId',
                                    r.id,
                                    !localFilters.racaId.includes(r.id)
                                  )
                                }
                              >
                                {r.nome}
                              </Badge>
                            ))
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-black font-bold mb-1 block">
                        Cores
                      </label>
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                        {metadata.cores.map((c) => (
                          <Badge
                            key={c.id}
                            active={localFilters.corId.includes(c.id)}
                            onClick={() =>
                              handleCheckboxChange(
                                'corId',
                                c.id,
                                !localFilters.corId.includes(c.id)
                              )
                            }
                          >
                            {c.nome}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-8 gap-3 mt-auto">
                    <button
                      onClick={clearFilters}
                      className="text-sm text-black font-bold hover:text-red-600 underline whitespace-nowrap transition-colors"
                    >
                      Limpar Filtros
                    </button>
                    <button
                      onClick={applyFilters}
                      className="flex-1 bg-blue-600 text-white text-xs font-bold px-4 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95 max-w-64"
                    >
                      FILTRAR
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative z-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Animal
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Sexo
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Espécie
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Idade
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                    Disponível
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-20 text-center text-gray-400">
                      Carregando...
                    </td>
                  </tr>
                ) : pets.length > 0 ? (
                  pets.map((pet) => (
                    <tr
                      key={pet.id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={pet.imagemPath || logo}
                            alt={pet.nome}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                          />
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">
                              {pet.nome}
                            </div>
                            <div className="text-xs text-gray-500">
                              {pet.raca?.nome || 'SRD'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                            pet.sexo === 'MACHO'
                              ? 'bg-blue-50 text-blue-700 border border-blue-100'
                              : 'bg-pink-50 text-pink-700 border border-pink-100'
                          }`}
                        >
                          {pet.sexo === 'MACHO' ? 'Macho' : 'Fêmea'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          {pet.tipo === 'CACHORRO' ? (
                            <FaDog size={14} />
                          ) : (
                            <FaCat size={14} />
                          )}
                          <span className="capitalize">
                            {pet.tipo?.toLowerCase()}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {pet.idade}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {pet.disponivelParaAdocao ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                            Sim
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                            Não
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/pets/${pet.id}`)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                            title="Ver Detalhes"
                          >
                            <span className="text-xs font-medium hidden sm:inline">
                              Ver mais
                            </span>
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/admin/pets/${pet.id}/editar`)
                            }
                            className="p-1.5 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-1"
                            title="Editar"
                          >
                            <span className="text-xs font-medium hidden sm:inline">
                              Editar
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <GoSearch size={48} className="mb-4 opacity-20" />
                        <p>Nenhum pet encontrado com os filtros atuais.</p>
                        <button
                          onClick={clearFilters}
                          className="mt-2 text-blue-600 text-sm hover:underline"
                        >
                          Limpar todos os filtros
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pageData.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex justify-center bg-gray-50">
              <Pagination
                currentPage={pageData.number + 1}
                totalPageCount={pageData.totalPages}
                onPageChange={(p) =>
                  setSearchParams({
                    ...Object.fromEntries([...searchParams]),
                    page: p - 1,
                  })
                }
              />
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
};

export default PetsTable;
