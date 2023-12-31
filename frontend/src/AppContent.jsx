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
import { TASK_STATES_ACTIVE } from 'Consts';

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
  
  function setContextTasks({ users, tasks, bets, curUser }) {
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
    tasks.sort((t1, t2) => new Date(t2.updated_at) - new Date(t1.updated_at));
    context.updateContext(c => {
      c.tasks = tasks;
      c.user = curUser;
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
      const user = (await context.axios.get(`users/${context.userId}`)).data;
      const group = (await context.axios.get(`groups/${user.group_id}`)).data;
      user.group = group;
      console.log(user);
      const [users, tasks, bets] = await Promise.all([
        context.axios.get(`users?group_id=${user.group_id}`),
        context.axios.get(`tasks?group_id=${user.group_id}`),
        context.axios.get(`bets?group_id=${user.group_id}`),
      ]);
      setContextTasks({
        users: users.data,
        tasks: tasks.data,
        bets: bets.data,
        curUser: user,
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  

  useEffect(() => {
    if (context.notificationsManager) {
      context.notificationsManager.context = context;
    } else {
      new NotificationsManager(context).init();
    }
  }, [context]);

  useEffect(() => {
    if (context.userId === null && cookies.user_id) {
      context.updateContext(c => { c.userId = cookies.user_id; });
    } else if (context.shouldRefetch) {
      refetch();
    }
  });

  useEffect(() => {
    if (!context.shouldRefetch && context.tasks && context.notificationTaskId) {
      console.log("opening task from notification");
      const task = context.tasks.find(t => t.id === context.notificationTaskId);
      const bet = task.bets.find(b => b.created_by === context.userId);
      if (TASK_STATES_ACTIVE.has(task.task_state)) {
        context.updateContext(c => {
          console.log("Setting c.activeScreenId = CreateEditTask.name");
          if (bet) {
            c.prevScreenId = Bets.name;
            c.activeTabId = Bets.name;
          } else {
            c.prevScreenId = Explore.name;
            c.activeTabId = Explore.name;
          }
          c.activeScreenId = CreateEditTask.name;
          c.inputTask = task;
          c.inputBet = bet;

          c.notificationTaskId = null;
        });
      } else {
        context.updateContext(c => {
          console.log("Setting c.activeScreenId = TaskInfo.name");
          
          c.prevScreenId = History.name;
          c.activeTabId = History.name;
          c.activeScreenId = TaskInfo.name;
          c.inputTask = task;

          c.notificationTaskId = null;
        });
      }
    }
  },[context])


  function setUser(user) {
    context.updateContext(c => {
      c.userId = user.id;
      c.user = user;
    });
    const secInMonth = 30 * 24 * 60 * 60;
    setCookie('user_id', user.id, { maxAge: secInMonth });
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