import angular from 'angular';
import 'ngReact';
import "widgets/v2.steps/palettes";
import "d3";
import "date-and-time";




let m = angular.module("custom-react-directives",['react','app.widgets.palettes']);
m.service("d3", function(){return d3});

let WdcTable = React.createClass( {

  //default style properties

  defaultHeaderLabelStyle:{
      textAlign: "center",
      fontStretch: "ultra-condensed",
      fontSize: "medium",
      // color: "#008CBA",
      padding: "0.3em 1em"
      // border: "solid 1px #DDDDDD"
  },

  defaultHeaderValueStyle:{
    textAlign: "center",
      fontStretch: "ultra-condensed",
      fontSize: "small",
      fontWeight: "normal",
      // color: "#008CBA",
      padding: "0.3em 1em"
      // border: "solid 1px #DDDDDD"
  },

  defaultValueStyle: {
      fontStretch: "ultra-condensed",
      fontSize: "small",
      padding: "0.3em 1em",
      textAlign: "right"
      // border: "solid 1px #DDDDDD"

  },

 
  // react-directive properties
  propTypes : {
    data: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
  
    return { 
        data:{
              table: { header: [], body:[]},
              decoration:{}
        }
    }    
  },

  

  //partials rendering
   getHeader: function(table){
    let headRows = [];

    // let rowspan = function(r){return {__html: "rowspan="+r}};
    // let colspan = function(c){return {__html: "colspan="+c}};

    

    for(let i=0; i < table.header[0].metadata.length*2; i++){
      let headCells = [];
      if(i==0){
        headCells =
            table.body[0].metadata.map((item,index)=>
              // React.DOM.th({key:"mth"+i+"_"+index, style:headerLabelStyle,rowSpan:table.header[0].metadata.length*2},item.dimensionLabel)

              <th key={"mth"+i+"_"+index} 
                  style={this.headerLabelStyle} 
                  rowSpan={table.header[0].metadata.length*2}>
                {item.dimensionLabel}
              </th>
            )
      }
      
      if((i % 2) == 0){
        headCells.push(
          (() =>
            <th key={"th"+i} style={this.headerLabelStyle} colSpan={table.header.length}>
              {table.header[0].metadata[Math.floor(i/2)].dimensionLabel}
            </th>
          )()
        )
      }

      if((i % 2) == 1){
        headCells = table.header.map((item,index)=>
         <th key={"vth"+index+"_"+i} style={this.headerValueStyle}>
          {
            (item.metadata[Math.floor(i/2)].role == "time" 
              && item.metadata[Math.floor(i/2)].format) 
            ? date.format(new Date(item.metadata[Math.floor(i/2)].label),item.metadata[Math.floor(i/2)].format) 
            : item.metadata[Math.floor(i/2)].label
          } 
         </th>
        
        )
      }

      headRows.push(React.DOM.tr({key:"headtr"+i},headCells))
    }
    return headRows;
  },

  preparePalette: function(){
    if(!this.decoration.color){
      this.palette = [];
      return  
    }
    
    let opacity = (this.decoration.opacity) ? this.decoration.opacity : 1.0;
    this.palette = this.decoration.color.map( (item) => {
      let c = d3.rgb(item);
      return "rgba("+ c.r + ","+ c.g + ","+ c.b + ","+opacity+ ")"
    })
  },

  prepareScales:function(table){
    if(this.decoration.colorize) {
      
      let data = [];
      
      table.body.forEach((row) => {
        data.push(row.value)
      })
      
      if(this.decoration.direction == "Columns"){
        data = d3.transpose(data)
      }

      if(this.decoration.direction == "All"){
        let d = [];
        data.forEach((row) => {
          d = d.concat(row)
        })
        data = [d];
      }

      this.scales = data.map((row) => {
          return d3
            .scale
            .linear()
            .domain([d3.min(row),d3.max(row)])
            .rangeRound([0,this.palette.length-1])
      })
    }
  },

  // generate fill style for cell value
  getValueStyle: function(value,rowIndex,colIndex){
    if(!this.decoration.colorize) return this.valueStyle;

    let result = angular.copy(this.valueStyle);
    
    let index = 0; 
    
    if(this.decoration.direction == "Rows"){
      index = rowIndex
    }

    if(this.decoration.direction == "Columns"){
      index = colIndex
    }

    result.backgroundColor = (value == null) ? undefined : this.palette[this.scales[index](value)];
    return result; 

  },

  getValues: function (row, rowIndex){

    let meta = row.metadata.map((m,i) => 
      <td key={"m"+i} style={this.headerValueStyle} >{

          (m.role == "time" && m.format) ? date.format(new Date(m.label),m.format) : m.label
        }</td>);

    let values = row.value.map((v,colIndex) => 
      <td key={"v"+colIndex} style={this.getValueStyle(v,rowIndex,colIndex)}>{(v == null) ? "-" : v}</td>);
    return meta.concat(values); 
  },



  render: function() {
    // console.log("render", this.props)
    
    // get all render settings
    
    this.decoration = (this.props.data.decoration) ? this.props.data.decoration : {};

    // this.decoration.colorize = true;
    // this.decoration.direction = "All";


    // let c  = (decoration.color) ? decoration.color[0] : "green";
    
    this.headerLabelStyle = (this.decoration.headerLabelStyle) ? 
        this.decoration.headerLabelStyle : this.defaultHeaderLabelStyle;

    this.headerValueStyle = (this.decoration.headerValueStyle) ? 
        this.decoration.headerValueStyle : this.defaultHeaderValueStyle;

    this.valueStyle = (this.decoration.valueStyle) ? 
        this.decoration.valueStyle : this.defaultValueStyle;
  
    let dataTable = this.props.data.table;

    if (angular.isUndefined(dataTable)) return <h5>{this.noDataAvailable}</h5>;
    if (dataTable.body.length == 0) return <h5>No Data Available</h5>;
    // if (angular.isUndefined(dataTable.metadata)) return <h5>No Metadata Available</h5>; 

    // prepare palettes
    this.preparePalette();
    this.prepareScales(dataTable);
    
    let thos = this;
    // main rendering
     
    
    var head =
    <thead key="head">{this.getHeader(dataTable)}</thead>
    // React.DOM.thead({key:"head"},getHeader(this.props.table));
    

    let rows = dataTable.body.map( 
                  function(row, rowIndex) {
                    return React.DOM.tr( { key: rowIndex }, thos.getValues(row, rowIndex))
                  })  
    
    var body = 
     <tbody key="body">{rows}</tbody>
    
    // React.DOM.tbody({key:"body"},rows); 
    
    return <table key="table" border="1">{[head,body]}</table>

    // React.DOM.table({key:"table", border:"1"},[head,body]);
  }
});

m.value( "WdcTable",WdcTable);

m.directive( 'wdcTable', function( reactDirective ) {
  return reactDirective( 'WdcTable' );
});



