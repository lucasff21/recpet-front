import { useEffect, useState } from 'react';
import { findAllAdocoes } from '../../services/ApiAdocao';
import { showToast } from '../../utils/toast';
import Panel from '../../components/Panel';
import logo from '../../assets/logo-pet.png';

const AdocaoArea = () => {
  const [adocoes, setAdocoes] = useState([]);

  useEffect(() => {
    const findAdocoes = async () => {
      try {
        const response = await findAllAdocoes();
        setAdocoes(response.data);
      } catch (error) {
        showToast('Erro ao buscar adoções', 'error');
      }
    };

    findAdocoes();
  }, []);

  const handleEdit = (id) => {};

  const handleDelete = (id) => {};
  return (
    <Panel>
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Adoções</h1>
      </header>
      <div>
        <div className="p-4 border-b">
          <div className="mt-2 flex justify-between items-center">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Buscar adoções..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                + Nova Adoção
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
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Data
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
            <tbody className="bg-white divide-y divide-gray-200">
              {adocoes.map((adocao) => (
                <tr key={adocao.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {adocao.id ?? '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={adocao.animal?.imagePath || logo}
                          alt={adocao.animal?.nome || 'Animal'}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {adocao.animal?.nome ?? '-'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {adocao.animal?.idade ?? ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {adocao.user?.nome ?? '-'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {adocao.user?.email ?? ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {adocao.dataAdocao
                      ? new Date(adocao.dataAdocao).toLocaleDateString(
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
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        adocao.status === 'Aprovado'
                          ? 'bg-green-100 text-green-800'
                          : adocao.status === 'Pendente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : adocao.status === 'Recusado'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {adocao.status ?? 'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => handleEdit(adocao.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(adocao.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Panel>
  );
};

export default AdocaoArea;
