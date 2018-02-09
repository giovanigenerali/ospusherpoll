const path = require('path');

module.exports = {
  entry: path.resolve('./public/main.js'),
  output: {
    filename: 'main.js',
    path: path.resolve('./public/dist')
  },
};