import { useForm } from 'react-hook-form';
import InputField from '../../../components/FormFields/InputField';
import SelectField from '../../../components/FormFields/SelectField';
import { Button } from '../../../components/Button';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

const PetForm = ({
  onSubmit,
  loading,
  isEdit = false,
  currentImage = null,
  onImageChange,
  imagePreSave = null,
  onClear,
  defaultValues = {},
  validationSchema,
  id = null,
}) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    defaultValues: { ...defaultValues },
    resolver: zodResolver(validationSchema),
    mode: 'all',
  });

  const handleCancel = () => {
    if (isEdit) {
      navigate(`/admin/pets/lista`);
    } else {
      onClear?.();
    }
  };

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-3xl font-extrabold text-gray-800 text-center">
        {isEdit ? 'Editar animal' : 'Adicionar animal'}
      </h1>

      <div className="mt-4">
        <label className="mb-2 font-semibold">Imagem do Pet</label>

        {isEdit && currentImage && !imagePreSave && (
          <div className="mb-4">
            <img
              className="rounded-md mb-2"
              style={{ width: 300 }}
              src={currentImage}
              alt="Imagem atual do pet"
            />
            <p className="text-sm text-gray-500">
              Selecione uma nova imagem para substituir
            </p>
          </div>
        )}

        {imagePreSave && (
          <div className="mb-4">
            <img
              className="rounded-md mb-2"
              style={{ width: 300 }}
              src={URL.createObjectURL(imagePreSave)}
              alt={
                isEdit
                  ? 'Pré-visualização da nova imagem'
                  : 'Pré-visualização do pet'
              }
            />
          </div>
        )}

        <input
          type="file"
          id={isEdit ? 'novaImagem' : 'imagem'}
          accept="image/png, image/jpeg"
          className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
          onChange={onImageChange}
        />
      </div>

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

      <div className="flex justify-end gap-3 mt-6">
        <Button
          text="Cancelar"
          onClick={handleCancel}
          disabled={loading}
          type="button"
        />
        <Button
          text={
            loading
              ? isEdit
                ? 'Atualizando...'
                : 'Cadastrando...'
              : isEdit
                ? 'Atualizar'
                : 'Cadastrar'
          }
          disabled={loading || !isValid}
          type="submit"
          confirm={true}
        />
      </div>
    </form>
  );
};

export default PetForm;
