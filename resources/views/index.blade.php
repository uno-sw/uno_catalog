<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ config('app.name') }}</title>

  <!-- Scripts -->
  <script src="{{ mix('js/app.js') }}" defer></script>

  <!-- Fonts -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css">

  <!-- Styles -->
  <link rel="stylesheet" href="{{ mix('css/app.css') }}">
</head>
<body>
  <div id="app"></div>
</body>
</html>
