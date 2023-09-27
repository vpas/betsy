import {
    React,
    useContext,
} from "react";
import AppContext from "AppContext";
import "./UserInfo.css";
import Profile from "screens/Profile";
import Stars from "./Stars";

export const UserInfo = ({user = null}) => {
    const context = useContext(AppContext);
    if (!user) {
        user = context.user;
    }

    function onClick() {
        context.updateContext(c => {
            c.activeScreenId = Profile.name;
        });
    }

    return (
        <div className="user-info" onClick={onClick}>
            <div className="username">{user.username}</div>
            <Stars className="balance" value={user.stars}/>
        </div>
    );
};

export default UserInfo;