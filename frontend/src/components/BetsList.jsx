import {
    React,
    useContext,
} from "react";
import AppContext from "AppContext";
import BetShort from "components/BetShort";

import "./BetsList.css";

export const BetsList = ({bets}) => {
    const context = useContext(AppContext);
    return (
        <div className="bets-list">
            {bets.map(b => <BetShort key={b.id} bet={b}/>)}
        </div>
    );
};

export default BetsList;