import Layout from "../components/Layout";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/HomePage.css";

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
    const movies = [
        { id: 1, title: "Animal 1", image: "https://via.placeholder.com/150" },
        { id: 2, title: "Animal 2", image: "https://via.placeholder.com/150" },
        { id: 3, title: "Animal 3", image: "https://via.placeholder.com/150" },
        { id: 4, title: "Animal 4", image: "https://via.placeholder.com/150" },
        { id: 5, title: "Animal 5", image: "https://via.placeholder.com/150" },
        { id: 6, title: "Animal 6", image: "https://via.placeholder.com/150" },
    ];

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

    return (
        <Layout>
            <div>
                <Slider {...settings}>
                    {movies.map((movie) => (
                        <div key={movie.id}>
                            <img src={movie.image} alt={movie.title} />
                            <h3>{movie.title}</h3>
                        </div>
                    ))}
                </Slider>
            </div>
        </Layout>
    );
};

export default Home;
