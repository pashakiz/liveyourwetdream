const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  mode: 'development', // "production" | "development" | "none"
  entry: [
    './src/js/index.js',
    './src/scss/style.scss'
  ],
  output: {
    filename: './js/bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: "source-map",
  module: {
    rules: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname, 'src/js'),
          use: {
            loader: 'babel-loader',
            options: {
              presets: 'env'
            }
          }
        },
        {
          test: /\.(sass|scss)$/,
          include: path.resolve(__dirname, 'src/scss'),
          use: MiniCssExtractPlugin.extract({
            use: [{
                loader: "css-loader",
                options: {
                  sourceMap: true//,
                  //url: false
                }
              },
              {
                loader: "resolve-url-loader"
              },
              {
                loader: "sass-loader",
                options: {
                  sourceMap: true
                }
              }
            ]
          })
        },
        {
          test: /\.(png|jpg|svg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {name: 'img/[name].[ext]'}
            }
          ]
        },
        {
          test: /\.(ttf|otf|svg|woff|woff2|eot)$/,
          use: [
            {
              loader: 'file-loader',
              options: {name: 'fonts/[name].[ext]'}
            }
          ]
        },
    ]
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/html/views/index.html'
    }),
    // new HtmlWebpackPlugin({  // Also generate a test.html
    //   filename: 'test.html',
    //   template: './src/html/views/test.html'
    // }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: './css/style.bundle.css',
    })
  ]
};