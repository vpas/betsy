import React, { useContext } from "react";
import star_svg from "./star.svg"
import CreateEditTask from "screens/CreateEditTask";
import AppContext from "AppContext";
import { TASK_STATES } from "Consts";
import {hoursToDaysAndHours} from "Utils"

import "./TaskLong.css";

export const TaskLong = ({task, bet}) => {
    const context = useContext(AppContext);

    function onClick() {
        context.updateContext(c => {
            c.activeScreenId = CreateEditTask.name;
            c.taskProp = task;
            c.yourBetProp = bet;
        });
    }

    let status = "";
    if (task.state === TASK_STATES.ACCEPT_BETS) {
        status = "Waiting for bets";
    } else if (task.state === TASK_STATES.BETS_FINALIZED) {
        status = "Ready to start";
    } else if (task.state === TASK_STATES.IN_PROGRESS) {
        status = "In progress";
    }
    return (
        <div className="task-long" onClick={onClick}>
            <div className="title">{task.title}</div>
            <div className="status">{status}</div>
            <textarea 
                className="description" 
                value={task.description}
                disabled
            />
            <div className="bet-amount">{bet.bet_amount}</div>
            <img className="icon-star" alt="Icon star" src={star_svg} />
            <div className="term">{hoursToDaysAndHours(bet.term_hours)}</div>
        </div>
    );
}
export default TaskLong;