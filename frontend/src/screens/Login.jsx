import { React, useState, useContext } from 'react';

import Logo from "components/Logo"
import Button from "components/Button"
import AppContext from "AppContext";

import "./Login.css";

export const Login = ({setUser}) => {
    const context = useContext(AppContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function onLogin() {
        console.log("onLogin");
        const response = await context.axios.post('users/login', { "email": email });
        
        if (response.data.user) {
          console.log(response.data.user);
          setUser(response.data.user);
        } else {
          console.log(response.data.message);
          setError("No user found");
        }
    }

    return (
        <div className="screen login">
            <Logo/>
            <form>
                <div className="login-text">LOGIN</div>
                <input 
                    type="email" 
                    className="email"
                    value={email}
                    placeholder="Email"
                    onChange={e => setEmail(e.target.value)}
                />
                <input 
                    type="password" 
                    className="password"
                    value={password}
                    placeholder="Password"
                    onChange={e => setPassword(e.target.value)}
                />
                <label className="error">{error}</label>
                <Button 
                    text="LOG IN" 
                    className="login-button"
                    onClick={onLogin}
                />
            </form>
        </div>
    )
}

export default Login;