import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home, Register, Write, Post, User, Saves, Settings, Policy, NotFound } from 'pages';
import EmailLogin from 'containers/etc/EmailLogin';
import Core from 'containers/base/Core';
import { Helmet } from 'react-helmet';
import Callback from './etc/Callback';

const App = () => (
  <React.Fragment>
    <Helmet>
      <title>velog</title>
      <meta
        name="description"
        content="개발자들을 위한 취향저격 블로그 서비스. 어디서 글 쓸지 고민하지 말고 벨로그에서 시작하세요."
      />
    </Helmet>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/:mode(trending|recent|collections|tags|stored)" component={Home} />
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
      <Route path="/policy/:mode(policy|terms)?" component={Policy} />
      <Route path="/callback" component={Callback} />
      <Route component={NotFound} />
    </Switch>
    <Core />
  </React.Fragment>
);

export default App;
