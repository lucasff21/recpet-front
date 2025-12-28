import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { GoSearch, GoPlus } from 'react-icons/go';
import { FaUserTag, FaSort } from 'react-icons/fa6';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { getUsers, updateRole, deleteUser } from '../../../services/ApiAdmin';
import { toast } from 'react-toastify';
import ConfirmModal from '../../../components/ConfirmModal';
import Pagination from '../../../components/Pagination';
import { showToast } from '../../../utils/toast';
import { AuthContext } from '../../../contexts/AuthContext';
import Panel from '../../../components/Panel';

const UserTable = () => {
  document.title = 'Usuários | ADMIN';
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, userId: null });
  const [pageData, setPageData] = useState({
    totalPages: 0,
    number: 0,
    totalElements: 0,
  });

  const urlValor = searchParams.get('valor') || '';
  const urlTipoBusca = searchParams.get('tipoBusca') || 'NOME';
  const urlRole = searchParams.get('tipo') || '';
  const urlSortByDate = searchParams.get('sortByDate') || 'desc';
  const urlPage = searchParams.get('page')
    ? Number(searchParams.get('page')) - 1
    : 0;

  const [filters, setFilters] = useState({
    valor: urlValor,
    tipoBusca: urlTipoBusca,
    role: urlRole,
    sortByDate: urlSortByDate,
    page: urlPage,
  });

  const [localFilters, setLocalFilters] = useState({
    valor: urlValor,
    tipoBusca: urlTipoBusca,
    role: urlRole,
    sortByDate: urlSortByDate,
  });

  const tipos = {
    ADMIN: 'Administrador',
    ADOTANTE: 'Adotante',
  };

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
          totalElements: pageResponse.totalElements,
        });
      })
      .catch(() => toast.error('Erro ao buscar os usuários'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const paramsToSet = {};
    if (filters.valor) paramsToSet.valor = filters.valor;
    if (filters.tipoBusca !== 'NOME') paramsToSet.tipoBusca = filters.tipoBusca;
    if (filters.role) paramsToSet.tipo = filters.role;
    if (filters.sortByDate !== 'desc')
      paramsToSet.sortByDate = filters.sortByDate;
    if (filters.page > 0) paramsToSet.page = filters.page + 1;

    setSearchParams(paramsToSet, { replace: true });
    fetchUsers(filters);
  }, [filters, fetchUsers, setSearchParams]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      ...localFilters,
      page: 0,
    }));
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const clearFilters = () => {
    const empty = {
      valor: '',
      tipoBusca: 'NOME',
      role: '',
      sortByDate: 'desc',
    };
    setLocalFilters(empty);
    setFilters({ ...empty, page: 0 });
  };

  const handlePageChange = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page: page - 1 }));
  }, []);

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

  return (
    <Panel className="bg-transparent">
      <div className="mx-auto pb-10">
        <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Usuários Registrados
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Total de {pageData.totalElements} usuários encontrados
            </p>
          </div>
          <Link to="../criar">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition-all font-medium text-sm w-full md:w-auto justify-center">
              <GoPlus size={18} />
              Adicionar Novo Usuário
            </button>
          </Link>
        </header>

        <div className="bg-white rounded-xl border border-gray-300 mb-6 overflow-visible relative z-10">
          <div className="p-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex w-full lg:w-auto gap-2">
              <select
                id="tipoBusca"
                name="tipoBusca"
                value={localFilters.tipoBusca}
                onChange={handleFilterChange}
                className="bg-white border border-gray-400 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-28 font-medium cursor-pointer"
              >
                <option value="NOME">Nome</option>
                <option value="EMAIL">Email</option>
              </select>

              <div className="relative w-full lg:w-80">
                <GoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                <input
                  type="text"
                  name="valor"
                  value={localFilters.valor}
                  onChange={handleFilterChange}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-400 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-500"
                />
              </div>
            </div>

            <div className="flex w-full lg:w-auto items-center gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              <div className="relative">
                <select
                  name="role"
                  value={localFilters.role}
                  onChange={handleFilterChange}
                  className="bg-white border border-gray-400 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 min-w-[150px] font-medium cursor-pointer"
                >
                  <option value="">Todos Tipos</option>
                  {Object.entries(tipos).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <select
                  name="sortByDate"
                  value={localFilters.sortByDate}
                  onChange={handleFilterChange}
                  className="bg-white border border-gray-400 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 min-w-[150px] font-medium cursor-pointer"
                >
                  <option value="desc">Mais Recentes</option>
                  <option value="asc">Mais Antigos</option>
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
              >
                Filtrar
              </button>

              {(localFilters.valor ||
                localFilters.role ||
                localFilters.sortByDate !== 'desc') && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-black font-bold hover:text-red-600 underline whitespace-nowrap px-2 transition-colors"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative z-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Email
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Permissão
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {!loading ? (
                  accounts.length > 0 ? (
                    accounts.map((account) => (
                      <tr
                        key={account.id}
                        className="hover:bg-blue-50/30 transition-colors group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200 text-blue-700 font-bold shadow-sm">
                              {account.nome.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                <Link
                                  to={`/admin/usuarios/${account.id}`}
                                  className="hover:text-blue-600"
                                >
                                  {account.nome}
                                </Link>
                              </div>
                              <div className="text-xs text-gray-500 md:hidden">
                                {account.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">
                          {account.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            disabled={account.id === user.id}
                            value={account.tipoUsuario}
                            onChange={(e) =>
                              handleRoleChange(account.id, e.target.value)
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all appearance-none cursor-pointer ${
                              account.id === user.id
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                : account.tipoUsuario === 'ADMIN'
                                  ? 'bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-300'
                                  : 'bg-green-50 text-green-700 border-green-200 hover:border-green-300'
                            }`}
                          >
                            {Object.entries(tipos).map(([key, value]) => (
                              <option key={key} value={key}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                              onClick={() =>
                                navigate(`/admin/usuarios/${account.id}`)
                              }
                              title="Ver Detalhes"
                            >
                              <span className="text-xs font-medium hidden sm:inline">
                                Ver mais
                              </span>
                            </button>
                            <button
                              className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                                account.id === user.id
                                  ? 'text-gray-300 cursor-not-allowed'
                                  : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                              }`}
                              onClick={() => handleDelete(account.id)}
                              disabled={account.id === user.id}
                              title="Excluir"
                            >
                              <span className="text-xs font-medium hidden sm:inline">
                                Excluir
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
                          <p>
                            Nenhum usuário encontrado com os filtros atuais.
                          </p>
                          <button
                            onClick={clearFilters}
                            className="mt-2 text-blue-600 text-sm hover:underline"
                          >
                            Limpar filtros
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td colSpan="6" className="py-20">
                      <div className="flex justify-center items-center">
                        <AiOutlineLoading3Quarters className="animate-spin w-8 h-8 text-blue-600" />
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
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {modal.isOpen && (
        <ConfirmModal
          message="Tem certeza que deseja excluir este usuário? Essa ação não pode ser desfeita."
          onConfirm={confirmDelete}
          onCancel={() => setModal({ isOpen: false, userId: null })}
        />
      )}
    </Panel>
  );
};

export default UserTable;
