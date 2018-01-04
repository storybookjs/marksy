const path = require('path');

const libPath = path.resolve('lib');
const appPath = path.resolve('app', 'main.js');

module.exports = {
  entry: appPath,
  output: {
    path: path.resolve('build'),
    filename: 'bundle.js',
  },
  resolve: {
    alias: {
      marksy: libPath,
    },
  },
  module: {
    rules: [
      {
        test: /\.js/,
        include: [path.resolve('app')],
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [require.resolve('babel-preset-react')],
            },
          },
        ],
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
};
