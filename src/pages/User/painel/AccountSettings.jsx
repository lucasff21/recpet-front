import { useEffect, useState, useContext, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { showToast } from '../../../utils/toast';
import { updateUserProfile } from '../../../services/ApiUser';
import { getAddressByZipCode } from '../../../services/addressService';
import { AuthContext } from '../../../contexts/AuthContext';

import InputField from '../../../components/FormFields/InputField';
import SelectField from '../../../components/FormFields/SelectField';
import DateField from '../../../components/FormFields/DateField';
import { Button } from '../../../components/Button';

const accountSettingsSchema = z.object({
  nome: z.string().nonempty('Nome é obrigatório'),
  telefone: z
    .string()
    .nonempty('Telefone é obrigatório')
    .transform((phone) => phone.replace(/\D/g, ''))
    .pipe(z.string().min(10, 'Telefone deve ter no mínimo 10 dígitos')),
  genero: z.string().nonempty('Gênero é obrigatório'),
  dataNascimento: z.string().nonempty('Data de nascimento é obrigatória'),

  endereco: z.object({
    cep: z
      .string()
      .nonempty('CEP é obrigatório')
      .transform((cep) => cep.replace(/\D/g, ''))
      .pipe(z.string().length(8, 'CEP deve ter 8 dígitos')),
    logradouro: z.string().nonempty('Logradouro é obrigatório'),
    bairro: z.string().nonempty('Bairro é obrigatório'),
    cidade: z.string().nonempty('Cidade é obrigatória'),
    estado: z.string().nonempty('Estado é obrigatório'),
    complemento: z.string().optional(),
  }),

  email: z.string().optional(),
  cpf: z.string().optional(),
});

const AccountSettings = () => {
  const { user, updateUserContext } = useContext(AuthContext);

  const [initialUserData, setInitialUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(accountSettingsSchema),
    mode: 'onChange',
  });

  const formatDataForForm = useCallback((data) => {
    if (!data) return {};

    const endereco = data.endereco || {};

    return {
      ...data,
      dataNascimento: data.dataNascimento
        ? data.dataNascimento.split('T')[0]
        : '',
      genero: data.genero?.toUpperCase() || '',
      telefone: data.telefone || '',
      endereco: {
        cep: endereco.cep || '',
        logradouro: endereco.logradouro || '',
        complemento: endereco.complemento || '',
        bairro: endereco.bairro || '',
        cidade: endereco.localidade || '',
        estado: endereco.uf || '',
      },
    };
  }, []);

  useEffect(() => {
    if (user) {
      const formattedUser = formatDataForForm(user);
      reset(formattedUser);
      setInitialUserData(formattedUser);
    }
  }, [user, reset, formatDataForForm]);

  const cepValue = watch('endereco.cep');

  useEffect(() => {
    const fetchAddress = async () => {
      if (typeof cepValue !== 'string' || !cepValue) {
        return;
      }

      const cep = cepValue.replace(/\D/g, '');
      if (cep.length !== 8) return;

      setLoadingAddress(true);
      try {
        const response = await getAddressByZipCode(cep);
        const { data } = response;
        if (data.erro) {
          showToast('CEP não encontrado.', 'error');
          return;
        }
        setValue('endereco.logradouro', data.logradouro, {
          shouldValidate: true,
        });
        setValue('endereco.bairro', data.bairro, { shouldValidate: true });
        setValue('endereco.cidade', data.localidade, { shouldValidate: true });
        setValue('endereco.estado', data.uf, { shouldValidate: true });
      } catch (error) {
        showToast('Erro ao buscar o CEP.', 'error');
      } finally {
        setLoadingAddress(false);
      }
    };

    const debounceHandler = setTimeout(() => {
      fetchAddress();
    }, 500);

    return () => clearTimeout(debounceHandler);
  }, [cepValue, setValue]);

  const onSubmit = (data) => {
    setSaving(true);

    const payload = {
      nome: data.nome,
      telefone: data.telefone,
      genero: data.genero,
      dataNascimento: data.dataNascimento,
      endereco: {
        cep: data.endereco.cep,
        logradouro: data.endereco.logradouro,
        complemento: data.endereco.complemento,
        bairro: data.endereco.bairro,
        cidade: data.endereco.cidade,
        estado: data.endereco.estado,
      },
    };

    updateUserProfile(payload)
      .then((response) => {
        const { data: updatedUser } = response;
        showToast('Suas configurações foram salvas com sucesso!', 'success');

        const formattedUpdatedUser = formatDataForForm(updatedUser);

        updateUserContext(updatedUser);
        reset(formattedUpdatedUser);
        setInitialUserData(formattedUpdatedUser);

        setEditing(false);
      })
      .catch(() => {
        showToast('Erro ao salvar as configurações. Tente novamente.', 'error');
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const handleCancel = () => {
    reset(initialUserData);
    setEditing(false);
  };

  if (!user) {
    return <div className="text-center p-10">Carregando seus dados...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
        Configurações da Conta
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Dados Pessoais
            </h3>
            <InputField
              id="nome"
              label="Nome Completo"
              register={register}
              errors={errors}
              disabled={!editing}
            />
            <InputField
              id="email"
              label="Email"
              register={register}
              errors={errors}
              disabled
            />
            <InputField
              id="cpf"
              label="CPF"
              register={register}
              errors={errors}
              disabled
            />
            <InputField
              id="telefone"
              label="Telefone"
              register={register}
              errors={errors}
              mask={editing ? '(99) 99999-9999' : ''}
              disabled={!editing}
            />
            <DateField
              id="dataNascimento"
              label="Data de Nascimento"
              register={register}
              errors={errors}
              disabled={!editing}
            />
            <SelectField
              id="genero"
              label="Gênero"
              register={register}
              errors={errors}
              disabled={!editing}
              options={[
                { value: 'MASCULINO', label: 'Masculino' },
                { value: 'FEMININO', label: 'Feminino' },
                { value: 'OUTRO', label: 'Outro' },
              ]}
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700">Endereço</h3>
            <InputField
              id="endereco.cep"
              label="CEP"
              register={register}
              errors={errors}
              mask={editing ? '99999-999' : ''}
              disabled={!editing}
            />
            <InputField
              id="endereco.logradouro"
              label="Logradouro"
              register={register}
              errors={errors}
              disabled={!editing}
            />
            <InputField
              id="endereco.bairro"
              label="Bairro"
              register={register}
              errors={errors}
              disabled={!editing}
            />
            <InputField
              label="Complemento"
              register={register}
              errors={errors}
              disabled={!editing}
              required={false}
              id="endereco.complemento"
            />
            <InputField
              id="endereco.cidade"
              label="Cidade"
              register={register}
              errors={errors}
              disabled
            />
            <InputField
              id="endereco.estado"
              label="Estado"
              register={register}
              errors={errors}
              disabled
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t flex justify-end space-x-3">
          {!editing ? (
            <Button
              text="Editar Perfil"
              onClick={() => setEditing(true)}
              confirm={true}
              size="small"
              type="button"
            />
          ) : (
            <>
              <Button
                text="Cancelar"
                onClick={handleCancel}
                size="small"
                type="button"
              />
              <Button
                text="Salvar Alterações"
                disabled={!isValid || saving || loadingAddress}
                loading={saving || loadingAddress}
                confirm={true}
                size="small"
                type="submit"
              />
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default AccountSettings;
