import { Route, Routes, useNavigate } from 'react-router-dom';
import '../../styles/AdminPages.css';
import AddPet from './AddPet';
import UserManagement from './UserManagement';
import { ToastContainer } from 'react-toastify';
import { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import AdocaoArea from './AdocaoArea';
import Sidebar from '../../components/Sidebar';

const AdminArea = () => {
  useNavigate();
  const { logout } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(true);

  const menuItems = [
    { text: 'Página inicial', to: '/' },
    { text: 'Usuários', to: 'usuarios/lista' },
    { text: 'Pets', to: 'pet/adicionar' },
    { text: 'Solicitações', to: 'adocoes' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <ToastContainer />
      <Sidebar menuItems={menuItems} title="Painel Admin" expanded={true}>
        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
        >
          Sair
        </button>
      </Sidebar>

      <main className="flex-1 p-8 ml-24">
        <Routes>
          <Route
            path="/*"
            element={
              <Routes>
                <Route path="pet/adicionar" element={<AddPet />} />
                <Route path="usuarios/*" element={<UserManagement />} />
                <Route path="adocoes" element={<AdocaoArea />} />
              </Routes>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default AdminArea;
