import {
    React,
    useContext,
} from "react";

import Logo from "components/Logo"
import TasksList from "components/TasksList";
import RefreshButton from "components/RefreshButton";
import AppContext from "AppContext";
import { TASK_STATES } from "Consts";

import "./Explore.css";

export const Explore = () => {
    const context = useContext(AppContext);
    const tasksAcceptingBets = context.tasks.filter(
        t => (
            t.task_state === TASK_STATES.ACCEPT_BETS &&
            t.created_by !== context.userId &&
            t.bets.every(b => b.created_by !== context.userId)
        )
    );

    return (
        <div className="screen explore">
            <Logo />
            <RefreshButton />
            <div className="section-title tasks-accepting-bets">TASKS ACCEPTING BETS</div>
            <div className="list-wrapper">
                <TasksList tasks={tasksAcceptingBets} />
            </div>
        </div>
    )
};

export default Explore;