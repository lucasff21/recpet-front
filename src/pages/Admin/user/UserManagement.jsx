import React from 'react';
import '../../../styles/UserManagement.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import UserTable from './UserTable';
import CreateUserAdmin from './CreateUserAdmin';
import Breadcrumb from '../../../components/Breadcrumb';
import UserDetails from './UserDetails';

const UserManagement = () => {
  const location = useLocation();

  const isCreatePage = location.pathname === '/admin/usuarios/criar';
  return (
    <>
      {isCreatePage && (
        <Breadcrumb
          items={[
            { label: 'Usuários', href: '/admin/usuarios' },
            { label: 'Criar' },
          ]}
        />
      )}
      <Routes>
        <Route path="/" element={<UserTable />} />
        <Route path="/:id" element={<UserDetails />} />
        <Route path="/criar" element={<CreateUserAdmin />} />
      </Routes>
    </>
  );
};

export default UserManagement;
