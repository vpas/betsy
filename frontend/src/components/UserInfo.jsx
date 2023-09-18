import {
    React,
    useContext,
} from "react";
import AppContext from "AppContext";
import star_svg from "./star.svg"
import "./UserInfo.css";
import Profile from "screens/Profile";

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
            <div className="stars">{user.stars}</div>
            <img className="icon-star" src={star_svg} alt="star"/>
        </div>
    );
};

export default UserInfo;