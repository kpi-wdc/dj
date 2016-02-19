import angular from 'angular';
import 'ngReact';
import "widgets/v2.steps/palettes";

let m = angular.module("wizard-directives",['react','app.widgets.palettes']);

let ulStyle = {
  height:"10rem", 
  overflow: "auto"
}

let colorStyle = (color) => {
  return {
    backgroundColor: color,
    width: "10px",
    height: "10px",
    display: "inline-block", 
    margin: "0",
    padding: "0",
    border: "1px solid #afafaf"
  }
}



let renderColor = (color,indexc,indexp) => <span key={"color"+indexp+indexc} style={colorStyle(color)}></span>

let renderRow = (pal,indexp,onSelect,dest) => { 
  let clickHandler = () => {
      onSelect.call(dest,pal)
  }
  return <li key={'pal'+indexp} onClick={clickHandler}>{pal.map((c,indexc)=>renderColor(c,indexp,indexc))}</li>
}

let Pal = React.createClass({
    propTypes : {
      setter: React.PropTypes.func.isRequired,
      dest: React.PropTypes.object.isRequired
     },

    getDefaultProps: function() {
      return {
        setter :  (data) => {console.log(data)},
        dest : {}
      };
    },
    
    render:function(){
     
     let setter = this.props.setter;
     let dest = this.props.dest;
     return <ul className={"f-dropdown tiny"} style={ulStyle} id={'dropdown-example-3'}>
          {Palettes.map((pal,index) => renderRow(pal, index, setter, dest)) }
        </ul>
    }    
})

m.value( "Pal",Pal);

m.directive( 'fastPalettePeacker', function( reactDirective ) {
  return reactDirective( 'Pal' );
});


m.directive('titlesControl', () => {
  return {
    restrict: 'E',
    templateUrl: 'widgets/v2.steps/partials/titles-ctrl.html',
    transclude: true
  }
});