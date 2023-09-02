import React from "react";
import "./BetShorts.css";
import star_svg from "./star.svg"

export const Box = () => {
    return (
        <div className="box">
            <div className="bet-short">
                <div className="overlap-group">
                    <div className="amount-of-money">80</div>
                    <img className="star" alt="Star" src={star_svg} />
                    <div className="time-left">14h left</div>
                    <div className="text-wrapper">Bet’s name</div>
                </div>
            </div>
        </div>
    );
};
