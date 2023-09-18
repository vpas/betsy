import { useContext } from 'react';
import { useImmer } from 'use-immer';
import { CookiesProvider } from 'react-cookie';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import AppContext from 'AppContext';
import AppContent from 'AppContent';
import Home from 'screens/Home';

import './App.css';

const client = new ApolloClient({
  // uri: 'https://vvp1a5v8v7.execute-api.eu-central-1.amazonaws.com/Prod/graphql',
  uri: 'https://betsy-graphql-api.hasura.app/v1/graphql',
  cache: new InMemoryCache(),
  headers: {
    'x-hasura-admin-secret': '5sjIP4i74T10e23pGzNId1MQxOJHf15UlFOz7j97VjKyrDgr3BJKcNbnzpp0Hj31',
  },
});

function App() {
  const defaultContext = useContext(AppContext);
  const [context, updateContext] = useImmer({
    ...defaultContext,
    userId: null,
    activeScreenId: Home.name,
  });
  if (!context.updateContext) {
    updateContext(c => { c.updateContext = updateContext; });
  }

  return (
    <div className="App">
      <ApolloProvider client={client}>
        <CookiesProvider defaultSetOptions={{ path: '/' }}>
          <AppContext.Provider value={context}>
            <AppContent />
          </AppContext.Provider>
        </CookiesProvider>
      </ApolloProvider>
    </div>
  );
}

export default App;
