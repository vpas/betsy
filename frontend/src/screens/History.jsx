import {
    React,
    useContext,
    useState,
} from "react";

import Logo from "components/Logo"
import TasksList from "components/TasksList";
import RefreshButton from "components/RefreshButton";
import AppContext from "AppContext";
import { TASK_STATES_ACTIVE } from "Consts";

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
        if (tab === TABS.TASKS) {
            return <TasksList tasks={ourTasks} />
        } else if (tab === TABS.BETS) {
            return <TasksList tasks={tasksWithOurBets} />
        } else {
            console.error(`Unkown tab name: ${tab}`);
            return <div>error</div>
        }
    }

    return (
        <div className="screen history">
            <Logo />
            <RefreshButton />
            <div
                className={"tab tasks " + (tab === TABS.TASKS ? "active" : "")}
                onClick={() => setTab(TABS.TASKS)}
            >
                Tasks
            </div>
            <div
                className={"tab bets " + (tab === TABS.BETS ? "active" : "")}
                onClick={() => setTab(TABS.BETS)}
            >
                Bets
            </div>
            <div className="list-wrapper">
                <ActiveList />
            </div>
        </div>
    )
};

export default History;