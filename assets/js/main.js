System.config({
  "baseURL": "/",
  "paths": {
    "app": "js/app.js",
    "app-list": "js/app-list.js",
    "info": "js/info.js",
    "shims": "js/shims.js",
    "widget-api": "js/widget-api.js",
    "template-cached-pages": "js/templates.js",
    "jsinq": "components/jsinq/source/jsinq.js",
    "jsinq-query": "components/jsinq/source/jsinq-query.js",
    "json-stat": "components/jsonstat/json-stat.max.js",
    "nv.d3": "components/nvd3/nv.d3.js",
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "bower:*": "jspm_packages/bower/*.js",
    "npm:*": "jspm_packages/npm/*.js"
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
        "SCEditor"
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
    "SCEditor": {
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
    "SCEditor": "bower:SCEditor@1.4.4",
    "angular": "bower:angular@1.3.14",
    "angular-cookies": "bower:angular-cookies@1.3.14",
    "angular-foundation": "bower:angular-foundation@0.5.1",
    "angular-json-editor": "bower:angular-json-editor@0.1.8",
    "angular-leaflet": "bower:angular-leaflet@0.7.11",
    "angular-mocks": "bower:angular-mocks@1.3.14",
    "angular-nvd3": "bower:angular-nvd3@0.1.1",
    "angular-oclazyload": "bower:oclazyload@0.5.2",
    "angular-ui-router": "bower:angular-ui-router@0.2.13",
    "d3": "bower:d3@3.5.5",
    "foundation": "bower:foundation@5.5.1",
    "jquery": "github:components/jquery@2.1.3",
    "ngstorage": "bower:ngstorage@0.3.0",
    "oclazyload": "bower:oclazyload@0.5.2",
    "topojson": "bower:topojson@1.6.18",
    "bower:angular-cookies@1.3.14": {
      "angular": "bower:angular@1.3.14"
    },
    "bower:angular-foundation@0.5.1": {
      "angular": "bower:angular@1.3.14"
    },
    "bower:angular-json-editor@0.1.8": {
      "angular": "bower:angular@1.3.14",
      "json-editor": "bower:json-editor@0.7.17"
    },
    "bower:angular-leaflet@0.7.11": {
      "angular": "bower:angular@1.3.14",
      "font-awesome": "bower:font-awesome@4.2.0",
      "leaflet": "bower:leaflet@0.7.3"
    },
    "bower:angular-mocks@1.3.14": {
      "angular": "bower:angular@1.3.14"
    },
    "bower:angular-nvd3@0.1.1": {
      "angular": "bower:angular@1.3.14",
      "d3": "bower:d3@3.3.13",
      "nvd3": "bower:nvd3@1.1.15-beta"
    },
    "bower:angular-ui-router@0.2.13": {
      "angular": "bower:angular@1.3.14"
    },
    "bower:font-awesome@4.2.0": {
      "css": "github:systemjs/plugin-css@0.1.6"
    },
    "bower:foundation@5.5.1": {
      "css": "github:systemjs/plugin-css@0.1.6",
      "fastclick": "bower:fastclick@1.0.6",
      "jquery": "bower:jquery@2.1.3",
      "jquery-placeholder": "bower:jquery-placeholder@2.0.9",
      "jquery.cookie": "bower:jquery.cookie@1.4.1",
      "modernizr": "bower:modernizr@2.8.3"
    },
    "bower:jquery-placeholder@2.0.9": {
      "jquery": "bower:jquery@2.1.3"
    },
    "bower:jquery.cookie@1.4.1": {
      "jquery": "bower:jquery@2.1.3"
    },
    "bower:leaflet@0.7.3": {
      "css": "github:systemjs/plugin-css@0.1.6"
    },
    "bower:ngstorage@0.3.0": {
      "angular": "bower:angular@1.3.14"
    },
    "bower:nvd3@1.1.15-beta": {
      "css": "github:systemjs/plugin-css@0.1.6",
      "d3": "bower:d3@3.3.13"
    },
    "bower:oclazyload@0.5.2": {
      "angular": "bower:angular@1.3.14"
    },
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.3.0"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.0.3"
    },
    "github:jspm/nodelibs-events@0.1.0": {
      "events-browserify": "npm:events-browserify@0.0.1"
    },
    "github:jspm/nodelibs-http@1.7.0": {
      "Base64": "npm:Base64@0.2.1",
      "events": "github:jspm/nodelibs-events@0.1.0",
      "inherits": "npm:inherits@2.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "github:jspm/nodelibs-https@0.1.0": {
      "https-browserify": "npm:https-browserify@0.0.0"
    },
    "github:jspm/nodelibs-os@0.1.0": {
      "os-browserify": "npm:os-browserify@0.1.2"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "github:jspm/nodelibs-stream@0.1.0": {
      "stream-browserify": "npm:stream-browserify@1.0.0"
    },
    "github:jspm/nodelibs-url@0.1.0": {
      "url": "npm:url@0.10.3"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:systemjs/plugin-css@0.1.6": {
      "clean-css": "npm:clean-css@3.0.10",
      "fs": "github:jspm/nodelibs-fs@0.1.1",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:amdefine@0.1.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.1",
      "module": "github:jspm/nodelibs-module@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:assert@1.3.0": {
      "util": "npm:util@0.10.3"
    },
    "npm:buffer@3.0.3": {
      "base64-js": "npm:base64-js@0.0.8",
      "ieee754": "npm:ieee754@1.1.4",
      "is-array": "npm:is-array@1.0.1"
    },
    "npm:clean-css@3.0.10": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "commander": "npm:commander@2.5.1",
      "fs": "github:jspm/nodelibs-fs@0.1.1",
      "http": "github:jspm/nodelibs-http@1.7.0",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "os": "github:jspm/nodelibs-os@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "source-map": "npm:source-map@0.1.43",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:commander@2.5.1": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-util-is@1.0.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:events-browserify@0.0.1": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:https-browserify@0.0.0": {
      "http": "github:jspm/nodelibs-http@1.7.0"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:os-browserify@0.1.2": {
      "os": "github:jspm/nodelibs-os@0.1.0"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:readable-stream@1.1.13": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.1",
      "events": "github:jspm/nodelibs-events@0.1.0",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "stream": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:source-map@0.1.43": {
      "amdefine": "npm:amdefine@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.0",
      "inherits": "npm:inherits@2.0.1",
      "readable-stream": "npm:readable-stream@1.1.13"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:url@0.10.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "punycode": "npm:punycode@1.3.2",
      "querystring": "npm:querystring@0.2.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

