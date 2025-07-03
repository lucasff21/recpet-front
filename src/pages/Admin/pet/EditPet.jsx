import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateCachorro, findCachorroById } from '../../../services/ApiAdocao';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../../contexts/AuthContext';
import PetForm from './PetForm';
import { petUpdateSchema } from '../../../zod/petForms';

const EditPet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);
  const [imagePreSave, setImagePreSave] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [defaultValues, setDefaultValues] = useState({});

  useEffect(() => {
    const loadPetData = async () => {
      try {
        setLoading(true);
        const response = await findCachorroById(id);
        const petData = response.data;
        setDefaultValues({ ...petData });
        setCurrentImage(petData.imagemPath || null);
      } catch (error) {
        toast.error('Erro ao carregar dados do pet');
        navigate('/admin/pets');
      } finally {
        setLoading(false);
      }
    };

    loadPetData();
  }, [id, authToken, navigate]);

  const atualizarPet = (data) => {
    setLoading(true);
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (
        data[key] !== undefined &&
        data[key] !== null &&
        key !== 'novaImagem'
      ) {
        formData.append(key, data[key]);
      }
    });

    if (imagePreSave) {
      formData.append('novaImagem', imagePreSave);
    }

    for (const value of formData.values()) {
      console.log(value);
    }

    updateCachorro(id, formData)
      .then(() => {
        toast.success('Pet atualizado com sucesso!');
        navigate(`/admin/pets/lista`);
      })
      .catch((error) => {
        toast.error('Erro ao atualizar pet.');
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreSave(file);
    }
  };

  return (
    <PetForm
      isEdit={true}
      onSubmit={atualizarPet}
      loading={loading}
      currentImage={currentImage}
      imagePreSave={imagePreSave}
      onImageChange={handleImageChange}
      defaultValues={defaultValues}
      validationSchema={petUpdateSchema}
      id={id}
    />
  );
};

export default EditPet;
