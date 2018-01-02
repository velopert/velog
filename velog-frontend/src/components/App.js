import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home, Register } from 'pages';
import EmailLogin from 'containers/etc/EmailLogin';

const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/register" component={Register} />
    <Route path="/email-login" component={EmailLogin} />
  </Switch>
);

export default App;
