import React, { useContext } from "react";
// import refresh_icon_svg from "./refresh_icon.svg"
import {ReactComponent as RefreshButtonIcon} from "./refresh_icon.svg"

import "./RefreshButton.css";
import AppContext from "AppContext";

export const RefreshButton = () => {
    const context = useContext(AppContext);

    function onClick() {
        context.updateContext(c => {
            c.shouldRefetch = true;
        });
    }

    return (
        <RefreshButtonIcon 
            className="refresh-button"
            onClick={onClick}
        />
    );
};

export default RefreshButton;