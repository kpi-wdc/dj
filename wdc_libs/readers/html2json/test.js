var converter = require('htm-to-json');
var fs = require('fs');
var str = fs.readFileSync('./html.html','utf8');

converter.convert_html_to_json(str,function(err,data){
    if(err) throw err;
    console.log(data);
});


converter.convert_html_to_json(str,function(err,jdata){
    if(err) throw err;
    //console.log(jdata);
    // hjobj.get_data_by_id(jdata,'example-popup2',function(err,data){
    //     console.log(data);
    // });
    // converter.get_data_by_tag(jdata,'script',function(err,data){
    //     console.log(data);
    // });
    // hjobj.get_data_by_attr_val(jdata,'username',function(err,data){
    //     console.log(data);
    // });
});

