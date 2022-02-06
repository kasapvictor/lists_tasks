// package.json ->"type"="module // -> babel.config.cjs
module.exports = {
  presets: [
    ['@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
};
