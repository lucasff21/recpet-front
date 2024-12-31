import Layout from "../components/Layout";
import React, { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/HomePage.css";
import { CachorroFindAll, downloadImage, findByIdCachorro } from "../services/ConsumeApi";
import logo from '../assets/vira-lata.png';
import { AuthContext } from "../contexts/AuthContext";
import { Modal, Button } from "react-bootstrap";


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
    const [imageUrl, setImageUrl] = useState(null);



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
            const body = await CachorroFindAll();

            if (body && Array.isArray(body)) {
                const cachorrosWithImages = await Promise.all(
                    body.map(async (cachorro) => {
                        const imagePet = await downloadImage(cachorro.imagePath);
                        return {
                            ...cachorro,
                            imageUrl: imagePet,
                        };
                    })
                );

                setCachorros(cachorrosWithImages); // Atualiza o estado com os cachorros e suas imagens
            }

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

                            <div class="labelPet">Data de nascimento:</div>
                            <div class="valorPet">{selectedDog.idade}</div>

                            <div class="labelPet">Sexo:</div>
                            <div class="valorPet">{selectedDog.sexo}</div>

                            <div class="labelPet">Porte:</div>
                            <div class="valorPet">{selectedDog.porte}</div>

                            <div class="labelPet">Pelagem:</div>
                            <div class="valorPet">{selectedDog.pelagem}</div>

                        </div>
                        <div class="row">
                            <div className="titleModalPet">
                                <h4>Características </h4>
                            </div>
                            <div class="labelPet">Gosta de Crianças</div>
                            <div class="valorPet">{selectedDog.gostaCrianca ? 'Sim' : 'Não'}</div>

                            <div class="labelPet">Ideal para casa?</div>
                            <div class="valorPet">{selectedDog.idealCasa ? 'Sim' : 'Não'}</div>

                            <div class="labelPet">Gosta de brincar?</div>
                            <div class="valorPet">{selectedDog.brincalhao ? 'Sim' : 'Não'}</div>

                            <div class="labelPet">É cão de guarda?</div>
                            <div class="valorPet">{selectedDog.caoGuarda ? 'Sim' : 'Não'}</div>

                            <div class="labelPet">Tem necessidade de correr?</div>
                            <div class="valorPet">{selectedDog.necessidadeCorrer ? 'Sim' : 'Não'}</div>

                            <div class="labelPet">Tem queda de pelo?</div>
                            <div class="valorPet">{selectedDog.necessidadeCorrer ? 'Sim' : 'Não'}</div>

                            <div class="labelPet">Gosta de Latir?</div>
                            <div class="valorPet">{selectedDog.tendeLatir ? 'Sim' : 'Não'}</div>

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
            </Modal.Footer>
        </Modal>
    );


    console.log(cachorros)
    return (
        <Layout>
            <div >
                {loading ? (
                    <p>Carregando...</p>
                ) : cachorros.length > 0 ? (
                    <Slider {...settings}>
                        {cachorros.map((cachorro) => (
                            <div key={cachorro.id}>
                                <img
                                    src={cachorro.imageUrl || logo}
                                    alt={cachorro.nome || "Cachorro"}
                                    style={{ width: '250px', height: '200px', objectFit: 'cover' }}
                                />
                                <h3>{cachorro.nome || "Nome não disponível"}</h3>
                                <button
                                    type="button"
                                    className="btn btn-warning"
                                    onClick={() => openModalPet(cachorro.id)}
                                >
                                    Visualizar Informações
                                </button>
                            </div>
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
