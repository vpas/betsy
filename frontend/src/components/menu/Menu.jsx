import React from "react";
import Home from "screens/Home"
import Bets from "screens/Bets"
import Explore from "screens/Explore"
import History from "screens/History"

import {ReactComponent as ButtonHomeSvg } from "./button_home.svg"
import {ReactComponent as ButtonBetsSvg } from "./button_bets.svg"
import {ReactComponent as ButtonExploreSvg } from "./button_explore.svg"
import {ReactComponent as ButtonHistorySvg } from "./button_history.svg"
import MenuButton from "./MenuButton"
import "./Menu.css";

export const MENU_BUTTONS_INFO = {
    [Home.name]: { text: "Home", icon: ButtonHomeSvg },
    [Bets.name]: { text: "Bets", icon: ButtonBetsSvg },
    [Explore.name]: { text: "Explore", icon: ButtonExploreSvg },
    [History.name]: { text: "History", icon: ButtonHistorySvg },
}

export const Menu = () => {
    return (
        <div className="menu">
            <MenuButton id={Home.name}/>
            <MenuButton id={Bets.name}/>
            <MenuButton id={Explore.name}/>
            <MenuButton id={History.name}/>
        </div>
    );
};

export default Menu;
