import React from "react";
import "./Button.css";

export const Button = ({text, className, onClick}) => {
    return (
        <div 
            className={"button-wrapper " + className}
            onClick={onClick}
        >
            <div className="button">{text}</div>
        </div>
    );
};

export default Button;