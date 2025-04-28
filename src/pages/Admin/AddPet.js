import { useContext, useRef, useState } from 'react';
import { createCachorro } from '../../services/ApiAdocao';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from '../../components/FormFields/InputField';
import SelectField from '../../components/FormFields/SelectField';
import { Button } from '../../components/Button';
import { petSchema } from '../../zod/petForms';
import Panel from '../../components/Panel';

const AddPet = () => {
  const { authToken } = useContext(AuthContext);
  const [imagePreSave, setImagePreSave] = useState(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    trigger,
  } = useForm({
    mode: 'all',
    resolver: zodResolver(petSchema),
    defaultValues: {
      idealCasa: false,
      gostaCrianca: false,
      caoGuarda: false,
      brincalhao: false,
      necessidadeCorrer: false,
      quedaPelo: false,
      tendeLatir: false,
      nome: '',
      idade: '',
      sexo: 'MACHO',
      porte: 'PEQUENO',
      pelagem: 'CURTA',
    },
  });

  const cadastrarPet = (data) => {
    setLoading(true);

    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key !== 'imagem') {
        formData.append(key, data[key]);
      }
    });

    if (imagePreSave) {
      formData.append('imagem', imagePreSave);
    }

    createCachorro(formData, authToken)
      .then((response) => {
        toast.success('Pet cadastrado com sucesso!');
        reset();
        setImagePreSave(null);
      })
      .catch((error) => {
        toast.error('Erro ao cadastrar pet.');
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImagePreSave(file);
    }
  };

  const handleClear = () => {
    reset();
    setImagePreSave(null);
  };

  return (
    <Panel>
      <form ref={formRef} onSubmit={handleSubmit(cadastrarPet)}>
        <h1 className="text-3xl font-extrabold text-gray-800 text-center">
          Adicionar PET
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <InputField
            id="nome"
            type="text"
            name="nome"
            register={register}
            errors={errors}
            placeholder="Nome"
            label="Nome"
          />
          <InputField
            id="idade"
            type="text"
            name="idade"
            register={register}
            errors={errors}
            placeholder="Idade"
            label="Idade"
          />
          <SelectField
            id="sexo"
            register={register}
            errors={errors}
            label="Sexo"
            options={[
              { value: 'MACHO', label: 'Macho' },
              { value: 'FEMEA', label: 'Fêmea' },
            ]}
          />

          <SelectField
            id="porte"
            register={register}
            errors={errors}
            label="Porte"
            options={[
              { value: 'PEQUENO', label: 'Pequeno' },
              { value: 'MEDIO', label: 'Médio' },
              { value: 'GRANDE', label: 'Grande' },
              { value: 'GIGANTE', label: 'Gigante' },
            ]}
          />
          <SelectField
            id="pelagem"
            register={register}
            errors={errors}
            label="Pelagem"
            options={[
              { value: 'CURTA', label: 'Curta' },
              { value: 'MEDIA', label: 'Média' },
              { value: 'LONGA', label: 'Longa' },
              { value: 'ENCARACOLADA', label: 'Encaracolada' },
              { value: 'DURA', label: 'Dura' },
              { value: 'SEDOSA', label: 'Sedosa' },
              { value: 'LANOSA', label: 'Lanosa' },
            ]}
          />
        </div>

        <div className="mt-4">
          <label className="mb-3 font-semibold">
            Selecione as características do PET
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'idealCasa', label: 'Ideal para apartamento/casa pequena' },
              { id: 'gostaCrianca', label: 'Se dá bem com crianças' },
              { id: 'caoGuarda', label: 'Tem instinto de guarda/proteção' },
              { id: 'brincalhao', label: 'Brincalhão e energético' },
              {
                id: 'necessidadeCorrer',
                label: 'Precisa de exercícios frequentes',
              },
              { id: 'quedaPelo', label: 'Solta muito pelo' },
              { id: 'tendeLatir', label: 'Late com frequência' },
            ].map((item) => (
              <div key={item.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={item.id}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  {...register(item.id)}
                />
                <label
                  htmlFor={item.id}
                  className="ml-2 block text-sm text-gray-900"
                >
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-2 font-semibold">Imagem do Pet</label>
          <input
            type="file"
            id="imagem"
            accept="image/png, image/jpeg"
            className="block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-md file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-indigo-50 file:text-indigo-700
                                  hover:file:bg-indigo-100"
            onChange={handleImageChange}
          />
          {errors.imagem && (
            <span className="text-red-500 text-sm">{errors.imagem}</span>
          )}

          {imagePreSave && (
            <img
              className="mt-2 rounded-md"
              style={{ width: 300 }}
              src={URL.createObjectURL(imagePreSave)}
              alt="Pré-visualização do pet"
            />
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            text="Cancelar"
            onClick={handleClear}
            disabled={loading}
            type="button"
          />
          <Button
            text={loading ? 'Cadastrando...' : 'Cadastrar'}
            disabled={loading || !isValid}
            type="submit"
            confirm={true}
          />
        </div>
      </form>
    </Panel>
  );
};

export default AddPet;
