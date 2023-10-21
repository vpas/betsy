import React from "react";
import {ReactComponent as BackButtonSvg} from "./icon_back.svg"
import "./BackButton.css"

export const BackButton = ({onClick}) => {
    return (
        <div className="back-button" onClick={onClick}>
            <BackButtonSvg className="back-icon"/>
            <div className="back-text body1">Back</div>
        </div>
    );
};

export default BackButton;