const path = require('path');
// eslint-disable-next-line import/no-unresolved
const slsw = require('serverless-webpack');
const webpack = require('webpack');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  resolve: {
    modules: [path.resolve('./src'), 'node_modules'],
  },
  module: {
    loaders: [
      {
        test: /node_modules[/\\]rc/i,
        use: {
          loader: require.resolve('shebang-loader'),
        },
      },
      {
        test: /\.(js|jsx)$/,
        include: __dirname,
        exclude: /node_modules\/(?!(koa-bodyparser|koa-logger)\/).*/,
        loader: 'babel-loader',
        options: {
          plugins: [
            'transform-object-rest-spread',
            'transform-async-to-generator',
          ],
          presets: ['flow'],
        },
      },
    ],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  plugins: [
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
    new webpack.IgnorePlugin(/^hiredis$/),
  ],
};
