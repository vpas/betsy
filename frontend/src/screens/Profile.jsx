import {
    React,
    useContext,
} from "react";
import { useCookies } from 'react-cookie';
import { useApolloClient} from '@apollo/client';

import AppContext from "AppContext";
import Logo from "components/Logo"
import Button from "components/Button"
import UserInfo from "components/UserInfo"
import BackButton from "components/BackButton"
import Home from "screens/Home"

import "./Profile.css";

export const Profile = () => {
    const context = useContext(AppContext);
    const user = context.user;
    const [, setCookie] = useCookies(['user_id']);
    const client = useApolloClient();

    function onBackButton({shouldRefetch = false}) {
        context.updateContext(c => { 
            c.activeScreenId = Home.name;
            c.shouldRefetch = shouldRefetch;
        });
    }

    async function onLogout() {
        setCookie('user_id', null);
        await client.resetStore();
        context.updateContext(c => {
            c.userId = null;
            c.user = null;
        });
    }

    if (user) {
        return (
            <div className="profile">
                <Logo/>
                <BackButton onClick={onBackButton}/>
                <UserInfo className="user-info"/>
                <label className="email">{user.email}</label>
                <Button 
                    text="LOG OUT" 
                    className="logout-button"
                    onClick={onLogout}
                />
            </div>
        )
    } else {
        return <div/>
    }
};

export default Profile;