var Promise = require("bluebird");
query = require("./query_async");

// var promise; 

// function execute(resolve,reject){
// 	for(var i=0; i<10; i++){
// 		console.log("Execute")
// 	}	
// 	resolve("Result");
// }

// a = function(count){
// 	this.count = count || 1;
// 	this.promise=undefined;
// 	this._resolve=undefined;
// 	this.defer =  undefined;
// }	

// a.prototype.execute = function(resolve,reject){
// 	// console.log("EXECUTE",this);
// 	this.resolve = resolve;
// 	thos = this;
// 	setTimeout(
// 		function(resolve,count){
// 			this.resolve("Result : "+this.count);
// 		}.bind(thos)
// 	,this.count)
// 	// resolve("Result : "+this.count);
// }

// // a.prototype.toPromise = function() {
// //    return Promise.promisify(this.execute).bind(this)();
// // };

// // a.prototype.then = function(cb, ec) {
// //   return this.toPromise().then(cb, ec);
// // };

// a.prototype.init = function(){
// 			return this;
// 	};

// a.prototype.get = function(){
// 		 thos = this;
// 		 this.defer = Promise.defer();
// 		 this.promise = new Promise(thos.execute.bind(thos)); 
// 		 this.defer.promise = this.promise;
// 		 return this.promise;		
// 	}

// function b(){
// 	new a(1500).init().get().then(function(result){console.log("RESULT",result)})
// 	new a(5).init().get().then(function(result){console.log("RESULT",result)})
// 	new a(150).init().get().then(function(result){console.log("RESULT",result)})
	
// 	for(var i=0; i<10; i++){
// 		console.log("main")
// 	}
// }


// b();
// console.log("1111111111111111111111111111")
// b();


// // console.log(promise)



