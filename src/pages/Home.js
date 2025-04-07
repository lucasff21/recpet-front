import Layout from "../components/Layout";
import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/HomePage.css";
import { adotarPet, cachorroFindAll, downloadImage, findByIdCachorro } from "../services/ApiAdocao";
import logo from '../assets/vira-lata.png';
import { AuthContext } from "../contexts/AuthContext";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import PetCard from "../components/PetCard";


const ArrowRight = (props) => {
    const { onClick } = props;
    return (
        <div className="slick-arrow slick-next" onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
            </svg>
        </div>
    );
};

const ArrowLeft = (props) => {
    const { onClick } = props;
    return (
        <div className="slick-arrow slick-prev" onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
            </svg>
        </div>
    );
};

const Home = () => {
    const [cachorros, setCachorros] = useState([]);
    const [loading, setLoading] = useState(true);
    const { authToken } = useContext(AuthContext)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [selectedDog, setSelectedDog] = useState(null);
  

    const [userAuthenticated, setUserAuthenticated] = useState(false)

    useEffect(() => {
        if (authToken) {
            setUserAuthenticated(true)
        }
    }, [])


    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        nextArrow: <ArrowRight />,
        prevArrow: <ArrowLeft />,
    };

    useEffect(() => {
        const fetchCachorros = async () => {
            let cachorrosWithImages = [];

             await cachorroFindAll()
                .then( async (response) => {
                    let cachorros = response.data;
                    setCachorros(cachorros)
                })
                .catch();

            console.log(cachorros)

            setLoading(false);
        };

        fetchCachorros();
    }, []);

    const openModalPet = async (id) => {
        try {
            const response = await findByIdCachorro(id);

            if (response) {
                const imagePet = await downloadImage(response.imagePath);

                setSelectedDog({
                    ...response,
                    imageUrl: imagePet,
                });

                setShow(true);
            } else {
                console.error("Nenhuma informação encontrada para o ID:", id);
            }
        } catch (error) {
            console.error("Erro ao abrir o modal do pet:", error);
        }
    };


    const renderModal = () => (
        <Modal show={show} onHide={handleClose} >
            <Modal.Header closeButton style={{ backgroundColor: '#F0EFEC' }} >
                {selectedDog && (
                    <>
                        <img
                            src={selectedDog.imageUrl || logo}
                            alt={selectedDog.nome || "Cachorro"}
                            style={{ width: '200px', height: '200px', objectFit: 'contain' }}
                        />
                        <Modal.Title>{selectedDog.nome || "Detalhes do Cachorro"}</Modal.Title>
                    </>
                )}
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: '#F0EFEC' }}>
                {selectedDog ? (
                    <>
                        <div class="row">
                            <div className="titleModalPet">
                                <h4>Perfil </h4>
                            </div>
                            <div className="col-6 mt-1">
                                <div class="labelPet">Data de nascimento:</div>
                                <div class="valorPet">{selectedDog.idade}</div>

                                <div class="labelPet">Sexo:</div>
                                <div class="valorPet">{selectedDog.sexo}</div>
                            </div>

                            <div className="col-6 mt-1">
                                <div class="labelPet">Porte:</div>
                                <div class="valorPet">{selectedDog.porte}</div>

                                <div class="labelPet">Pelagem:</div>
                                <div class="valorPet">{selectedDog.pelagem}</div>
                            </div>
                        </div>
                        <div class="row">
                            <div className="titleModalPet">
                                <h4>Características </h4>
                            </div>

                            <div className="col-6 mt-1">
                                <div class="labelPet">Gosta de Crianças</div>
                                <div class="valorPet">{selectedDog.gostaCrianca ? 'Sim' : 'Não'}</div>

                                <div class="labelPet">Ideal para casa?</div>
                                <div class="valorPet">{selectedDog.idealCasa ? 'Sim' : 'Não'}</div>

                                <div class="labelPet">Gosta de brincar?</div>
                                <div class="valorPet">{selectedDog.brincalhao ? 'Sim' : 'Não'}</div>
                            </div>
                            <div className="col-6 mt-1">
                                <div class="labelPet">É cão de guarda?</div>
                                <div class="valorPet">{selectedDog.caoGuarda ? 'Sim' : 'Não'}</div>

                                <div class="labelPet">Tem necessidade de correr?</div>
                                <div class="valorPet">{selectedDog.necessidadeCorrer ? 'Sim' : 'Não'}</div>

                                <div class="labelPet">Tem queda de pelo?</div>
                                <div class="valorPet">{selectedDog.necessidadeCorrer ? 'Sim' : 'Não'}</div>

                                <div class="labelPet">Gosta de Latir?</div>
                                <div class="valorPet">{selectedDog.tendeLatir ? 'Sim' : 'Não'}</div>
                            </div>
                        </div>
                        <div class="row" >
                            <div className="titleModalPet">
                                <h4>Comportamento </h4>
                            </div>

                            <div class="labelPet">Raça:</div>
                            <div class="valorPet">Sem raça definida</div>
                            <div class="labelPet">Altura:</div>
                            <div class="valorPet">50 cm</div>
                        </div>
                    </>
                ) : (
                    <p>Carregando...</p>
                )}
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: '#F0EFEC' }}>
                <Button variant="secondary" onClick={handleClose}>
                    Fechar
                </Button>
                <Button variant="none" style={{ backgroundColor: '#ECC891', color: 'black' }} onClick={() => interesseAdocao(selectedDog.id)} disabled={!userAuthenticated}>
                    {userAuthenticated ? 'Tenho Interesse' : 'Logar no sistema para adotar'}
                </Button>

            </Modal.Footer>
        </Modal>
    );


    const interesseAdocao = async (petId) => {
        const dataLocal = new Date().toISOString().split('T')[0];

        try {
            const response = await findByIdCachorro(petId);
            const adocaoData = {
                dataAdocao: dataLocal,  
                status: 'Pendente',         
                animal: response            
            };


            await adotarPet(adocaoData, authToken)

            handleClose();

            toast.success('Você acabou de demonstrar interesse em um de nossos pets, dentro de alguns dias entraremos em contato!', {
                position: "top-right",
                autoClose: 6000,
            });

        } catch (error) {
            console.error("Erro ao adotar o pet:", error);
        }
    }

    return (
        <Layout>
            <ToastContainer/>
            <div>
                {loading ? (
                    <p>Carregando...</p>
                ) : cachorros.length > 0 ? (
                    <Slider {...settings} className="w-[1000px]">
                        {cachorros.map((cachorro) => (
                            <PetCard cachorro={cachorro} openModalPet={openModalPet} key={cachorro.id} />
                        ))}
                    </Slider>
                ) : (
                    <p>Nenhum cachorro encontrado</p>
                )}
            </div>
            {renderModal()}
        </Layout>
    );
};

export default Home;
