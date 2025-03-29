import Footer from './Footer';
import Header from './Header';
import '../styles/ComponentLayout.css';


const Layout = ({ children, showNavBar= true, showFooter = true }) => { 
    return (
        <div className="layout-container">
            {showNavBar && <Header />}
            <main>
                {children}  
            </main>
            {showFooter && <Footer />} 
        </div>
    );
};

export default Layout;
