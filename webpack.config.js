const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }
  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }
  return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoaders = extra => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true
      },
    },
    {
      loader: 'css-loader',
      options: {
        url: false
      }
    }
  ];
  if (extra) {
    loaders.push(extra)
  }
  return loaders
}

const babelOptions = preset => {
  const opts = {
    presets: [
      '@babel/preset-env'
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties'
    ]
  }

  if (preset) {
    opts.presets.push(preset)
  }

  return opts
}

module.exports = {
  mode: 'development', // "production" | "development" | "none"
  entry: [
    '@babel/polyfill',
    './src/js/index.js'
  ],
  output: {
    filename: 'js/' + filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    port: 4250,
    hot: isDev
  },
  devtool: isDev ? 'source-map' : '',
  resolve: {
    //extensions: ['.js', '.json', '.png'],
    alias: {
      '@views': path.resolve(__dirname, 'src/html/views'),
      '@includes': path.resolve(__dirname, 'src/html/includes'),
      '@scss': path.resolve(__dirname, 'src/scss'),
      '@': path.resolve(__dirname, 'src'),
    }
  },
  optimization: optimization(),
  module: {
    rules: [
      {
        test: /\.html$/,
        //include: path.resolve(__dirname, 'src/html/includes'),
        use: ['html-loader']
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: {
          loader: 'babel-loader',
          options: babelOptions()
        }
      },
      {
        test: /\.css$/,
        use: cssLoaders()
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader')
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        exclude: path.resolve(__dirname, 'src/fonts'),
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: path.resolve(__dirname, 'dist/img')
            }
          }
        ]
      },
      {
        test: /\.(ttf|otf|svg|woff|woff2|eot)$/,
        exclude: path.resolve(__dirname, 'src/img'),
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: path.resolve(__dirname, 'dist/fonts')
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/html/views/index.hbs',
      minify: {
        collapseWhitespace: isProd
      },
      inject: false
    }),
    // new HtmlWebpackPlugin({  // Also generate a test.html
    //   filename: 'test.html',
    //   template: './src/html/views/test.html'
    // }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/' + filename('css'),
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'src/favicon'),
        to: path.resolve(__dirname, 'dist')
      },
      {
        from: path.resolve(__dirname, 'src/fonts'),
        to: path.resolve(__dirname, 'dist/fonts')
      },
      {
        from: path.resolve(__dirname, 'src/img'),
        to: path.resolve(__dirname, 'dist/img')
      }
    ])
  ]
};