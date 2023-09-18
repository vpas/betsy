import {
    React,
    useContext,
    useState,
} from "react";
import { useQuery } from "@apollo/client";

import Logo from "components/Logo"
import LoadingBlock from "components/LoadingBlock"
import ErrorBlock from "components/ErrorBlock"
import TasksList from "components/TasksList";
import BetsList from "components/BetsList";
import AppContext from "AppContext";
import {GET_USER_BETS, GET_USER_BY_ID, GET_USER_TASKS} from "GraphQLQueries";
import {TASK_STATES_ACTIVE} from "Consts";
import {joinQueries} from "Utils";

import "./History.css";

const TABS = {
    TASKS: "tasks",
    BETS: "bets",
}

export const History = () => {
    const context = useContext(AppContext);
    const [tab, setTab] = useState(TABS.TASKS);
    const userId = context.userId;
    const tasksQuery = useQuery(GET_USER_TASKS, { variables: { user_id: userId }});
    const betsQuery = useQuery(GET_USER_BETS, { variables: { user_id: userId }});

    const {loading, error} = joinQueries(tasksQuery, betsQuery);

    function ActiveList() {
        if (tab === TABS.TASKS) {
            return <TasksList tasks={tasksQuery.data.tasks}/>
        } else if (tab === TABS.BETS) {
            return <BetsList bets={betsQuery.data.bets}/>
        } else {
            console.error(`Unkown tab name: ${tab}`);
            return <div>error</div>
        }
    }

    if (error) {
        return <ErrorBlock message={error.message}/>
    } else if (loading) {
        return <LoadingBlock/>
    } else {
        return (
            <div className="screen history">
                <Logo/>
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
                    <ActiveList/>
                </div>
            </div>
        )
    }
};

export default History;