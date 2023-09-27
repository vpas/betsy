import React from "react";

import Stars from "components/Stars";
import { TASK_STATE_MESSAGES } from "Consts";
import { hoursToDaysAndHours } from "Utils"

import "./TaskLong.css";

export const TaskLong = ({task, bet, onClick}) => {
    return (
        <div className="task-long" onClick={() => onClick({task, bet})}>
            <div className="title">{task.title}</div>
            <div className="status">{TASK_STATE_MESSAGES[task.state]}</div>
            <textarea 
                className="description" 
                value={task.description}
                disabled
            />
            <Stars className="bet-amount" value={bet.bet_amount}/>
            <div className="term">{hoursToDaysAndHours(bet.term_hours)}</div>
            <div className="win-payout-block">
                {/* <div className="win-payout-text">Payout if done</div> */}
                <Stars 
                    className="win-payout" 
                    value={bet.win_payout}
                    formatAsEarning={true}
                />
            </div>
        </div>
    );
}
export default TaskLong;