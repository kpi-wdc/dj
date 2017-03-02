import angular from 'angular';
import 'widgets/v2.nvd3-widget/nvd3-widget';
import "widgets/v2.nvd3-timeline/adapter";
import "wizard-directives";
import 'ng-ace';

var m = angular.module("app.widgets.v2.steps.timeline-chart-decoration",[
	'app.widgets.v2.nvd3-widget',
    "app.widgets.v2.timeline-chart-adapter", 
    "wizard-directives", "app.dps", "ng.ace"]);

m.factory("TimelineChartDecoration",[
	"$http",
	"$q", 
	"$dps",
	"dialog",
	"appUrls",
	"parentHolder",
	"TimelineChartAdapter", 
	"pageWidgets",
	"i18n",
	"$lookup",
	"EventEmitter",
	"dpsEditor",
	function(
		$http, 
		$q, 
		$dps,
		dialog,
		appUrls,
		parentHolder, 
		TimelineChartAdapter,
		pageWidgets,
		i18n,
		$lookup,
		EventEmitter,
		dpsEditor ){
		
		let chartAdapter = TimelineChartAdapter;

		return {
			id: "TimelineChartChartDecoration",

			title : "Chart Decoration",
			
			description : "Setup chart decoration options",
	        
	    	html : "./widgets/v2.nvd3-timeline/timeline-chart-decoration.html",

	  //   	formatlist : [	"%Y-%m-%d", "%m/%d/%Y", "%H:%M","%H:%M %p", "%B %d", "%d %b", "%d-%b-%y", "%S s", "%M m", "%H h", "%a", "%A", "%d d", "%b", "%m/%Y",
			// 				"%b %Y", "%B", "%c", "%d", "%e", "%H", "%I", "%j", 
			// 				"%m", "%M", "%L", "%p", "%S", "%U", "%w", "%W", "%x", "%X", "%y", "%Z" 
			// ],

	    	onStartWizard: function(wizard){
	    		this.wizard = wizard;
	    		this.conf = {
	    			decoration : wizard.conf.decoration,
	    			dataID : wizard.conf.dataID,
	    			script : wizard.conf.script,
	    			serieDataId: wizard.conf.dataID,
	    			optionsUrl : "./widgets/v2.nvd3-timeline/options.json",
	    			dataUrl : "/api/data/process/"
	    		}
	    		// console.log("Start step", this)
	    		// var d = new Date()
	    		// this.formatlist.forEach(function(item){
	    		// 	console.log(d3.locale(i18n.localeDef()).timeFormat(item)(d))
	    		// })	
	    	},

	    	onFinishWizard:  function(wizard){
	    		wizard.conf.decoration = this.conf.decoration;
	    		wizard.conf.dataID  = this.conf.dataID;
	    		wizard.conf.script  = this.conf.script;
	    		wizard.conf.serieDataId  = this.conf.serieDataId;
	    		this.settings = {options:angular.copy(this.options), data:[]};
	    		this.conf = {};
	    		this.data = undefined;
	    		// console.log("Finish step", this)
	    	},

	    	onCancelWizard: function(wizard){
				this.settings = {options:angular.copy(this.options), data:[]};
				this.conf = {};
	    	},

	    	reversePalette: function(){
				if ( this.conf.decoration.color ){
					this.conf.decoration.color = this.conf.decoration.color.reverse(); 
				}	
			},

	    	// _prepare : function(data){
      //         var result = data.map((item) => {return item})
      //         result.forEach((item) => {
      //           if(item.end == null) delete item.end;
      //           if(item.note == null) delete item.note;
                
      //           if(item.income == null) {
      //             delete item.income
      //           }else{
      //             item.income.forEach((p) => {
      //               if(p.marker == null) delete p.marker
      //             })
      //           } 

      //           if(item.expenditure == null) {
      //             delete item.expenditure
      //           }else{
      //             item.expenditure.forEach((p) => {
      //               if(p.marker == null) delete p.marker
      //             })
      //           } 

      //           if(item.causes == null) {
      //             delete item.causes
      //           }else{
      //             item.causes.forEach((p) => {
      //               if(p.type == null) {
      //                 delete p.type
      //                 delete p.src.type
      //                 delete p.target.type
      //               }  
      //             })
      //           }  

      //         })
      //         return result;
      //       },
			
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
			        $http.post($dps.getUrl()+appUrls.createTimeline, fd, {
				          withCredentials: true,
				          headers: {'Content-Type': undefined},
				          transformRequest: angular.identity
				        })
				        .success(resp => {
				          	thos.data = resp.value;
				          	thos.conf.dataID = resp.id;
				          	thos.conf.serieDataId = resp.id;
				          	thos.updateData = true;
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
				// console.log('load series')
				if(this.conf.serieDataId)
					return $dps.get("/api/data/process/"+this.conf.serieDataId)

				if(this.conf.script)
                    return $dps.post("/api/script",{
                                "script": this.conf.script,
                                "locale": i18n.locale()
                            })
                            .then((resp) => {
                            	if (resp.data.type == "error") {
                                $error(resp.data.data)
                                return
                            };
                                return {data:resp}
                            })
                            	          
                // console.log("sample")            
				return $http.get("/widgets/v2.nvd3-timeline/sample.json")   
			}, 

			
		   loadData: function(){
		   		// console.log("load data for", this.wizard.conf.instanceName,this.conf.serieDataId)
				let thos = this;
				$q
					.all([
						thos.loadOptions().then((resp) =>{
							thos.options = resp.data;
							if(!thos.conf.decoration){
			            		thos.conf.decoration = chartAdapter.getDecoration(thos.options);
			            	}
			            	thos.conf.decoration.setColor = (palette) => {thos.conf.decoration.color = angular.copy(palette) }
			            	// console.log("thos.options",thos.options)
						}),
						thos.loadSeries().then((resp) => {
							// console.log("DECORATION LOAD DATA",resp.data.value)
							thos.metadata = resp.data.value.metadata; 
							thos.data =resp.data.value.data.series; //thos._prepare( resp.data.value)
							
							thos.scopeStub = {
								dictionary: $lookup.dictionary(resp.data.value.dictionary),
								translations: i18n.translation(resp.data.value.dictionary.filter(item => item.type=="i18n"))
			               }
							
							// console.log("thos.data",thos.data)
						})
					])
					.then(() => {
						if(thos.updateData){

							thos.conf.decoration.title = thos.metadata.dataset.label;
							thos.conf.decoration.subtitle = thos.metadata.dataset.note;
							thos.updateData = false;
							//console.log("data loaded", thos)
						}
						thos.apply();
					})

			},

			activate : function(wizard){
				// if (this.conf.dataID){
					this.loadData();
				// }
			},

			editScript: function() {
                var thos = this;
                dpsEditor(thos.conf.script)
                    .then((script) => {
                        thos.conf.script = script;
                        thos.loadData();
                    })
            },

			apply: function(){
				this.conf.decoration.width = parentHolder(this.wizard.conf).width;
				chartAdapter.applyDecoration(this.options,this.conf.decoration,undefined,undefined,this.scopeStub);
				this.settings = {options:angular.copy(this.options), data:angular.copy(this.data)};
				// console.log("this.settings",this.settings)
				
			}	
	    }
}]);    	

