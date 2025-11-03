import React from 'react';
import { usePersonalForm } from '../../hooks/usePersonalForm';
import Layout from '../../components/Layout';
import InputField from '../../components/FormFields/InputField';
import SelectField from '../../components/FormFields/SelectField';
import DateField from '../../components/FormFields/DateField';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const CreateAccountForm = () => {
  const { errors, register, handleSubmit, loading, handleFormSubmit } =
    usePersonalForm();

  const minDate18YearsOld = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  };

  return (
    <Layout showFooter={true}>
      <div className="w-[330px] md:w-[700px] p-6">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Crie sua conta
          </h1>
          <p className="text-gray-600">
            Preencha os campos abaixo para criar sua conta.
          </p>
        </header>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6"
        >
          <h2 className="col-span-full text-xl font-semibold text-gray-700 mb-2 border-b pb-2">
            Dados da Conta
          </h2>

          <InputField
            id="email"
            label="E-mail"
            register={register}
            errors={errors}
            type="email"
            placeholder="example@gmail.com"
            colSpan={2}
          />
          <InputField
            id="confirmEmail"
            label="Confirmar E-mail"
            register={register}
            errors={errors}
            type="email"
            placeholder="example@gmail.com"
            colSpan={2}
          />

          <InputField
            id="password"
            label="Senha"
            register={register}
            errors={errors}
            type="password"
            placeholder="Senha"
            autoComplete="new-password"
          />
          <InputField
            id="confirmPassword"
            label="Confirmar Senha"
            register={register}
            errors={errors}
            type="password"
            placeholder="Confirme sua Senha"
            autoComplete="new-password"
          />
          <div className="col-span-full mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Sua senha deve conter:
            </label>
            <ul className="text-xs text-gray-600 list-disc list-inside mt-1">
              <li>Pelo menos 8 caracteres</li>
              <li>Pelo menos 1 letra maiúscula (A-Z)</li>
              <li>Pelo menos 1 número (0-9)</li>
              <li>Pelo menos 1 símbolo (ex: !@#$)</li>
            </ul>
          </div>

          <h2 className="col-span-full text-xl font-semibold text-gray-700 mt-6 mb-2 border-b pb-2">
            Dados Pessoais
          </h2>

          <InputField
            id="fullName"
            label="Nome Completo"
            register={register}
            errors={errors}
            colSpan={2}
            placeholder="Nome Completo"
            minLength={5}
          />
          <InputField
            id="cpf"
            label="CPF"
            register={register}
            errors={errors}
            placeholder="CPF"
            mask="999.999.999-99"
          />
          <SelectField
            id="gender"
            label="Gênero"
            register={register}
            errors={errors}
            options={[
              { value: 'Feminino', label: 'Feminino' },
              { value: 'Masculino', label: 'Masculino' },
              { value: 'Prefiro não dizer', label: 'Prefiro não dizer' },
            ]}
          />
          <DateField
            id="birthDate"
            label="Data de Nascimento"
            register={register}
            errors={errors}
            max={minDate18YearsOld()}
          />
          <InputField
            id="phone"
            label="Celular"
            register={register}
            errors={errors}
            placeholder="(99) 99999-9999"
            mask="(99) 99999-9999"
          />

          <h2 className="col-span-full text-xl font-semibold text-gray-700 mt-6 mb-2 border-b pb-2">
            Endereço
          </h2>

          <InputField
            id="zipCode"
            label="CEP"
            register={register}
            errors={errors}
            placeholder="CEP"
            mask="99999-999"
          />
          <InputField
            id="state"
            label="Estado"
            register={register}
            errors={errors}
            placeholder="Estado"
            disabled
          />
          <InputField
            id="city"
            label="Cidade"
            register={register}
            errors={errors}
            placeholder="Cidade"
            disabled
          />
          <InputField
            id="street"
            label="Logradouro"
            register={register}
            errors={errors}
            placeholder="Logradouro"
          />
          <InputField
            id="district"
            label="Bairro"
            register={register}
            errors={errors}
            placeholder="Bairro"
          />
          <InputField
            id="complement"
            label="Complemento"
            register={register}
            errors={errors}
            placeholder="Complemento"
            required={false}
          />

          <div className="col-span-full flex justify-end mt-8">
            <button
              type="submit"
              className="w-full md:w-auto bg-cyan-950 hover:bg-cyan-900 px-10 py-3 text-white rounded-md disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin" />
                  Cadastrando...
                </>
              ) : (
                'Cadastrar'
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateAccountForm;
