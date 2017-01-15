import angular from 'angular';

// console.log("ace",ace)
var highlight = ace.require("ace/ext/static_highlight")
// console.log("highlight",highlight)
// 
// 
const skin = angular.module('app.skinDirectives', []);

skin.directive('designPanel', () => {
    return {
        restrict: 'E',
        templateUrl: '/partials/design-panel.html',
        require: '^MainController'
    }
});

skin.directive('applicationView', () => {
    return {
        restrict: 'E',
        templateUrl: '/partials/application-view.html',
        transclude: true
    }
});

skin.directive('pageListNav', () => {
    return {
        restrict: 'E',
        template: `<widget type="page-list" instanceName="page-list-nav" skin="true"></widget>`
    }
});

skin.directive('languageSelectorNav', () => {
    return {
        restrict: 'E',
        template: `<widget type="language-selector" instanceName="language-selector" skin="true"></widget>`
    }
});

skin.directive('appLogo', () => {
    return {
        restrict: 'E',
        template: `<widget type="app-logo" instanceName="app-logo-widget" skin="true"></widget>`
    }
});

skin.directive('logoutButton', () => {
    return {
        restrict: 'E',
        templateUrl: '/partials/logout-button.html'
    }
});

skin.directive('loginGoogleButton', () => {
    return {
        restrict: 'E',
        templateUrl: '/partials/login-google-button.html'
    }
});

skin.directive('prettyDps', function() {
    // console.log("prettyDps")
    var isDefined = angular.isDefined;
    var lookups = {
        comment: {
            re: /\/\/.*|\/\*[\w\W\b\.\t\:\,;\'\"\(\)\{\}\[\]\*0-9-_]*(?:\*\/)/gim
        },
        command: {
            re: /[a-zA-Z]+[a-zA-Z0-9_]*[\t ]*\(/gim
        },
        property: {
            re: /[a-zA-Z]+[a-zA-Z0-9_]*[\t ]*:/gim
        },
        textValue: {
            re: /"[\w\d_\-'\?\$\(\)\=\#\@\/\[\]\%\^\.\>\<\}\{\s\,}]*"|'[\w\d_\-"\?\$\(\)\=\#\@\/\[\]\%\^\.\>\<\}\{\s\,]*'/gim
        },
        numberValue: {
            re: /[-]*[0-9]+[0-9\.]*/gim
        },
        delimiter: {
            re: /[\(\)\{\}\:\:\;\,\[\]]/gim
        },
        injection:{
          re: /(\<\%([^%]|(\%+[^%\>]))*\%\>)/g,
        },
        snippet: {
            re: /<[0-9]+>/gim
        },
        lt: {
            re: /\</gim
        },
        gt: {
            re: /\>/gim
        }
    }

    var markup = function(str) {
        if (!str || str == '') return str;
        var snippets = []
        var s = str
           
            .replace(lookups.injection.re, function(match, index) {
                snippets.push('<span class="injection">' + 
                    match.replace(lookups.lt.re, "&lt;")
                         .replace(lookups.gt.re, "&gt;") + '</span>');
                return '<' + (snippets.length - 1) + '>'
            })

            .replace(lookups.comment.re, function(match, index) {
                snippets.push('<span class="comment">' + match + '</span>');
                return '<' + (snippets.length - 1) + '>'
            })
            
            .replace(lookups.command.re, function(match, index) {
                snippets.push('<span class="command">' + match.substring(0, match.length - 1) + '</span>');
                return '<' + (snippets.length - 1) + '>('
            })
            .replace(lookups.property.re, function(match, index) {
                snippets.push('<span class="property">' + match.substring(0, match.length - 1) + '</span>');
                return '<' + (snippets.length - 1) + '>:'
            })
            .replace(lookups.textValue.re, function(match, index) {
                snippets.push('<span class="textValue">' + match + '</span>');
                return '<' + (snippets.length - 1) + '>'
            })
        
            
        while (s.match(lookups.snippet.re)) {
            s = s.replace(lookups.snippet.re, function(match) {
                return snippets[new Number(match.substring(1, match.length - 1))]
                         
            })
        }

        return s
    }

    return {
        restrict: 'AE',

        scope: {
            script: '=',
            prettyDps: '='
        },

        template: '<pre class="prettify-dps"></pre>',

        replace: true,

        link: function(scope, elm, attrs) {
            var exp = isDefined(attrs.script) ? attrs.script : '';
            scope.$watch(exp, function(newValue, oldValue) {
                elm.html(markup(newValue))
            }, true);
        }

    };
})

skin.directive('highlight', function() {

    
    
    return {
        restrict: 'AE',
        template: '<div class="highlighter"></div>',

        replace: true,

        scope: {
            settings: '=?'
        },

        link: function(scope, elm, attrs) {
           
            var render = function(scope){
                var mode = ace.require("ace/mode/"+scope.settings.options.mode);
                mode = (mode)? mode.Mode : mode;  
                var theme = ace.require("ace/theme/"+scope.settings.options.theme);
                
                if(!mode){
                    console.error("Highlighter mode: "+scope.settings.options.mode+" not supported")
                    return
                }
                
                if(!theme){
                    console.error("Highlighter theme: "+scope.settings.options.theme+" not supported")
                }


                var highlighted = highlight.renderSync(
                        scope.settings.data,
                        new mode(),
                        theme
                );
                

                ace.require("ace/lib/dom").importCssString(
                    highlighted.css
                        .replace("font-size: 12px;","")
                        .replace(
                            ".ace_static_highlight .ace_gutter-cell:before {",
                            ".ace_static_highlight .ace_gutter-cell:before { font-size: xx-small; padding-right: 0.5em; "
                        ),
                    "ace_highlight"
                );     
                
                elm.html(highlighted.html)
                
            }

            scope.$watch("settings", function() {
                render(scope)
            }, true);

            
        }

    };
})
