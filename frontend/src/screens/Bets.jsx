import {
    React,
    useContext,
} from "react";

import Logo from "components/Logo"
import TasksList from "components/TasksList";
import AppContext from "AppContext";
import { TASK_STATES_ACTIVE } from "Consts";

import "./Bets.css";

export const Bets = () => {
    const context = useContext(AppContext);
    const tasksWithOurBets = context.tasks.filter(
        t => (
            TASK_STATES_ACTIVE.has(t.state) &&
            t.created_by !== context.userId &&
            t.bets.some(b => b.created_by === context.userId)
        )
    );

    return (
        <div className="screen bets">
            <Logo />
            <div className="section-title your-bets">YOUR BETS</div>
            <div className="list-wrapper">
                <TasksList tasks={tasksWithOurBets} />
            </div>
        </div>
    )
};

export default Bets;