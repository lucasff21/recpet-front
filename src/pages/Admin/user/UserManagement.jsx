import React from 'react';
import '../../../styles/UserManagement.css';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import UserTable from './UserTable';
import CreateUserAdmin from './CreateUserAdmin';
import Panel from '../../../components/Panel';

const UserManagement = () => {
  const location = useLocation();

  const isCreatePage = location.pathname === '/admin/usuarios/criar';
  return (
    <Panel>
      {!isCreatePage && (
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Usuários</h1>
        </header>
      )}
      {isCreatePage && (
        <nav aria-label="breadcrumb" className="flex">
          <ol className="inline-flex items-center space-x-1 p-0">
            <li className="inline-flex items-center">
              <Link
                to="lista"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Usuários
              </Link>
            </li>
            <li className="inline-flex items-center">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                Criar
              </span>
            </li>
          </ol>
        </nav>
      )}

      <Routes>
        <Route
          path="/*"
          element={
            <Routes>
              <Route path="/lista" element={<UserTable />} />
              <Route path="/criar" element={<CreateUserAdmin />} />
            </Routes>
          }
        />
      </Routes>
    </Panel>
  );
};

export default UserManagement;
