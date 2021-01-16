const mix = require('laravel-mix')
require('vuetifyjs-mix-extension')

mix.webpackConfig({
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    },
  },
})

mix.browserSync('uno_learning.test')
  .js('resources/js/app.js', 'public/js')
  .sass('resources/sass/app.scss', 'public/css')
  .vue()
  .vuetify()
  .version()
