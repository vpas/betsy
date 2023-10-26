import { useContext } from 'react';
import { useImmer } from 'use-immer';
import { CookiesProvider } from 'react-cookie';
import axios from 'axios';

import AppContext from 'AppContext';
import AppContent from 'AppContent';
import Home from 'screens/Home';

import './App.css';

function App() {
  const axiosInstance = axios.create({
    baseURL: 'https://vvp1a5v8v7.execute-api.eu-central-1.amazonaws.com/Prod/',
    timeout: 20000,
  });
  
  const defaultContext = useContext(AppContext);
  const [context, updateContext] = useImmer({
    ...defaultContext,
    userId: null,
    activeScreenId: Home.name,
    activeTabId: Home.name,
    shouldRefetch: true,
    axios: axiosInstance,
  });
  
  if (!context.updateContext) {
    updateContext(c => { c.updateContext = updateContext; });
  }

  return (
    <div className="App">
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <AppContext.Provider value={context}>
          <AppContent />
        </AppContext.Provider>
      </CookiesProvider>
    </div>
  );
}

export default App;
