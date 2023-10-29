import {
  React,
  useContext,
  useState,
} from "react";

import Logo from "components/Logo"
import TasksList from "components/TasksList";
import RefreshButton from "components/RefreshButton";
import AppContext from "AppContext";
import { ACTIONS, TASK_STATES_ACTIVE } from "Consts";

import "./History.css";

const TABS = {
  TASKS: "tasks",
  BETS: "bets",
}

export const History = () => {
  const context = useContext(AppContext);
  const [tab, setTab] = useState(TABS.TASKS);
  const finalizedTasks = context.tasks.filter(
    t => !TASK_STATES_ACTIVE.has(t.task_state));
  const ourTasks = finalizedTasks.filter(
    t => t.created_by === context.user.id);
  const tasksWithOurBets = finalizedTasks.filter(
    t =>
      t.created_by !== context.user.id &&
      t.bets.some(b => b.created_by === context.userId));

  function ActiveList() {
    let tasks = null;
    if (tab === TABS.TASKS) {
      tasks = ourTasks;
    } else if (tab === TABS.BETS) {
      tasks = tasksWithOurBets;
    } else {
      console.error(`Unkown tab name: ${tab}`);
      return <div>error</div>
    }
    return <TasksList tasks={tasks} onClickAction={ACTIONS.VIEW}/>
  }

  return (
    <div className="screen history">
      <Logo />
      <RefreshButton />
      <div id="history-tabs">
        <div
          className={"body1 tab tasks " + (tab === TABS.TASKS ? "active" : "")}
          onClick={() => setTab(TABS.TASKS)}
        >
          Your Tasks
        </div>
        <div
          className={"body1 tab bets " + (tab === TABS.BETS ? "active" : "")}
          onClick={() => setTab(TABS.BETS)}
        >
          Your Bets
        </div>
      </div>
      <div className="list-wrapper">
        <ActiveList />
      </div>
    </div>
  )
};

export default History;