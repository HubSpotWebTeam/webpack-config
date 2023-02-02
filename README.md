# @hs-web-team/webpack-config

A shared Webpack configuration

## Installation

```bash
npm install --save-dev @hs-web-team/webpack-config
```

## Usage

Depending on the type of project you are creating, you will need to use a different configuration. The following configurations are available:

* Hubspot CMS - `cmsConfig`
* React Application - `reactConfig`

To use the configuration, import it from the package:

```js
const { cmsConfig, reactConfig } = require('@hs-web-team/webpack-config');
```

You can use these configurations directly in your Webpack configuration file:

```js
// webpack.config.js
const { cmsConfig } = require('@hs-web-team/webpack-config');

module.exports = cmsConfig;
```

## Customizing the configuration

You can override any of the values in the configuration by spreading the object and overriding the values you want to change.

```js
// webpack.config.js
const { cmsConfig } = require('@hs-web-team/webpack-config');

const customWebpackConfig = {
  ...cmsConfig,
  entry: {
    main: './src/main.js',
  },
};

module.exports = customWebpackConfig;
```
