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
        const response = await findByIdCachorro(id, authToken);
        if (response) {
            console.log(response)
            setSelectedDog(response); // Armazena os dados do cachorro
            setShow(true); // Abre o modal
        }
    };

    const renderModal = () => (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{selectedDog?.nome || "Detalhes do Cachorro"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedDog ? (
                    <div>
                        <p><strong>Raça:</strong> {selectedDog.raca}</p>
                        <p><strong>Idade:</strong> {selectedDog.idade}</p>
                        <p><strong>Descrição:</strong> {selectedDog.descricao}</p>
                    </div>
                ) : (
                    <p>Carregando...</p>
                )}
            </Modal.Body>
            <Modal.Footer>
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
                            <div key={imageUrl}>
                                <img src={cachorro.imageUrl || logo} alt={cachorro.nome}
                                    style={{ width: '250px', height: '200px', objectFit: 'cover' }}
                                />
                                <h3>{cachorro.nome}</h3>
                                <button type="button" class="btn btn-warning" onClick={() => openModalPet(cachorro.id)}>Visualizar Informações</button>
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
