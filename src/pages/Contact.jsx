import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getPaginaPublicaPorNome } from '../services/ApiPagina';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const Contact = () => {
  document.title = 'Contato';
  const [pagina, setPagina] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const nomePagina = process.env.REACT_APP_PAGINA_CONTATO || 'contato';

    const fetchPagina = async () => {
      try {
        const response = await getPaginaPublicaPorNome(nomePagina);
        setPagina(response.data);
      } catch (err) {
        setError('Não foi possível carregar as informações de contato.');
      } finally {
        setLoading(false);
      }
    };

    fetchPagina();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-600" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center my-10 p-8 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 mt-2">{error}</p>
        </div>
      );
    }

    if (pagina) {
      return (
        <>
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            {pagina.titulo}
          </h1>
          <div dangerouslySetInnerHTML={{ __html: pagina.conteudo }} />
        </>
      );
    }

    return null;
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">{renderContent()}</div>
    </Layout>
  );
};

export default Contact;
