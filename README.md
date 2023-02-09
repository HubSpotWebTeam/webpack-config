# @hs-web-team/webpack-config

A shared Webpack configuration for Hubspot CMS projects.

## Installation

```bash
npm install --save-dev @hs-web-team/webpack-config
```

## Usage

The following configurations are available:

* Hubspot CMS - `cmsConfig`

To use the configuration, import it from the package:

```js
const { cmsConfig } = require('@hs-web-team/webpack-config');
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
const { merge } = require('webpack-merge');
const { cmsConfig } = require('@hs-web-team/webpack-config');

const customWebpackConfig = merge(cmsConfig, {
  // Your custom configuration
});

module.exports = customWebpackConfig;
```
