import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home, Register, Write, Post, User, Saves, Settings } from 'pages';
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
      <Route exact path="/@:username/" component={User} />
      <Route exact path="/@:username/tags/:tag" component={User} />
      <Route exact path="/@:username/:tab(collections|popular)" component={User} />
      <Route path="/@:username/:urlSlug" component={Post} />
      <Route path="/posts/preview/:id" component={Post} />
      <Route path="/saves" component={Saves} />
      <Route path="/settings" component={Settings} />
    </Switch>
    <Core />
  </React.Fragment>
);

export default App;
