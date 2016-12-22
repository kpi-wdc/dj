import angular from 'angular';
import "custom-react-directives";
import "wizard-directives";


var m = angular.module("app.widgets.v2.steps.table-decoration",[
	 "custom-react-directives", "wizard-directives", 'app.dps']);

m.factory("TableDecoration",[
	"$http",
	"$dps",
	"$q", 
	"parentHolder",
	"pageWidgets",
	
	function(
		$http, 
		$dps,
		$q, 
		parentHolder,
		pageWidgets){

		


		return {
			id: "TableDecoration",

			title : "Table Decoration",
			
			description : "Setup table decoration options",
	        
	    	html : "./widgets/v2.steps/table-decoration.html",

	    	onStartWizard: function(wizard){
	    		this.wizard = wizard;
	    		this.conf = {
	    			decoration : (wizard.conf.decoration) ? wizard.conf.decoration : {},
	    			dataID : wizard.conf.dataID,
	    			queryID : wizard.conf.queryID,
	    			dataUrl : "/api/data/process/",
	    			emitters: wizard.conf.emitters
	    		}
	    		
	    		this.conf.decoration.setColor = (palette) => { this.conf.decoration.color = angular.copy(palette) }
	    		
	    		this.conf.decoration.colorize = (this.conf.decoration.colorize) ? 
	    			this.conf.decoration.colorize : false;

	    		this.conf.decoration.height = (this.conf.decoration.height) ? 
	    			this.conf.decoration.height : 250;	
	    		

	    		this.conf.decoration.opacity = (this.conf.decoration.opacity) ? 
	    			this.conf.decoration.opacity : 0.5;
	    		
	    		this.conf.decoration.direction = (this.conf.decoration.direction) ? 
	    			this.conf.decoration.direction : "Rows";

	    		this.queries = [];
	    		
	    		pageWidgets()
	    			.filter((item) => item.type =="v2.query-manager")
	    			.map((item) => item.queries)
	    			.forEach((item) => {this.queries = this.queries.concat(item)})

	    		if(this.conf.queryID){
	    			let thos = this;
	    			this.inputQuery = this.queries.filter((item) => item.$id == this.conf.queryID)[0].$title;
	    		}	

	    		this.activate();	 

	    	},

	    	onFinishWizard:  function(wizard){
	    		wizard.conf.decoration = this.conf.decoration;
	    		wizard.conf.dataID  = this.conf.dataID; 
	    		wizard.conf.queryID = this.conf.queryID;
	    		wizard.conf.emitters  = this.conf.emitters;
	    		
	    		this.table = undefined;
	    		this.conf = {};
	    	},

	    	onCancelWizard: function(wizard){
				this.table = undefined;
	    		this.conf = {};
	    	},

	    	reversePalette: function(){
				if ( this.conf.decoration.color ){
					this.conf.decoration.color = this.conf.decoration.color.reverse(); 
				}	
			},
			selectInputData: function(){
				let thos = this;
      			let iq = this.queries.filter((item) => item.$title == thos.inputQuery)[0];
				this.conf.dataID = iq.context.queryResultId;
				this.conf.queryID = iq.$id;
				this.loadData();
			},

			loadData: function(){
				let thos = this;

				$dps
		          .get("/api/data/process/"+this.conf.dataID)
		          .success(function (resp) {
		              thos.wizard.context.postprocessedTable = resp.value;
		              thos.table = resp.value;
		              thos.conf.decoration.width = parentHolder(thos.wizard.conf).width;
		          })
		          
			},

			activate : function(wizard){
				if (this.conf.dataID) this.loadData();
			}
	    }
}]);    	
