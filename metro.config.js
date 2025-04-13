const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname, {
  // Add this configuration object
  transformer: {
    routerRoot: 'app/views',
  },
});

// Keep existing transformer config
config.transformer = {
  ...config.transformer,
  routerRoot: 'app/views',
};

// Keep existing resolver config
config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, 'mjs', 'cjs'],
};

module.exports = config;