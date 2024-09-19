import '../styles/StyledComponentLayout.css';
import logo from '../assets/logo-pet.png';

const Footer = () => {
    return (
        <div style={{ backgroundColor: '#f0ac4c' }}>
            <div className="container text-center footer-items">
                <div className="row align-items-end">
                    <div className="col-4">
                        <ul className="list-group no-bullets">
                            <li>IC - INSTITUTO DE COMPUTAÇÃO/UFBA</li>
                            <li>Avenida Milton Santos, s/n - Campus de Ondina, PAF 2 - Salvador - Bahia, CEP 40.170-110</li>
                            <li>Desenvolvido Lucas França Freita</li>
                        </ul>
                    </div>
                    <div className ="col-4">
                        <img src={logo} alt="Logo" className="rounded-circle-footer" />

                    </div>
                    <div className ="col-4">
                        <ul className="list-group no-bullets">
                            <li>
                                <p>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-fill" viewBox="0 0 16 16" style={{ marginRight: 10 }}>
                                        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z" />
                                    </svg>
                                    ceapg-ic@ufba.br
                                </p>
                            </li>
                            <li>
                                <p>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telephone-forward-fill" viewBox="0 0 16 16" style={{ marginRight: 10 }}>
                                        <path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877zm10.761.135a.5.5 0 0 1 .708 0l2.5 2.5a.5.5 0 0 1 0 .708l-2.5 2.5a.5.5 0 0 1-.708-.708L14.293 4H9.5a.5.5 0 0 1 0-1h4.793l-1.647-1.646a.5.5 0 0 1 0-.708" />
                                    </svg>
                                    (71) 9 9999-9999
                                </p>
                            </li>
                        </ul>

                    </div>
                </div>
            </div>
        </div>

    )
}

export default Footer;