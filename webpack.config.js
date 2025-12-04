// webpack.config.js
const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    background: './background.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.js'],
  },
};