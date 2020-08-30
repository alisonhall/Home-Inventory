import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import Home from './Home';
import LocationForm from './LocationForm';
import LocationList from './LocationList';
import './App.scss';

function App() {
  return (
    <Router>
      <div className="app">
        <Container className="container" maxWidth="sm">
          <Card>
            <CardContent>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/add">Add</Link>
                </li>
                <li>
                  <Link to="/view">View</Link>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route path="/add">
                  <LocationForm />
                </Route>
                <Route path="/view">
                  <LocationList />
                </Route>
              </Switch>
            </CardContent>
          </Card>
        </Container>
      </div>
    </Router>
  );
}
export default App;
