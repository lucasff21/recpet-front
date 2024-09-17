import { Link } from "react-router-dom";
import styled from "styled-components";

const NavBarContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 10px;
  background-color: #333;
  color: white;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 10px;
  &:hover {
    background-color: #555;
    border-radius: 5px;
  }
`;

const NavBar = () => {
    return (
        <NavBarContainer>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
        </NavBarContainer>
    )
}

export default NavBar;
