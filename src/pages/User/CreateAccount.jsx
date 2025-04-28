import AccountStep from '../../components/CreateAccountForm/AccountStep';
import PersonalStep from '../../components/CreateAccountForm/PersonalStep';
import AddressStep from '../../components/CreateAccountForm/AddressStep';
import ProgressIndicator from '../../components/CreateAccountForm/ProgressIndicator';
import { usePersonalForm } from '../../hooks/usePersonalForm';
import Layout from '../../components/Layout';

const CreateAccountForm = () => {
  const {
    errors,
    register,
    handleSubmit,
    watch,
    setCurrentStep,
    currentStep,
    loading,
    handleFormSubmit,
  } = usePersonalForm();

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);
  const goToStep = (step) => {
    if (canProceed(step)) {
      setCurrentStep(step);
    }
  };

  const minDate18YearsOld = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  };

  const canProceed = (step) => {
    const values = watch();
    const requiredFields = {
      1: ['email', 'confirmEmail', 'password', 'confirmPassword'],
      2: ['fullName', 'cpf', 'birthDate', 'phone', 'gender'],
      3: ['zipCode', 'street', 'district', 'state', 'city'],
    };
    return requiredFields[step].every(
      (field) => !!values[field] && !errors[field]
    );
  };

  return (
    <Layout showFooter={true}>
      <div className="w-[330px] md:w-[700px] p-6">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Crie sua conta
          </h1>
          <ProgressIndicator currentStep={currentStep} goToStep={goToStep} />
        </header>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6"
        >
          {currentStep === 1 && (
            <AccountStep register={register} errors={errors} />
          )}

          {currentStep === 2 && (
            <PersonalStep
              register={register}
              errors={errors}
              minDate={minDate18YearsOld()}
            />
          )}

          {currentStep === 3 && (
            <AddressStep register={register} errors={errors} />
          )}
        </form>

        <div className="col-span-full flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={prevStep}
              disabled={loading}
            >
              Voltar
            </button>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              className="bg-cyan-950 hover:bg-cyan-900 px-6 py-2 text-white rounded-md disabled:opacity-50"
              onClick={nextStep}
              disabled={!canProceed(currentStep)}
            >
              Próximo
            </button>
          ) : (
            <button
              type="submit"
              className="bg-cyan-950 hover:bg-cyan-900 px-6 py-2 text-white rounded-md disabled:opacity-50"
              disabled={!canProceed(3) || loading}
              onClick={handleSubmit(handleFormSubmit)}
            >
              Cadastrar
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CreateAccountForm;
