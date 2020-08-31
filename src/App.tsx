import React, { useState } from 'react';
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

type DefaultContext = {
  currentItemId: string | undefined,
  parentItemId: string | undefined
}
export const AppContext = React.createContext<Partial<DefaultContext>>({})

function App() {
  const [currentItemId, setCurrentItemId] = useState<string | undefined>(undefined);
  const [parentItemId, setParentItemId] = useState<string | undefined>(undefined);

  const defaultProps = {
    currentItemId,
    setCurrentItemId,
    parentItemId,
    setParentItemId
  };

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
            </CardContent>
          </Card>
        </Container>
      </div>
    </Router>
  );
}
export default App;
