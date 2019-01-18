import React from 'react';
import { Route, Switch } from 'react-router-dom';
import {
  Home,
  Register,
  Write,
  Post,
  User,
  Saves,
  Settings,
  Policy,
  Series,
  NotFound,
} from 'pages';
import EmailLogin from 'containers/etc/EmailLogin';
import Core from 'containers/base/Core';
import { Helmet } from 'react-helmet';
import Callback from 'containers/etc/Callback';
import EmailCertifyContainer from '../containers/etc/EmailCertifyContainer';
import CustomError from '../pages/errors/CustomError';
import Success from '../pages/Success';
import Search from '../pages/Search';

const App = () => (
  <React.Fragment>
    <Helmet>
      <title>velog</title>
      <meta
        name="description"
        content="개발자들을 위한 취향저격 블로그 서비스. 어디서 글 쓸지 고민하지 말고 벨로그에서 시작하세요."
      />
      <meta property="fb:app_id" content="203040656938507" />
      <meta property="og:image" content="https://images.velog.io/velog.png" />
    </Helmet>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/:mode(trending|recent|collections|tags|stored)" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/error" component={CustomError} />
      <Route path="/success" component={Success} />
      <Route path="/email-login" component={EmailLogin} />
      <Route path="/write" component={Write} />
      <Route exact path="/@:username/" component={User} />
      <Route exact path="/@:username/tags/:tag" component={User} />
      <Route exact path="/@:username/:tab(history|about|series)" component={User} />
      <Route path="/@:username/series/:urlSlug" component={Series} />
      <Route path="/@:username/:urlSlug" component={Post} />
      <Route path="/posts/preview/:id" component={Post} />
      <Route path="/saves" component={Saves} />
      <Route path="/settings" component={Settings} />
      <Route path="/policy/:mode(policy|terms)?" component={Policy} />
      <Route path="/callback" component={Callback} />
      <Route path="/certify" component={EmailCertifyContainer} />
      <Route path="/search" component={Search} />
      <Route component={NotFound} />
    </Switch>
    <Core />
  </React.Fragment>
);

export default App;
