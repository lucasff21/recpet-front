import React, { useContext, useEffect, useState, useCallback } from 'react';
import { getUsers, updateRole, deleteUser } from '../../../services/ApiAdmin';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmModal from '../../../components/ConfirmModal';
import Pagination from '../../../components/Pagination';
import { showToast } from '../../../utils/toast';
import { AuthContext } from '../../../contexts/AuthContext';
import { GoPlus } from 'react-icons/go';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const UserTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [pageData, setPageData] = useState({ totalPages: 0, number: 0 });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    valor: '',
    tipoBusca: 'NOME',
    role: '',
    sortByDate: 'desc',
    page: 0,
  });

  const [searchType, setSearchType] = useState('NOME');
  const [searchValue, setSearchValue] = useState('');

  const [modal, setModal] = useState({ isOpen: false, userId: null });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchUsers = useCallback((currentFilters) => {
    setLoading(true);
    const apiParams = {
      page: currentFilters.page,
      valor: currentFilters.valor,
      tipoBusca: currentFilters.tipoBusca,
      tipo: currentFilters.role,
      sort: `createdAt,${currentFilters.sortByDate}`,
    };

    Object.keys(apiParams).forEach((key) => {
      if (apiParams[key] === '' || apiParams[key] === null) {
        delete apiParams[key];
      }
    });

    getUsers(apiParams)
      .then((response) => {
        const pageResponse = response.data;
        setAccounts(pageResponse.content);
        setPageData({
          totalPages: pageResponse.totalPages,
          number: pageResponse.number,
        });
      })
      .catch(() => toast.error('Erro ao buscar os usuários'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchUsers(filters);
  }, [filters, fetchUsers]);

  const handleSelectFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 0 }));
  };

  const handlePageChange = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page: page - 1 }));
  }, []);

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      valor: searchValue,
      tipoBusca: searchType,
      page: 0,
    }));
  };

  const handleDelete = (id) => setModal({ isOpen: true, userId: id });

  const confirmDelete = () => {
    if (!modal.userId) return;
    deleteUser(modal.userId)
      .then(() => {
        showToast('Sucesso ao deletar o usuário');
        fetchUsers(filters);
      })
      .catch(() => showToast('Erro ao deletar o usuário', 'error'))
      .finally(() => setModal({ isOpen: false, userId: null }));
  };

  const handleRoleChange = (id, newRole) => {
    updateRole(id, { tipo: newRole })
      .then(() => {
        setAccounts((accs) =>
          accs.map((acc) =>
            acc.id === id ? { ...acc, tipoUsuario: newRole } : acc
          )
        );
        showToast('Sucesso ao editar o usuário');
      })
      .catch(() => showToast('Erro ao editar o usuário', 'error'));
  };

  const handleEdit = (id) => navigate(`/admin/usuarios/${id}/editar`);

  const tipos = {
    ADMIN: 'ADMINISTRADOR',
    MODERATOR: 'MODERADOR',
    ADOTANTE: 'ADOTANTE',
  };

  return (
    <div>
      <div className="pb-4 border-b">
        <div className="flex-shrink-0 flex justify-end py-4">
          <Link to="../criar">
            <button
              type="button"
              className="w-full lg:w-auto h-10 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <GoPlus className="h-5 w-5" />
              Criar usuário
            </button>
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 flex-grow justify-end">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="h-10 px-3 w-32 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Tipo de busca"
              >
                <option value="NOME">Nome</option>
                <option value="EMAIL">Email</option>
              </select>
              <input
                type="text"
                placeholder="Buscar..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="h-10 w-full sm:w-48 pl-4 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                name="role"
                value={filters.role}
                onChange={handleSelectFilterChange}
                className="h-10 px-3 w-full sm:w-48 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os Tipos</option>
                {Object.entries(tipos).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
              <select
                name="sortByDate"
                value={filters.sortByDate}
                onChange={handleSelectFilterChange}
                className="h-10 px-3 w-full sm:w-48 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Mais Recentes</option>
                <option value="asc">Mais Antigos</option>
              </select>
            </div>

            <button
              onClick={handleSearch}
              className="h-10 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
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
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tipo
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
              {accounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-medium">
                          {account.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {account.nome}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      disabled={account.id === user.id}
                      value={account.tipoUsuario}
                      onChange={(e) =>
                        handleRoleChange(account.id, e.target.value)
                      }
                      className={`px-2 py-1 rounded-md text-xs font-medium ${account.id === user.id ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
                    >
                      {Object.entries(tipos).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => handleEdit(account.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(account.id)}
                      disabled={account.id === user.id}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
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
        <div className="flex justify-center p-4">
          <Pagination
            currentPage={pageData.number + 1}
            totalPageCount={pageData.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {modal.isOpen && (
        <ConfirmModal
          message="Tem certeza que deseja excluir este usuário?"
          onConfirm={confirmDelete}
          onCancel={() => setModal({ isOpen: false, userId: null })}
        />
      )}
    </div>
  );
};

export default UserTable;
