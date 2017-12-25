import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home, Register } from 'pages';

const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/" component={Register} />
  </Switch>
);

export default App;
