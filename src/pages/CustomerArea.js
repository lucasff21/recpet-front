import { useState } from "react";
import Layout from "../components/Layout";
import "../styles/CustomerArea.css"
import { loginUser } from "../services/ApiUser";

const CustomerArea = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

  

    const login = async () => { 
        if (email && password){
            const token = await loginUser(email, password)

            if(token){
                console.log("TOKEN RETORNADO: ", token )
            }
        }
    }

    return (
        <Layout>
            <div className="container" id="div-principal-customer">
                <div className="row">
                    <div className="col card-creat-account">
                        <h3>Bem Vindo</h3>
                    </div>
                    <div className="col card-login-account">
                        <h3>Login</h3>
                        <form onSubmit={(e) => { e.preventDefault(); login(); }}>
                            <div className="form-group">
                                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E M A I L: " />
                        
                                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} id="exampleInputPassword1" placeholder="S E N H A:" />
                            </div>
                            <div>

                            </div>
                            <button type="submit" className="button-customer">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )

}

export default CustomerArea;