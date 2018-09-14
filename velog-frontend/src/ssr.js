// @flow
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import { actionCreators as commonActions } from 'store/modules/common';
import { actionCreators as userActions } from 'store/modules/user';
import routeConfig from './routeConfig';
import App from './components/App';
import configure from './store/configure';
import defaultClient from './lib/defaultClient';

const serverRender = async (ctx: any) => {
  const store = configure();
  store.dispatch(commonActions.didSSR());
  // match routes...
  const promises = [];
  const token = ctx.cookies.get('access_token');
  let { path, url } = ctx;

  defaultClient.defaults.headers.cookie = '';
  if (token) {
    ctx.state.logged = true;
    defaultClient.defaults.headers.cookie = `access_token=${token}`;
    promises.push(store.dispatch(userActions.checkUser()));
  }

  if (token && path === '/') {
    path = '/trending';
    url = '/trending';
  }

  routeConfig.every((route) => {
    const match = matchPath(path, route);
    if (match) {
      console.log(match);
      if (route.preload) {
        promises.push(route.preload(ctx, store, match));
      }
      if (route.stop) return false;
    }
    return true;
  });
  try {
    await Promise.all(promises);
  } catch (e) {
    throw e;
  }
  const context = {};
  const html = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter context={context} location={url}>
        <App />
      </StaticRouter>
    </Provider>,
  );
  const helmet = Helmet.renderStatic();
  return {
    html,
    helmet,
    context,
    state: store.getState(),
  };
};

export default serverRender;
