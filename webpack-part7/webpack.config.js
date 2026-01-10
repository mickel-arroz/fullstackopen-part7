const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const config = (env, argv) => {
  console.log('argv', argv.mode);

  const backend_url =
    argv.mode === 'production'
      ? 'https://notes2023.fly.dev/api/notes'
      : 'http://localhost:3001/notes';

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].[contenthash].js',
    },
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'build'),
      },
      compress: true,
      port: 3000,
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
    devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
    plugins: [
      new HtmlWebpackPlugin({ template: './src/index.html' }),
      new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(backend_url),
      }),
    ],

    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
      ],
    },
  };
};

module.exports = config;
