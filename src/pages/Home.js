import Layout from "../components/Layout";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/HomePage.css";
import { CachorroFindAll } from "../services/ConsumeApi";
import logo from '../assets/vira-lata.png';

// Componente de seta customizada
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
            if (body) {
                setCachorros(body)
            }
            setLoading(false);
        }
        fetchCachorros();
    }, [])


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
                                <img src={logo} alt={cachorro.nome}
                                    style={{ width: '250px', height: '200px', objectFit: 'cover' }}
                                />
                                <h3>{cachorro.nome}</h3>
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <p>Nenhum cachorro encontrado</p>
                )}
            </div>
            {/*
            <div style={{marginTop: 100}}>
                {loading ? (
                    <p>Carregando...</p>
                ) : cachorros.length > 0 ? (
                    <Slider {...settings}>
                        {cachorros.map((cachorro) => (
                            <div key={cachorro.id}>
                                <img src={logo} alt={cachorro.nome}
                                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                                />
                                <h3>{cachorro.nome}</h3>
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <p>Nenhum cachorro encontrado</p>
                )}
            </div>

            */}
            { /* 
            <div style={{marginTop: 100}}>
                {loading ? (
                    <p>Carregando...</p>
                ) : cachorros.length > 0 ? (
                    <Slider {...settings}>
                        {cachorros.map((cachorro) => (
                            <div key={cachorro.id}>
                                <img src={logo} alt={cachorro.nome}
                                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                                />
                                <h3>{cachorro.nome}</h3>
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <p>Nenhum cachorro encontrado</p>
                )}
            </div>
            */}
        </Layout>
    );
};

export default Home;
