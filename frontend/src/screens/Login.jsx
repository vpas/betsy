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
          setError("Login or password is not correct");
        }
    }

    function onKeyDown(event) {
      if (event.key === 'Enter'){
        onLogin();
      }
    }

    const classError = error ? " input-error" : "";

    return (
        <div className="screen login">
            <Logo/>
            <form>
                <div className="login-text section-title">LOG IN</div>
                <div className={"input-wrapper email-wrapper" + classError}>
                  <input 
                      type="email" 
                      className="input email"
                      value={email}
                      placeholder="Email"
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={onKeyDown}
                  />
                </div>
                <div className={"input-wrapper password-wrapper" + classError}>
                  <input 
                      type="password" 
                      className="input password"
                      value={password}
                      placeholder="Password"
                      onChange={e => setPassword(e.target.value)}
                      onKeyDown={onKeyDown}
                  />
                </div>
                <label className="error">{error}</label>
                <Button 
                    text="LOG IN" 
                    className="login-button"
                    onClick={onLogin}
                    disabled={email === ""}
                />
            </form>
        </div>
    )
}

export default Login;