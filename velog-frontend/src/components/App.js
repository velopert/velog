import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home, Register, Write, Post } from 'pages';
import EmailLogin from 'containers/etc/EmailLogin';
import Core from 'containers/base/Core';

const App = () => (
  <React.Fragment>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/(trending|recent|collections|tags|stored)" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/email-login" component={EmailLogin} />
      <Route path="/write" component={Write} />
      <Route path="/@:username/:urlSlug" component={Post} />
      <Route path="/posts/preview/:id" component={Post} />
    </Switch>
    <Core />
  </React.Fragment>
);

export default App;
