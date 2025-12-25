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
  FaPrint,
  FaPaw,
  FaMars,
  FaVenus,
  FaSyringe,
  FaRulerVertical,
  FaCheck,
  FaTimes,
  FaNotesMedical,
  FaLock,
} from 'react-icons/fa';
import logo from '../../../assets/logo-pet.png';
import { calculateHumanAge } from '../../../utils/usuario';
import { calculateAge } from '../../../utils/pet';

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
    KITNET: 'Kitnet',
    SITIO: 'Sítio/Chácara',
  };

  const criancasLabels = {
    NAO_POSSUI: 'Não convive com crianças',
    CRIANCAS_PEQUENAS: 'Possui crianças pequenas',
    CRIANCAS_MAIORES: 'Possui crianças maiores',
    VISITAS_FREQUENTES: 'Recebe visitas de crianças',
  };

  const tempoLabels = {
    1: 'Curto (1 a 2 horas livres/dia)',
    3: 'Moderado (3 a 5 horas livres/dia)',
    5: 'Amplo (Mais de 5h)',
  };

  const experienciaLabels = {
    1: 'Nenhuma (Primeiro contato como tutor)',
    3: 'Média (Já tive pets)',
    5: 'Alta (Sei lidar com saúde/comportamento)',
  };

  const renderBool = (value) => (value ? 'Sim' : 'Não');

  const TermItem = ({ label, value }) => (
    <div className="flex items-center gap-2 py-1">
      {value ? (
        <FaCheck className="text-green-500 w-4 h-4 flex-shrink-0" />
      ) : (
        <FaTimes className="text-red-500 w-4 h-4 flex-shrink-0" />
      )}
      <span
        className={`text-sm ${value ? 'text-gray-700' : 'text-gray-400 decoration-line-through'}`}
      >
        {label}
      </span>
    </div>
  );

  const displayDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR');
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

  const handlePrint = () => {
    window.print();
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
    <div className="p-4 sm:p-6 space-y-6" id="adoption-print-area">
      <div className="print:hidden">
        <Breadcrumb
          items={[
            { label: 'Adoções', href: '/admin/adocoes' },
            { label: `Solicitação #${request.id}` },
          ]}
        />
      </div>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            Detalhes da Solicitação{' '}
            <span className="text-gray-400 font-normal text-xl print:hidden">
              #{request.id}
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Solicitado em:{' '}
            {new Date(request.createdAt).toLocaleDateString('pt-BR')} às{' '}
            {new Date(request.createdAt).toLocaleTimeString('pt-BR')}
          </p>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          <div className="mr-2">
            <AdocaoStatusBadge status={request.status} />
          </div>
        </div>
      </header>

      <div className="space-y-6">
        <Panel title={'Informações do Animal'}>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={animal.imagemPath || logo}
                alt={animal.nome}
                className="h-32 w-32 md:h-40 md:w-40 rounded-lg object-cover border border-gray-200 shadow-sm"
              />
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row justify-between items-start mb-4 border-b pb-2">
                <Link
                  to={`/admin/pets/${animal.id}`}
                  target="_blank"
                  className="text-2xl font-bold text-blue-600 hover:underline print:text-black print:no-underline"
                >
                  {animal.nome}
                </Link>
                <div className="text-sm text-gray-500 mt-1 md:mt-0 flex items-center gap-1">
                  <FaPaw /> {animal.tipo}
                </div>
              </div>

              {/* Grid de Características Básicas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Sexo
                  </span>
                  <div className="flex items-center gap-2 font-medium text-gray-800">
                    {animal.sexo === 'FEMEA' ? (
                      <FaVenus className="text-pink-500" />
                    ) : (
                      <FaMars className="text-blue-500" />
                    )}
                    {animal.sexo}
                  </div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Idade
                  </span>
                  <div className="flex items-center gap-2 font-medium text-gray-800">
                    <FaCalendarAlt className="text-gray-400" />
                    {calculateAge(animal.dataNascimentoAproximada)}
                  </div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Porte
                  </span>
                  <div className="flex items-center gap-2 font-medium text-gray-800">
                    <FaRulerVertical className="text-gray-400" />
                    {animal.porte}
                  </div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Raça
                  </span>
                  <div className="flex items-center gap-2 font-medium text-gray-800">
                    {animal.raca || 'SRD'}
                  </div>
                </div>
              </div>

              {/* Seção de Saúde */}
              <h4 className="font-bold text-gray-700 text-sm border-b pb-1 mb-2 mt-4 flex items-center gap-2">
                <FaSyringe className="text-gray-400" /> Dados Clínicos
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div className="bg-gray-50 p-2 rounded border border-gray-100">
                  <span className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Castrado?
                  </span>
                  <span
                    className={`font-bold ${animal.castrado ? 'text-green-600' : 'text-orange-600'}`}
                  >
                    {animal.castrado ? 'SIM' : 'NÃO'}
                  </span>
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-100">
                  <span className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Vermifugação
                  </span>
                  <span className="text-gray-800">
                    {displayDate(animal.dataUltimaVermifugacao)}
                  </span>
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-100">
                  <span className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Antirrábica
                  </span>
                  <span className="text-gray-800">
                    {displayDate(animal.dataUltimaVacinaAntirrabica)}
                  </span>
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-100">
                  <span className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Vac. Múltipla{' '}
                    {animal.tipoVacinaMultipla &&
                      `(${animal.tipoVacinaMultipla})`}
                  </span>
                  <span className="text-gray-800">
                    {displayDate(animal.dataUltimaVacinaMultipla)}
                  </span>
                </div>
              </div>

              {animal.observacoesMedicas && (
                <div className="grid grid-cols-1 gap-3 mt-4">
                  <div className="p-3 bg-gray-50 rounded border border-gray-200">
                    <span className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase mb-1">
                      <FaNotesMedical /> Observações Médicas
                    </span>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">
                      {animal.observacoesMedicas}
                    </p>
                  </div>
                </div>
              )}

              {animal.observacoesPrivadas && (
                <div className="grid grid-cols-1 gap-3 mt-4">
                  <div className="p-3 bg-gray-50 rounded border border-gray-200">
                    <span className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase mb-1">
                      <FaLock /> Observações Internas
                    </span>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">
                      {animal.observacoesPrivadas}
                    </p>
                  </div>
                </div>
              )}

              {animal.caracteristicas && animal.caracteristicas.length > 0 && (
                <div className="mt-4 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-2">
                    Características:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {animal.caracteristicas.map((char) => (
                      <span
                        key={char.id}
                        className="px-2 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-md"
                      >
                        {char.nome}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Panel>

        <Panel title={'Informações do Adotante'}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-500 flex items-center gap-2 mb-1">
                <FaUser /> Nome Completo
              </p>
              <Link
                to={`/admin/usuarios/${usuario.id}`}
                target="_blank"
                className="text-lg text-blue-600 hover:underline print:text-black print:no-underline font-medium"
              >
                {usuario.nome}
              </Link>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 flex items-center gap-2 mb-1">
                <FaEnvelope /> E-mail
              </p>
              <a
                href={`mailto:${usuario.email}`}
                className="text-lg text-gray-800 hover:text-blue-600 hover:underline break-all"
              >
                {usuario.email}
              </a>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 flex items-center gap-2 mb-1">
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
              <p className="text-sm font-semibold text-gray-500 flex items-center gap-2 mb-1">
                <FaCalendarAlt /> Idade
              </p>
              <p className="text-gray-800">
                {calculateHumanAge(usuario.dataNascimento)} anos
              </p>
            </div>
            <div className="lg:col-span-2">
              <p className="text-sm font-semibold text-gray-500 flex items-center gap-2 mb-1">
                <FaMapMarkerAlt /> Localização
              </p>
              <p className="text-lg text-gray-800">
                {renderLocalizacao(usuario)}
              </p>
            </div>
          </div>
        </Panel>

        <Panel title={'Questionário de Pré-Adoção'}>
          <div className="space-y-4 text-gray-700 text-sm">
            {questionario ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="p-2 border-l-4 border-gray-200 bg-gray-50">
                    <div className="font-bold text-gray-500 text-xs uppercase mb-1">
                      Moradia
                    </div>
                    <div className="text-base text-gray-900 font-medium">
                      {moradiaLabels[questionario.moradia] ||
                        questionario.moradia}
                    </div>
                  </div>

                  <div className="p-2 border-l-4 border-gray-200 bg-gray-50">
                    <div className="font-bold text-gray-500 text-xs uppercase mb-1">
                      Crianças em casa
                    </div>
                    <div className="text-base text-gray-900 font-medium">
                      {criancasLabels[questionario.temCriancas] ||
                        questionario.temCriancas}
                    </div>
                  </div>

                  <div className="p-2 border-l-4 border-gray-200 bg-gray-50">
                    <div className="font-bold text-gray-500 text-xs uppercase mb-1">
                      Tempo Disponível
                    </div>
                    <div className="text-base text-gray-900 font-medium">
                      {tempoLabels[questionario.tempoDisponivel] ||
                        `${questionario.tempoDisponivel}`}
                    </div>
                  </div>

                  <div className="p-2 border-l-4 border-gray-200 bg-gray-50">
                    <div className="font-bold text-gray-500 text-xs uppercase mb-1">
                      Experiência com Pets
                    </div>
                    <div className="text-base text-gray-900 font-medium">
                      {experienciaLabels[questionario.experienciaPets] ||
                        `${questionario.experienciaPets}`}
                    </div>
                  </div>
                </div>

                <h4 className="font-bold text-gray-700 mt-4 mb-2 border-b pb-1">
                  Convivência e Perfil
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <span className="block text-xs font-bold text-gray-500 mb-1">
                      Possui Cães?
                    </span>
                    <span
                      className={`font-bold ${questionario.possuiCaes ? 'text-blue-600' : 'text-gray-600'}`}
                    >
                      {renderBool(questionario.possuiCaes)}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <span className="block text-xs font-bold text-gray-500 mb-1">
                      Possui Gatos?
                    </span>
                    <span
                      className={`font-bold ${questionario.possuiGatos ? 'text-blue-600' : 'text-gray-600'}`}
                    >
                      {renderBool(questionario.possuiGatos)}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-center col-span-2">
                    <span className="block text-xs font-bold text-gray-500 mb-1">
                      Disposto a Nec. Especiais?
                    </span>
                    <span
                      className={`font-bold ${questionario.disposicaoNecessidadesEspeciais ? 'text-green-600' : 'text-gray-600'}`}
                    >
                      {renderBool(questionario.disposicaoNecessidadesEspeciais)}
                    </span>
                  </div>
                </div>

                <h4 className="font-bold text-gray-700 mt-4 mb-2 border-b pb-1">
                  Compromissos e Termos
                </h4>
                <div className="bg-gray-50 rounded p-4 border border-gray-100">
                  <div className="mb-3">
                    <span className="font-bold text-gray-700 mr-2">
                      Ciente dos Custos Financeiros?
                    </span>
                    <span
                      className={`font-bold ${questionario.cienteCustos ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {renderBool(questionario.cienteCustos)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <TermItem
                      label="Compromisso de Longo Prazo"
                      value={questionario.termoCompromissoLongoPrazo}
                    />
                    <TermItem
                      label="Saúde e Bem-Estar"
                      value={questionario.termoSaudeBemEstar}
                    />
                    <TermItem
                      label="Paciência na Adaptação"
                      value={questionario.termoPacienciaAdaptacao}
                    />
                    <TermItem
                      label="Concordância com Vistoria"
                      value={questionario.termoVistoria}
                    />
                    <TermItem
                      label="Não Abandono (Devolução)"
                      value={questionario.termoDevolucaoNaoAbandono}
                    />
                    <TermItem
                      label="Legislação Posse Responsável"
                      value={questionario.termoLegislacaoPosseResponsavel}
                    />
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500 italic">
                Usuário não respondeu o questionário.
              </p>
            )}
          </div>
        </Panel>

        <div className="print:hidden">
          <Panel title={'Ações Administrativas'}>
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
    </div>
  );
};

export default AdoptionDetailsPage;
