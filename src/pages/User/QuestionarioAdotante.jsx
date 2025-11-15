import Layout from '../../components/Layout';
import { ToastContainer } from 'react-toastify';
import { useQuestionario } from '../../hooks/useQuestionario';
import SelectField from '../../components/FormFields/SelectField';
import RadioGroupField from '../../components/FormFields/RadioGroupField';
import InputField from '../../components/FormFields/InputField';
import CheckboxField from '../../components/FormFields/CheckboxField';
import { Button } from '../../components/Button';

const QuestionarioAdotante = () => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isEditing,
  } = useQuestionario();

  const moradiaOptions = [
    { value: 'CASA_QUINTAL_TOTALMENTE_FECHADO', label: 'Casa com quintal totalmente fechado' },
    { value: 'CASA_QUINTAL_ABERTO', label: 'Casa com quintal aberto' },
    { value: 'CASA_SEM_QUINTAL', label: 'Casa sem quintal' },
    { value: 'APARTAMENTO', label: 'Apartamento' },
  ];

  const simNaoOptions = [
    { value: 'true', label: 'Sim' },
    { value: 'false', label: 'Não' },
  ];

  return (
    <Layout showFooter={false}>
      <ToastContainer />
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isEditing ? 'Editar Questionário de Adoção' : 'Questionário de Adoção'}
          </h2>
          <p className="text-gray-600 mb-6">
            {isEditing 
              ? 'Atualize suas informações de adoção abaixo.' 
              : 'Preencha as informações abaixo para iniciar o processo de adoção.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <SelectField
              id="moradia"
              label="Sua moradia é"
              register={register}
              errors={errors}
              options={moradiaOptions}
            />

            <RadioGroupField
              id="telasProtecao"
              label="Janelas e sacadas possuem telas ou grades de proteção?"
              options={simNaoOptions}
              register={register}
              errors={errors}
            />

            <RadioGroupField
              id="todosDeAcordo"
              label="Todos na sua casa estão de acordo com a adoção?"
              options={simNaoOptions}
              register={register}
              errors={errors}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quais animais você já tem em casa?
              </label>
              <div className="grid grid-cols-3 gap-3">
                <InputField
                  id="qtdCaes"
                  label="Cães"
                  type="number"
                  register={register}
                  errors={errors}
                  required={false}
                />
                <InputField
                  id="qtdGatos"
                  label="Gatos"
                  type="number"
                  register={register}
                  errors={errors}
                  required={false}
                />
                <InputField
                  id="qtdOutros"
                  label="Outros"
                  type="number"
                  register={register}
                  errors={errors}
                  required={false}
                />
              </div>
            </div>

            <RadioGroupField
              id="cienteCustos"
              label="Você pode incluir os custos de um animal (ração, vacinas, veterinário) no seu orçamento?"
              options={simNaoOptions}
              register={register}
              errors={errors}
            />

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Pilares da Adoção Responsável
              </label>
              <div className="space-y-3">
                <CheckboxField
                  id="termoCompromissoLongoPrazo"
                  name="termoCompromissoLongoPrazo"
                  label="Entendo que um animal pode viver mais de 15 anos e é um compromisso para a vida toda."
                  register={register}
                  errors={errors}
                />
                
                <CheckboxField
                  id="termoSaudeBemEstar"
                  name="termoSaudeBemEstar"
                  label="Comprometo-me a zelar pela saúde e bem-estar do animal."
                  register={register}
                  errors={errors}
                />
                
                <CheckboxField
                  id="termoPacienciaAdaptacao"
                  name="termoPacienciaAdaptacao"
                  label="Entendo que o animal precisará de paciência e carinho para se adaptar."
                  register={register}
                  errors={errors}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              confirm={true}
            >
              {isEditing ? 'Atualizar Questionário' : 'Enviar Questionário'}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default QuestionarioAdotante;
