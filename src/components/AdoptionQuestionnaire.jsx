import React from 'react';
import {
  FaHome,
  FaChild,
  FaClock,
  FaPaw,
  FaCheck,
  FaTimes,
  FaMoneyBillWave,
  FaInfoCircle,
} from 'react-icons/fa';

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

const AdoptionQuestionnaire = ({ questionario }) => {
  const moradiaLabels = {
    KITNET: 'Kitnet',
    APARTAMENTO_PEQUENO: 'Apartamento Pequeno',
    APARTAMENTO_GRANDE: 'Apartamento Grande',
    CASA_SEM_QUINTAL: 'Casa sem Quintal',
    CASA_COM_QUINTAL: 'Casa com Quintal',
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

  const experienciaLabels = {
    1: 'Primeiro contato como tutor',
    3: 'Já teve animais de estimação',
    5: 'Conhecimento especializado',
  };

  if (!questionario) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <FaInfoCircle className="mx-auto mb-2 text-gray-400" size={24} />
        Usuário não respondeu o questionário.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pl-1">
          Estilo de Vida & Ambiente
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InfoCard
            icon={FaHome}
            label="Moradia"
            value={moradiaLabels[questionario.moradia] || questionario.moradia}
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
            label="Experiência com Pets"
            value={
              experienciaLabels[questionario.experienciaPets] ||
              `${questionario.experienciaPets}/5`
            }
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
            <span className="block text-xs font-bold uppercase mb-1">Cães</span>
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
              O adotante declarou estar ciente que um animal gera despesas.
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
            <div key={idx} className="flex items-center gap-2 text-sm">
              {t.val ? (
                <FaCheck className="text-green-500 text-xs" />
              ) : (
                <FaTimes className="text-red-500 text-xs" />
              )}
              <span
                className={
                  t.val ? 'text-gray-700' : 'text-gray-400 line-through'
                }
              >
                {t.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdoptionQuestionnaire;
