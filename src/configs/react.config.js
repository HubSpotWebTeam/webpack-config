const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HubSpotAutoUploadPlugin = require('@hubspot/webpack-cms-plugins/HubSpotAutoUploadPlugin');
const path = require('path');

/**
 * This is the webpack config for React applications.
 *
 * @param {string} portal - The portal ID to upload to
 * @param {boolean} autoupload - Whether or not to upload automatically
 * @param {string} [cmsSrc=dist] - The source folder that will be uploaded to your target portal
 * @param {string} [cmsDest=website] - The destination folder in your target portal to upload the src contents to
 * @returns {object} - The webpack config
 */

const config = ({
  portal,
  autoupload = false,
  cmsSrc = 'dist',
  cmsDest = 'website',
}) => ({
  target: 'web',
  entry: {
    main: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { url: false } },
          {
            loader: 'postcss-loader',
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(svg)$/,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HubSpotAutoUploadPlugin({
      portal,
      autoupload,
      src: cmsSrc,
      dest: cmsDest,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets',
          to: 'assets',
        },
        {
          from: 'src/modules',
          to: 'modules',
        },
      ],
    }),
  ],
});

module.exports = config;
