import React, { useContext, useEffect, useState } from 'react';
import { getUsers, updateRole } from '../services/ApiAdmin';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { deleteUser } from '../services/ApiAdmin';
import ConfirmModal from './ConfirmModal';
import { showToast } from '../utils/toast';
import { AuthContext } from '../contexts/AuthContext';

const UserTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [filters, setFilters] = useState({
    query: '',
    role: '',
    sortByDate: 'desc',
  });
  const [total, setTotal] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, userId: null });
  const { user } = useContext(AuthContext);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredUsers = accounts
    .filter((account) => {
      const queryMatch =
        account.nome.toLowerCase().includes(filters.query.toLowerCase()) ||
        account.email.toLowerCase().includes(filters.query.toLowerCase());
      const roleMatch =
        filters.role === '' || account['tipoUsuario'] === filters.role;
      return queryMatch && roleMatch;
    })
    .sort((a, b) => {
      if (filters.sortByDate === 'desc') {
        return b.criadoEm - a.criadoEm;
      } else {
        return a.criadoEm - b.criadoEm;
      }
    });

  const handleDelete = (id) => {
    setModal({ isOpen: true, userId: id });
  };

  const confirmDelete = () => {
    deleteUser(modal.userId)
      .then(() => {
        setAccounts(accounts.filter((account) => account.id !== modal.userId));
        showToast('Sucesso ao deletar o usuário');
      })
      .catch(() => {
        showToast('Erro ao deletar o usuário', 'error');
      });
    setModal({ isOpen: false, userId: null });
  };

  const handleRoleChange = (id, newRole) => {
    updateRole(id, { tipo: newRole })
      .then(() => {
        setAccounts(
          accounts.map((account) =>
            account.id === id ? { ...account, tipoUsuario: newRole } : account
          )
        );
        showToast('Sucesso ao editar o usuário');
      })
      .catch(() => {
        showToast('Erro ao editar o usuário', 'error');
      });
  };

  const tipos = {
    ADMIN: 'ADMINISTRADOR',
    MODERATOR: 'MODERADOR',
    ADOTANTE: 'ADOTANTE',
  };

  const getUsersFiltered = (filters = {}) => {
    getUsers(filters)
      .then((response) => {
        setTotal(response.data['totalElements']);
        setAccounts(response.data.content);
      })
      .catch(() => {
        toast('Erro ao buscar os usuários', {
          type: 'error',
          position: 'bottom-right',
          autoClose: 5000,
        });
      });
  };

  useEffect(() => {
    getUsersFiltered();
  }, []);

  const handleFilteredSearch = () => {
    getUsersFiltered(filters);
  };

  const handleEdit = (id) => {};

  return (
    <div>
      <div className="py-4 border-b">
        <div className="mt-2 flex justify-between items-center">
          <div className="relative w-64">
            <input
              type="text"
              name="query"
              placeholder="Buscar usuários..."
              value={filters.query}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && handleFilteredSearch()}
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
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os tipos</option>
              {Object.entries(tipos).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
            <select
              name="sortByDate"
              value={filters.sortByDate}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Mais Recentes</option>
              <option value="asc">Mais Antigos</option>
            </select>
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Link
                to="../criar"
                className="list-group-item list-group-item-action"
              >
                + Criar usuário
              </Link>
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
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((account) => (
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
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      account.id === user.id
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    }`}
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
                    onClick={() => handleEdit(user.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(user.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
