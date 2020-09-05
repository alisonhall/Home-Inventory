import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import { AppBar, Toolbar, Container, Switch as ToggleSwitch, Button } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { signIn, signOut, checkLoggedInStatus } from './firebase';
import Home from './Home';
import EditForm from './EditForm';
import ViewItem from './ViewItem';
import './App.scss';
import Loader from './Loader';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#673ab7'
    },
    secondary: {
      main: '#00b0ff'
    }
  }
});

function App() {
  const [showJSON, setShowJSON] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>();

  // Get the logged in status from Firebase auth
  useEffect(() => {
    checkLoggedInStatus(setIsLoggedIn);
  }, []);

  const defaultProps = { showJSON };

  const routes = (
    <Switch>
      <Route exact path="/">
        <Home {...defaultProps} />
      </Route>
      <Route path="/add-location">
        <EditForm {...defaultProps} />
      </Route>
      <Route path="/view/:itemId">
        <ViewItem {...defaultProps} />
      </Route>
      <Route path="/edit/:itemId">
        <EditForm {...defaultProps} />
      </Route>
      <Route path="/add/:parentId">
        <EditForm {...defaultProps} />
      </Route>
    </Switch>
  );

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div className="app">
          <AppBar position="static">
            <Toolbar>
              <div className="logo">
                <Link to="/">Home Inventory</Link>
              </div>
              <div className="toggle-switch">
                <label htmlFor="toggleJSON">
                  Show Data
                </label>
                <ToggleSwitch
                  checked={showJSON}
                  onChange={e => setShowJSON(!showJSON)}
                  name="toggleJSON"
                  color="secondary"
                  inputProps={{ 'aria-label': 'Toggle JSON' }}
                />
              </div>
              <span className="text-divider">|</span>
              {typeof isLoggedIn !== 'undefined' && (isLoggedIn
                ? <Button color="inherit" onClick={signOut}>Logout</Button>
                : <Button color="inherit" onClick={signIn}>Login</Button>)}
            </Toolbar>
          </AppBar>
          <Container className="container" maxWidth="sm">
            {typeof isLoggedIn === 'undefined' && <Loader />}
            {typeof isLoggedIn !== 'undefined' && (isLoggedIn
              ? routes
              : <p>You must login to use this app.</p>)}
          </Container>
        </div>
      </ThemeProvider>
    </Router>
  );
}
export default App;
