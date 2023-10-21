import {
  React,
} from "react";
import { ReactComponent as IconLockSvg } from "./icon_lock.svg"
import { TASK_STATE_MESSAGES } from "Consts"

import "./TaskState.css";

export const TaskState = ({state, className}) => {
  const stateMsg = TASK_STATE_MESSAGES[state];
  className += " state-" + state;
  return (
      <div className={"task-state " + className}>
          <div className="state-text">{stateMsg}</div>
          <IconLockSvg className="state-icon-lock"/>
      </div>
  );
};

export default TaskState;