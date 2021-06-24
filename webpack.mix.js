const mix = require('laravel-mix')

mix.browserSync('uno_catalog.test')
  .ts('resources/ts/index.tsx', 'public/js')
  .react()
  .version()
