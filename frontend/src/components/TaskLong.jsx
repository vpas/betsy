import React, { useContext } from "react";
import star_svg from "./star.svg"
import CreateEditTask from "screens/CreateEditTask";
import AppContext from "AppContext";
import { TASK_STATE_MESSAGES } from "Consts";
import { hoursToDaysAndHours } from "Utils"

import "./TaskLong.css";

export const TaskLong = ({task}) => {
    const context = useContext(AppContext);

    function onClick() {
        context.updateContext(c => {
            c.activeScreenId = CreateEditTask.name;
            c.taskToEdit = task;
        });
    }

    return (
        <div className="task-long" onClick={onClick}>
            <div className="title">{task.title}</div>
            <div className="status">{TASK_STATE_MESSAGES[task.state]}</div>
            <textarea 
                className="description" 
                value={task.description}
                disabled
            />
            <div className="bet-amount">{task.owner_bet.bet_amount}</div>
            <img className="icon-star" alt="Icon star" src={star_svg} />
            <div className="term">{hoursToDaysAndHours(task.owner_bet.term_hours)}</div>
        </div>
    );
}
export default TaskLong;