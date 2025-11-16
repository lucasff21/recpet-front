import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import CharacteristicsTable from './CharacteristicsTable';
import CreateCharacteristic from './CreateCharacteristic';
import EditCharacteristic from './EditCharacteristic';
import Breadcrumb from '../../../components/Breadcrumb';
const CharacteristicsManagement = () => {
  const location = useLocation();
  const isSubPage = /criar|editar/.test(location.pathname);

  return (
    <>
      {isSubPage && (
        <Breadcrumb
          items={[
            { label: 'Temperamentos', href: '/admin/caracteristicas' },
            { label: /criar/.test(location.pathname) ? 'Criar' : 'Editar' },
          ]}
        />
      )}

      <Routes>
        <Route path="/" element={<CharacteristicsTable />} />
        <Route path="criar" element={<CreateCharacteristic />} />
        <Route path=":id/editar" element={<EditCharacteristic />} />
      </Routes>
    </>
  );
};

export default CharacteristicsManagement;
