import { useState, useEffect, useCallback, useContext } from 'react';
import { showToast } from '../../../utils/toast';
import { updateUserProfile } from '../../../services/ApiUser';
import { getAddressByZipCode } from '../../../services/addressService';
import { AuthContext } from '../../../contexts/AuthContext';

import InputField from '../../../components/FormFields/InputField';
import SelectField from '../../../components/FormFields/SelectField';
import DateField from '../../../components/FormFields/DateField';
import { Button } from '../../../components/Button';

const AccountSettings = () => {
  const { user, updateUserContext } = useContext(AuthContext);

  const [userData, setUserData] = useState({
    nome: '',
    telefone: '',
    genero: '',
    dataNascimento: '',
    cpf: '',
    email: '',
    endereco: {
      cep: '',
      logradouro: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
    },
  });

  const [initialUserData, setInitialUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      const formattedUser = {
        ...user,
        dataNascimento: user.dataNascimento
          ? user.dataNascimento.split('T')[0]
          : '',
        endereco: {
          cep: user.endereco?.cep || '',
          logradouro: user.endereco?.logradouro || '',
          complemento: user.endereco?.complemento || '',
          bairro: user.endereco?.bairro || '',
          cidade: user.endereco?.localidade || '',
          estado: user.endereco?.uf || '',
        },
      };

      setUserData(formattedUser);
      setInitialUserData(formattedUser);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (Object.keys(userData.endereco).includes(name)) {
      setUserData((prev) => ({
        ...prev,
        endereco: { ...prev.endereco, [name]: value },
      }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCepBlur = useCallback((e) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length !== 8) return;

    getAddressByZipCode(cep)
      .then((response) => {
        const { data } = response;
        if (data.erro) {
          showToast('CEP não encontrado.', 'error');
          return;
        }
        setUserData((prev) => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            cep: data.cep,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
          },
        }));
      })
      .catch(() => {
        showToast('Erro ao buscar o CEP.', 'error');
      });
  }, []);

  const handleSave = () => {
    setSaving(true);

    const payload = {
      nome: userData.nome,
      telefone: userData.telefone,
      genero: userData.genero,
      dataNascimento: userData.dataNascimento,
      endereco: {
        cep: userData.endereco.cep,
        logradouro: userData.endereco.logradouro,
        complemento: userData.endereco.complemento,
        bairro: userData.endereco.bairro,
        cidade: userData.endereco.cidade,
        estado: userData.endereco.estado,
      },
    };

    updateUserProfile(payload)
      .then((response) => {
        const { data: updatedUser } = response;
        showToast('Suas configurações foram salvas com sucesso!', 'success');
        updateUserContext(updatedUser);
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
    setUserData(initialUserData);
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

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Dados Pessoais
            </h3>
            <InputField
              id="nome"
              name="nome"
              label="Nome Completo"
              value={userData.nome}
              onChange={handleChange}
              disabled={!editing}
            />
            <InputField
              id="email"
              name="email"
              label="Email"
              value={userData.email}
              disabled
            />
            <InputField
              id="cpf"
              name="cpf"
              label="CPF"
              value={userData.cpf}
              disabled
            />
            <InputField
              id="telefone"
              name="telefone"
              label="Telefone"
              value={userData.telefone}
              onChange={handleChange}
              disabled={!editing}
            />
            <DateField
              id="dataNascimento"
              name="dataNascimento"
              label="Data de Nascimento"
              value={userData.dataNascimento}
              onChange={handleChange}
              disabled={!editing}
            />
            <SelectField
              id="genero"
              name="genero"
              label="Gênero"
              value={userData.genero.toUpperCase()}
              onChange={handleChange}
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
              id="cep"
              name="cep"
              label="CEP"
              value={userData.endereco.cep}
              onChange={handleChange}
              onBlur={handleCepBlur}
              disabled={!editing}
            />
            <InputField
              id="logradouro"
              name="logradouro"
              label="Logradouro"
              value={userData.endereco.logradouro}
              onChange={handleChange}
              disabled={!editing}
            />
            <InputField
              id="bairro"
              name="bairro"
              label="Bairro"
              value={userData.endereco.bairro}
              onChange={handleChange}
              disabled={!editing}
            />
            <InputField
              id="complemento"
              name="complemento"
              label="Complemento"
              value={userData.endereco.complemento}
              onChange={handleChange}
              disabled={!editing}
              required={false}
            />
            <InputField
              id="cidade"
              name="cidade"
              label="Cidade"
              value={userData.endereco.cidade}
              onChange={handleChange}
              disabled
            />
            <InputField
              id="estado"
              name="estado"
              label="Estado"
              value={userData.endereco.estado}
              onChange={handleChange}
              disabled
            />
          </div>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t flex justify-end space-x-3">
        {!editing ? (
          <Button
            text="Editar Perfil"
            onClick={() => setEditing(true)}
            confirm={true}
            size="small"
          />
        ) : (
          <>
            <Button text="Cancelar" onClick={handleCancel} size="small" />
            <Button
              text="Salvar Alterações"
              onClick={handleSave}
              disabled={saving}
              loading={saving}
              confirm={true}
              size="small"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
