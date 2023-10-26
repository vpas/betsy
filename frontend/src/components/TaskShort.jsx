import {
  React,
  useContext,
} from "react";

import AppContext from "AppContext";
import star_svg from "./star.svg"
import TaskState from "components/TaskState";

import "./TaskShort.css";
import { TASK_STATES } from "Consts";

export const TaskShort = ({ task, onClick = () => { } }) => {
  const context = useContext(AppContext);
  const ourBet = task.bets.find(b => b.created_by === context.userId);
  const isOurs = task.created_by === context.userId;
  const hasBonus = (
    isOurs && (
      task.task_state === TASK_STATES.DONE ||
      task.task_state === TASK_STATES.DONE_OVERTIME
    )
  );

  const bet = ourBet ? ourBet : task.owner_bet;

  let starsValue;
  // let formatAsEarning;
  if (ourBet && ourBet.final_payout != null) {
    starsValue = ourBet.final_payout;
    // formatAsEarning = true;
  } else {
    starsValue = bet.bet_amount;
    // formatAsEarning = false;
  }

  return (
    <div className="task-short" onClick={() => onClick({ task: task, bet: ourBet })}>
      <div className="title h4">{task.title}</div>
      <TaskState
        state={task.task_state}
        className="task-short-state"
      />
      <div id="task-short-stars-value" className="body3">{starsValue}</div>
      <img id="task-short-star-icon" alt="Icon star" src={star_svg} />
      <div
        className="owner body2"
        style={{ visibility: isOurs ? "hidden" : "visible" }}
      >
        {task.owner.username}
      </div>
      {hasBonus &&
        <div id="completion-bonus">
          <div id="completion-bonus-text" className="body2">Time bonus</div>
          <div id="completion-bonus-amount" className="body2">+{ourBet.term_hours}</div>
          <img id="completion-bonus-icon-star" alt="Icon star" src={star_svg} />
        </div>
      }
    </div>
  );
};

export default TaskShort;