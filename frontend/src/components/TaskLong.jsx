import React from "react";

import star_svg from "./star.svg"
import TaskState from "components/TaskState";
import { timeLeftStr, ensureTextLen } from "Utils"
import { TASK_STATES } from "Consts";

import "./TaskLong.css";

export const TaskLong = ({ task, bet, onClick = () => {}, className, id }) => {
  return (
    <div 
      className={"task-long " + className} 
      onClick={() => onClick({ task, bet })}
      id={id}
    >
      <div className="title h4">{task.title}</div>
      <div className="description body1" >
        {ensureTextLen({
          text: task.description,
          maxLen: 110,
        })}
      </div>
      <TaskState
        state={task.task_state}
        className="task-long-state"
      />
      <div id="task-long-bet-amount" className="body3">{bet.bet_amount}</div>
      <img id="task-long-star-icon" alt="Icon star" src={star_svg} />
      {task.task_state === TASK_STATES.IN_PROGRESS &&
        <div className="time-left body2">
          {timeLeftStr(task)}
        </div>
      }
      {/* <div className="term">{hoursToDaysAndHours(bet.term_hours)}</div> */}
      {/* <div className="win-payout-block">
        <div className="win-payout-text">Payout if done</div>
        <Stars
          className="win-payout"
          value={bet.win_payout}
          formatAsEarning={true}
        />
      </div> */}
    </div>
  );
}
export default TaskLong;