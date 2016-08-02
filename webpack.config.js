const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    index: './index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    library: 'ResourceOp',
    libraryTarget: 'umd',
  },
  resolve: {
    alias: {
      '#': path.join(__dirname, 'src'),
    },
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['es2015'],
        },
      },
    ],
  },
};
