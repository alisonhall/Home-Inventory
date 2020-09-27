import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import { AppBar, Toolbar, Container, Switch as ToggleSwitch, Button } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { signIn, signOut, checkLoggedInStatus, itemsRef, locationsRef } from '../firebase';
import Home from '../Home/Home';
import EditForm from '../EditForm/EditForm';
import ViewItem from '../ViewItem/ViewItem';
import Loader from '../Loader/Loader';
import './App.scss';

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
  const [isLoading, setIsLoading] = useState(true);
  const [showJSON, setShowJSON] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | undefined>();
  const [userId, setUserId] = useState<string | null>(null);
  const [moveList, setMoveList] = useState<string[]>([]);

  // Get the logged in status from Firebase auth
  useEffect(() => {
    checkLoggedInStatus(setIsLoggedIn, setUserId);
    setIsLoading(false);
  }, []);

  const defaultProps = {
    showJSON,
    userId
  };

  const routes = (
    <Switch>
      <Route exact path="/">
        <Home {...defaultProps} moveList={moveList} setMoveList={setMoveList} />
      </Route>
      <Route path="/add-location">
        <EditForm {...defaultProps} />
      </Route>
      <Route path="/view/:itemId">
        <ViewItem {...defaultProps} moveList={moveList} setMoveList={setMoveList} />
      </Route>
      <Route path="/edit/:itemId">
        <EditForm {...defaultProps} />
      </Route>
      <Route path="/add/:parentId">
        <EditForm {...defaultProps} />
      </Route>
    </Switch>
  );

  if (isLoading) {
    return (
      <Loader />
    )
  }

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
                  onChange={() => setShowJSON(!showJSON)}
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
          {typeof isLoggedIn === 'undefined' && !userId && (
            <Container className="container" maxWidth="sm">
              <p>Invalid user ID.</p>
            </Container>
          )}
          {typeof isLoggedIn === 'undefined' && userId && <Loader />}
          {typeof isLoggedIn !== 'undefined' && userId && itemsRef && locationsRef && isLoggedIn
            ? routes
            : (
              <Container className="container" maxWidth="sm">
                <p>You must login to use this app.</p>
              </Container>
            )}
        </div>
      </ThemeProvider>
    </Router>
  );
}
export default App;
