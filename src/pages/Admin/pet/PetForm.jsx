import { useForm } from 'react-hook-form';
import InputField from '../../../components/FormFields/InputField';
import SelectField from '../../../components/FormFields/SelectField';
import TextareaField from '../../../components/FormFields/TextareaField';
import CheckboxField from '../../../components/FormFields/CheckboxField';
import { Button } from '../../../components/Button';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useRef } from 'react';
import { findAllCaracteristicas } from '../../../services/ApiAdocao';
import { showToast } from '../../../utils/toast';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import DateField from '../../../components/FormFields/DateField';

const PetForm = ({
  onSubmit,
  loading,
  isEdit = false,
  currentImage = null,
  onClear,
  defaultValues = {},
  validationSchema,
}) => {
  const navigate = useNavigate();

  const [imagePreSave, setImagePreSave] = useState(null);
  const [localCurrentImage, setLocalCurrentImage] = useState(currentImage);

  const hasDefaultValuesBeenSet = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm({
    mode: 'all',
    resolver: zodResolver(validationSchema),
    defaultValues: isEdit
      ? {}
      : {
          nome: '',
          dataNascimentoAproximada: '',
          sexo: 'MACHO',
          porte: 'PEQUENO',
          pelagem: 'CURTA',
          tipo: 'CACHORRO',
          descricao: '',
          caracteristicasIds: [],
        },
  });

  const [caracteristicasOptions, setCaracteristicasOptions] = useState([]);
  const [loadingCaracteristicas, setLoadingCaracteristicas] = useState(true);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreSave(file);
      setLocalCurrentImage(null);
    } else {
      setImagePreSave(null);
      if (isEdit && currentImage) {
        setLocalCurrentImage(currentImage);
      }
    }
  };

  useEffect(() => {
    if (
      isEdit &&
      defaultValues &&
      Object.keys(defaultValues).length > 0 &&
      !hasDefaultValuesBeenSet.current
    ) {
      reset({
        ...defaultValues,
        caracteristicasIds:
          defaultValues.caracteristicas?.map((c) => String(c.id)) || [],
        dataNascimentoAproximada: defaultValues.dataNascimentoAproximada || '',
        tipo: defaultValues.tipo || 'CACHORRO',
      });
      setLocalCurrentImage(defaultValues.imagemPath || null);
      hasDefaultValuesBeenSet.current = true;
    } else if (!isEdit && !hasDefaultValuesBeenSet.current) {
      reset({
        nome: '',
        dataNascimentoAproximada: '',
        sexo: 'MACHO',
        porte: 'PEQUENO',
        pelagem: 'CURTA',
        tipo: 'CACHORRO',
        descricao: '',
        caracteristicasIds: [],
      });
      setImagePreSave(null);
      setLocalCurrentImage(null);
      hasDefaultValuesBeenSet.current = true;
    }
  }, [defaultValues, isEdit, reset]);

  useEffect(() => {
    const fetchCaracteristicas = async () => {
      try {
        setLoadingCaracteristicas(true);
        const { data } = await findAllCaracteristicas();
        setCaracteristicasOptions(data);
      } catch (error) {
        showToast('Erro ao carregar características.', 'error');
      } finally {
        setLoadingCaracteristicas(false);
      }
    };
    fetchCaracteristicas();
  }, []);

  const handleFormSubmit = (data) => {
    const dataToSend = { ...data };

    if (imagePreSave) {
      dataToSend[isEdit ? 'novaImagem' : 'imagem'] = imagePreSave;
    }

    if (isEdit) {
      delete dataToSend.imagemPath;
    }

    onSubmit(dataToSend);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <h1 className="text-3xl font-bold text-gray-800 text-center">
        {isEdit
          ? `Editar ${defaultValues.nome || 'animal'}`
          : 'Adicionar animal'}
      </h1>

      <div className="w-80 mt-4 lg:smt-0">
        <label className="block mb-2 font-semibold">Imagem do Pet</label>
        <div className="p-4 border-2 border-dashed rounded-lg text-center h-full flex flex-col justify-between">
          <div>
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
              onChange={handleImageChange}
            />
            {errors.imagem && !isEdit && (
              <span className="text-red-500 text-sm">
                {errors.imagem.message}
              </span>
            )}
            {errors.novaImagem && isEdit && (
              <span className="text-red-500 text-sm">
                {errors.novaImagem.message}
              </span>
            )}
          </div>

          <div className="mt-4 flex-grow flex items-center justify-center">
            {isEdit && localCurrentImage && !imagePreSave ? (
              <div>
                <p className="text-sm text-gray-500 mb-2">Imagem atual:</p>
                <img
                  className="rounded-md mx-auto"
                  style={{ maxHeight: 250 }}
                  src={localCurrentImage}
                  alt="Imagem atual do pet"
                />
              </div>
            ) : imagePreSave ? (
              <div>
                <p className="text-sm text-gray-500 mb-2">Pré-visualização:</p>
                <img
                  className="rounded-md mx-auto"
                  style={{ maxHeight: 250 }}
                  src={URL.createObjectURL(imagePreSave)}
                  alt={
                    isEdit
                      ? 'Pré-visualização da nova imagem'
                      : 'Pré-visualização do pet'
                  }
                />
              </div>
            ) : (
              <div className="text-gray-400">
                <p>Nenhuma imagem selecionada</p>
              </div>
            )}
          </div>
        </div>
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
        <DateField
          id="dataNascimentoAproximada"
          label="Data de nascimento aproximada"
          register={register}
          errors={errors}
          max={new Date().toISOString().split('T')[0]}
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
        <SelectField
          id="tipo"
          register={register}
          errors={errors}
          label="Tipo de Animal"
          options={[
            { value: 'CACHORRO', label: 'Cachorro' },
            { value: 'GATO', label: 'Gato' },
          ]}
        />
      </div>

      <div className="mt-4">
        <TextareaField
          id="descricao"
          name="descricao"
          register={register}
          errors={errors}
          placeholder="Descreva o animal aqui..."
          label="Descrição Completa"
          rows={6}
        />
      </div>

      <div className="mt-4">
        <label className="block mb-3 font-semibold">
          Selecione as características do animal
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {loadingCaracteristicas ? (
            <div className="flex items-center justify-center h-20 col-span-2">
              <AiOutlineLoading3Quarters className="animate-spin text-xl text-gray-600" />
              <span>Carregando características...</span>
            </div>
          ) : caracteristicasOptions.length > 0 ? (
            caracteristicasOptions.map((caracteristica) => (
              <CheckboxField
                key={caracteristica.id}
                id={`caracteristica-${caracteristica.id}`}
                name="caracteristicasIds"
                value={String(caracteristica.id)}
                label={caracteristica.nome}
                register={register}
                errors={errors}
              />
            ))
          ) : (
            <p className="text-gray-600 col-span-2">
              Nenhuma característica disponível.
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button
          text="Cancelar"
          onClick={() => {
            if (isEdit) {
              navigate(`/admin/pets`);
            } else {
              reset();
              setImagePreSave(null);
              setLocalCurrentImage(null);
              onClear?.();
            }
          }}
          disabled={loading}
          type="button"
        />
        <Button
          text={isEdit ? 'Atualizar' : 'Cadastrar'}
          disabled={loading || !isValid}
          loading={loading}
          type="submit"
          confirm={true}
        />
      </div>
    </form>
  );
};

export default PetForm;
