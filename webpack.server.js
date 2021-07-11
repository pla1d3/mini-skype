const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = ()=> {
  return {
    target: 'node',
    entry: './server/index.js',
    output: {
      filename: 'bundle-server.js',
      path: path.join(__dirname, './build/server')
    },
    resolve: {
      modules: [path.resolve(__dirname, './server'), 'node_modules'],
      alias: {
        helpers: path.resolve(__dirname, './helpers'),
        config: path.resolve(__dirname, './config')
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: '/node_modules/',
          loader: 'babel-loader'
        }
      ]
    },
    optimization: {
      minimize: false
    },
    plugins: [
      new NodemonPlugin()
    ],
    externals: [
      nodeExternals()
    ],
    devtool: 'sourcemap',
    context: __dirname,
    node: {
      __filename: false,
      __dirname: false
    }
  };
};
