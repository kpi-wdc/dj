import angular from 'angular';
import 'ngReact';

let m = angular.module("custom-react-directives",['react']);

let WdcTable = React.createClass( {

  propTypes : {
    table: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return { table: { header: [], body:[]} };
  },

  render: function() {
    let headerLabelStyle = {
      textAlign: "center",
      fontStretch: "ultra-condensed",
      fontSize: "medium",
      color: "#008CBA",
      padding: "0.3em 1em",
      border: "solid 1px #DDDDDD"

    }
    
    let headerValueStyle = {
      textAlign: "center",
      fontStretch: "ultra-condensed",
      fontSize: "small",
      fontWeight: "normal",
      color: "#008CBA",
      padding: "0.3em 1em",
      border: "solid 1px #DDDDDD"

    } 

    let valueStyle = {
      fontStretch: "ultra-condensed",
      fontSize: "small",
      padding: "0.3em 1em",
      textAlign: "right",
      border: "solid 1px #DDDDDD"

    } 

    if (angular.isUndefined(this.props.table)) return <div/>; 
    if (angular.isUndefined(this.props.table.metadata)) return <div/>; 
    
    
    function getHeader(table){
      let headRows = [];

      let rowspan = function(r){return {__html: "rowspan="+r}};
      let colspan = function(c){return {__html: "colspan="+c}};

      // console.log(rowspan(table.header[0].metadata.length*2))
      // console.log(colspan(table.header.length))


      for(let i=0; i < table.header[0].metadata.length*2; i++){
        let headCells = [];
        if(i==0){
          headCells =
              table.body[0].metadata.map((item,index)=>
                // React.DOM.th({key:"mth"+i+"_"+index, style:headerLabelStyle,rowSpan:table.header[0].metadata.length*2},item.dimensionLabel)

                <th key={"mth"+i+"_"+index} 
                    style={headerLabelStyle} 
                    rowSpan={table.header[0].metadata.length*2}>
                  {item.dimensionLabel}
                </th>
              )
        }
        
        if((i % 2) == 0){
          headCells.push(
            (() =>
              <th key={"th"+i} style={headerLabelStyle} colSpan={table.header.length}>
                {table.header[0].metadata[Math.floor(i/2)].dimensionLabel}
              </th>
            )()
          )
        }

        if((i % 2) == 1){
          headCells = table.header.map((item,index)=>
           <th key={"vth"+index+"_"+i} style={headerValueStyle}>
              {item.metadata[Math.floor(i/2)].label}
            </th>
          
          )
        }

        headRows.push(React.DOM.tr({key:"headtr"+i},headCells))
      }
      return headRows;
    }

    function getValues(row){
      let meta = row.metadata.map((m,i) => 
        <td key={"m"+i} style={headerValueStyle} >{m.label}</td>);

      let values = row.value.map((v,i) => 
        <td key={"v"+i} style={valueStyle}>{(v == null) ? "-" : v}</td>);
      return meta.concat(values); 
    }

    // console.log(this.props);
    let rows = this.props.table.body.map( 
                  function(row, i) {
                    return React.DOM.tr( { key: i }, getValues(row))
                  })  
    var head =
    <thead key="head">{getHeader(this.props.table)}</thead>
    // React.DOM.thead({key:"head"},getHeader(this.props.table));
    
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