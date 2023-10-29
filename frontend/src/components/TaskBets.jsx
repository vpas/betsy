import {
  React,
  useContext,
} from "react";

import AppContext from "AppContext";
import star_svg from "./star.svg"
import { formatEarning } from "Utils";

import "./TaskBets.css";

export const TaskBets = ({ task, className, id }) => {
  const context = useContext(AppContext);
  
  return (
    <div
      className={"task-bets " + className}
      id={id}
    >
      {task.bets.map(bet => (
        <div
          key={bet.id}
          className="task-bet"
        >
          <div className="task-info-final-payout-amount body1">{formatEarning(bet.final_payout)}</div>
          <img className="task-info-final-payout-star-icon" alt="Icon star" src={star_svg} />
          <div className="task-info-final-payout-username body1">
            {bet.created_by === context.userId ? "You" : bet.owner.username}
          </div>
        </div>
      ))}

    </div>
  );
}

export default TaskBets;