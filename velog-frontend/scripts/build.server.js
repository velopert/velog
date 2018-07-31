/* eslint-disable */
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.env.APP_ENV = 'server';

process.on('unhandledRejection', err => {
  throw err;
});

require('../config/env');

const webpack = require('webpack');
const config = require('../config/webpack.config.server');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');

if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

function build() {
  let compiler = webpack(config);
  compiler.run((err, stats) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(stats.toString());
  });
}

build();
