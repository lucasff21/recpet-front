import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo-pet.png';
import AdocaoStatusBadge from './AdocaoStatusBadge';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const AdoptionTable = ({ adocoes = [], loading, openDetailsModal }) => {
  const navigate = useNavigate();
  return (
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
              Animal
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Adotante
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-nowrap"
            >
              Data de conclusão
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
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
            {adocoes.length > 0 ? (
              adocoes.map((adocao) => (
                <tr
                  key={adocao.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openDetailsModal(adocao)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {adocao.id ?? '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={adocao.animal?.imagemPath || logo}
                          alt={adocao.animal?.nome || 'Animal'}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-blue-600">
                          <Link to={`/admin/pets/${adocao.animal.id}`}>
                            {adocao.animal?.nome ?? '-'}
                          </Link>
                        </div>
                        <div className="text-sm text-gray-500">
                            {adocao.animal?.idade ?? ''} {adocao.animal?.raca ? `• ${adocao.animal.raca}` : ''} {adocao.animal?.rgAnimal ? `• RG: ${adocao.animal.rgAnimal}` : ''} {adocao.animal?.microchipId ? `• ${adocao.animal.microchipId}` : ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/admin/usuarios/${adocao.usuario?.id}`}>
                      <div className="text-sm font-medium text-blue-600">
                        {adocao.usuario?.nome ?? '-'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {adocao.usuario?.email ?? ''}
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {adocao.concluidoEm
                      ? new Date(adocao.concluidoEm).toLocaleDateString(
                          'pt-BR',
                          {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          }
                        )
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <AdocaoStatusBadge status={adocao.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => navigate(`/admin/adocoes/${adocao.id}`)}
                    >
                      Ver mais
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  Nenhuma solicitação de adoção encontrada.
                </td>
              </tr>
            )}
          </tbody>
        ) : (
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td colSpan="6" className="py-10">
                <div className="flex justify-center items-center">
                  <AiOutlineLoading3Quarters className="animate-spin w-8 h-8 text-gray-500" />
                </div>
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
};

export default AdoptionTable;
