const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    'youngblood': './src/main.ts',
    'youngblood.min': './src/main.ts'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'bundle'),
    library: 'yb',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  plugins: [ 
    // new UglifyJsPlugin({
    //   sourceMap: true,
    //   include: '/\.min\.js$/',
    //   uglifyOptions: {
    //     mangle: false
    //   }
    // }) 
  ]
};
