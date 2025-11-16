import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Panel from '../../../components/Panel';
import { Button } from '../../../components/Button';
import { useCharacteristics } from '../../../hooks/useCharacteristics';
import { GoPlus } from 'react-icons/go';
import { FaEdit } from 'react-icons/fa';
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6';
import { MdToggleOff, MdToggleOn } from 'react-icons/md';

const CharacteristicsTable = () => {
  const { items, loading, filterName, setFilterName, fetchItems, toggleAtivo } = useCharacteristics();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleToggle = async (id, isAtivo) => {
    await toggleAtivo(id, isAtivo);
  };

  return (
    <Panel>
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:justify-between sm:items-center ">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 whitespace-nowrap">Características</h1>
        <Link to="criar" className="w-full sm:w-auto flex-shrink-0">
          <Button 
            text="Adicionar" 
            icon={<GoPlus />} 
            confirm 
            size="medium" 
            className="w-full sm:w-auto justify-center whitespace-nowrap"
          />
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
          <Button text="Buscar" type="submit" confirm size="small" />
        </div>
      </form>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      ) : (
        <>

          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{item.nome}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{item.descricao || '-'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {item.ativo ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <FaCircleCheck /> Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <FaCircleXmark /> Inativo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => navigate(`${item.id}/editar`)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition"
                            title="Editar"
                          >
                            <FaEdit /> Editar
                          </button>
                          <button
                            onClick={() => handleToggle(item.id, item.ativo)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition ${
                              item.ativo
                                ? 'text-red-600 hover:text-red-800 hover:bg-red-50'
                                : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                            }`}
                            title={item.ativo ? 'Desativar' : 'Reativar'}
                          >
                            {item.ativo ? (
                              <>
                                <MdToggleOff /> Desativar
                              </>
                            ) : (
                              <>
                                <MdToggleOn /> Reativar
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      <p className="text-lg">Nenhuma característica encontrada</p>
                      <p className="text-sm mt-1">Tente ajustar os filtros ou adicione uma nova característica</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-4">
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.nome}</h3>
                      <p className="text-sm text-gray-600">{item.descricao || 'Sem descrição'}</p>
                    </div>
                    <div className="ml-3">
                      {item.ativo ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FaCircleCheck className="text-xs" /> Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <FaCircleXmark className="text-xs" /> Inativo
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => navigate(`${item.id}/editar`)}
                      className="flex-1 inline-flex justify-center items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition"
                    >
                      <FaEdit /> Editar
                    </button>
                    <button
                      onClick={() => handleToggle(item.id, item.ativo)}
                      className={`flex-1 inline-flex justify-center items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition ${
                        item.ativo
                          ? 'text-red-600 bg-red-50 hover:bg-red-100'
                          : 'text-green-600 bg-green-50 hover:bg-green-100'
                      }`}
                    >
                      {item.ativo ? (
                        <>
                          <MdToggleOff /> Desativar
                        </>
                      ) : (
                        <>
                          <MdToggleOn /> Reativar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">Nenhuma característica encontrada</p>
                <p className="text-sm text-gray-400 mt-1">Tente ajustar os filtros ou adicione uma nova</p>
              </div>
            )}
          </div>
        </>
      )}
    </Panel>
  );
};

export default CharacteristicsTable;
