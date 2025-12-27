import { ToastContainer } from 'react-toastify';
import { useQuestionario } from '../hooks/useQuestionario';
import SelectField from './FormFields/SelectField';
import RadioGroupField from './FormFields/RadioGroupField';
import CheckboxField from './FormFields/CheckboxField';
import { Button } from './Button';

const QuestionarioForm = ({ onSuccess, onClose, showTitle = true }) => {
  const { register, handleSubmit, errors, isSubmitting, isEditing } =
    useQuestionario({ onSuccess });

  const criancasOptions = [
    { value: 'NAO', label: 'Não convive com crianças' },
    { value: 'CRIANCAS_PEQUENAS', label: 'Crianças pequenas (até 5 anos)' },
    { value: 'CRIANCAS_MAIORES', label: 'Crianças maiores (6+ anos)' },
  ];

  const moradiaOptions = [
    { value: 'KITNET', label: 'Kitnet' },
    { value: 'APARTAMENTO_PEQUENO', label: 'Apartamento Pequeno' },
    { value: 'APARTAMENTO_GRANDE', label: 'Apartamento Grande' },
    { value: 'CASA_SEM_QUINTAL', label: 'Casa sem Quintal' },
    { value: 'CASA_COM_QUINTAL', label: 'Casa com Quintal' },
  ];

  const porteOptions = [
    { value: '1', label: 'Pequeno' },
    { value: '2', label: 'Médio' },
    { value: '3', label: 'Grande' },
  ];

  const energiaOptions = [
    { value: '1', label: '1 - Baixa (Sedentário/Calmo)' },
    { value: '2', label: '2 - Moderada-Baixa' },
    { value: '3', label: '3 - Moderada' },
    { value: '4', label: '4 - Moderada-Alta' },
    { value: '5', label: '5 - Alta (Atleta/Agitado)' },
  ];

  const tempoOptions = [
    { value: '1', label: '1 a 2 horas/dia' },
    { value: '3', label: '3 a 5 horas/dia' },
    { value: '5', label: 'Mais de 5h/dia' },
  ];

  const experienciaOptions = [
    { value: '1', label: 'Primeiro contato como tutor' },
    { value: '3', label: 'Já teve animais de estimação' },
    { value: '5', label: 'Conhecimento especializado' },
  ];

  const escala1a5Options = [
    { value: '1', label: '1 - Muito Baixa / Pouco' },
    { value: '2', label: '2 - Baixa' },
    { value: '3', label: '3 - Moderada / Médio' },
    { value: '4', label: '4 - Alta' },
    { value: '5', label: '5 - Muito Alta / Muito' },
  ];

  const simNaoOptions = [
    { value: 'true', label: 'Sim' },
    { value: 'false', label: 'Não' },
  ];

  return (
    <>
      <ToastContainer />
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white p-6">
          {showTitle && (
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isEditing ? 'Editar Questionário' : 'Preencher Questionário'}
            </h2>
          )}
          <p className="text-gray-600 mb-6">
            {isEditing
              ? 'Atualize suas preferências para melhorarmos as recomendações.'
              : 'Responda com sinceridade para encontrarmos o pet ideal para você.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Seu Estilo de Vida
              </h3>
              <div className="space-y-4">
                <SelectField
                  id="moradia"
                  label="Tipo de Moradia"
                  register={register}
                  errors={errors}
                  options={moradiaOptions}
                />

                <SelectField
                  id="temCriancas"
                  label="Convívio com Crianças"
                  register={register}
                  errors={errors}
                  options={criancasOptions}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField
                    id="tempoDisponivel"
                    label="Tempo diário livre para o pet"
                    register={register}
                    errors={errors}
                    options={tempoOptions}
                  />

                  <SelectField
                    id="experienciaPets"
                    label="Sua experiência com animais"
                    register={register}
                    errors={errors}
                    options={experienciaOptions}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <RadioGroupField
                    id="possuiCaes"
                    label="Já possui Cães?"
                    options={simNaoOptions}
                    register={register}
                    errors={errors}
                    required={true}
                  />
                  <RadioGroupField
                    id="possuiGatos"
                    label="Já possui Gatos?"
                    options={simNaoOptions}
                    register={register}
                    errors={errors}
                    required={true}
                  />
                  <RadioGroupField
                    id="disposicaoNecessidadesEspeciais"
                    label="Aceita pets especiais?"
                    options={simNaoOptions}
                    register={register}
                    errors={errors}
                    required={true}
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Termos de Adoção Responsável
              </label>
              <div className="space-y-3">
                <CheckboxField
                  id="cienteCustos"
                  name="cienteCustos"
                  label="Estou ciente dos custos financeiros (ração, vacina, vet)."
                  register={register}
                  errors={errors}
                />

                <CheckboxField
                  id="termoCompromissoLongoPrazo"
                  name="termoCompromissoLongoPrazo"
                  label="Entendo que a adoção é um compromisso para a vida toda."
                  register={register}
                  errors={errors}
                />

                <CheckboxField
                  id="termoSaudeBemEstar"
                  name="termoSaudeBemEstar"
                  label="Comprometo-me a zelar pela saúde física e mental do animal."
                  register={register}
                  errors={errors}
                />

                <CheckboxField
                  id="termoPacienciaAdaptacao"
                  name="termoPacienciaAdaptacao"
                  label="Tenho ciência de que a adaptação exige paciência e tempo."
                  register={register}
                  errors={errors}
                />

                <CheckboxField
                  id="termoVistoria"
                  name="termoVistoria"
                  label="Autorizo vistoria no local para averiguação, caso julguem necessário."
                  register={register}
                  errors={errors}
                />

                <CheckboxField
                  id="termoDevolucaoNaoAbandono"
                  name="termoDevolucaoNaoAbandono"
                  label="Comprometo-me a NUNCA abandonar. Se não puder ficar, devolverei ao doador."
                  register={register}
                  errors={errors}
                />

                <CheckboxField
                  id="termoLegislacaoPosseResponsavel"
                  name="termoLegislacaoPosseResponsavel"
                  label="Estou ciente da legislação de maus-tratos e posse responsável."
                  register={register}
                  errors={errors}
                />
              </div>
            </div>

            {/* --- BOTÕES --- */}
            <div className="flex justify-end gap-3 pt-4">
              {onClose && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                confirm={true}
              >
                {isEditing ? 'Salvar Alterações' : 'Finalizar Cadastro'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default QuestionarioForm;
