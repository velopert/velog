import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home, Register } from 'pages';
import EmailLogin from 'containers/etc/EmailLogin';
import Core from 'containers/etc/Core';

const App = () => (
  [
    <Switch key={0}>
      <Route exact path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/email-login" component={EmailLogin} />
    </Switch>,
    <Core key={1} />,
  ]
);

export default App;
