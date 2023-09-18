import {
    React,
    useContext,
} from "react";

import Logo from "components/Logo"
import UserInfo from "components/UserInfo"
import CreateTaskButton from "components/CreateTaskButton"
import TaskLong from "components/TaskLong"
import AppContext from "AppContext";
import { TASK_STATES_ACTIVE } from "Consts";

import "./Home.css";

export const Home = () => {
    const context = useContext(AppContext);

    function TaskBlock() {
        const curTask = context.tasks.find(
            t => (
                t.created_by === context.user.id &&
                TASK_STATES_ACTIVE.has(t.state)
            )
        );
        if (!curTask) {
            return <CreateTaskButton />
        } else {
            return <TaskLong task={curTask} />
        }
    }

    return (
        <div className="screen home">
            <Logo />
            <UserInfo className="user-info" user={context.user} />
            <div className="section-title your-task">YOUR TASK</div>
            <div className="task-block-wrapper">
                <TaskBlock />
            </div>
            <div className="section-title your-bets">YOUR BETS</div>

        </div>
    )
}

export default Home;