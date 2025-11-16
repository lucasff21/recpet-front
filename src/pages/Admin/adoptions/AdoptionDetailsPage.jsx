import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  getAdoptionById,
  updateAdoptionStatus,
} from '../../../services/ApiAdmin';
import { showToast } from '../../../utils/toast';
import Panel from '../../../components/Panel';
import Breadcrumb from '../../../components/Breadcrumb';
import AdocaoStatusBadge from '../../../components/AdocaoStatusBadge';
import { Button } from '../../../components/Button';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from 'react-icons/fa';
import logo from '../../../assets/logo-pet.png';
import { calculateHumanAge } from '../../../utils/usuario';

const AdoptionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const moradiaLabels = {
    CASA_QUINTAL_TOTALMENTE_FECHADO: 'Casa com quintal totalmente fechado',
    CASA_QUINTAL_ABERTO: 'Casa com quintal aberto',
    CASA_SEM_QUINTAL: 'Casa sem quintal',
    APARTAMENTO: 'Apartamento',
  };

  const renderBool = (value) => {
    return value ? 'Sim' : 'Não';
  };

  const fetchAdoptionDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdoptionById(id);
      setRequest(response.data);
      setNewStatus(response.data.status);
      setAdminNotes(response.data.observacoes || '');
    } catch (err) {
      showToast('Erro ao buscar detalhes da solicitação', 'error');
      setError('Solicitação não encontrada.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAdoptionDetails();
  }, [fetchAdoptionDetails]);

  const handleStatusChange = () => {
    if (isSaving) return;
    setIsSaving(true);

    const payload = {
      status: newStatus,
      observacoes: adminNotes,
    };

    updateAdoptionStatus(request.id, payload)
      .then(() => {
        showToast('Solicitação atualizada com sucesso', 'success');
        fetchAdoptionDetails();
      })
      .catch((err) => {
        showToast('Erro ao atualizar as informações', 'error');
        console.error(err);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const renderLocalizacao = (user) => {
    const parts = [user.localidade, user.uf];
    return parts.filter(Boolean).join('/') || 'Não informado';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <AiOutlineLoading3Quarters className="animate-spin w-8 h-8 text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Breadcrumb
          items={[
            { label: 'Adoções', href: '/admin/adocoes' },
            { label: 'Detalhes' },
          ]}
        />
        <Panel>
          <p className="text-center text-red-500">{error}</p>
        </Panel>
      </div>
    );
  }

  if (!request) return null;

  const { animal, usuario } = request;
  const { questionario } = request.usuario;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Breadcrumb
        items={[
          { label: 'Adoções', href: '/admin/adocoes' },
          { label: `Solicitação #${request.id}` },
        ]}
      />

      <header>
        <h1 className="text-3xl font-bold text-gray-800">
          Detalhes da Solicitação de Adoção
        </h1>
      </header>

      <div className="space-y-6">
        <Panel title={'Informações Principais'}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src={animal.imagemPath || logo}
                  alt={animal.nome}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div>
                  <Link
                    to={`/admin/pets/${animal.id}`}
                    target="_blank"
                    className="text-lg font-semibold text-blue-600 hover:underline"
                  >
                    {animal.nome}
                  </Link>
                  <p className="text-sm text-gray-500">{animal.tipo}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Status:</p>
              <AdocaoStatusBadge status={request.status} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Data da Solicitação:
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(request.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </Panel>

        <Panel title={'Informações do Adotante'}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <FaUser /> Nome
              </p>
              <Link
                to={`/admin/usuarios/${usuario.id}`}
                target="_blank"
                className="text-lg text-blue-600 hover:underline"
              >
                {usuario.nome}
              </Link>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <FaEnvelope /> E-mail
              </p>
              <a
                href={`mailto:${usuario.email}`}
                className="text-lg text-gray-800 hover:text-blue-600 hover:underline"
              >
                {usuario.email}
              </a>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <FaPhone /> Telefone
              </p>
              {usuario.telefone ? (
                <a
                  href={`https://api.whatsapp.com/send?phone=55${usuario.telefone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg text-gray-800 hover:text-blue-600 hover:underline"
                >
                  {usuario.telefone}
                </a>
              ) : (
                <p className="text-lg text-gray-800">Não informado</p>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <FaCalendarAlt /> Idade
              </p>
              <p>{calculateHumanAge(usuario.dataNascimento)}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                <FaMapMarkerAlt /> Localização
              </p>
              <p className="text-lg text-gray-800">
                {renderLocalizacao(usuario)}
              </p>
            </div>
          </div>
        </Panel>

        <Panel title={'Questionário do Adotante'}>
          <div className="space-y-2 text-gray-700 text-sm">
            {questionario ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                <div>
                  <div className="font-semibold text-gray-500">Moradia:</div>
                  <div className="text-base text-gray-900">
                    {moradiaLabels[questionario.moradia] ||
                      questionario.moradia}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-gray-500">
                    Telas de Proteção:
                  </div>
                  <div className="text-base text-gray-900">
                    {renderBool(questionario.telasProtecao)}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-gray-500">
                    Todos de Acordo:
                  </div>
                  <div className="text-base text-gray-900">
                    {renderBool(questionario.todosDeAcordo)}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-gray-500">
                    Ciente dos Custos:
                  </div>
                  <div className="text-base text-gray-900">
                    {renderBool(questionario.cienteCustos)}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="font-semibold text-gray-500">
                    Animais em casa:
                  </div>
                  <div className="text-base text-gray-900">
                    {questionario.qtdCaes} Cães, {questionario.qtdGatos} Gatos,{' '}
                    {questionario.qtdOutros} Outros
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-gray-500">
                    Termos de Adoção:
                  </div>
                  <div className="text-base text-green-600 font-medium">
                    Aceitos
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">
                Usuário não respondeu o questionário.
              </p>
            )}
          </div>
        </Panel>

        <Panel title={'Ações'}>
          <div className="mb-6">
            <label
              htmlFor="newStatus"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Alterar Status
            </label>
            <select
              id="newStatus"
              disabled={!!request.concluidoEm || isSaving}
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
              rows="4"
              value={adminNotes}
              disabled={isSaving}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              placeholder="Adicione notas sobre a análise ou decisão..."
            ></textarea>
          </div>

          <div className="flex flex-col space-y-3">
            <Button
              onClick={handleStatusChange}
              disabled={isSaving}
              loading={isSaving}
              text={isSaving ? 'Salvando...' : 'Salvar Alterações'}
              confirm
            />
            <Button
              onClick={() => navigate(-1)}
              disabled={isSaving}
              text="Voltar"
            />
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default AdoptionDetailsPage;
