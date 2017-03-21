module.exports.dpsLibrary = {
    "baseUrl":{
    	"import": "https://dj-dps.herokuapp.com/lib/",
    	"call": "https://dj-dps.herokuapp.com/api/extension/call/"
    },
    "name": 		"Default DJ dps extension library",
    "description": 	"This library provide basic extensions for data processing",
    "type": 		"category",
    
    "test":{
    	"name": "test",
    	"description": 	"Test remote call",
        "type": 		"extension",
        "call": 		"test"
    },

    "help":{
        "name": "help",
        "description":  "Return html version for library description. Arguments: url - the url library entry.",
        "type":         "extension",
        "import":       "help/lib-description.dps"
    },

    "words": {
        "name": 		"Module \"words\" ",
        "description": 	"Provides extensions for word proseccing",
        "type": 		"category",
        "distance": {
            "name": 		"Extension \"distance\" ",
            "description": 	"Provide various word distances js implementation",
            "type": 		"extension",
            "import": 		"words/words-distance.dps"
        }
    },

    "load": {
        "name": 		"Module \"load\" ",
        "description": 	"Provides extensions for data preparation",
        "type": 		"category",
        
        "rss": {
            "name": 		"Module \"rss\" ",
            "description": 	"Provides extensions for data extraction from rss",
            "type": 		"category",
            
            "getChannelItems": {
                "name": 		"Extension \"getChannelItems\" ",
                "description": 	"Extract channel items from rss. \nArguments: \nurl: url for rss (required); encoding: rss file encoding (optional, defualt value: \"utf8\")",
                "type": 		"extension",
                "import": 		"load/rss/get-channel-items.dps",
                "call": 		"getChannelItems"
            },
            "getChannelHeadlines": {
                "name": 		"Extension \"getChannelHeadlines\" ",
                "description": 	"Extract item titles from rss. \nArguments: \nurl: url for rss (required); encoding: rss file encoding (optional, defualt value: \"utf8\")",
                "type": 		"extension",
                "import": 		"load/rss/get-channel-headlines.dps",
              	"call": 		"getChannelHeadlines"
            },

            "newsWordTable": {
                "name": 		"Extension \"newsWordTable\" ",
                "description": 	"Extract item titles from rss. \nArguments: \nurl: url for rss (required); encoding: rss file encoding (optional, defualt value: \"utf8\")",
                "type": 		"extension",
                "import": 		"load/rss/news-word-table.dps",
                "call": 		"newsWordTable"
            }
        }
    }
}
