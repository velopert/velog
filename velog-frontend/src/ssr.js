// @flow
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { Provider } from 'react-redux';
import App from './components/App';
import configure from './store/configure';

const serverRender = async (ctx: any) => {
  const store = configure();
  // match routes...
  const html = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={ctx.url}>
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
