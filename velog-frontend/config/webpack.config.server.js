const path = require('path');
const webpack = require('webpack');
const paths = require('./paths');
const getClientEnvironment = require('./env');

const publicPath = paths.servedPath;
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

module.exports = {
  entry: paths.ssrEntry,
  target: 'node',
  output: {
    path: paths.ssrBuild,
    filename: 'render.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|jsx|mjs)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
              compact: true,
              cacheDirectory: true,
            },
          },
          {
            test: /\.css$/,
            loader: require.resolve('css-loader/locals'),
          },
          {
            test: /\.scss$/,
            use: [
              require.resolve('css-loader/locals'),
              {
                loader: require.resolve('sass-loader'),
                options: {
                  includePaths: [paths.styles],
                },
              },
            ],
          },
          {
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              emitFile: false,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: ['node_modules', paths.appNodeModules].concat(
      // It is guaranteed to exist because we tweak it in `env.js`
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean),
    ),
  },
  plugins: [new webpack.DefinePlugin(env.stringified)],
};
