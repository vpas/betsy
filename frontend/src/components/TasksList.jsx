import {
  React,
  useContext,
} from "react";

import TaskShort from "components/TaskShort";
import CreateEditTask from "screens/CreateEditTask";
import TaskInfo from "screens/TaskInfo";
import AppContext from "AppContext";
import { ACTIONS } from "Consts";

import "./TasksList.css";

export const TasksList = ({ tasks, onClickAction = ACTIONS.EDIT }) => {
  const context = useContext(AppContext);

  function onClick({ task, bet }) {
    if (onClickAction === ACTIONS.EDIT) {
      context.updateContext(c => {
        c.prevScreenId = c.activeScreenId;
        c.activeScreenId = CreateEditTask.name;
        c.inputTask = task;
        c.inputBet = bet;
      });
    } else if (onClickAction === ACTIONS.VIEW) {
      context.updateContext(c => {
        c.prevScreenId = c.activeScreenId;
        c.activeScreenId = TaskInfo.name;
        c.inputTask = task;
      });
    }
  }

  return (
    <div className="tasks-list">
      {tasks.map(t => <TaskShort key={t.id} task={t} onClick={onClick} />)}
    </div>
  );
};

export default TasksList;