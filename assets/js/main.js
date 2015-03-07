System.config({
  "baseURL": "/",
  "paths": {
    "app": "js/app.js",
    "app-list": "js/app-list.js",
    "info": "js/info.js",
    "shims": "js/shims.js",
    "widget-api": "js/widget-api.js",
    "template-cached-pages": "js/templates.js",
    "angular-mocks": "components/angular-mocks/angular-mocks.js",
    "angular-ui-router": "components/angular-ui-router/release/angular-ui-router.js",
    "ngstorage": "components/ngstorage/ngStorage.js",
    "angular-oclazyload": "components/oclazyload/dist/ocLazyLoad.js",
    "angular-foundation": "components/angular-foundation/mm-foundation-tpls.js",
    "angular-json-editor": "components/angular-json-editor/src/angular-json-editor.js",
    "json-editor": "components/json-editor/dist/jsoneditor.js",
    "angular-cookies": "components/angular-cookies/angular-cookies.js",
    "sceditor": "components/SCEditor/minified/jquery.sceditor.min.js",
    "leaflet": "components/leaflet/dist/leaflet.js",
    "angular-leaflet": "components/angular-leaflet/dist/angular-leaflet-directive.js",
    "d3": "components/d3/d3.js",
    "jsinq": "components/jsinq/source/jsinq.js",
    "jsinq-query": "components/jsinq/source/jsinq-query.js",
    "json-stat": "components/jsonstat/json-stat.max.js",
    "nv.d3": "components/nvd3/nv.d3.js",
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js"
  },
  }
});

System.config({
  "meta": {
    "app-config": {
      "build": false
    },
    "author": {
      "build": false
    },
    "user": {
      "build": false
    },
    "app-list/list": {
      "build": false
    },
    "json-editor": {
      "deps": [
        "sceditor"
      ],
      "exports": "JSONEditor"
    },
    "angular-mocks": {
      "deps": [
        "angular"
      ]
    },
    "angular-ui-router": {
      "deps": [
        "angular"
      ]
    },
    "ngstorage": {
      "deps": [
        "angular"
      ]
    },
    "angular-oclazyload": {
      "deps": [
        "angular"
      ]
    },
    "angular-foundation": {
      "deps": [
        "angular"
      ]
    },
    "angular-json-editor": {
      "deps": [
        "angular",
        "json-editor"
      ]
    },
    "angular-cookies": {
      "deps": [
        "angular"
      ]
    },
    "sceditor": {
      "deps": [
        "jquery"
      ]
    },
    "leaflet": {
      "exports": "L"
    },
    "angular-leaflet": {
      "deps": [
        "angular",
        "leaflet"
      ]
    },
    "d3": {
      "exports": "d3"
    },
    "jsinq": {
      "exports": "jsinq"
    },
    "jsinq-query": {
      "deps": [
        "jsinq"
      ]
    },
    "json-stat": {
      "exports": "JSONstat"
    },
    "nv.d3": {
      "exports": "nv",
      "deps": [
        "d3"
      ]
    }
  }
});

System.config({
  "map": {
    "angular": "github:angular/bower-angular@1.3.14",
    "jquery": "github:components/jquery@2.1.3"
  }
});

