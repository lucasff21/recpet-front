import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Panel from '../../../components/Panel';
import { showToast } from '../../../utils/toast';
import { findAllPaginas } from '../../../services/ApiAdmin';
import { GoPlus, GoSearch } from 'react-icons/go';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Pagination from '../../../components/Pagination';

const ContentModal = ({ content, onClose }) => {
  if (!content) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[9999] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            Visualizar Conteúdo
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div
            className="prose max-w-none text-gray-600"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors"
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

  const [pageData, setPageData] = useState({
    totalPages: 0,
    number: 0,
    totalElements: 0,
  });
  const [currentPage, setCurrentPage] = useState(0);

  const getPaginas = useCallback((page) => {
    setLoading(true);
    findAllPaginas({ page })
      .then((response) => {
        setPaginas(response.data.content);
        setPageData({
          totalPages: response.data.totalPages,
          number: response.data.number,
          totalElements:
            response.data.totalElements || response.data.content.length,
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
    <Panel className="bg-transparent">
      <div className="mx-auto pb-10">
        <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gerenciar Conteúdos
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Páginas institucionais e termos de uso
            </p>
          </div>
          <Link to="criar">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow-sm transition-all font-medium text-sm w-full md:w-auto justify-center">
              <GoPlus size={18} />
              Nova Página
            </button>
          </Link>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative z-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Identificador (Slug)
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Título da Página
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Última Atualização
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {!loading ? (
                  paginas.length > 0 ? (
                    paginas.map((pagina) => (
                      <tr
                        key={pagina.id}
                        className="hover:bg-blue-50/30 transition-colors group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {pagina.nome}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {pagina.titulo}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(pagina.updatedAt).toLocaleDateString(
                            'pt-BR',
                            {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewContent(pagina.conteudo)}
                              className="p-1.5 text-green-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-1"
                              title="Visualizar Conteúdo"
                            >
                              <span className="text-xs font-medium hidden sm:inline">
                                Visualizar
                              </span>
                            </button>
                            <button
                              onClick={() => handleEdit(pagina.id)}
                              className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                              title="Editar Página"
                            >
                              <span className="text-xs font-medium hidden sm:inline">
                                Editar
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-20 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <GoSearch size={48} className="mb-4 opacity-20" />
                          <p>Nenhuma página de conteúdo encontrada.</p>
                        </div>
                      </td>
                    </tr>
                  )
                ) : (
                  <tr>
                    <td colSpan="4" className="py-20">
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

      <ContentModal
        content={modalContent}
        onClose={() => setModalContent(null)}
      />
    </Panel>
  );
};

export default ContentTable;
