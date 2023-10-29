import {
  React,
  useContext,
} from "react";

import AppContext from "AppContext";
import BackButton from "components/BackButton"
import TaskBets from "components/TaskBets"
import TaskLong from "components/TaskLong";

import "./TaskInfo.css";

export const TaskInfo = () => {
  const context = useContext(AppContext);
  const task = context.inputTask;
  
  function onBackButton() {
    context.updateContext(c => {
      c.activeScreenId = c.prevScreenId;
    });
  }

  return (
    <div className="screen task-info">
      <BackButton onClick={onBackButton} />
      <div
        id="task-info-screen-title"
        className="screen-title h2">
        Task info
      </div>
      <TaskLong
        id="task-info-task-long"
        task={task}

      />
      <div id="task-info-task-bets-title" className="section-title h3">Task's bets</div>
      <TaskBets id="task-info-task-bets" task={task}/>
    </div>
  )
};

export default TaskInfo;