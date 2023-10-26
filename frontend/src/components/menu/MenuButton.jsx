import {
    React,
    useContext,
} from "react";
import classNames from "classnames";

import AppContext from "AppContext";

import { MENU_BUTTONS_INFO } from "./Menu"
import "./MenuButton.css";

export const MenuButton = ({id, icon}) => {
    const context = useContext(AppContext);
    const isActive = context.activeTabId === id;
    const buttonInfo = MENU_BUTTONS_INFO[id];
    return (
        <div 
            className={classNames(
                "menu-button", 
                {active: isActive},
            )}
            onClick={() => context.updateContext(c => { 
              c.activeScreenId = id; 
              c.activeTabId = id;
            })}
        >
            <div className="text">{buttonInfo.text}</div>
            <buttonInfo.icon className="icon"/>
        </div>
    );
};

export default MenuButton;
