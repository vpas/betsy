import React from "react";
import { useState } from 'react';
import Logo from "../components/Logo"
import Button from "../components/Button"
import { 
    gql, 
    useApolloClient,
    NetworkStatus,
} from '@apollo/client';
import "./Login.css";

const GET_USER_BY_EMAIL = gql`
    query GetUserByEmail($email: String = "") {
        users(where: {email: $email}) {
            email
            id
            username
            tasks
            bets
        }
    }
`

export const Login = ({setUser}) => {
    const client = useApolloClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function onLogin() {
        const result = await client.query({
            query: GET_USER_BY_EMAIL,
            variables: { email },
        });
        console.log(result);
        
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
                <label className="email-label">email</label>
                <input 
                    type="email" 
                    className="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <label className="password-label">password</label>
                <input 
                    type="password" 
                    className="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <label className="error">{error}</label>
                <Button 
                    text="LOGIN" 
                    className="login-button"
                    onClick={onLogin}
                />
            </form>
        </div>
    )
}

export default Login;