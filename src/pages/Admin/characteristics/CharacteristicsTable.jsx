import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Panel from '../../../components/Panel';
import { useCharacteristics } from '../../../hooks/useCharacteristics';
import { GoPlus, GoSearch } from 'react-icons/go';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const CharacteristicsTable = () => {
  const { items, loading, filterName, setFilterName, fetchItems, toggleAtivo } =
    useCharacteristics();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e?.preventDefault();
    fetchItems();
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleToggle = async (id, isAtivo) => {
    await toggleAtivo(id, isAtivo);
  };

  return (
    <Panel className="bg-transparent">
      <div className="mx-auto pb-10">
        <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Temperamentos</h1>
            <p className="text-sm text-gray-500 mt-1">
              Total de {items.length} registros encontrados
            </p>
          </div>
          <Link to="criar">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition-all font-medium text-sm w-full md:w-auto justify-center">
              <GoPlus size={18} />
              Adicionar Novo
            </button>
          </Link>
        </header>

        <div className="bg-white rounded-xl border border-gray-300 mb-6 overflow-visible relative z-10">
          <div className="p-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:w-96">
              <GoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Buscar por nome..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-400 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-500"
              />
            </div>

            <div className="flex w-full lg:w-auto items-center gap-3">
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 w-full lg:w-auto active:scale-95"
              >
                Filtrar
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative z-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {!loading ? (
                  items.length > 0 ? (
                    items.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-blue-50/30 transition-colors group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">
                            {item.nome}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600 line-clamp-1">
                            {item.descricao || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {item.ativo ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                              Visível
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                              Oculto
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`${item.id}/editar`)}
                              className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                              title="Editar"
                            >
                              <span className="text-xs font-medium hidden sm:inline">
                                Editar
                              </span>
                            </button>
                            <button
                              onClick={() => handleToggle(item.id, item.ativo)}
                              className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                                item.ativo
                                  ? 'text-red-500 hover:text-red-600 hover:bg-red-50'
                                  : 'text-green-500 hover:text-green-600 hover:bg-green-50'
                              }`}
                              title={item.ativo ? 'Ocultar' : 'Mostrar'}
                            >
                              <span className="text-xs font-medium hidden sm:inline">
                                {item.ativo ? 'Ocultar' : 'Mostrar'}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <GoSearch size={48} className="mb-4 opacity-20" />
                          <p>Nenhum temperamento encontrado.</p>
                        </div>
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td colSpan="4" className="py-20">
                      <div className="flex justify-center items-center">
                        <AiOutlineLoading3Quarters className="animate-spin w-8 h-8 text-blue-600" />
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Panel>
  );
};

export default CharacteristicsTable;
