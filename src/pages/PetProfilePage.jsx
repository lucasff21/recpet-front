import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo-pet.png';
import { adotarPet, findAnimalById } from '../services/ApiAdocao';
import { showToast } from '../utils/toast';
import { AuthContext } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { Button } from '../components/Button';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { calculateAge } from '../utils/pet';
import Breadcrumb from '../components/Breadcrumb';
import { useAdoptions } from '../contexts/AdoptionContext';
import Modal from '../components/Modal';
import QuestionarioForm from '../components/QuestionarioForm';

const predefinedColors = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-yellow-100 text-yellow-800',
  'bg-purple-100 text-purple-800',
  'bg-indigo-100 text-indigo-800',
  'bg-amber-100 text-amber-800',
  'bg-red-100 text-red-800',
  'bg-pink-100 text-pink-800',
  'bg-teal-100 text-teal-800',
  'bg-lime-100 text-lime-800',
];

const getPredefinedColorClass = (index) => {
  return predefinedColors[index % predefinedColors.length];
};

const PetProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedPet, setSelectedPet] = useState(null);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useContext(AuthContext);
  const [pageLoading, setPageLoading] = useState(true);
  const [adoptionLoading, setAdoptionLoading] = useState(false);
  const [isQuestionarioModalOpen, setIsQuestionarioModalOpen] = useState(false);

  const { pendingAnimalIds, loadingAdoptions, addAdoption } = useAdoptions();
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await findAnimalById(id);
        setSelectedPet(response.data || null);
      } catch (err) {
        setError('Pet não encontrado');
      } finally {
        setPageLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  useEffect(() => {
    if (!pageLoading && !loadingAdoptions && selectedPet) {
      setIsPending(pendingAnimalIds.has(selectedPet.id));
    }
  }, [selectedPet, pendingAnimalIds, pageLoading, loadingAdoptions]);

  const handleAdoptionClick = (e) => {
    e?.preventDefault();

    if (!isAuthenticated) {
      navigate(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    if (!user.questionario) {
      setIsQuestionarioModalOpen(true);
      return;
    }
    interesseAdocao();
  };

  const handleQuestionarioSuccess = () => {
    setIsQuestionarioModalOpen(false);
    interesseAdocao();
  };

  const interesseAdocao = async () => {
    if (!isAuthenticated) {
      navigate(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    setAdoptionLoading(true);
    try {
      const response = await adotarPet({ animalId: selectedPet.id });
      showToast('Interesse registrado! Entraremos em contato.');
      addAdoption(response.data);
      setIsPending(true);
    } catch (error) {
      const statusCode = error.status || error.response?.status;
      if (statusCode === 401) {
        showToast('Você já solicitou adoção desse pet', 'error');
        setIsPending(true);
      } else {
        showToast('Erro ao processar interesse', 'error');
      }
    } finally {
      setAdoptionLoading(false);
    }
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
        <div className="w-75">
          <Button variant="primary" onClick={() => navigate('/')}>
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    );
  }

  const renderAdoptionButton = () => {
    if (pageLoading || loadingAdoptions) {
      return (
        <Button
          disabled
          size={'medium'}
          className="flex items-center justify-center"
        >
          <AiOutlineLoading3Quarters className="animate-spin w-5 h-5 mr-2" />
          Verificando status...
        </Button>
      );
    }

    if (!isAuthenticated) {
      return (
        <Button onClick={handleAdoptionClick} size={'medium'}>
          Faça login para adotar
        </Button>
      );
    }

    if (isPending) {
      return (
        <div className="w-full text-right">
          <div className="inline-block p-4 rounded-md bg-green-100 text-green-800 text-center font-semibold">
            <p>Sua solicitação para {selectedPet?.nome} já foi registrada!</p>
            <Link
              to="/painel/adocoes"
              className="text-sm text-blue-600 hover:underline mt-1 block"
            >
              Acompanhar minha solicitação
            </Link>
          </div>
        </div>
      );
    }

    return (
      <Button
        confirm={true}
        onClick={handleAdoptionClick}
        disabled={adoptionLoading || !selectedPet}
        size={'medium'}
      >
        {adoptionLoading ? (
          <>
            <AiOutlineLoading3Quarters className="animate-spin w-5 h-5 mr-2" />
            Enviando...
          </>
        ) : (
          'Tenho Interesse'
        )}
      </Button>
    );
  };

  return (
    <Layout>
      {isQuestionarioModalOpen && (
        <Modal
          onClose={() => setIsQuestionarioModalOpen(false)}
          title="Questionário de Adoção"
        >
          <QuestionarioForm
            onSuccess={handleQuestionarioSuccess}
            onClose={() => setIsQuestionarioModalOpen(false)}
            showTitle={false}
          />
        </Modal>
      )}
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

            <div className="flex flex-col md:flex-row md:gap-8">
              <div className="h-auto max-w-96 md:h-[400px] w-full md:w-[400px] mb-6 md:mb-0">
                <img
                  src={selectedPet.imagemPath || logo}
                  alt={selectedPet.nome}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="w-full md:w-3/5 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
                    Sobre
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-500 m-0">Pelagem</p>
                        <p className="font-medium text-base md:text-lg">
                          {selectedPet.pelagem || 'Não informada'}
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
                    Temperamento
                  </h2>
                  <div className="flex flex-wrap gap-3 mt-3">
                    {selectedPet.caracteristicas &&
                    selectedPet.caracteristicas.length > 0 ? (
                      selectedPet.caracteristicas.map(
                        (caracteristica, index) => (
                          <span
                            key={caracteristica.id || index}
                            className={`${getPredefinedColorClass(index)} px-3 py-1.5 rounded-full text-sm md:text-base`}
                          >
                            {caracteristica.nome}
                          </span>
                        )
                      )
                    ) : (
                      <p className="text-gray-600 text-sm">
                        Nenhuma característica de personalidade cadastrada.
                      </p>
                    )}
                  </div>

                  <div className="pt-6">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
                      Saúde
                    </h2>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-gray-500 m-0">Castrado</p>
                        <p className="font-medium text-base md:text-lg">
                          {selectedPet.castrado ? 'Sim' : 'Não'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 m-0">Vermifugado</p>
                        <p className="font-medium text-base md:text-lg">
                          {selectedPet.dataUltimaVermifugacao
                            ? 'Sim'
                            : 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 m-0">
                          Vacina Antirrábica
                        </p>
                        <p className="font-medium text-base md:text-lg">
                          {selectedPet.dataUltimaVacinaAntirrabica
                            ? 'Sim'
                            : 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 m-0">
                          Vacina Múltipla
                        </p>
                        <p className="font-medium text-base md:text-lg">
                          {selectedPet.dataUltimaVacinaMultipla
                            ? `Sim (${selectedPet.tipoVacinaMultipla || 'N/A'})`
                            : 'Não informado'}
                        </p>
                      </div>
                      {selectedPet.observacoesMedicas && (
                        <div className="mt-4">
                          <h3 className="text-base font-semibold text-gray-700">
                            Observações Médicas:
                          </h3>
                          <p className="text-gray-800 mt-1">
                            {selectedPet.observacoesMedicas}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-6 flex justify-end">
              {renderAdoptionButton()}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PetProfilePage;
