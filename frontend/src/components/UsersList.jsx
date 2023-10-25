import {
    React,
} from "react";

import "./UsersList.css";

export const UsersList = ({users, className}) => {
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
                    <div className="username">{"- " + u.username}</div>
                </div>
            )}    
        </div>
    );
};

export default UsersList;