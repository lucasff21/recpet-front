import { Route, Routes, useLocation } from 'react-router-dom';
import AddPet from './AddPet';
import PetsTable from './PetsTable';
import EditPet from './EditPet';
import PetDetails from './PetDetails';
import Breadcrumb from '../../../components/Breadcrumb';

const PetManagement = () => {
  document.title = 'Pets | ADMIN';
  const location = useLocation();
  const isSubPage = /criar|editar/.test(location.pathname);

  return (
    <>
      {isSubPage && (
        <Breadcrumb
          items={[
            { label: 'Pets', href: '/admin/pets' },
            { label: /criar/.test(location.pathname) ? 'Criar' : 'Editar' },
          ]}
        />
      )}

      <Routes>
        <Route path="/" element={<PetsTable />} />
        <Route path="/:id" element={<PetDetails />} />
        <Route path="/criar" element={<AddPet />} />
        <Route path="/:id/editar" element={<EditPet />} />
      </Routes>
    </>
  );
};

export default PetManagement;
