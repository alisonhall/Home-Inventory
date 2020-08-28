import React from 'react';
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import LocationForm from './LocationForm';
import LocationList from './LocationList';
import './App.scss';

function App() {
  return (
    <div className="app">
      <Container className="container" maxWidth="sm">
        <Card>
          <CardContent>
            <h3>Locations</h3>
            <LocationForm />
            <LocationList />
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
export default App;