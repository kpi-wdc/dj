import angular from 'angular';
import 'widgets/v2.nvd3-widget/nvd3-widget';
import "widgets/v2.nvd3-gantt/adapter";
import "wizard-directives";


var m = angular.module("app.widgets.v2.steps.gantt-chart-decoration",[
	'app.widgets.v2.nvd3-widget',
    "app.widgets.v2.gantt-chart-adapter", 
    "wizard-directives"]);

m.factory("GanttChartDecoration",[
	"$http",
	"$q", 
	"dialog",
	"appUrls",
	"parentHolder",
	"GanttChartAdapter", 
	"pageWidgets",
	function(
		$http, 
		$q, 
		dialog,
		appUrls,
		parentHolder, 
		GanttChartAdapter,
		pageWidgets ){
		
		let chartAdapter = GanttChartAdapter;

		return {
			id: "GanttChartChartDecoration",

			title : "Chart Decoration",
			
			description : "Setup chart decoration options",
	        
	    	html : "./widgets/v2.nvd3-gantt/gantt-chart-decoration.html",

	    	onStartWizard: function(wizard){
	    		this.wizard = wizard;
	    		this.conf = {
	    			decoration : wizard.conf.decoration,
	    			dataID : wizard.conf.dataID,
	    			serieDataId: wizard.conf.dataID,
	    			optionsUrl : "./widgets/v2.nvd3-gantt/options.json",
	    			dataUrl : "./api/data/process/"
	    		}	
	    	},

	    	onFinishWizard:  function(wizard){
	    		wizard.conf.decoration = this.conf.decoration;
	    		wizard.conf.dataID  = this.conf.dataID;
	    		wizard.conf.serieDataId  = this.conf.serieDataId;
	    		this.settings = {options:angular.copy(this.options), data:[]};
	    		this.conf = {};
	    	},

	    	onCancelWizard: function(wizard){
				this.settings = {options:angular.copy(this.options), data:[]};
				this.conf = {};
	    	},

	    	
	    	_prepare : function(data){
              var result = data.map((item) => {return item})
              result.forEach((item) => {
                if(item.end == null) delete item.end;
                if(item.note == null) delete item.note;
                
                if(item.income == null) {
                  delete item.income
                }else{
                  item.income.forEach((p) => {
                    if(p.marker == null) delete p.marker
                  })
                } 

                if(item.expenditure == null) {
                  delete item.expenditure
                }else{
                  item.expenditure.forEach((p) => {
                    if(p.marker == null) delete p.marker
                  })
                } 

                if(item.causes == null) {
                  delete item.causes
                }else{
                  item.causes.forEach((p) => {
                    if(p.type == null) {
                      delete p.type
                      delete p.src.type
                      delete p.target.type
                    }  
                  })
                }  

              })
              return result;
            },
			
			createTimeline: function(){
			var thos = this;	
			  dialog({
		        title:"Select Timeline Excel file",
		        fields:{
		          file:{
		            title:"Timeline file:", 
		            type:'file', 
		            editable:true, 
		            required:true
		          }
		        }
		      })
		      	.then((form) =>{

			        const fd = new FormData();
			        // Take the first selected file
			        fd.append('file', form.fields.file.value);
			        $http
			        	.post(appUrls.createTimeline, fd, {
				          withCredentials: true,
				          headers: {'Content-Type': undefined},
				          transformRequest: angular.identity
				        })
				        .success(resp => {
				          	thos.data = resp.value;
				          	thos.conf.dataID = resp.id;
				          	thos.conf.serieDataId = resp.id;
				          	thos.loadData();
				        })
				        .error((data, status) => {
				          	if (status === 415) {
				            	alert.error($translate.instant('WIDGET.V2.APP-LIST.CANNOT_PARSE_DATA_AS_VALID_JSON', {data}));
				          	} else {
				            	alert.error($translate.instant('WIDGET.V2.APP-LIST.ERROR_IMPORTING_APP', {status}));
				          	}
				        });
				})        
		    },

			
			loadOptions : function(){
				return $http.get(this.conf.optionsUrl)
			},

			loadSeries : function(){
				return $http.get("./api/data/process/"+this.conf.serieDataId)
			}, 

			
		   loadData: function(){
				let thos = this;
				$q
					.all([
						thos.loadOptions().then((resp) =>{
							thos.options = resp.data;
							if(!thos.conf.decoration){
			            		thos.conf.decoration = chartAdapter.getDecoration(thos.options);
			            	}
			            	// console.log("thos.options",thos.options)
						}),
						thos.loadSeries().then((resp) => {
							// console.log("resp",resp.data.value)
							thos.data =thos._prepare( resp.data.value)
							console.log("thos.data",thos.data)
						})
					])
					.then(() => {
						thos.apply();
					})

			},

			activate : function(wizard){
				if (this.conf.dataID){
					this.loadData();
				}
			},

			apply: function(){
				this.conf.decoration.width = parentHolder(this.wizard.conf).width;
				chartAdapter.applyDecoration(this.options,this.conf.decoration);
				this.settings = {options:angular.copy(this.options), data:angular.copy(this.data)};
				// console.log("this.settings",this.settings)
				
			}	
	    }
}]);    	

