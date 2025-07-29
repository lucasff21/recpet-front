import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateAnimal, findAnimalById } from '../../../services/ApiAdocao';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../../contexts/AuthContext';
import PetForm from './PetForm';
import { petUpdateSchema } from '../../../zod/petForms';

const EditPet = () => {
  document.title = 'Editar Pet | ADMIN ';
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
        const response = await findAnimalById(id);
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
      const value = data[key];

      if (value !== undefined && value !== null) {
        if (key === 'caracteristicasIds' && Array.isArray(value)) {
          value.forEach((id) => {
            formData.append(key, id);
          });
        } else {
          formData.append(key, value);
        }
      }
    });

    updateAnimal(id, formData)
      .then(() => {
        toast.success('Pet atualizado com sucesso!');
        navigate(`/admin/pets/lista`);
      })
      .catch(() => {
        toast.error('Erro ao atualizar pet.');
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
