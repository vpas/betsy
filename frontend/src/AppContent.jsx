import { StrictMode, useContext, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Scrollbar } from 'react-scrollbars-custom';
import { useQuery } from "@apollo/client";

import Login from 'screens/Login';
import Bets from 'screens/Bets';
import CreateEditTask from 'screens/CreateEditTask';
import Explore from 'screens/Explore';
import History from 'screens/History';
import Home from 'screens/Home';
import Profile from 'screens/Profile';
import Menu from 'components/menu/Menu';
import LoadingBlock from "components/LoadingBlock"
import ErrorBlock from "components/ErrorBlock"
import AppContext from "AppContext";
import {GET_BETS, GET_USERS, GET_TASKS} from "GraphQLQueries";
import {calcWinPayouts, joinQueries} from "Utils";

import './AppContent.css';

const ALL_SCREENS = [
    Bets,
    CreateEditTask,
    Explore,
    History,
    Home,
    Profile,
];

export const AppContent = () => {
    const context = useContext(AppContext);
    const [cookies, setCookie] = useCookies(['user_id']);

    const usersQuery = useQuery(GET_USERS);
    const tasksQuery = useQuery(GET_TASKS);
    const betsQuery = useQuery(GET_BETS);
    const {loading, error} = joinQueries(usersQuery, tasksQuery, betsQuery);

    function setContextTasks() {
        const users = usersQuery.data.users;
        const tasks = tasksQuery.data.tasks.map(
            t => { return {...t} }
        );
        const bets = betsQuery.data.bets.map(
            b => { return {...b} }
        );
        
        const usersById = {};
        users.forEach(u => usersById[u.id] = u);

        const tasksById = {};
        tasks.forEach(t => tasksById[t.id] = t);

        tasks.forEach(t => {
            t.bets = [];
            t.owner = usersById[t.created_by];
        });
        bets.forEach(b => {
            b.owner = usersById[b.created_by];
            const t = tasksById[b.task_id];
            t.bets.push(b);
            if (t.created_by === b.created_by) {
                t.owner_bet = b;
            }
        });
        tasks.forEach(t => calcWinPayouts(t));
        context.updateContext(c => { 
            c.tasks = tasks; 
            c.user = usersById[c.userId];
        });
    }

    async function refetch() {
        context.updateContext(c => { 
            c.tasks = null;
            c.shouldRefetch = false; 
            c.refetching = true;
        });
        await Promise.all([usersQuery.refetch(), tasksQuery.refetch(), betsQuery.refetch()]);
        context.updateContext(c => { 
            c.refetching = false;
        });
    }

    useEffect(() => {
        if (context.userId === null && cookies.user_id) {
            context.updateContext(c => { c.userId = cookies.user_id; });
        } else if (context.shouldRefetch) {
            refetch();
        } else if (!context.tasks && !loading && !error && !context.refetching) {
            setContextTasks();
        }
    });
    

    function setUser(user) {
        context.updateContext(c => {
            c.userId = user.id;
            c.user = user;
        });
        setCookie('user_id', user.id);
    }

    function getActiveScreen() {
        for (var screen of ALL_SCREENS) {
            if (context.activeScreenId === screen.name) {
                return screen;
            }
        }
    }

    const ActiveScreen = getActiveScreen();

    function ScreenContent() {
        if (error) {
            return <ErrorBlock message={error.message}/>
        } else if (loading || context.shouldRefetch || !context.tasks) {
            return <LoadingBlock/>
        } else {
            return <ActiveScreen />
        }
    }

    if (context.userId === null) {
        if (cookies.user_id) {
            return <></>
        } else {
            return <Login setUser={setUser} />;
        }
    } else {
        return (
            <>
                <Menu />
                <div className="content">
                    <Scrollbar
                        style={{
                            height: window.innerHeight - 82,
                            width: 375
                        }}
                        noScrollX="true"
                    >
                        <StrictMode>
                            <ScreenContent />
                        </StrictMode>
                    </Scrollbar>
                </div>
            </>
        );
    }
}

export default AppContent;