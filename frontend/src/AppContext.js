import { createContext } from 'react';

export const AppContext = createContext({
    userId: null,
    user: null,
    activeScreenId: null,
});

export default AppContext;