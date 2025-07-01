import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import logo from '../assets/logo-pet.png';
import { adotarPet, findCachorroById } from '../services/ApiAdocao';
import { showToast } from '../utils/toast';
import { AuthContext } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { Button } from '../components/Button';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { calculateAge } from '../utils/pet';
import Breadcrumb from '../components/Breadcrumb';

const PetProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedPet, setSelectedPet] = useState(null);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);
  const [pageLoading, setPageLoading] = useState(true);
  const [adoptionLoading, setAdoptionLoading] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await findCachorroById(id);
        setSelectedPet(response.data || null);
      } catch (err) {
        setError('Pet não encontrado');
      } finally {
        setPageLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const interesseAdocao = async (e) => {
    e?.preventDefault();

    if (!isAuthenticated) {
      navigate(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    setAdoptionLoading(true);
    try {
      await adotarPet({ animalId: selectedPet.id });
      showToast('Interesse registrado! Entraremos em contato.');
    } catch (error) {
      if (error.status === 401) {
        showToast('Você já solicitou adoção desse pet', 'error');
      } else {
        showToast('Erro ao processar interesse', 'error');
      }
    } finally {
      setAdoptionLoading(false);
    }
  };

  const traits = [
    { key: 'brincalhao', label: 'Brincalhão', color: 'blue' },
    { key: 'gostaCrianca', label: 'Bom com crianças', color: 'green' },
    { key: 'caoGuarda', label: 'Cão de guarda', color: 'yellow' },
    { key: 'idealCasa', label: 'Ideal para casa', color: 'purple' },
    {
      key: 'necessidadeCorrer',
      label: 'Precisa de exercícios',
      color: 'indigo',
    },
    { key: 'quedaPelo', label: 'Solta muito pelo', color: 'amber' },
    { key: 'tendeLatir', label: 'Gosta de latir', color: 'red' },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    amber: 'bg-amber-100 text-amber-800',
    red: 'bg-red-100 text-red-800',
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <AiOutlineLoading3Quarters className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
        <Button variant="primary" onClick={() => navigate('/')}>
          Voltar para a página inicial
        </Button>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <Breadcrumb
          items={[
            { label: 'Pets', href: '/' },
            { label: selectedPet?.nome || 'Perfil do Pet' },
          ]}
        />

        {selectedPet && (
          <div className="overflow-hidden">
            <div className="pb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {selectedPet.nome}
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="h-64 md:h-96 lg:h-[500px] flex items-center justify-center p-4 md:p-6 bg-gray-100">
                <img
                  src={selectedPet.imagePath || logo}
                  alt={selectedPet.nome}
                  className="w-full h-full max-h-[500px] object-cover border-2 border-amber-400 rounded-lg shadow-md"
                />
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
                    Sobre
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-500 m-0">Raça</p>
                        <p className="font-medium text-base md:text-lg">
                          {selectedPet.raca || 'SRD (Sem Raça Definida)'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 m-0">Idade</p>
                        <p className="font-medium text-base md:text-lg">
                          {calculateAge(selectedPet.dataNascimentoAproximada)}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-500 m-0">Sexo</p>
                        <p
                          className={`font-medium text-base md:text-lg ${
                            selectedPet.sexo?.toLowerCase() === 'macho'
                              ? 'text-blue-600'
                              : 'text-pink-600'
                          }`}
                        >
                          {selectedPet.sexo}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 m-0">Porte</p>
                        <p className="font-medium text-base md:text-lg">
                          {selectedPet.porte}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
                    Descrição
                  </h2>
                  <p className="text-gray-700 text-base md:text-lg mt-3">
                    {selectedPet.descricao ||
                      'Este pet ainda não tem uma descrição cadastrada. Entre em contato para conhecer melhor suas características.'}
                  </p>
                </div>

                <div className="pt-4">
                  <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
                    Personalidade
                  </h2>
                  <div className="flex flex-wrap gap-3 mt-3">
                    {traits.map(
                      (trait) =>
                        selectedPet[trait.key] === true && (
                          <span
                            key={trait.key}
                            className={`${colorClasses[trait.color]} px-3 py-1.5 rounded-full text-sm md:text-base`}
                          >
                            {trait.label}
                          </span>
                        )
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 flex justify-end gap-4">
              <Button
                confirm={true}
                onClick={interesseAdocao}
                className="px-6 py-2 text-base"
                disabled={adoptionLoading || !selectedPet}
              >
                {isAuthenticated ? 'Tenho Interesse' : 'Faça login para adotar'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PetProfilePage;
