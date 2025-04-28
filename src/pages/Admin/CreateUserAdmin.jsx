import { Button } from '../../components/Button';
import { ToastContainer } from 'react-toastify';
import { useCreateAdminUserForm } from '../../hooks/useCreateAdminUserForm';
import InputField from '../../components/FormFields/InputField';
import SelectField from '../../components/FormFields/SelectField';

const CreateUserAdmin = () => {
  const {
    errors,
    register,
    handleSubmit,
    handleFormSubmit,
    handleClear,
    loading,
  } = useCreateAdminUserForm();

  return (
    <div>
      <header className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Crie um novo usuário
        </h1>
      </header>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <InputField
          id="personalData.fullName"
          name="personalData.fullName"
          register={register}
          errors={errors}
          placeholder="Nome"
          label="Nome Completo"
        />
        <InputField
          id="personalData.email"
          name="personalData.email"
          type="email"
          register={register}
          errors={errors}
          placeholder="E-mail"
          label="E-mail"
        />
        <InputField
          id="personalData.password"
          type="password"
          name="personalData.password"
          register={register}
          errors={errors}
          placeholder="Senha"
          label="Senha"
        />
        <SelectField
          id="personalData.role"
          register={register}
          errors={errors}
          label="Selecione o tipo de usuário"
          options={[
            { value: 'ADMIN', label: 'Administrador' },
            { value: 'MODERATOR', label: 'Moderador' },
          ]}
        />

        <div className="flex justify-between pt-3">
          <Button text="Cancelar" onClick={handleClear} disabled={loading} />
          <Button
            text="Cadastrar"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={loading}
            confirm={true}
          />
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateUserAdmin;
