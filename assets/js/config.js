System.config({
  "baseURL": "/",
  "transpiler": "traceur",
  "paths": {
    "app": "js/app.js",
    "app-list": "js/app-list.js",
    "info": "js/info.js",
    "i18n": "js/i18n.js",
    "dictionary": "js/dictionary.js",
    "modal-controllers": "js/modal-controllers.js",
    "widget-api": "js/widget-api.js",
    "skin-directives": "js/skin-directives.js",
    "template-cached-pages": "js/templates.js",
    "file-upload-shim": "components/ng-file-upload/angular-file-upload-shim.js",
    "file-upload": "components/ng-file-upload/angular-file-upload.js",
    "jquery": "components/jquery/dist/jquery.js",
    "angular": "components/angular/angular.js",
    "angular-mocks": "components/angular-mocks/angular-mocks.js",
    "angular-animate": "components/angular-animate/angular-animate.js",
    "angular-translate": "components/angular-translate/angular-translate.js",
    "angular-translate-loader-static-files": "components/angular-translate-loader-static-files/angular-translate-loader-static-files.js",
    "angular-translate-storage-cookie": "components/angular-translate-storage-cookie/angular-translate-storage-cookie.js",
    "angular-translate-storage-local": "components/angular-translate-storage-local/angular-translate-storage-local.js",
    "angular-ui-router": "components/angular-ui-router/release/angular-ui-router.js",
    "angular-ui-tree": "components/angular-ui-tree/dist/angular-ui-tree.js",
    "angular-clipboard": "components/angular-clipboard/angular-clipboard.js",
    
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
    "github:*": "../../jspm_packages/github/*.js"
  }
});

System.config({
  "meta": {
    "file-upload-shim": {
      "deps": []
    },
    "angular": {
      "deps": [
        "jquery",
        "file-upload-shim"
      ],
      "exports": "angular"
    },
    "file-upload": {
      "deps": [
        "angular"
      ]
    },
    "jquery": {
      "exports": "$"
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
    "angular-animate": {
      "deps": [
        "angular"
      ]
    },
    "angular-translate": {
      "deps": [
        "angular"
      ]
    },
    "angular-translate-loader-static-files": {
      "deps": [
        "angular-translate"
      ]
    },
    "angular-translate-storage-cookie": {
      "deps": [
        "angular-translate",
        "angular-cookies"
      ]
    },
    "angular-translate-storage-local": {
      "deps": [
        "angular-translate",
        "angular-translate-storage-cookie"
      ]
    },
    "angular-ui-router": {
      "deps": [
        "angular"
      ]
    },
    "angular-ui-tree": {
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
    "text": "github:systemjs/plugin-text@0.0.2",
    "traceur": "github:jmcriffey/bower-traceur@0.0.87",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.87"
  }
});

