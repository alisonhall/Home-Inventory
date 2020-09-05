import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import { AppBar, Toolbar, Container, Typography, Switch as ToggleSwitch, Button } from '@material-ui/core';

import { signIn, signOut, checkLoggedInStatus } from './firebase';
import Home from './Home';
import EditForm from './EditForm';
import ViewItem from './ViewItem';
import './App.scss';

function App() {
  const [showJSON, setShowJSON] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      <div className="app">
        <Container className="container" maxWidth="sm">
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6">
                <Link to="/">Home Inventory</Link>
              </Typography>
              <ToggleSwitch
                checked={showJSON}
                onChange={e => setShowJSON(!showJSON)}
                name="toggleJSON"
                color="primary"
                inputProps={{ 'aria-label': 'Toggle JSON' }}
              />
              {isLoggedIn
                ? <Button color="inherit" onClick={signOut}>Logout</Button>
                : <Button color="inherit" onClick={signIn}>Login</Button>}
            </Toolbar>
          </AppBar>
          {isLoggedIn
            ? routes
            : <p>You must login</p>}
        </Container>
      </div>
    </Router>
  );
}
export default App;
