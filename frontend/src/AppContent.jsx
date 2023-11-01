import { StrictMode, useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Scrollbar } from 'react-scrollbars-custom';

import Login from 'screens/Login';
import Bets from 'screens/Bets';
import CreateEditTask from 'screens/CreateEditTask';
import Explore from 'screens/Explore';
import History from 'screens/History';
import Home from 'screens/Home';
import Profile from 'screens/Profile';
import TaskInfo from 'screens/TaskInfo';
import Menu from 'components/menu/Menu';
import LoadingBlock from "components/LoadingBlock"
import ErrorBlock from "components/ErrorBlock"
import AppContext from "AppContext";
import { calcWinPayouts } from "Utils";
import { NotificationsManager } from "NotificationsManager"

import './AppContent.css';

const ALL_SCREENS = [
  Bets,
  CreateEditTask,
  Explore,
  History,
  Home,
  Profile,
  TaskInfo,
];

export const AppContent = () => {
  const context = useContext(AppContext);
  const [cookies, setCookie] = useCookies(['user_id']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  function setContextTasks({ users, tasks, bets }) {
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
    console.log("refetch");
    context.updateContext(c => {
      c.tasks = null;
      c.shouldRefetch = false;
    });
    try {
      setLoading(true);
      const [users, tasks, bets] = await Promise.all([
        context.axios.get("users"),
        context.axios.get("tasks"),
        context.axios.get("bets"),
      ]);
      setContextTasks({
        users: users.data,
        tasks: tasks.data,
        bets: bets.data,
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  

  useEffect(() => {
    new NotificationsManager(context).init();
  }, []);

  useEffect(() => {
    if (context.userId === null && cookies.user_id) {
      context.updateContext(c => { c.userId = cookies.user_id; });
    } else if (context.shouldRefetch) {
      refetch();
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
      return <ErrorBlock message={error.message} />
    } else if (loading || context.shouldRefetch) {
      return <LoadingBlock />
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
        <div className="content">
          <Scrollbar
            style={{
              height: window.innerHeight - 103,
              width: 375
            }}
            trackYProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                delete restProps.style;
                return <span {...restProps} ref={elementRef} className="scroll-track" />;
              },
            }}
            thumbYProps={{
              renderer: (props) => {
                const { elementRef, ...restProps } = props;
                delete restProps.style;
                return <span
                  {...restProps}
                  ref={elementRef}
                  className="scroll-thumb"
                />;
              },
            }}
            noScrollX="true"
          >
            <StrictMode>
              <ScreenContent />
            </StrictMode>
          </Scrollbar>
        </div>
        <Menu />
      </>
    );
  }
}

export default AppContent;