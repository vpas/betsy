import {
    React,
    useContext,
} from "react";
import { useQuery } from "@apollo/client";

import Logo from "components/Logo"
import UserInfo from "components/UserInfo"
import LoadingBlock from "components/LoadingBlock"
import ErrorBlock from "components/ErrorBlock"
import CreateTaskButton from "components/CreateTaskButton"
import TaskLong from "components/TaskLong"
import AppContext from "AppContext";
import {GET_USER_BETS, GET_USER_BY_ID, GET_USER_TASKS} from "GraphQLQueries";
import {TASK_STATES_ACTIVE} from "Consts";
import {joinQueries} from "Utils";

import "./Home.css";

export const Home = () => {
    const context = useContext(AppContext);
    const userId = context.userId;
    const userQuery = useQuery(GET_USER_BY_ID, {
        variables: { id: parseInt(userId) },
        onCompleted: () => {
            context.updateContext(c => { c.user = userQuery.data.users[0] });
        }
    });
    const tasksQuery = useQuery(GET_USER_TASKS, { variables: { user_id: userId }});
    const betsQuery = useQuery(GET_USER_BETS, { variables: { user_id: userId }});

    async function refetch() {
        await userQuery.refetch();
        await tasksQuery.refetch();
        await betsQuery.refetch();
        context.updateContext(c => { c.shouldRefetch = false; });
    }

    if (context.shouldRefetch) {
        refetch();
    }

    function TaskBlock() {
        const curTask = tasksQuery.data.tasks.find(t => TASK_STATES_ACTIVE.has(t.state));
        if (!curTask) {
            return <CreateTaskButton/>
        } else {
            const yourTaskBet = betsQuery.data.bets.find(b => b.task_id === curTask.id);
            return <TaskLong task={curTask} bet={yourTaskBet}/>
        }
    }

    const {loading, error} = joinQueries(userQuery, tasksQuery, betsQuery);
    if (error) {
        return <ErrorBlock message={error.message}/>
    } else if (loading || context.shouldRefetch) {
        return <LoadingBlock/>
    } else {
        const user = userQuery.data.users[0];
        return (
            <div className="screen home">
                <Logo/>
                <UserInfo className="user-info" user={user}/>
                <div className="section-title your-task">YOUR TASK</div>
                <div className="task-block-wrapper">
                    <TaskBlock/>
                </div>
                <div className="section-title your-bets">YOUR BETS</div>
                
            </div>
        )
    }
}

export default Home;