import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import Container from '@material-ui/core/Container';
import ToggleSwitch from '@material-ui/core/Switch';

import Home from './Home';
import EditForm from './EditForm';
import ViewItem from './ViewItem';
import './App.scss';

function App() {
  const [showJSON, setShowJSON] = useState(false);

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
          <Link to="/">Home Inventory</Link>
          <ToggleSwitch
            checked={showJSON}
            onChange={e => setShowJSON(!showJSON)}
            name="toggleJSON"
            color="primary"
            inputProps={{ 'aria-label': 'Toggle JSON' }}
          />
          {routes}
        </Container>
      </div>
    </Router>
  );
}
export default App;
