import { useState } from 'react';
import AdocaoStatusBadge from './AdocaoStatusBadge';
import { Link } from 'react-router-dom';

const ModalAdoptionDetails = ({ onClose, request, onUpdateStatus }) => {
  const [newStatus, setNewStatus] = useState(request.status);
  const [adminNotes, setAdminNotes] = useState(request.observacoes || '');

  const handleStatusChange = () => {
    onUpdateStatus(request.id, newStatus, adminNotes);
  };

  const details = [
    {
      label: 'Animal',
      value: (
        <Link className="text-blue-600" to={`/admin/pets/${request.animal.id}`}>
          {request.animal.nome}
        </Link>
      ),
    },
    {
      label: 'Usuário',
      value: (
        <Link
          className="text-blue-600"
          to={`/admin/usuarios/${request.usuario.id}`}
        >
          {request.usuario.nome}
        </Link>
      ),
    },
    {
      label: 'Data da solicitação',
      value: new Date(request.createdAt).toLocaleDateString('pt-BR'),
    },
    { label: 'Status', value: <AdocaoStatusBadge status={request.status} /> },
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 m-0">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <header>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-semibold"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
            Detalhes da Solicitação de Adoção
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {details.map((detail, index) => (
            <div className="space-y-2" key={index}>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {detail.label}:
              </p>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                {detail.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-1">
            Questionário do Adotante
          </h3>
          <div className="space-y-2 text-gray-700 text-sm"> Sem registros </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-1">
            Solicitação
          </h3>
          <label
            htmlFor="newStatus"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Alterar Status
          </label>
          <select
            id="newStatus"
            disabled={!!request.concluidoEm}
            name="newStatus"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          >
            <option value="PENDENTE">PENDENTE</option>
            <option value="EM_ANALISE">EM ANÁLISE</option>
            <option value="APROVADO">APROVADO</option>
            <option value="RECUSADO">RECUSADO</option>
            <option value="FINALIZADO">FINALIZADO</option>
          </select>
        </div>

        <div className="mb-6">
          <label
            htmlFor="adminNotes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Observações do Administrador:
          </label>
          <textarea
            id="adminNotes"
            name="adminNotes"
            rows="3"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            placeholder="Adicione notas sobre a análise ou decisão..."
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            Cancelar
          </button>
          <button
            onClick={handleStatusChange}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAdoptionDetails;
