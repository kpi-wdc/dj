var conf = require("./impl")
    .concat(require("../../dj-libs/script/dps-config"));

var Script = require("../../dj-libs/script");

var logger = require("../../dj-libs/log").global;

logger.debug("Start DPS Service")

module.exports = {

    run: function(req, resp) {
        var script = req.body.script;
        
        var state = req.body.state;
        
      
        var locale = req.body.locale || "en";
        locale = (locale == "uk") ? "ua" : locale;

        state = (state) || {locale : locale}

        var executable = new Script()
            .config(conf)
            .script(script)
            // .state(state)
            .run(state)
            .then(function(result) {
                resp.send(result)
            })
            .catch(function(error) {
                resp.send({ type: "error", data: error })
            })
    }

}
