import {
    React,
    useContext,
} from "react";
import AppContext from "AppContext";
import Profile from "screens/Profile";
import star_svg from "./star.svg"

import "./UserInfo.css";

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
            <div className="username body1">{user.username}</div>
            <div className="stars-amount body1">{user.stars}</div>
            <img className="icon-star" alt="Icon star" src={star_svg} />
        </div>
    );
};

export default UserInfo;