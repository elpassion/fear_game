const path = require('path')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpackConfig = require('./config')

module.exports = merge(webpackConfig, {
  devtool: 'eval',

  output: {
    path: path.join(__dirname, '../../priv/static'),
    filename: '[name].js',
    publicPath: '/'
  },

})
