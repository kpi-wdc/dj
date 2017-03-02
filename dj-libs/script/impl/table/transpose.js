// Transpose Table


module.exports = {
    name: "transpose",
    synonims: {},
    defaultProperty: {},

    execute: function(command, state, config) {
        if (state.head.type != "table") throw "Incompatible context " + state.head.type + " for command 'transpose'"
        var table = state.head.data;
        

        state.head = {
            data: this.transpose(table),
            type: "table"
        }
        return state;
    },
    help: {
        synopsis: "Transpose table",

        name: {
            "default": "transpose",
            synonims: []
        },
        input:["table"],
        output:"table",
        "default param": "none",
        params: [],
        example: {
            description: "Transpose table",
            code:  "load(\r\n    cache:'5855481930d9ae60277a474a',\r\n    as:'table'\r\n)\r\n\r\norder(for:'row',by:-1, as:'az')\r\n\r\ntranspose()\r\n"

        }
    },
    transpose: function(table){
    	var tBody = table.header;
        var values = [];
        table.body.forEach(function(row) {
            values.push(row.value)
        })


        tValues = [];
        for (var i = 0; i < values[0].length; i++) {
            tValues.push(
                values.map(function(item) {
                    return item[i]
                })
            )
        }

        var tHeader = table.body;
        tHeader.forEach(function(item) {
            item.value = undefined;
        })

        tBody.forEach(function(item, index) {
            item.value = tValues[index]
        })

        table.body = tBody;
        table.header = tHeader;
        return table
    }
}