var test = {
  "dataset":{
    "id":"GDPpc20102013",
    "visibility":"public",
    "commit":{
      "id":"1112322212",
      "note":"Add commit info",
      "status":"HEAD"
    },
    "locale":[
      "#en",
      "#ua"
    ],
    "label":"#GDP_DATASET_LABEL",
    "note":"#GDP_NOTE",
    "source":"#WB",
    "topics":[
      "#GDP",
      "#WDI/#EC/#GDP"
    ]
  },
  "dimension":{
    "country":{
      "label":"#DIM_COUNTRY",
      "role":"geo",
      "values":[
        {
          "id":"LBY",
          "label":"Libya"
        },
        {
          "id":"ABW",
          "label":"Aruba"
        },
        {
          "id":"AGO",
          "label":"Angola"
        },
        {
          "id":"ALB",
          "label":"Albania"
        },
        {
          "id":"ARB",
          "label":"Arab World"
        },
        {
          "id":"ARE",
          "label":"United Arab Emirates"
        },
        {
          "id":"ARG",
          "label":"Argentina"
        },
        {
          "id":"ARM",
          "label":"Armenia"
        },
        {
          "id":"ATG",
          "label":"Antigua and Barbuda"
        },
        {
          "id":"AUS",
          "label":"Australia"
        },
        {
          "id":"AUT",
          "label":"Austria"
        },
        {
          "id":"AZE",
          "label":"Azerbaijan"
        },
        {
          "id":"BDI",
          "label":"Burundi"
        },
        {
          "id":"BEL",
          "label":"Belgium"
        },
        {
          "id":"BEN",
          "label":"Benin"
        },
        {
          "id":"BFA",
          "label":"Burkina Faso"
        },
        {
          "id":"BGD",
          "label":"Bangladesh"
        },
        {
          "id":"BGR",
          "label":"Bulgaria"
        },
        {
          "id":"BHR",
          "label":"Bahrain"
        },
        {
          "id":"BHS",
          "label":"Bahamas  The"
        },
        {
          "id":"BIH",
          "label":"Bosnia and Herzegovina"
        },
        {
          "id":"BLR",
          "label":"Belarus"
        },
        {
          "id":"BLZ",
          "label":"Belize"
        },
        {
          "id":"BMU",
          "label":"Bermuda"
        },
        {
          "id":"BOL",
          "label":"Bolivia"
        },
        {
          "id":"BRA",
          "label":"Brazil"
        },
        {
          "id":"BRB",
          "label":"Barbados"
        },
        {
          "id":"BRN",
          "label":"Brunei Darussalam"
        },
        {
          "id":"BTN",
          "label":"Bhutan"
        },
        {
          "id":"BWA",
          "label":"Botswana"
        },
        {
          "id":"CAF",
          "label":"Central African Republic"
        },
        {
          "id":"CAN",
          "label":"Canada"
        },
        {
          "id":"CEB",
          "label":"Central Europe and the Baltics"
        },
        {
          "id":"CHE",
          "label":"Switzerland"
        },
        {
          "id":"CHL",
          "label":"Chile"
        },
        {
          "id":"CHN",
          "label":"China"
        },
        {
          "id":"CIV",
          "label":"Cote d'Ivoire"
        },
        {
          "id":"CMR",
          "label":"Cameroon"
        },
        {
          "id":"COG",
          "label":"Congo  Rep "
        },
        {
          "id":"COL",
          "label":"Colombia"
        },
        {
          "id":"COM",
          "label":"Comoros"
        },
        {
          "id":"CPV",
          "label":"Cabo Verde"
        },
        {
          "id":"CRI",
          "label":"Costa Rica"
        },
        {
          "id":"CSS",
          "label":"Caribbean small states"
        },
        {
          "id":"CUB",
          "label":"Cuba"
        },
        {
          "id":"CYP",
          "label":"Cyprus"
        },
        {
          "id":"CZE",
          "label":"Czech Republic"
        },
        {
          "id":"DEU",
          "label":"Germany"
        },
        {
          "id":"DJI",
          "label":"Djibouti"
        },
        {
          "id":"DMA",
          "label":"Dominica"
        },
        {
          "id":"DNK",
          "label":"Denmark"
        },
        {
          "id":"DOM",
          "label":"Dominican Republic"
        },
        {
          "id":"DZA",
          "label":"Algeria"
        },
        {
          "id":"EAP",
          "label":"East Asia & Pacific (developing only)"
        },
        {
          "id":"EAS",
          "label":"East Asia & Pacific (all income levels)"
        },
        {
          "id":"ECA",
          "label":"Europe & Central Asia (developing only)"
        },
        {
          "id":"ECS",
          "label":"Europe & Central Asia (all income levels)"
        },
        {
          "id":"ECU",
          "label":"Ecuador"
        },
        {
          "id":"EGY",
          "label":"Egypt  Arab Rep"
        },
        {
          "id":"EMU",
          "label":"Euro area"
        },
        {
          "id":"ERI",
          "label":"Eritrea"
        },
        {
          "id":"ESP",
          "label":"Spain"
        },
        {
          "id":"EST",
          "label":"Estonia"
        },
        {
          "id":"ETH",
          "label":"Ethiopia"
        },
        {
          "id":"EUU",
          "label":"European Union"
        },
        {
          "id":"FCS",
          "label":"Fragile and conflict affected situations"
        },
        {
          "id":"FIN",
          "label":"Finland"
        },
        {
          "id":"FJI",
          "label":"Fiji"
        },
        {
          "id":"FRA",
          "label":"France"
        },
        {
          "id":"FSM",
          "label":"Micronesia Fed Sts"
        },
        {
          "id":"GAB",
          "label":"Gabon"
        },
        {
          "id":"GBR",
          "label":"United Kingdom"
        },
        {
          "id":"GEO",
          "label":"Georgia"
        },
        {
          "id":"GHA",
          "label":"Ghana"
        },
        {
          "id":"GIN",
          "label":"Guinea"
        },
        {
          "id":"GMB",
          "label":"Gambia  The"
        },
        {
          "id":"GNB",
          "label":"Guinea-Bissau"
        },
        {
          "id":"GNQ",
          "label":"Equatorial Guinea"
        },
        {
          "id":"GRC",
          "label":"Greece"
        },
        {
          "id":"GRD",
          "label":"Grenada"
        },
        {
          "id":"GTM",
          "label":"Guatemala"
        },
        {
          "id":"GUY",
          "label":"Guyana"
        },
        {
          "id":"HIC",
          "label":"High income"
        },
        {
          "id":"HKG",
          "label":"Hong Kong SAR  China"
        },
        {
          "id":"HND",
          "label":"Honduras"
        },
        {
          "id":"HPC",
          "label":"Heavily indebted poor countries (HIPC)"
        },
        {
          "id":"HRV",
          "label":"Croatia"
        },
        {
          "id":"HTI",
          "label":"Haiti"
        },
        {
          "id":"HUN",
          "label":"Hungary"
        },
        {
          "id":"IDN",
          "label":"Indonesia"
        },
        {
          "id":"IND",
          "label":"India"
        },
        {
          "id":"IRL",
          "label":"Ireland"
        },
        {
          "id":"IRN",
          "label":"Iran  Islamic Rep "
        },
        {
          "id":"IRQ",
          "label":"Iraq"
        },
        {
          "id":"ISL",
          "label":"Iceland"
        },
        {
          "id":"ISR",
          "label":"Israel"
        },
        {
          "id":"ITA",
          "label":"Italy"
        },
        {
          "id":"JAM",
          "label":"Jamaica"
        },
        {
          "id":"JOR",
          "label":"Jordan"
        },
        {
          "id":"JPN",
          "label":"Japan"
        },
        {
          "id":"KAZ",
          "label":"Kazakhstan"
        },
        {
          "id":"KEN",
          "label":"Kenya"
        },
        {
          "id":"KGZ",
          "label":"Kyrgyz Republic"
        },
        {
          "id":"KHM",
          "label":"Cambodia"
        },
        {
          "id":"KIR",
          "label":"Kiribati"
        },
        {
          "id":"KNA",
          "label":"St  Kitts and Nevis"
        },
        {
          "id":"KOR",
          "label":"Korea  Rep "
        },
        {
          "id":"KWT",
          "label":"Kuwait"
        },
        {
          "id":"LAC",
          "label":"Latin America & Caribbean (developing only)"
        },
        {
          "id":"LAO",
          "label":"Lao PDR"
        },
        {
          "id":"LBN",
          "label":"Lebanon"
        },
        {
          "id":"LBR",
          "label":"Liberia"
        },
        {
          "id":"AFG",
          "label":"Afghanistan"
        },
        {
          "id":"LCA",
          "label":"St  Lucia"
        },
        {
          "id":"LCN",
          "label":"Latin America & Caribbean (all income levels)"
        },
        {
          "id":"LDC",
          "label":"Least developed countries: UN classification"
        },
        {
          "id":"LIC",
          "label":"Low income"
        },
        {
          "id":"LKA",
          "label":"Sri Lanka"
        },
        {
          "id":"LMC",
          "label":"Lower middle income"
        },
        {
          "id":"LMY",
          "label":"Low & middle income"
        },
        {
          "id":"LSO",
          "label":"Lesotho"
        },
        {
          "id":"LTU",
          "label":"Lithuania"
        },
        {
          "id":"LUX",
          "label":"Luxembourg"
        },
        {
          "id":"LVA",
          "label":"Latvia"
        },
        {
          "id":"MAC",
          "label":"Macao SAR  China"
        },
        {
          "id":"MAR",
          "label":"Morocco"
        },
        {
          "id":"MCO",
          "label":"Monaco"
        },
        {
          "id":"MDA",
          "label":"Moldova"
        },
        {
          "id":"MDG",
          "label":"Madagascar"
        },
        {
          "id":"MDV",
          "label":"Maldives"
        },
        {
          "id":"MEA",
          "label":"Middle East & North Africa (all income levels)"
        },
        {
          "id":"MEX",
          "label":"Mexico"
        },
        {
          "id":"MHL",
          "label":"Marshall Islands"
        },
        {
          "id":"MIC",
          "label":"Middle income"
        },
        {
          "id":"MKD",
          "label":"Macedonia  FYR"
        },
        {
          "id":"MLI",
          "label":"Mali"
        },
        {
          "id":"MLT",
          "label":"Malta"
        },
        {
          "id":"MNA",
          "label":"Middle East & North Africa (developing only)"
        },
        {
          "id":"MNE",
          "label":"Montenegro"
        },
        {
          "id":"MNG",
          "label":"Mongolia"
        },
        {
          "id":"MOZ",
          "label":"Mozambique"
        },
        {
          "id":"MRT",
          "label":"Mauritania"
        },
        {
          "id":"MUS",
          "label":"Mauritius"
        },
        {
          "id":"MWI",
          "label":"Malawi"
        },
        {
          "id":"MYS",
          "label":"Malaysia"
        },
        {
          "id":"NAC",
          "label":"North America"
        },
        {
          "id":"NAM",
          "label":"Namibia"
        },
        {
          "id":"NER",
          "label":"Niger"
        },
        {
          "id":"NGA",
          "label":"Nigeria"
        },
        {
          "id":"NIC",
          "label":"Nicaragua"
        },
        {
          "id":"NLD",
          "label":"Netherlands"
        },
        {
          "id":"NOC",
          "label":"High income: nonOECD"
        },
        {
          "id":"NOR",
          "label":"Norway"
        },
        {
          "id":"NPL",
          "label":"Nepal"
        },
        {
          "id":"NZL",
          "label":"New Zealand"
        },
        {
          "id":"OEC",
          "label":"High income: OECD"
        },
        {
          "id":"OED",
          "label":"OECD members"
        },
        {
          "id":"OMN",
          "label":"Oman"
        },
        {
          "id":"OSS",
          "label":"Other small states"
        },
        {
          "id":"PAK",
          "label":"Pakistan"
        },
        {
          "id":"PAN",
          "label":"Panama"
        },
        {
          "id":"PER",
          "label":"Peru"
        },
        {
          "id":"PHL",
          "label":"Philippines"
        },
        {
          "id":"PLW",
          "label":"Palau"
        },
        {
          "id":"PNG",
          "label":"Papua New Guinea"
        },
        {
          "id":"POL",
          "label":"Poland"
        },
        {
          "id":"PRI",
          "label":"Puerto Rico"
        },
        {
          "id":"PRT",
          "label":"Portugal"
        },
        {
          "id":"PRY",
          "label":"Paraguay"
        },
        {
          "id":"PSS",
          "label":"Pacific island small states"
        },
        {
          "id":"QAT",
          "label":"Qatar"
        },
        {
          "id":"ROU",
          "label":"Romania"
        },
        {
          "id":"RUS",
          "label":"Russian Federation"
        },
        {
          "id":"RWA",
          "label":"Rwanda"
        },
        {
          "id":"SAS",
          "label":"South Asia"
        },
        {
          "id":"SAU",
          "label":"Saudi Arabia"
        },
        {
          "id":"SDN",
          "label":"Sudan"
        },
        {
          "id":"SEN",
          "label":"Senegal"
        },
        {
          "id":"SGP",
          "label":"Singapore"
        },
        {
          "id":"SLB",
          "label":"Solomon Islands"
        },
        {
          "id":"SLE",
          "label":"Sierra Leone"
        },
        {
          "id":"SLV",
          "label":"El Salvador"
        },
        {
          "id":"SRB",
          "label":"Serbia"
        },
        {
          "id":"SSA",
          "label":"Sub-Saharan Africa (developing only)"
        },
        {
          "id":"SSD",
          "label":"South Sudan"
        },
        {
          "id":"SSF",
          "label":"Sub-Saharan Africa (all income levels)"
        },
        {
          "id":"SST",
          "label":"Small states"
        },
        {
          "id":"STP",
          "label":"Sao Tome and Principe"
        },
        {
          "id":"SUR",
          "label":"Suriname"
        },
        {
          "id":"SVK",
          "label":"Slovak Republic"
        },
        {
          "id":"SVN",
          "label":"Slovenia"
        },
        {
          "id":"SWE",
          "label":"Sweden"
        },
        {
          "id":"SWZ",
          "label":"Swaziland"
        },
        {
          "id":"SYC",
          "label":"Seychelles"
        },
        {
          "id":"TCD",
          "label":"Chad"
        },
        {
          "id":"TGO",
          "label":"Togo"
        },
        {
          "id":"THA",
          "label":"Thailand"
        },
        {
          "id":"TJK",
          "label":"Tajikistan"
        },
        {
          "id":"TKM",
          "label":"Turkmenistan"
        },
        {
          "id":"TLS",
          "label":"Timor-Leste"
        },
        {
          "id":"TON",
          "label":"Tonga"
        },
        {
          "id":"TTO",
          "label":"Trinidad and Tobago"
        },
        {
          "id":"TUN",
          "label":"Tunisia"
        },
        {
          "id":"TUR",
          "label":"Turkey"
        },
        {
          "id":"TUV",
          "label":"Tuvalu"
        },
        {
          "id":"TZA",
          "label":"Tanzania"
        },
        {
          "id":"UGA",
          "label":"Uganda"
        },
        {
          "id":"UKR",
          "label":"Ukraine"
        },
        {
          "id":"UMC",
          "label":"Upper middle income"
        },
        {
          "id":"URY",
          "label":"Uruguay"
        },
        {
          "id":"USA",
          "label":"United States"
        },
        {
          "id":"UZB",
          "label":"Uzbekistan"
        },
        {
          "id":"VCT",
          "label":"St  Vincent and the Grenadines"
        },
        {
          "id":"VEN",
          "label":"Venezuela  RB"
        },
        {
          "id":"VNM",
          "label":"Vietnam"
        },
        {
          "id":"VUT",
          "label":"Vanuatu"
        },
        {
          "id":"PSE",
          "label":"West Bank and Gaza"
        },
        {
          "id":"WLD",
          "label":"World"
        },
        {
          "id":"WSM",
          "label":"Samoa"
        },
        {
          "id":"YEM",
          "label":"Yemen  Rep "
        },
        {
          "id":"ZAF",
          "label":"South Africa"
        },
        {
          "id":"COD",
          "label":"Congo  Dem  Rep "
        },
        {
          "id":"ZMB",
          "label":"Zambia"
        },
        {
          "id":"ZWE",
          "label":"Zimbabwe"
        }
      ]
    },
    "concept":{
      "label":"#DIM_INDICATOR",
      "role":"metric",
      "values":[
        {
          "id":"GDP",
          "label":"GDP per capita (current US$)"
        }
      ]
    },
    "year":{
      "label":"#DIM_YEAR",
      "role":"time",
      "values":[
        {
          "id":"2010",
          "label":"2010"
        },
        {
          "id":"2011",
          "label":"2011"
        },
        {
          "id":"2012",
          "label":"2012"
        },
        {
          "id":"2013",
          "label":"2013"
        }
      ]
    }
  },
  "layout":{
    "sheet":"data",
    "value":"Value",
    "country":{
      "id":"Country Code",
      "label":"Country Name"
    },
    "concept":{
      "id":"Indicator Code",
      "label":"Indicator Name"
    },
    "year":{
      "id":"Year",
      "label":"Year"
    }
  }
};


new query()
	.from(test.dimension.country.values)
	.map(function(item){return item.id})
	.select(function(item){return true})
	.distinct()
	.group(function(item){return {key:"1", value:item}})
	.map(function(item){return {key:"count", value:item.values.length}})
	.execute()
	.then(function(res){
		console.log("COUNTRIES", res);
	})

new query()
	.from(test.dimension.concept.values)
	.map(function(item){return item.id})
	.get()
	.then(function(res){
		console.log("CONCEPT", res.length);
	})

new query()
	.from(test.dimension.year.values)
	.map(function(item){return item.id})
	.get()
	.then(function(res){
		console.log("YEARS", res.length);
	})