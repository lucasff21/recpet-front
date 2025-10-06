import React, { useEffect, useState, useCallback } from 'react';
import { findAllAnimals } from '../../../services/ApiAdmin';
import { showToast } from '../../../utils/toast';
import logo from '../../../assets/logo-pet.png';
import { Link, useNavigate } from 'react-router-dom';
import { calculateAge } from '../../../utils/pet';
import Pagination from '../../../components/Pagination';
import { GoPlus } from 'react-icons/go';
import { FaCircleCheck, FaCircleXmark } from 'react-icons/fa6';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Panel from '../../../components/Panel';

const PetsTable = () => {
  const [pets, setPets] = useState([]);
  const [pageData, setPageData] = useState({ totalPages: 0, number: 0 });
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    nome: '',
  });

  const getPets = useCallback((page, nome) => {
    setLoading(true);
    findAllAnimals({ page, nome })
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
        });
      })
      .catch(() => {
        showToast('Erro ao carregar pets', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      getPets(currentPage, filters.nome);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [currentPage, filters.nome, getPets]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page - 1);
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/pets/${id}/editar`);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentPage(0);
  };

  return (
    <Panel>
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Pets</h1>
      </header>
      <div className="py-4 border-b">
        <div className="mt-2 flex justify-between items-center">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Buscar animais..."
              name="nome"
              value={filters.nome}
              onChange={handleFilterChange}
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
            <Link
              to="../criar"
              className="list-group-item list-group-item-action"
            >
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <GoPlus className="h-5 w-5" />
                Novo Pet
              </button>
            </Link>
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
                  <tr key={pet.id} className="hover:bg-gray-50">
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
                        onClick={() => handleEdit(pet.id)}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    Nenhuma animal encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          ) : (
            <td colSpan="6" className="py-10">
              <div className="flex justify-center items-center">
                <AiOutlineLoading3Quarters className="animate-spin w-8 h-8 text-gray-500" />
              </div>
            </td>
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
