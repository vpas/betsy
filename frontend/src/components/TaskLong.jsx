import React from "react";
import "./TaskLong.css";
import star_svg from "./star.svg"

export const TaskLong = ({task}) => {
    return (
        <div className="task-long">
            <p className="text-wrapper">
                {task.description}
            </p>
            <div className="amount-of-money"></div>
            <img className="icon-star" alt="Icon star" src={star_svg} />
            <div className="time-left">14h left</div>
            <div className="name">{task.title}</div>
        </div>
    );
};

export default TaskLong;