import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Panel from '../../../components/Panel';
import { showToast } from '../../../utils/toast';
import { findAllPaginas } from '../../../services/ApiAdmin';
import { GoPlus } from 'react-icons/go';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Pagination from '../../../components/Pagination';

const ContentModal = ({ content, onClose }) => {
  if (!content) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Visualizar Conteúdo</h2>
        <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
        <div className="text-right mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

const ContentTable = () => {
  const [paginas, setPaginas] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [modalContent, setModalContent] = useState(null);

  const [pageData, setPageData] = useState({ totalPages: 0, number: 0 });
  const [currentPage, setCurrentPage] = useState(0);

  const getPaginas = useCallback((page) => {
    setLoading(true);
    findAllPaginas({ page })
      .then((response) => {
        setPaginas(response.data.content);
        setPageData({
          totalPages: response.data.totalPages,
          number: response.data.number,
        });
      })
      .catch(() => showToast('Erro ao carregar conteúdos.', 'error'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getPaginas(currentPage);
  }, [currentPage, getPaginas]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page - 1);
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/conteudos/${id}/editar`);
  };

  const handleViewContent = (conteudo) => {
    setModalContent(conteudo);
  };

  return (
    <Panel>
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gerenciar Conteúdos
        </h1>
      </header>
      <div className="flex justify-end mb-4">
        <Link to="criar">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <GoPlus className="h-5 w-5" />
            Nova Página
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome (Identificador)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Última Atualização
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-10 text-center">
                  <AiOutlineLoading3Quarters className="animate-spin w-8 h-8 text-gray-500 mx-auto" />
                </td>
              </tr>
            ) : paginas.length > 0 ? (
              paginas.map((pagina) => (
                <tr key={pagina.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {pagina.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                    {pagina.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pagina.titulo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(pagina.updatedAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      onClick={() => handleViewContent(pagina.conteudo)}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Ver Conteúdo
                    </button>
                    <button
                      onClick={() => handleEdit(pagina.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  Nenhuma página de conteúdo encontrada.
                </td>
              </tr>
            )}
          </tbody>
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

      <ContentModal
        content={modalContent}
        onClose={() => setModalContent(null)}
      />
    </Panel>
  );
};

export default ContentTable;
