import React from "react";
import star_svg from "./star.svg"

import "./Stars.css";

export const Stars = ({value, className, formatAsEarning = false}) => {
    let amountClass = "amount body3";
    if (formatAsEarning) {
        if (value < 0) {
            amountClass += " negative";
        } else if (value >= 0) {
            amountClass += " positive";
            value = `+${value}`;
        } else {
            // do nothing for 0
        }
    }
    return (
        <div className={"stars " + className}>
            <div className={amountClass}>{value}</div>
            <img className="icon-star" alt="Icon star" src={star_svg} />
        </div>
    );
}
export default Stars;