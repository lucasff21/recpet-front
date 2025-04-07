import { useState } from 'react';
import AccountStep from './AccountStep';
import PersonalStep from './PersonalStep';
import AddressStep from './AddressStep';
import ProgressIndicator from './ProgressIndicator';
import { usePersonalForm } from '../../hooks/usePersonalForm';
import Layout from "../Layout";

const CreateAccountForm = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const {
        errors,
        register,
        handleSubmit,
        handleFormSubmit,
        handleClear,
        ufs,
        cities,
        watch
    } = usePersonalForm();

    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => setCurrentStep(currentStep - 1);
    const goToStep = (step) => setCurrentStep(step);

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
            3: ['zipCode', 'street', 'district', 'state', 'city']
        };
    
        const section = step === 3 ? 'address' : 'personalData';
    
        return requiredFields[step].every(field =>
            !!values[section]?.[field] &&
            !errors[section]?.[field]
        );
    };
    

    return (
        <Layout showFooter={true}>
            <div className="w-[330px] md:w-[700px] p-6">
                <header className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Crie sua conta</h1>
                    <ProgressIndicator currentStep={currentStep} goToStep={goToStep} />
                </header>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
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
                        <AddressStep
                            register={register}
                            errors={errors}
                            ufs={ufs}
                            cities={cities}
                        />
                    )}

                    <div className="col-span-full flex justify-between mt-8">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Voltar
                            </button>
                        )}

                        {currentStep < 3 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="px-6 py-2 bg-black text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                disabled={!canProceed(currentStep)}
                            >
                                Próximo
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="px-6 py-2 bg-black text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                disabled={!canProceed(3)}
                            >
                                Cadastrar
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default CreateAccountForm;