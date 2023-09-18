import React from "react";
import "./Button.css";

export const Button = ({text, className, onClick, style}) => {
    return (
        <div 
            className={"button-wrapper " + className}
            onClick={onClick}
            style={style}
        >
            <div className="button">{text}</div>
        </div>
    );
};

export default Button;