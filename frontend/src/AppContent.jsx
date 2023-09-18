import { StrictMode, useContext, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Scrollbar } from 'react-scrollbars-custom';

import AppContext from 'AppContext';
import Menu from 'components/menu/Menu';

import Login from 'screens/Login';
import Bets from 'screens/Bets';
import CreateEditBet from 'screens/CreateEditBet';
import CreateEditTask from 'screens/CreateEditTask';
import Explore from 'screens/Explore';
import History from 'screens/History';
import Home from 'screens/Home';
import Profile from 'screens/Profile';

import './AppContent.css';

const ALL_SCREENS = [
    Bets,
    CreateEditBet,
    CreateEditTask,
    Explore,
    History,
    Home,
    Profile,
];

export const AppContent = () => {
    const context = useContext(AppContext);
    const [cookies, setCookie] = useCookies(['user_id']);

    useEffect(() => {
        if (context.userId === null && cookies.user_id) {
            context.updateContext(c => { c.userId = cookies.user_id; });
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
                            <ActiveScreen />
                        </StrictMode>
                    </Scrollbar>
                </div>
            </>
        );
    }
}

export default AppContent;