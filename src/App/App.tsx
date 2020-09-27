import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import { AppBar, Toolbar, Container, Switch as ToggleSwitch, Button, SwipeableDrawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Menu as MenuIcon, AccountBox as AccountBoxIcon, ExitToApp as ExitToAppIcon } from '@material-ui/icons';

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
  const [menuOpen, setMenuOpen] = useState(false);

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

  const toggleMenu = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setMenuOpen(open);
  };

  const menu = () => (
    <div
      role="presentation"
      onClick={toggleMenu(false)}
      onKeyDown={toggleMenu(false)}
    >
      <List>
        {typeof isLoggedIn !== 'undefined' && isLoggedIn
          ? (
            <ListItem button onClick={signOut}>
              <ListItemIcon><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary='Logout' />
            </ListItem>
          )
          : (
            <ListItem button onClick={signIn}>
              <ListItemIcon><AccountBoxIcon /></ListItemIcon>
              <ListItemText primary='Login' />
            </ListItem>
          )
        }
        <ListItem>
          <div className="toggle-switch">
            <label htmlFor="toggleJSON">
              Show JSON Data
                </label>
            <ToggleSwitch
              checked={showJSON}
              onChange={() => setShowJSON(!showJSON)}
              name="toggleJSON"
              color="secondary"
              inputProps={{ 'aria-label': 'Toggle JSON' }}
            />
          </div>
        </ListItem>
      </List>
    </div>
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
              <Button className="menu-button" onClick={toggleMenu(true)}><MenuIcon /></Button>
              <SwipeableDrawer
                anchor="right"
                open={menuOpen}
                onClose={toggleMenu(false)}
                onOpen={toggleMenu(true)}
              >
                {menu()}
              </SwipeableDrawer>
            </Toolbar>
          </AppBar>
          {typeof isLoggedIn === 'undefined' && <Loader />}
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
