const glob = require('glob');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HubSpotAutoUploadPlugin = require('@hubspot/webpack-cms-plugins/HubSpotAutoUploadPlugin');

/**
 * This is the webpack config for CMS applications.
 *
 * @param {string} portal - The portal ID to upload to
 * @param {boolean} autoupload - Whether or not to upload automatically
 * @param {string} [cmsSrc=dist] - The source folder that will be uploaded to your target portal
 * @param {string} [cmsDest=website] - The destination folder in your target portal to upload the src contents to
 * @returns {object} - The webpack config
 */

const moduleEntries = (projectFolder) => glob.sync(`${projectFolder}/src/modules/**.module/module.{js,scss}`)
  .reduce((acc, item) => {
    const name = item
      .replace(`${projectFolder}/src/modules/`, '')
      .replace('.module/', '.module')
      .replace('module.js', '')
      .replace('module.scss', '');

    if (!acc[name]) {
      acc[name] = [];
    }

    acc[name].push(item);

    return acc;
  }, []);

const assetEntries = (projectFolder) => glob.sync(`${projectFolder}/src/assets/**/*.{js,scss}`)
  .reduce((acc, item) => {
    const name = item.replace(`${projectFolder}/src/assets/`, '').replace(/\.[^/.]+$/, '');

    if (!acc[name]) {
      acc[name] = [];
    }

    acc[name].push(item);

    return acc;
  }, []);

const outputFileName = pathData => pathData.chunk.name.includes('.module')
  ? 'modules/[name]/module.js'
  : 'assets/[name].js';

const config = ({
  projectFolder,
  portal,
  autoupload = false,
  cmsSrc = 'dist',
  cmsDest = 'website',
}) => ({
  target: 'web',
  entry: {
    ...moduleEntries(projectFolder),
    ...assetEntries(projectFolder),
  },
  output: {
    path: `${projectFolder}/dist`,
    filename: outputFileName,
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
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
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
      filename: pathData => outputFileName(pathData).replace('.js', '.css'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${projectFolder}/src/templates`,
          to: 'templates',
          noErrorOnMissing: true,
        },
        {
          from: `${projectFolder}/src/assets/**/*.{html,json}`,
          to: 'assets/[name][ext]',
          noErrorOnMissing: true,
        },
        {
          from: `${projectFolder}/src/modules/**/*.{html,json}`,
          to: ({ absoluteFilename }) => {
            const parentFolder = absoluteFilename.split('/').slice(-2)[0];
            return `modules/${parentFolder}/[name][ext]`;
          },
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
});

module.exports = config;
