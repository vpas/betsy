import {
    React,
    useContext,
} from "react";

import Logo from "components/Logo"
import UserInfo from "components/UserInfo"
import CreateTaskButton from "components/CreateTaskButton"
import TaskLong from "components/TaskLong"
import RefreshButton from "components/RefreshButton";
import TasksList from "components/TasksList";
import CreateEditTask from "screens/CreateEditTask";
import AppContext from "AppContext";
import { TASK_STATES_ACTIVE } from "Consts";

import "./Home.css";

export const Home = () => {
    const context = useContext(AppContext);

    const tasksWithOurBets = context.tasks.filter(
        t => (
            TASK_STATES_ACTIVE.has(t.state) &&
            t.created_by !== context.userId &&
            t.bets.some(b => b.created_by === context.userId)
        )
    );

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
            return <TaskLong 
                task={curTask} 
                bet={curTask.owner_bet}
                onClick={taskOnClick}
            />
        }
    }

    function taskOnClick({task, bet}) {
        context.updateContext(c => {
            c.prevScreenId = c.activeScreenId;
            c.activeScreenId = CreateEditTask.name;
            c.inputTask = task;
            c.inputBet = bet;
        });
    }

    return (
        <div className="screen home">
            <Logo />
            <RefreshButton />
            <UserInfo className="user-info" user={context.user} />
            <div className="section-title your-task">YOUR TASK</div>
            <div className="task-block-wrapper">
                <TaskBlock />
            </div>
            <div className="section-title your-bets">YOUR BETS</div>
            <div className="your-bets-list">
                <TasksList tasks={tasksWithOurBets} />
            </div>
        </div>
    )
}

export default Home;