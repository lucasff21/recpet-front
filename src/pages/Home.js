import { styled } from "styled-components";
import NavBar from "../components/NavBar";

const HomeContainer = styled.div`
  text-align: center;
`;

const Home = () => {
    return (
        <HomeContainer>
            <NavBar />
            <h1>Iniciando Construção.</h1>
        </HomeContainer>
    );
}


export default Home;