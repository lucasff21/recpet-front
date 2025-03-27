import '../styles/ComponentLayout.css';
import logo from '../assets/logo-pet.png';
import {Link} from "react-router-dom";

const Footer = () => {
    return (
    <footer className="bg-cyan-900 text-white py-6 px-4 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between md:items-start space-y-6 md:space-y-0 md:gap-16">
            <img src={logo} alt="Logo" className="w-12 h-12 mb-4 md:mb-0"/>

            <div>
                <h3 className="font-semibold text-lg text-white">Institucional</h3>
                <ul className="space-y-2 mt-2 p-0">
                    <li>
                        <Link to="#" className="text-white hover:underline">Quem somos</Link>
                    </li>
                </ul>
            </div>

            <div>
                <h3 className="font-semibold text-lg text-white">Navegação</h3>
                <ul className="space-y-2 mt-2 p-0">
                    <li>
                        <Link to="#" className="text-white hover:underline">Adote</Link>
                    </li>
                    <li>
                        <Link to="#" className="text-white hover:underline">Dúvidas Frequentes</Link>
                    </li>
                    <li>
                        <Link to="#" className="text-white hover:underline">Blog</Link>
                    </li>
                </ul>
            </div>

            <div className="max-w-xs">
                <h3 className="font-semibold text-lg">Contato</h3>
                <p className="text-sm">
                    Avenida Milton Santos, s/n - Campus de Ondina, PAF 2 - Salvador - Bahia, CEP 40.170-110
                </p>
            </div>
        </div>
    </footer>
    )
}

export default Footer;