import Footer from './Footer';
import Header from './Header';
import { ToastContainer } from 'react-toastify';

const Layout = ({ children, showNavBar = true, showFooter = true }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer />
      {showNavBar && <Header />}

      <main className={`flex-grow align-self-center w-screen`}>{children}</main>

      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
