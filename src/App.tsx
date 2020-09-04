import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Home from './Home';
import EditForm from './EditForm';
import ViewItem from './ViewItem';
import './App.scss';

function App() {
  const routes = (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/add-location">
        <EditForm />
      </Route>
      <Route path="/view/:itemId">
        <ViewItem />
      </Route>
      <Route path="/edit/:itemId">
        <EditForm />
      </Route>
      <Route path="/add/:parentId">
        <EditForm />
      </Route>
    </Switch>
  );

  return (
    <Router>
      <div className="app">
        <Container className="container" maxWidth="sm">
          <Card>
            <CardContent>
                <Link to="/">Home</Link>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              {routes}
            </CardContent>
          </Card>
        </Container>
      </div>
    </Router>
  );
}
export default App;
