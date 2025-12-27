import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  getAdoptionById,
  updateAdoptionStatus,
} from '../../../services/ApiAdmin';
import { showToast } from '../../../utils/toast';
import Breadcrumb from '../../../components/Breadcrumb';
import AdocaoStatusBadge from '../../../components/AdocaoStatusBadge';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMars,
  FaVenus,
  FaCheck,
  FaTimes,
  FaNotesMedical,
  FaLock,
  FaHome,
  FaChild,
  FaClock,
  FaPaw,
  FaMoneyBillWave,
  FaInfoCircle,
  FaSave,
  FaArrowLeft,
} from 'react-icons/fa';
import logo from '../../../assets/logo-pet.png';
import { calculateHumanAge } from '../../../utils/usuario';
import { calculateAge } from '../../../utils/pet';

const InfoCard = ({ icon: Icon, label, value, subValue, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    gray: 'bg-gray-100 text-gray-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-white hover:shadow-sm transition-shadow">
      <div className={`p-2 rounded-lg ${colorClasses[color]} flex-shrink-0`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className="font-medium text-gray-900 text-sm">{value}</p>
        {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
      </div>
    </div>
  );
};

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
    <Icon className="text-gray-400" />
    <h2 className="text-lg font-bold text-gray-800">{title}</h2>
  </div>
);

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
    CASA_QUINTAL_TOTALMENTE_FECHADO: 'Casa c/ quintal fechado',
    CASA_QUINTAL_ABERTO: 'Casa c/ quintal aberto',
    CASA_SEM_QUINTAL: 'Casa sem quintal',
    APARTAMENTO: 'Apartamento',
    KITNET: 'Kitnet',
    SITIO: 'Sítio/Chácara',
  };

  const criancasLabels = {
    NAO_POSSUI: 'Não convive',
    CRIANCAS_PEQUENAS: 'Tem crianças pequenas',
    CRIANCAS_MAIORES: 'Tem crianças maiores',
    VISITAS_FREQUENTES: 'Recebe visitas',
  };

  const tempoLabels = {
    1: '1 a 2 horas/dia',
    3: '3 a 5 horas/dia',
    5: 'Mais de 5h/dia',
  };

  const displayDate = (dateString) => {
    if (!dateString) return null;
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

  const renderLocalizacao = (user) => {
    const parts = [user.localidade, user.uf];
    return parts.filter(Boolean).join('/') || 'Não informado';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <AiOutlineLoading3Quarters className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="p-8 text-center max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="text-red-500 text-xl font-bold mb-2">Ops!</div>
        <p className="text-gray-600 mb-6">
          {error || 'Solicitação não encontrada'}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline"
        >
          Voltar
        </button>
      </div>
    );
  }

  const { animal, usuario } = request;
  const { questionario } = request.usuario;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-24">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: 'Adoções', href: '/admin/adocoes' },
            { label: `Solicitação #${request.id}` },
          ]}
        />
      </div>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Solicitação de Adoção
            </h1>
            <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded font-mono border border-gray-200">
              #{request.id}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Solicitado em{' '}
            {new Date(request.createdAt).toLocaleDateString('pt-BR')} às{' '}
            {new Date(request.createdAt).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        <div className="scale-110 origin-right">
          <AdocaoStatusBadge status={request.status} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
          <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-gray-100">
            <div className="w-32 h-32 mb-4">
              <img
                src={animal.imagemPath || logo}
                alt={animal.nome}
                className="w-full h-full object-cover rounded-full border-4 border-white shadow-md"
              />
            </div>

            <Link
              to={`/admin/pets/${animal.id}`}
              target="_blank"
              className="text-2xl font-bold text-gray-900 hover:text-blue-600 hover:underline mb-1"
            >
              {animal.nome}
            </Link>
            <p className="text-gray-500 font-medium">
              {animal.raca || 'SRD'} • {animal.porte}
            </p>

            <div className="flex items-center gap-2 mt-3">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${animal.sexo === 'FEMEA' ? 'bg-pink-50 text-pink-700' : 'bg-blue-50 text-blue-700'}`}
              >
                {animal.sexo === 'FEMEA' ? (
                  <FaVenus size={11} />
                ) : (
                  <FaMars size={11} />
                )}{' '}
                {animal.sexo === 'FEMEA' ? 'Fêmea' : 'Macho'}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 uppercase tracking-wide">
                {calculateAge(animal.dataNascimentoAproximada)}
              </span>
            </div>
          </div>

          <div className="space-y-8 flex-1">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">
                Protocolo de Saúde
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-sm font-medium text-gray-600">
                    Castrado
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${animal.castrado ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}
                  >
                    {animal.castrado ? 'SIM' : 'NÃO'}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">
                      Vacina Antirrábica
                    </span>
                    <span
                      className={`text-sm font-medium ${displayDate(animal.dataUltimaVacinaAntirrabica) ? 'text-gray-900' : 'text-gray-400 italic'}`}
                    >
                      {displayDate(animal.dataUltimaVacinaAntirrabica) ||
                        'Não registrada'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">
                      Vacina Múltipla (V8/V10)
                    </span>
                    <span
                      className={`text-sm font-medium ${displayDate(animal.dataUltimaVacinaMultipla) ? 'text-gray-900' : 'text-gray-400 italic'}`}
                    >
                      {displayDate(animal.dataUltimaVacinaMultipla) ||
                        'Não registrada'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">
                      Vermifugação
                    </span>
                    <span
                      className={`text-sm font-medium ${displayDate(animal.dataUltimaVermifugacao) ? 'text-gray-900' : 'text-gray-400 italic'}`}
                    >
                      {displayDate(animal.dataUltimaVermifugacao) ||
                        'Não registrada'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {animal.caracteristicas && animal.caracteristicas.length > 0 && (
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase mb-2 block">
                  Temperamento
                </span>
                <div className="flex flex-wrap gap-2">
                  {animal.caracteristicas.map((char) => (
                    <span
                      key={char.id}
                      className="px-2.5 py-1 bg-white text-gray-600 text-xs font-medium rounded-md border border-gray-200 shadow-sm"
                    >
                      {char.nome}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {animal.observacoesMedicas && (
              <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-sm">
                <span className="font-bold text-red-700 flex items-center gap-2 mb-2">
                  <FaNotesMedical /> Atenção Médica
                </span>
                <p className="text-red-800 leading-relaxed">
                  {animal.observacoesMedicas}
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <Link
              to={`/admin/pets/${animal.id}`}
              target="_blank"
              className="text-blue-600 text-xs font-bold hover:underline uppercase tracking-wide flex items-center justify-center gap-2"
            >
              Ver ficha completa do pet <FaPaw />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <SectionTitle icon={FaUser} title="Dados do Solicitante" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard
                icon={FaUser}
                label="Nome Completo"
                value={usuario.nome}
              />
              <InfoCard icon={FaEnvelope} label="Email" value={usuario.email} />
              <InfoCard
                icon={FaPhone}
                label="Telefone/WhatsApp"
                value={usuario.telefone || 'Não informado'}
                color="green"
              />
              <InfoCard
                icon={FaMapMarkerAlt}
                label="Localização"
                value={renderLocalizacao(usuario)}
                color="orange"
              />
              <InfoCard
                icon={FaCalendarAlt}
                label="Idade"
                value={
                  usuario.dataNascimento
                    ? `${calculateHumanAge(usuario.dataNascimento)} anos`
                    : 'Não informada'
                }
                color="gray"
              />
              <div className="flex items-center justify-center md:justify-end">
                <Link
                  to={`/admin/usuarios/${usuario.id}`}
                  target="_blank"
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  Ver perfil do usuário &rarr;
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <SectionTitle
              icon={FaNotesMedical}
              title="Questionário de Pré-Adoção"
            />

            {questionario ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pl-1">
                    Estilo de Vida & Ambiente
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InfoCard
                      icon={FaHome}
                      label="Moradia"
                      value={
                        moradiaLabels[questionario.moradia] ||
                        questionario.moradia
                      }
                      color="purple"
                    />
                    <InfoCard
                      icon={FaChild}
                      label="Crianças"
                      value={
                        criancasLabels[questionario.temCriancas] ||
                        questionario.temCriancas
                      }
                      color="purple"
                    />
                    <InfoCard
                      icon={FaClock}
                      label="Tempo Livre"
                      value={
                        tempoLabels[questionario.tempoDisponivel] ||
                        questionario.tempoDisponivel
                      }
                      color="purple"
                    />
                    <InfoCard
                      icon={FaPaw}
                      label="Experiência"
                      value={`${questionario.experienciaPets}/5`}
                      subValue="Nível de conhecimento"
                      color="purple"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pl-1 mt-2">
                    Convivência
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div
                      className={`p-3 rounded-lg border text-center ${questionario.possuiCaes ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
                    >
                      <span className="block text-xs font-bold uppercase mb-1">
                        Cães
                      </span>
                      {questionario.possuiCaes ? (
                        <FaCheck className="inline" />
                      ) : (
                        <FaTimes className="inline" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-lg border text-center ${questionario.possuiGatos ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
                    >
                      <span className="block text-xs font-bold uppercase mb-1">
                        Gatos
                      </span>
                      {questionario.possuiGatos ? (
                        <FaCheck className="inline" />
                      ) : (
                        <FaTimes className="inline" />
                      )}
                    </div>
                    <div
                      className={`col-span-2 p-3 rounded-lg border flex items-center justify-between px-4 ${questionario.disposicaoNecessidadesEspeciais ? 'bg-green-50 border-green-100 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-500'}`}
                    >
                      <span className="text-xs font-bold uppercase text-left">
                        Aceita Nec. Especiais?
                      </span>
                      {questionario.disposicaoNecessidadesEspeciais ? (
                        <span className="font-bold">SIM</span>
                      ) : (
                        <span>NÃO</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className={`mt-0.5 p-1.5 rounded-full ${questionario.cienteCustos ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                    >
                      <FaMoneyBillWave />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        Ciente dos Custos Financeiros
                      </p>
                      <p className="text-xs text-gray-500">
                        O adotante declarou estar ciente que um animal gera
                        despesas.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-200">
                    {[
                      {
                        label: 'Compromisso Longo Prazo',
                        val: questionario.termoCompromissoLongoPrazo,
                      },
                      { label: 'Vistoria', val: questionario.termoVistoria },
                      {
                        label: 'Não Abandono',
                        val: questionario.termoDevolucaoNaoAbandono,
                      },
                      {
                        label: 'Posse Responsável',
                        val: questionario.termoLegislacaoPosseResponsavel,
                      },
                    ].map((t, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm"
                      >
                        {t.val ? (
                          <FaCheck className="text-green-500 text-xs" />
                        ) : (
                          <FaTimes className="text-red-500 text-xs" />
                        )}
                        <span
                          className={
                            t.val
                              ? 'text-gray-700'
                              : 'text-gray-400 line-through'
                          }
                        >
                          {t.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <FaInfoCircle
                  className="mx-auto mb-2 text-gray-400"
                  size={24}
                />
                Usuário não respondeu o questionário.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
        <SectionTitle icon={FaLock} title="Área Administrativa" />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <label
              htmlFor="adminNotes"
              className="block text-xs font-bold text-gray-500 uppercase mb-2"
            >
              Observações Internas (Não visível ao usuário)
            </label>
            <textarea
              id="adminNotes"
              rows="3"
              value={adminNotes}
              disabled={isSaving}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm bg-gray-50 p-3"
              placeholder="Adicione notas sobre a análise, tentativas de contato, motivos de recusa, etc."
            ></textarea>
          </div>

          <div className="w-full lg:w-72 flex flex-col gap-4">
            <div>
              <label
                htmlFor="newStatus"
                className="block text-xs font-bold text-gray-500 uppercase mb-2"
              >
                Atualizar Status
              </label>
              <div className="relative">
                <select
                  id="newStatus"
                  disabled={!!request.concluidoEm || isSaving}
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 pl-3 pr-10 text-sm"
                >
                  <option value="PENDENTE">PENDENTE</option>
                  <option value="EM_ANALISE">EM ANÁLISE</option>
                  <option value="APROVADO">APROVADO</option>
                  <option value="RECUSADO">RECUSADO</option>
                  <option value="FINALIZADO">FINALIZADO</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleStatusChange}
              disabled={isSaving}
              className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg font-bold text-white shadow-md transition-all ${
                isSaving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform active:scale-95'
              }`}
            >
              {isSaving ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                <FaSave />
              )}
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>

            <button
              onClick={() => navigate(-1)}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors text-sm"
            >
              <FaArrowLeft size={12} /> Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdoptionDetailsPage;
