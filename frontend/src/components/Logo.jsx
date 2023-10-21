import React from "react";
import logo_svg from "./logo.svg"

import "./Logo.css";

export const Logo = () => {
    return (
        <div className="logo-wrapper">
            <div className="logo">
                betsy
            </div>
            {/* <img className="logo" alt="Icon logo" src={logo_svg} /> */}
        </div>
    );
};

export default Logo;