import { useContext, useEffect } from 'react';
import { useImmer } from 'use-immer';
import { CookiesProvider } from 'react-cookie';
import axios from 'axios';

import AppContext from 'AppContext';
import AppContent from 'AppContent';
import Home from 'screens/Home';

import './App.css';

function App() {
  const axiosInstance = axios.create({
    baseURL: 'https://pjuc4dus7b.execute-api.eu-central-1.amazonaws.com/prod/',
    timeout: 20000,
  });
  // const axiosInstance = axios.create({
  //   baseURL: 'http://localhost:3000',
  //   timeout: 20000,
  // });
  
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

  useEffect(() => {
    console.log("adding message listener");
    navigator.serviceWorker.addEventListener("message", (event) => {
      console.log(`Notification data: ${JSON.stringify(event.data)}`);
      console.log(`Notification about taskId: ${event.data.task_id}`);
      updateContext(c => {
        c.shouldRefetch = true;
        c.notificationTaskId = event.data.task_id;
      });
    });
  }, [updateContext]);

  useEffect(() => {
    console.log(`window.location.search: ${window.location.search}`);
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("task_id")) {
      const taskId = urlParams.get("task_id");
      console.log(`Url param taskId: ${taskId}`);
      updateContext(c => {
        c.shouldRefetch = true;
        c.notificationTaskId = taskId;
      });
      window.history.replaceState(null, "", "/");
    }
  }, [updateContext]);

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
