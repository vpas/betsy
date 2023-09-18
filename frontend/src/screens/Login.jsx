import React from "react";
import { useState } from 'react';
import { 
    useApolloClient,
    NetworkStatus,
} from '@apollo/client';

import Logo from "components/Logo"
import Button from "components/Button"
import {GET_USER_BY_EMAIL} from "GraphQLQueries";

import "./Login.css";

export const Login = ({setUser}) => {
    const client = useApolloClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function onLogin() {
        console.log("onLogin");
        const result = await client.query({
            query: GET_USER_BY_EMAIL,
            variables: { "email": email },
        });
        
        if (result.networkStatus !== NetworkStatus.ready) {
            setError("Network error");
            return;
        }
        if (result.data.users.length == 0) {
            setError("No user found");
            return;
        }
        let user = result.data.users[0];
        console.log(user);

        setUser(user);
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