const path = require('path')
const pkg = require('./package')

module.exports = {
  entry: [
    'src/polyfills.js',
    'src/index.js'
  ],
  dist: 'docs',
  html: {
    title: pkg.productName,
    description: pkg.description,
    template: path.join(__dirname, 'index.ejs')
  },
  postcss: {
    plugins: [
      // Your postcss plugins
    ]
  },
  transformModules: ['./src/vue-beautiful-chat/src/index.js','escape-goat','msgdown'],
  presets: [
    require('poi-preset-bundle-report')()
  ]
}
