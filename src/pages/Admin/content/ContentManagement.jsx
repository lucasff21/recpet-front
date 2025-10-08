import { Route, Routes } from 'react-router-dom';
import ContentTable from './ContentTable';
import ContentForm from './ContentForm';

const ContentManagement = () => {
  return (
    <Routes>
      <Route path="/" element={<ContentTable />} />
      <Route path="/criar" element={<ContentForm isEdit={false} />} />
      <Route path="/:id/editar" element={<ContentForm isEdit={true} />} />
    </Routes>
  );
};

export default ContentManagement;
