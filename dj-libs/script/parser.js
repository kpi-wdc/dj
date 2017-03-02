

var util = require("util");
var logger = require("../log").global;



var ParserError = function(message) {
    this.message = message;
    this.name = "ParserError";
}
ParserError.prototype = Object.create(Error.prototype);
ParserError.prototype.constructor = ParserError;


var valuesRE = /'((?:\\\\[\'bfnrt/\\\\]|\\\\u[a-fA-F0-9]{4}|[^\'\\\\])*)'|\"((?:\\\\[\"bfnrt/\\\\]|\\\\u[a-fA-F0-9]{4}|[^\"\\\\])*)\"/gim,
    lineCommentRE = /\/\/[\w\S\ .\t\:\,;\'\"\(\)\{\}\[\]0-9-_]*(?:[\n\r]*)/gi,
    lineRE = /[\r\n\t\s]*/gim,
    inlineCommentRE = /\/\*[\w\W\b\.\t\:\,;\'\"\(\)\{\}\[\]\*0-9-_]*(?:\*\/)/gim,
    commandSplitRE = /(\))([a-zA-Z@])/gim,
    nonbrackedParamsRE = /\(([\w\b\.\t\:\,\'\"0-9-_]+[\w\b\.\t\:\,\'\"\[\]\^0-9-_]*)\)/gi,
    propertyNameRE = /((@[a-zA-Z\-_]+|[a-zA-Z\-_]+)(?=[\(\)\{\}\:\[\]\s]+))/gim,
    emptyPropsListRE = /\(\s*\)/gi,
    defaultValueRE = /\:\{\^*[0-9]+\};/gi,
    defaultStoredValueRE = /\:\^[0-9]+;/gi,
    urlLookup = /\^[0-9]+/gi,
    commandNameRE = /"@*[a-zA-Z0_-]+[a-zA-Z0-9_-]*":/gi,
    paramsRE = /:[\{\^\[]+[a-zA-Z0-9_:",\^\{\}\[\]-]*[\}\]]+;*|:\^[0-9]+;*/gi,
    // scriptRE = /\<\%[\w\d_\-\"\'\?\!\$\(\)\=\:\#\@\/\[\]\^\.\>\<\}\{\|\&\s\,\r\n\f\t]*\%\>/gim,
    scriptRE = /(\<\?([^?]|(\?+[^?\>]))*\?\>)/g,
    bindableRE = /({{[a-zA-Z\$\_]+[a-zA-Z0-9\$\_\.\[\]\"\']*}})/g,
    // urlRE = /http\:\/\/[\w\s\d\:\.\?\=\&\/\%]*/gim;
    urlRE = /((https?:\/\/)([a-zA-Z0-9]+[a-zA-Z0-9_-]*)(:\d{0,4})?([a-zA-Z0-9_\-\/\%\=\{\}\?\+\&\.\:]*))/g




var ScriptParser = function() {
    this.defaultPropName = {}
    this.keywords = {};
    this.commands = {};
}

ScriptParser.prototype.config = function(commands) {
    var self = this;
    if (!commands) return this;
    if (!util.isArray(commands)) commands = [commands]
    commands.forEach(function(command) {
        for (var key in command.defaultProperty) {
            self.defaultPropName[key] = command.defaultProperty[key]
        }
        for (var key in command.synonims) {
            self.keywords[key] = command.synonims[key]
        }
        self.commands[command.name] = command;
    })
    return this;
}

ScriptParser.prototype.parse = function(str) {
	
    var self = this;

    var lookup = function(o,keywords) {
        if (util.isDate(o)) {
            return o;
        }

        if (util.isString(o)) {
            return ((keywords[o.toLowerCase()]) ? keywords[o.toLowerCase()] : o)
        }

        if (util.isArray(o)) {
            var res = [];
            o.forEach(function(item) {
                res.push(lookup(item,keywords))
            })
            return res;
        }

        if (util.isObject(o)) {
            var res = {};
            for (key in o) {
                res[lookup(key,keywords)] = lookup(o[key],keywords)
            }
            return res;
        }

        return o;
    }

    var values = [];


    function varIndex(tag) {
        var key = tag.substring(1, tag.length - 1)
        if (key.indexOf("?") == 0) {
            key = key
                .replace(/\"/gim, '\\"');
           
            var postProcess;
            key = key.replace(
                /(?:\?)(javascript|json|text|html|dps|xml|csv)/,
                    function(m){
                        postProcess = m.substring(1);
                        return ""
                    }
                )
                .replace(/(^\?)|(\?$)/g, "")
                .replace(/\r/gim, "\\r")
                .replace(/\n/gim, "\\n")
                .replace(/\t/gim, "\\t")
                //.replace(/\"/gim, "'")
                
            values.push(key)
            return "context(value:" + "^" + (values.length - 1) + ");"+postProcess+"();"
        } else {
            key = key.replace(/\"/gi, "'")
            values.push(key)
            return "^" + (values.length - 1)
        }
    }

    function pushUrl(tag) {
        values.push(tag)
        return "^" + (values.length - 1)
    }


    function getUrl(key) {
        return values[Number(key.substring(1))]
    }

    function varValue(tag) {

        var key = tag.substring(1);
        var r = values[Number(key)]

        while (r.indexOf("^") == 0) {
            key = r.substring(1);
            r = values[Number(key)]
        }

        // if (r.indexOf("?") == (r.length-1)) {
        //     return '"' + r + '"'
        // }

        return '"' + r + '"'
    }

    var p = str
        .replace(scriptRE, varIndex)
        .replace(urlRE, pushUrl)
        .replace(bindableRE,"\"$1\"")

        .replace(lineCommentRE, "")
        .replace(valuesRE, varIndex)
        .replace(lineRE, "")
        .replace(inlineCommentRE, "")

    

        .replace(commandSplitRE, "$1;$2")
        .replace(nonbrackedParamsRE, "({$1})")
        .replace(propertyNameRE, "\"$1\"")
        .replace(/\'/gim, "\"")
        .replace(emptyPropsListRE, "({})")
        .replace(/\(/gim, ":")
        .replace(/\)/gim, "")

    // console.log(p)
        
    try {
        p = p
            .split(";")
            .map(function(item) {
                return item + ";"
            })
            .map(function(cmd) {
                if (cmd == ";") {
                    return cmd
                }
                // console.log("MAP ", cmd)
                var cmdName = cmd.match(commandNameRE)[0];
                cmdName = cmdName.substring(1, cmdName.length - 2)
                var params = cmd.match(paramsRE).map(function(item) {
                    if (item.match(defaultValueRE)) {
                        var p;
                        if (item.match(/\:\{\^/gi)) {
                            p = item.substring(3, item.length - 3)
                        } else if (item.match(/\:\{/gi)) {
                            p = item.substring(2, item.length - 2)
                        }
                        return ":{\"" + self.defaultPropName[cmdName] + "\":" + p + "}"
                    }
                    if (item.match(defaultStoredValueRE)) {
                        var p = item.substring(1, item.length - 1)
                        return ":{\"" + self.defaultPropName[cmdName] + "\":" + p + "}"
                    }
                    return item
                });

                return "\"" + cmdName + "\"" + params[0]
            })
            .join(";")
            .replace(/;;/gi, ";");

        // console.log("AFTER MAP ", p)    
        //p = p.replace(/\^[0-9]+/gim, varValue)


        var script = [];
        var cmd = p.split(";")
        cmd.forEach(function(cm) {
            // console.log('Parse:',"{" + cm.replace(/\^[0-9]+/gim, varValue) + "}")
            var t = JSON.parse("{" + cm.replace(/\^[0-9]+/gim, varValue) + "}");
            script.push(t)

        })

        var result = script.map(function(c) {
            var res = {
                processId: lookup(Object.keys(c)[0],self.keywords),
                settings: c[Object.keys(c)[0]]
            }
            
            if(self.commands[res.processId]){
                res.settings = lookup(res.settings,self.commands[res.processId]["internal aliases"])
            }
            return res;
        }).filter(function(c){return c.processId});
    } catch (e) {
        throw new ParserError(e.toString());
    }

    result.forEach(function(c) {
        if (c.processId == "context" && c.settings.value.replace) {
            c.settings.value = c.settings.value.replace(urlLookup, getUrl)
        }
    })
    // console.log(JSON.stringify(result))
    return result;
}

ScriptParser.prototype.stringify = function(script) {
    return script.map(function(c) {
        return c.processId + "(" + JSON.stringify(c.settings) + ")"
    }).join(";")
}

ScriptParser.prototype.applyContext = function(template, context) {
    var getContextValue = function() {
        var tags = arguments[1].split(".")
        var value = context;
        tags.forEach(function(tag) {
            tag = tag.trim();
            value = value[tag]
        })

        return value
    }
    return template.replace(/(?:\{\{\s*)([a-zA-Z0-9_\.]*)(?:\s*\}\})/gim, getContextValue)
}


module.exports = ScriptParser;

