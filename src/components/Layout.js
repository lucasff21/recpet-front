import Footer from './Footer';
import NavBar from './NavBar';
import '../styles/StyledComponentLayout.css';


const Layout = ({ children }) => {
    return (
        <div className="layout-container">
            <NavBar />  
            <main>
                {children}  
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
