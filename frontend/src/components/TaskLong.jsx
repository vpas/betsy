import React from "react";
import "./TaskLong.css";
import star_svg from "./star.svg"

export const TaskLong = () => {
    return (
        <div className="task-long">
            <p className="text-wrapper">
                Had repulsive dashwoods suspicion sincerity but advantage now him. Remark easily garret nor nay. Civil those mrs
                enjoy shy fat merry. You greatest jointure saw horrible. He private he on be imagine suppose.
            </p>
            <div className="amount-of-money">80</div>
            <img className="icon-star" alt="Icon star" src={star_svg} />
            <div className="time-left">14h left</div>
            <div className="name">Bet’s name</div>
        </div>
    );
};

export default TaskLong;