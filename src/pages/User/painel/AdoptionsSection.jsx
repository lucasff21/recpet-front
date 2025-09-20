import React, { useState, useEffect } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { findAllAdocoes } from '../../../services/ApiAdocao';
import { showToast } from '../../../utils/toast';
import AdocaoStatusBadge from '../../../components/AdocaoStatusBadge';

const Adoptions = () => {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    findAllAdocoes()
      .then((response) => {
        setSolicitacoes(response.data);
      })
      .catch(() => {
        showToast('Erro ao carregar solicitações de adoção', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const statusDetails = {
    PENDENTE: {
      label: 'PENDENTE',
      observation: 'Aguardando revisão inicial.',
    },
    EM_ANALISE: {
      label: 'EM ANÁLISE',
      observation: 'Questionário em análise pela equipe.',
    },
    APROVADA: {
      label: 'APROVADO',
      observation:
        'Parabéns! Sua solicitação foi aprovada. Entraremos em contato para os próximos passos.',
    },
    RECUSADA: {
      label: 'RECUSADO',
      observation:
        'Agradecemos seu interesse, mas no momento não foi possível prosseguir com a adoção.',
    },
    DESCONHECIDO: {
      label: 'DESCONHECIDO',
      observation:
        'Status desconhecido. Entre em contato para mais informações.',
    },
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Minhas Solicitações de Adoção
      </h2>

      {loading && (
        <div className="flex justify-center items-center h-48">
          <AiOutlineLoading3Quarters className="animate-spin w-8 h-8" />
          <p className="ml-4 text-gray-600">Carregando solicitações...</p>
        </div>
      )}

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Erro:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {!loading && !error && solicitacoes.length === 0 && (
        <div className="text-center py-10 text-gray-600">
          <p className="mb-2">Você ainda não possui solicitações de adoção.</p>
          <p>
            Que tal explorar nossos{' '}
            <a href="/" className="text-blue-600 hover:underline">
              cãezinhos disponíveis
            </a>
            ?
          </p>
        </div>
      )}

      {!loading && !error && solicitacoes.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Animal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data da Solicitação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Observações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {solicitacoes.map((solicitacao) => (
                <tr key={solicitacao.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                        <img
                          className="h-10 w-10 object-cover"
                          src={solicitacao.animal.imagemPath}
                          alt={solicitacao.animal.nome}
                          onError={(e) =>
                            (e.target.src =
                              'https://placehold.co/60x60/a0aec0/ffffff?text=Pet')
                          }
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {solicitacao.animal.nome}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {solicitacao.created_at
                      ? new Date(solicitacao.created_at).toLocaleDateString(
                          'pt-BR'
                        )
                      : 'Desconhecida'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <AdocaoStatusBadge status={solicitacao.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                    {statusDetails[solicitacao.status]?.observation ||
                      statusDetails.DESCONHECIDO.observation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Adoptions;
