import Layout from "../components/Layout";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { adotarPet, cachorroFindAll} from "../services/ApiAdocao";
import { AuthContext } from "../contexts/AuthContext";
import { Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import PetCard from "../components/Cards/PetCard";
import FeaturedPetCard from "../components/Cards/FeaturedPetCard";
import ModalPet from "../components/ModalPet";
import {useNavigate} from "react-router-dom";

const Home = () => {
    const [cachorros, setCachorros] = useState([]);
    const [featuredPets, setFeaturedPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { authToken } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [selectedDog, setSelectedDog] = useState(null);
    const navigate = useNavigate();


    const openModalPet = useCallback((id) => {
        const pet = [...featuredPets, ...cachorros].find(p => p.id === id);
        if (pet) {
            setSelectedDog(pet);
            setShowModal(true);
        }
    }, [featuredPets, cachorros]);


    const interesseAdocao = useCallback(async () => {
        if (!authToken) {
            navigate('/login');
        }

        if (!selectedDog) return;

        try {
            await adotarPet({
                dataAdocao: new Date().toISOString().split('T')[0],
                status: 'Pendente',
                animal: selectedDog
            }, authToken);

            setShowModal(false);
            toast.success('Interesse registrado! Entraremos em contato.');
        } catch (error) {
            toast.error("Erro ao processar interesse");
        }
    }, [selectedDog, authToken]);

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
                    toast.error("Erro ao carregar pets");
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
            <ToastContainer />
            <div className="flex flex-col min-h-screen">
                <main className="flex-grow container mx-auto px-4 py-6">
                    <section className="mb-8">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : featuredPets.length > 0 && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-4">
                                    Recomendado para você
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {featuredPets.map((pet) => (
                                        <FeaturedPetCard key={pet.id} pet={pet} openModalPet={openModalPet}/>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>


                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Todos os Pets</h2>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : cachorros.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {cachorros.map((pet) => (
                                    <PetCard key={pet.id} pet={pet} openModalPet={openModalPet} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-3xl shadow-md p-5">
                                <p className="text-gray-500 mt-2 font-bold">Nenhum pet disponível no momento</p>
                            </div>
                        )}
                    </section>
                </main>

                <ModalPet
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    pet={selectedDog}
                    onAdopt={interesseAdocao}
                    authToken={authToken}
                />
            </div>
        </Layout>
    );
};

export default Home;