import React from "react";
import "./ErrorBlock.css";

export const ErrorBlock = ({message}) => {
    return (
        <div className="error-block">
            Error: {message}
        </div>
    );
};

export default ErrorBlock;