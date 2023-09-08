import { useState } from 'react';
import './App.css';
import AppContext from './AppContext';
import Home from './screens/Home';
import Login from './screens/Login';

function App() {
  const [context, setContext] = useState({
    user: null,
  });

  function Content() {
    if (context.user === null) {
      return <Login setUser={(u) => { setContext({...context, user: u}) }}/>;
    } else {
      return <Home/>
    }
  }

  return (
    <div className="App">
      <AppContext.Provider value={context}>
        <Content/>
      </AppContext.Provider>
    </div>
  );
}

export default App;
