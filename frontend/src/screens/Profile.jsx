import {
    React,
    useContext,
} from "react";
import { useCookies } from 'react-cookie';

import AppContext from "AppContext";
import Button from "components/Button"
import UserInfo from "components/UserInfo"
import BackButton from "components/BackButton"
import Home from "screens/Home"

import "./Profile.css";

export const Profile = () => {
    const context = useContext(AppContext);
    const user = context.user;
    const [, setCookie] = useCookies(['user_id']);

    let notificationBtnText = "";
    if (context.isNotificationsSupported) {
      if (context.isSubscribed) {
        notificationBtnText = "Unsubscribe";
      } else {
        notificationBtnText = "Subscribe";
      }
    } else {
      notificationBtnText = "Notifications not supported";
    }
    
    function onBackButton({shouldRefetch = false}) {
        context.updateContext(c => { 
            c.activeScreenId = Home.name;
            c.shouldRefetch = shouldRefetch;
        });
    }

    async function toggleNotifications() {
      if (context.isNotificationsSupported) {
        if (context.isSubscribed) {
          context.notificationsManager.unsubscribeUser();
        } else {
          context.notificationsManager.subscribeUser();
        }
      } else {
        await context.notificationsManager.init();
      }
    }

    async function onLogout() {
        setCookie('user_id', null);
        context.updateContext(c => {
            c.userId = null;
            c.user = null;
            c.activeScreenId = Home.name;
            c.activeTabId = Home.name;
        });
    }

    if (user) {
        return (
            <div className="profile">
                <BackButton onClick={onBackButton}/>
                <UserInfo className="user-info"/>
                <label className="email">{user.email}</label>
                <Button
                  text={notificationBtnText}
                  className="notifications-button"
                  onClick={toggleNotifications}
                  enabled={context.subscribeButtonEnabled}
                />
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