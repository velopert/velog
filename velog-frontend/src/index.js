import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';
import './styles/main.scss';
import registerServiceWorker from './registerServiceWorker';

const render = window.__REDUX_STATE__ ? ReactDOM.hydrate : ReactDOM.render;

render(<Root />, document.getElementById('root'));
registerServiceWorker();
