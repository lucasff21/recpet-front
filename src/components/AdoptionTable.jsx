import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-pet.png';
import AdocaoStatusBadge from './AdocaoStatusBadge';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { GoSearch } from 'react-icons/go';
import { FaPaw } from 'react-icons/fa6';

const AdoptionTable = ({
  adocoes = [],
  loading,
  openDetailsModal,
  clearFilters,
}) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-100">
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Animal
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Adotante Solicitante
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-nowrap">
              Data Conclusão
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status Atual
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
              Ações
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {!loading ? (
            adocoes.length > 0 ? (
              adocoes.map((adocao) => (
                <tr
                  key={adocao.id}
                  className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                  onClick={() => openDetailsModal(adocao)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow-sm"
                          src={adocao.animal?.imagemPath || logo}
                          alt={adocao.animal?.nome || 'Animal'}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span
                          className="text-sm font-semibold text-gray-900 hover:text-blue-600 z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/pets/${adocao.animal.id}`);
                          }}
                        >
                          {adocao.animal?.nome ?? '-'}
                        </span>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <FaPaw size={10} />
                          {adocao.animal?.raca || 'SRD'}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span
                        className="text-sm font-medium text-blue-600 hover:underline z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/usuarios/${adocao.usuario?.id}`);
                        }}
                      >
                        {adocao.usuario?.nome ?? '-'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {adocao.usuario?.email ?? ''}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {adocao.concluidoEm ? (
                      new Date(adocao.concluidoEm).toLocaleDateString('pt-BR')
                    ) : (
                      <span className="text-gray-400 italic">Em andamento</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <AdocaoStatusBadge status={adocao.status} />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/adocoes/${adocao.id}`);
                        }}
                        title="Ver Página Completa"
                      >
                        <span className="text-xs font-medium hidden sm:inline">
                          Ver mais
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <GoSearch size={48} className="mb-4 opacity-20" />
                    <p>Nenhuma solicitação encontrada.</p>
                    {clearFilters && (
                      <button
                        onClick={clearFilters}
                        className="mt-2 text-blue-600 text-sm hover:underline"
                      >
                        Limpar filtros
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          ) : (
            <tr>
              <td colSpan="5" className="py-20">
                <div className="flex justify-center items-center">
                  <AiOutlineLoading3Quarters className="animate-spin w-8 h-8 text-blue-600" />
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdoptionTable;
