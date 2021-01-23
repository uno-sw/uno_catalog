const mix = require('laravel-mix')

mix.webpackConfig({
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    },
  },
})

mix.browserSync('uno_catalog.test')
  .js('resources/js/app.js', 'public/js')
  .sass('resources/sass/app.scss', 'public/css')
  .vue()
  .version()
