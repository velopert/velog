// @flow
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router';
import { Provider } from 'react-redux';
import routeConfig from './routeConfig';
import App from './components/App';
import configure from './store/configure';

const serverRender = async (ctx: any) => {
  const store = configure();
  // match routes...
  const promises = [];

  routeConfig.every((route) => {
    const match = matchPath(ctx.url, route);
    if (match) {
      console.log(route);
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
    console.log(e);
  }
  const context = {};
  const html = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter context={context} location={ctx.url}>
        <App />
      </StaticRouter>
    </Provider>,
  );
  return {
    html,
    state: store.getState(),
  };
};

export default serverRender;
