<%@ page session="false" %>
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="components/foundation/css/foundation.css"/>
    <link rel="stylesheet" href="css/main.css"/>
    <script data-main="js/main" src="components/requirejs/require.js"></script>
  </head>

  <body>
  <div class="row">
    <div class="large-3 columns">
      <h1><img src="http://placehold.it/400x100&text=Logo"/></h1>
    </div>
    <div class="large-9 columns" ng-controller="SectionsController">
      <ul class="inline-list right">
        <li ng-repeat="section in sections"><a href="#/404">{{section}}</a></li>
      </ul>
    </div>
  </div>

  <div class="row">
    <div class="large-9 push-3 columns" ng-view>

    </div>

    <nav class="large-3 pull-9 columns">
      <ul class="side-nav">
        <li><a href="#/">Home</a></li>
        <li><a href="#/page/1">Page 1</a></li>
        <li><a href="#/page/2">Page 2</a></li>
        <li><a href="#/page/3">Page 3</a></li>
        <li><a href="#/page/4">Page 4</a></li>
        <li><a href="#/page/5">Page 5</a></li>
      </ul>

      <p><img src="http://placehold.it/320x240&text=Ad"/></p>
    </nav>
  </div>

  <footer class="row">
    <div class="large-12 columns">
      <hr/>
      <div class="row">
        <div class="large-6 columns">
          <p>&copy; Copyright Oleksandr Sochka & Victor Batytskyy</p>
        </div>
        <div class="large-6 columns" ng-controller="SectionsController">
          <ul class="inline-list right">
            <li ng-repeat="section in sections"><a href="#/404">{{section}}</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
  </body>
</html>
