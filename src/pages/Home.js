import Layout from '../components/Layout';
import React, { useEffect, useState, useCallback } from 'react';
import { cachorroFindAll } from '../services/ApiAdocao';
import { Spinner } from 'react-bootstrap';
import PetCard from '../components/Cards/PetCard';
import FeaturedPetCard from '../components/Cards/FeaturedPetCard';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toast';

const Home = () => {
  const [cachorros, setCachorros] = useState([]);
  const [featuredPets, setFeaturedPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const openPagePet = useCallback(
    (id) => {
      if (featuredPets.length === 0 && cachorros.length === 0) return;

      const pet = [...featuredPets, ...cachorros].find((p) => p.id === id);

      if (pet) {
        navigate(`/pets/${pet.id}`);
      }
    },
    [featuredPets, cachorros, navigate]
  );

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const response = await cachorroFindAll();
        if (!ignore) {
          setCachorros(response.data);
          setFeaturedPets(response.data.slice(0, 3));
        }
      } catch (error) {
        if (!ignore) {
          showToast('Erro ao carregar pets', 'error');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow container mx-auto px-4 py-6">
          <section className="mb-8">
            {loading ? (
              <div className="flex justify-center py-8">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              featuredPets.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Recomendado para você
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featuredPets.map((pet) => (
                      <FeaturedPetCard
                        key={pet.id}
                        pet={pet}
                        openPagePet={openPagePet}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Todos os Pets
            </h2>
            {loading ? (
              <div className="flex justify-center py-8">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : cachorros.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cachorros.map((pet) => (
                  <PetCard key={pet.id} pet={pet} openPagePet={openPagePet} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-3xl shadow-md p-5">
                <p className="text-gray-500 mt-2 font-bold">
                  Nenhum pet disponível no momento
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default Home;
