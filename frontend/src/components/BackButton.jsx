import React from "react";
import {ReactComponent as BackButtonSvg} from "./icon_back.svg"
import "./BackButton.css"

export const BackButton = ({onClick}) => {
    return (
        <div className="back-button" onClick={onClick}>
            <BackButtonSvg/>
        </div>
    );
};

export default BackButton;