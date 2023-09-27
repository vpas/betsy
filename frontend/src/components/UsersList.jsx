import {
    React,
    useContext,
} from "react";

import AppContext from "AppContext";

import "./UsersList.css";

export const UsersList = ({users, className}) => {
    const context = useContext(AppContext);

    return (
        <div className={className + " users-list"}>
            {users.map((u, i) => 
                <div className="user-card" key={i}>
                    <div 
                        className="color"
                        style={{
                            backgroundColor: u.color
                        }}
                    />
                    <div className="username">{u.username}</div>
                </div>
            )}    
        </div>
    );
};

export default UsersList;