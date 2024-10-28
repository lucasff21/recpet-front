import Footer from './Footer';
import NavBar from './NavBar';
import '../styles/ComponentLayout.css';


const Layout = ({ children, showNavBar= true, showFooter = true }) => { 
    return (
        <div className="layout-container">
            {showNavBar && <NavBar />}
            <main>
                {children}  
            </main>
            {showFooter && <Footer />} 
        </div>
    );
};

export default Layout;
