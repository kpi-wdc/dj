var getProperty = require("wdc-flat").getProperty;

var test = {
	"dataset": {
        "id": "3a37ea80-93a8-11e5-b62f-dfcea48fc8d9",
        "visibility": "public",
        "commit": {
          "id": "565808a7ff4a82341af640dd",
          "author": "aaaaa",
          "note": "Add commit info",
          "createdAt": "2015-11-27T07:39:18.887Z",
          "HEAD": true
        },
        "locale": [
          "#en",
          "#ua"
        ],
        "label": "#GDP_DATASET_LABEL",
        "note": "#GDP_NOTE",
        "source": "#WB",
        "topics": [
          "#GDP",
          "#WDI/#EC/#GDP"
        ]
      }
    };


console.log("dataset.id",getProperty(test,"dataset.id"));
console.log("dataset.commit.createdAt", getProperty(test,"dataset.commit.createdAt"));
console.log("dataset.note", getProperty(test,"dataset.note"));
console.log("dataset.topics", getProperty(test,"dataset.topics"));
console.log("dataset.commit", getProperty(test,"dataset.commit"));
console.log("dataset", getProperty(test,"dataset"));





    
