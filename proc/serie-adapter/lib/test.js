
var PCA = require("./pca").PCA;


var data ={
    "header": [
      {
        "metadata": [
          {
            "id": "2010",
            "label": "2010",
            "dimension": "year",
            "dimensionLabel": "Year",
            "role": "time"
          },
          {
            "id": "GDP $St.Col",
            "label": "GDP per capita (current US$) $St.Col",
            "dimension": "concept",
            "dimensionLabel": "Indicator",
            "role": "metric"
          }
        ]
      },
      {
        "metadata": [
          {
            "id": "2011",
            "label": "2011",
            "dimension": "year",
            "dimensionLabel": "Year",
            "role": "time"
          },
          {
            "id": "GDP $St.Col",
            "label": "GDP per capita (current US$) $St.Col",
            "dimension": "concept",
            "dimensionLabel": "Indicator",
            "role": "metric"
          }
        ]
      },
      {
        "metadata": [
          {
            "id": "2012",
            "label": "2012",
            "dimension": "year",
            "dimensionLabel": "Year",
            "role": "time"
          },
          {
            "id": "GDP $St.Col",
            "label": "GDP per capita (current US$) $St.Col",
            "dimension": "concept",
            "dimensionLabel": "Indicator",
            "role": "metric"
          }
        ]
      },
      {
        "metadata": [
          {
            "id": "2013",
            "label": "2013",
            "dimension": "year",
            "dimensionLabel": "Year",
            "role": "time"
          },
          {
            "id": "GDP $St.Col",
            "label": "GDP per capita (current US$) $St.Col",
            "dimension": "concept",
            "dimensionLabel": "Indicator",
            "role": "metric"
          }
        ]
      }
    ],
    "body": [
      {
        "metadata": [
          {
            "id": "LBY",
            "label": "Libya",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.004693801091028859,
          -0.42095021926379644,
          -0.026516036032749078,
          -0.11542243255808851
        ]
      },
      {
        "metadata": [
          {
            "id": "AGO",
            "label": "Angola",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.47835450528795914,
          -0.448068956849923,
          -0.4315815681490474,
          -0.42788206218495817
        ]
      },
      {
        "metadata": [
          {
            "id": "ALB",
            "label": "Albania",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.48557189144461044,
          -0.4852503764748593,
          -0.4985682124128574,
          -0.4947592355774922
        ]
      },
      {
        "metadata": [
          {
            "id": "ARB",
            "label": "Arab World",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.3729963884896555,
          -0.3529151906247285,
          -0.3255745010530432,
          -0.3301911741471741
        ]
      },
      {
        "metadata": [
          {
            "id": "ARE",
            "label": "United Arab Emirates",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          1.2444071530214809,
          1.2924450084307835,
          1.3896902560689413,
          1.4558379793671758
        ]
      },
      {
        "metadata": [
          {
            "id": "ARG",
            "label": "Argentina",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.05783158552794042,
          -0.008210399371572741,
          0.04534154273869717,
          0.023609079609220544
        ]
      },
      {
        "metadata": [
          {
            "id": "ARM",
            "label": "Armenia",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.5418745739066914,
          -0.5376195873138714,
          -0.5456359988687273,
          -0.5430622262399328
        ]
      },
      {
        "metadata": [
          {
            "id": "ATG",
            "label": "Antigua and Barbuda",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.032578689577610974,
          -0.05335151493777217,
          -0.014889217551328627,
          -0.045799026038042055
        ]
      },
      {
        "metadata": [
          {
            "id": "AUS",
            "label": "Australia",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          2.2847212362014417,
          2.4883403168141394,
          2.8020533098989513,
          2.689941511544182
        ]
      },
      {
        "metadata": [
          {
            "id": "AUT",
            "label": "Austria",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          1.9821607178139922,
          1.9214348990302164,
          1.8021221641414995,
          1.8330250568443933
        ]
      },
      {
        "metadata": [
          {
            "id": "AZE",
            "label": "Azerbaijan",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.38404066306409435,
          -0.3434210934235596,
          -0.334843095031194,
          -0.32535651840866775
        ]
      },
      {
        "metadata": [
          {
            "id": "BDI",
            "label": "Burundi",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.7105810625822431,
          -0.7012452891960502,
          -0.7075454637596241,
          -0.706721453096989
        ]
      },
      {
        "metadata": [
          {
            "id": "BEL",
            "label": "Belgium",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          1.8525296299409617,
          1.7503218767873598,
          1.6184221689906597,
          1.6520064548677458
        ]
      },
      {
        "metadata": [
          {
            "id": "BEN",
            "label": "Benin",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6832609963917484,
          -0.6755542252997775,
          -0.6814820959847795,
          -0.6795473468777525
        ]
      },
      {
        "metadata": [
          {
            "id": "BFA",
            "label": "Burkina Faso",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6897260625065875,
          -0.679315148083704,
          -0.6838331885131648,
          -0.6817633770090593
        ]
      },
      {
        "metadata": [
          {
            "id": "BGD",
            "label": "Bangladesh",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6790334576088456,
          -0.6705994853937942,
          -0.6756620033316971,
          -0.6718067420872325
        ]
      },
      {
        "metadata": [
          {
            "id": "BGR",
            "label": "Bulgaria",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.3411849580360947,
          -0.3228509416398119,
          -0.3450559073579075,
          -0.34116762868745404
        ]
      },
      {
        "metadata": [
          {
            "id": "BHR",
            "label": "Bahrain",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.46976344639401524,
          0.4439510346111624,
          0.4971649436239752,
          0.5277775984469173
        ]
      },
      {
        "metadata": [
          {
            "id": "BHS",
            "label": "Bahamas  The",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.5508226882764895,
          0.40184032249115026,
          0.4323294631583234,
          0.40762230146592837
        ]
      },
      {
        "metadata": [
          {
            "id": "BIH",
            "label": "Bosnia and Herzegovina",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.4689498624303692,
          -0.4680642874151444,
          -0.49055479137245134,
          -0.4845775601085872
        ]
      },
      {
        "metadata": [
          {
            "id": "BLR",
            "label": "Belarus",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.3854314794920781,
          -0.3889773740026453,
          -0.3699041348468974,
          -0.33729304268295685
        ]
      },
      {
        "metadata": [
          {
            "id": "BLZ",
            "label": "Belize",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.4604291990964925,
          -0.47165765701372253,
          -0.4672243013322865,
          -0.4728420636879237
        ]
      },
      {
        "metadata": [
          {
            "id": "BOL",
            "label": "Bolivia",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.610984086804908,
          -0.5944212247831969,
          -0.586246410190464,
          -0.5752681371143719
        ]
      },
      {
        "metadata": [
          {
            "id": "BRA",
            "label": "Brazil",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.0858277789033673,
          -0.06580572161572157,
          -0.12997757171259192,
          -0.1536699688032245
        ]
      },
      {
        "metadata": [
          {
            "id": "BRN",
            "label": "Brunei Darussalam",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          1.069874818830088,
          1.4022199547722571,
          1.4253048573290976,
          1.2291001884270545
        ]
      },
      {
        "metadata": [
          {
            "id": "BTN",
            "label": "Bhutan",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.5949177609865894,
          -0.5853611223389703,
          -0.5923663809087084,
          -0.6007981421463854
        ]
      },
      {
        "metadata": [
          {
            "id": "BWA",
            "label": "Botswana",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.3179834393245366,
          -0.3153661820024873,
          -0.34210701541918814,
          -0.3504590878100829
        ]
      },
      {
        "metadata": [
          {
            "id": "CAF",
            "label": "Central African Republic",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6968166573386191,
          -0.688462996550779,
          -0.6956248202449649,
          -0.7033808159310198
        ]
      },
      {
        "metadata": [
          {
            "id": "CAN",
            "label": "Canada",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          2.0329562842133426,
          1.9552661193613023,
          2.0141911579367946,
          1.906503500890009
        ]
      },
      {
        "metadata": [
          {
            "id": "CEB",
            "label": "Central Europe and the Baltics",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.00022394199146609183,
          -0.007279035470946566,
          -0.050647806929173256,
          -0.03247079509828211
        ]
      },
      {
        "metadata": [
          {
            "id": "CHE",
            "label": "Switzerland",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          3.589877251394533,
          3.821386104553437,
          3.6256251912884094,
          3.5636923605336785
        ]
      },
      {
        "metadata": [
          {
            "id": "CHL",
            "label": "Chile",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.01309377354272143,
          0.03391053191326923,
          0.07485103267694576,
          0.07502382203352591
        ]
      },
      {
        "metadata": [
          {
            "id": "CHN",
            "label": "China",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.4658874783668382,
          -0.43322181630031475,
          -0.40272753059390304,
          -0.3761170017132677
        ]
      },
      {
        "metadata": [
          {
            "id": "CIV",
            "label": "Cote d'Ivoire",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6471810528758561,
          -0.6465059473291906,
          -0.6493731657921815,
          -0.6429377346175689
        ]
      },
      {
        "metadata": [
          {
            "id": "CMR",
            "label": "Cameroon",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6568181136105341,
          -0.6492013397725582,
          -0.6569883082896354,
          -0.6530624953345199
        ]
      },
      {
        "metadata": [
          {
            "id": "COG",
            "label": "Congo  Rep ",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.5537426951996128,
          -0.5380138507640259,
          -0.5560840000145633,
          -0.5601335903974063
        ]
      },
      {
        "metadata": [
          {
            "id": "COL",
            "label": "Colombia",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.36447332590137194,
          -0.34677846679995444,
          -0.315578640546345,
          -0.32436607338163576
        ]
      },
      {
        "metadata": [
          {
            "id": "COM",
            "label": "Comoros",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6793814750845867,
          -0.6723090489885679,
          -0.6806107943252104,
          -0.6790284826220845
        ]
      },
      {
        "metadata": [
          {
            "id": "CPV",
            "label": "Cabo Verde",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.525122792538198,
          -0.5180478737550744,
          -0.5351773319054749,
          -0.5298008572185375
        ]
      },
      {
        "metadata": [
          {
            "id": "CRI",
            "label": "Costa Rica",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.2719446248869119,
          -0.26536927616556916,
          -0.2279338006334551,
          -0.20540535751806427
        ]
      },
      {
        "metadata": [
          {
            "id": "CSS",
            "label": "Caribbean small states",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.22230368357112262,
          -0.23753866299159976,
          -0.23095085548785307,
          -0.23632835522014675
        ]
      },
      {
        "metadata": [
          {
            "id": "CYP",
            "label": "Cyprus",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.8961713037258477,
          0.791305082602677,
          0.6543935908147192,
          0.5560785485798716
        ]
      },
      {
        "metadata": [
          {
            "id": "CZE",
            "label": "Czech Republic",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.4243559740617265,
          0.40217830585464237,
          0.3057399637830621,
          0.28358907094635205
        ]
      },
      {
        "metadata": [
          {
            "id": "DEU",
            "label": "Germany",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          1.699522809102099,
          1.650157597816949,
          1.5716712376365012,
          1.6177216450015486
        ]
      },
      {
        "metadata": [
          {
            "id": "DJI",
            "label": "Djibouti",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6447498914688552,
          -0.6385388539866363,
          -0.6384805054409145,
          -0.6358912944505568
        ]
      },
      {
        "metadata": [
          {
            "id": "DMA",
            "label": "Dominica",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.32109097898543304,
          -0.34690940518363034,
          -0.3459074728096005,
          -0.3575051834374663
        ]
      },
      {
        "metadata": [
          {
            "id": "DNK",
            "label": "Denmark",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          2.6242527906161657,
          2.445575882740859,
          2.286755708753408,
          2.303527862988294
        ]
      },
      {
        "metadata": [
          {
            "id": "DOM",
            "label": "Dominican Republic",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.41582821984169804,
          -0.4186542708738232,
          -0.4143119521275833,
          -0.42304809633448737
        ]
      },
      {
        "metadata": [
          {
            "id": "DZA",
            "label": "Algeria",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.4707520446930508,
          -0.4422782117976461,
          -0.4435816226681565,
          -0.4492472402408637
        ]
      },
      {
        "metadata": [
          {
            "id": "EAP",
            "label": "East Asia & Pacific (developing only)",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.49770567257274184,
          -0.47173444134850273,
          -0.4499742594505365,
          -0.43258540586413474
        ]
      },
      {
        "metadata": [
          {
            "id": "EAS",
            "label": "East Asia & Pacific (all income levels)",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.29024755637087685,
          -0.2728074330509226,
          -0.24659585527326058,
          -0.2594138736271365
        ]
      },
      {
        "metadata": [
          {
            "id": "ECA",
            "label": "Europe & Central Asia (developing only)",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.36347765378859537,
          -0.35955054712478296,
          -0.35912340724231223,
          -0.3488152173117542
        ]
      },
      {
        "metadata": [
          {
            "id": "ECS",
            "label": "Europe & Central Asia (all income levels)",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.6357146149505537,
          0.6077071111479321,
          0.5615007015738567,
          0.5679909465879914
        ]
      },
      {
        "metadata": [
          {
            "id": "ECU",
            "label": "Ecuador",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.4540789324707428,
          -0.44598493686878515,
          -0.42552120866806314,
          -0.416785687331205
        ]
      },
      {
        "metadata": [
          {
            "id": "EGY",
            "label": "Egypt  Arab Rep",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.5605294862962401,
          -0.5607668611490406,
          -0.5507471807988727,
          -0.552681828776776
        ]
      },
      {
        "metadata": [
          {
            "id": "EMU",
            "label": "Euro area",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          1.458584197487178,
          1.369270195646889,
          1.244630790603699,
          1.2570528866383244
        ]
      },
      {
        "metadata": [
          {
            "id": "ERI",
            "label": "Eritrea",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.7019160616142152,
          -0.6913174208504589,
          -0.6943280440812601,
          -0.692734004194306
        ]
      },
      {
        "metadata": [
          {
            "id": "ESP",
            "label": "Spain",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          1.061492928296776,
          0.9339908322709678,
          0.791784298180204,
          0.7902782853802229
        ]
      },
      {
        "metadata": [
          {
            "id": "EST",
            "label": "Estonia",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.1262062872039626,
          0.17139361756256621,
          0.17330137382098493,
          0.23400018534752814
        ]
      },
      {
        "metadata": [
          {
            "id": "ETH",
            "label": "Ethiopia",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.7033711424056767,
          -0.6955488384103595,
          -0.6960062845500368,
          -0.6946940870321241
        ]
      },
      {
        "metadata": [
          {
            "id": "EUU",
            "label": "European Union",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          1.2255063073866683,
          1.150774518460485,
          1.059767156484209,
          1.0700520783749194
        ]
      },
      {
        "metadata": [
          {
            "id": "FCS",
            "label": "Fragile and conflict affected situations",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6458328796715922,
          -0.6426675302702395,
          -0.6392388560272554,
          -0.6394249216426802
        ]
      },
      {
        "metadata": [
          {
            "id": "FIN",
            "label": "Finland",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          1.959618621374759,
          1.9037351612354543,
          1.7444906865354959,
          1.7642720764174806
        ]
      },
      {
        "metadata": [
          {
            "id": "FJI",
            "label": "Fiji",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.511411498588901,
          -0.49743837890827847,
          -0.49099808139933254,
          -0.4990525829623927
        ]
      },
      {
        "metadata": [
          {
            "id": "FRA",
            "label": "France",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          1.6404495054889947,
          1.5439374947504902,
          1.4147959658285103,
          1.431148175568069
        ]
      },
      {
        "metadata": [
          {
            "id": "FSM",
            "label": "Micronesia Fed Sts",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.5585019584316651,
          -0.5593461172259705,
          -0.556043576009283,
          -0.5658444358371718
        ]
      },
      {
        "metadata": [
          {
            "id": "GAB",
            "label": "Gabon",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.17967648497992394,
          -0.10624367066363535,
          -0.1503323138255233,
          -0.13532079815120698
        ]
      },
      {
        "metadata": [
          {
            "id": "GBR",
            "label": "United Kingdom",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          1.5044139297685246,
          1.3976887539971785,
          1.4213475504130693,
          1.3917573930431542
        ]
      },
      {
        "metadata": [
          {
            "id": "GEO",
            "label": "Georgia",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.5715496715829492,
          -0.5480355611570285,
          -0.5365172704576492,
          -0.5384045942649806
        ]
      },
      {
        "metadata": [
          {
            "id": "GHA",
            "label": "Ghana",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.646323630648478,
          -0.6318165839226316,
          -0.6347816714149306,
          -0.626291806992509
        ]
      },
      {
        "metadata": [
          {
            "id": "GIN",
            "label": "Guinea",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6980427654016088,
          -0.6905721708762671,
          -0.6948933236278085,
          -0.6937805067237165
        ]
      },
      {
        "metadata": [
          {
            "id": "GMB",
            "label": "Gambia  The",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6904415230219267,
          -0.6871091085449587,
          -0.6940637998009899,
          -0.6955271364998676
        ]
      },
      {
        "metadata": [
          {
            "id": "GNB",
            "label": "Guinea-Bissau",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6923113892809972,
          -0.678950575605738,
          -0.6905676849161633,
          -0.6917265258832377
        ]
      },
      {
        "metadata": [
          {
            "id": "GNQ",
            "label": "Equatorial Guinea",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.2428376622280355,
          0.4180023589284521,
          0.4484158845428105,
          0.32014901610043267
        ]
      },
      {
        "metadata": [
          {
            "id": "GRC",
            "label": "Greece",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.8365004767691218,
          0.6241889479683346,
          0.45309416936700425,
          0.39012457133793255
        ]
      },
      {
        "metadata": [
          {
            "id": "GRD",
            "label": "Grenada",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.29560901619961605,
          -0.3320419078391554,
          -0.3249671010451608,
          -0.3213686389687428
        ]
      },
      {
        "metadata": [
          {
            "id": "GTM",
            "label": "Guatemala",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.5559505343176739,
          -0.5469650927148153,
          -0.5463242836734081,
          -0.544420807108448
        ]
      },
      {
        "metadata": [
          {
            "id": "GUY",
            "label": "Guyana",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.556440292888097,
          -0.546062697837532,
          -0.5335972270170515,
          -0.5311982934223406
        ]
      },
      {
        "metadata": [
          {
            "id": "HIC",
            "label": "High income",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          1.3691227564516053,
          1.2877755144420016,
          1.304863091741384,
          1.2566530730671885
        ]
      },
      {
        "metadata": [
          {
            "id": "HKG",
            "label": "Hong Kong SAR  China",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          1.1668306289307195,
          1.0972425836432729,
          1.1947387111096748,
          1.2068692748898533
        ]
      },
      {
        "metadata": [
          {
            "id": "HND",
            "label": "Honduras",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.602641851126599,
          -0.5965976919225471,
          -0.5985810838593868,
          -0.6044275963940838
        ]
      },
      {
        "metadata": [
          {
            "id": "HPC",
            "label": "Heavily indebted poor countries (HIPC)",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.68022934512974,
          -0.67238871730484,
          -0.6766272771939396,
          -0.6752684994097555
        ]
      },
      {
        "metadata": [
          {
            "id": "HRV",
            "label": "Croatia",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.06065781364006954,
          0.035421009823812605,
          -0.03007303510997985,
          -0.032866837739798385
        ]
      },
      {
        "metadata": [
          {
            "id": "HTI",
            "label": "Haiti",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6844697318831174,
          -0.6753568663596001,
          -0.6801759758349286,
          -0.6787784302823445
        ]
      },
      {
        "metadata": [
          {
            "id": "HUN",
            "label": "Hungary",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.029165367070802625,
          0.006725303270360914,
          -0.05357063057447707,
          -0.03855100258878981
        ]
      },
      {
        "metadata": [
          {
            "id": "IDN",
            "label": "Indonesia",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.5522184103807032,
          -0.5351431758327798,
          -0.5353332114223545,
          -0.5445542346795138
        ]
      },
      {
        "metadata": [
          {
            "id": "IND",
            "label": "India",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6410403826111376,
          -0.6361862680350799,
          -0.6431851750245263,
          -0.6445243393540873
        ]
      },
      {
        "metadata": [
          {
            "id": "IRL",
            "label": "Ireland",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          2.058245132947404,
          1.9635651959930536,
          1.8043707513593201,
          1.8313922493740216
        ]
      },
      {
        "metadata": [
          {
            "id": "IRN",
            "label": "Iran  Islamic Rep ",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.3937894658629851,
          -0.3528859349411335,
          -0.377402964113354,
          -0.4794448970526568
        ]
      },
      {
        "metadata": [
          {
            "id": "IRQ",
            "label": "Iraq",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.46354324160380805,
          -0.4125429017411877,
          -0.3746146602255835,
          -0.37333354728627005
        ]
      },
      {
        "metadata": [
          {
            "id": "ISL",
            "label": "Iceland",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          1.6979333183007677,
          1.6553958742956674,
          1.5868049272934377,
          1.6732291603280103
        ]
      },
      {
        "metadata": [
          {
            "id": "ISR",
            "label": "Israel",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          1.0507453300630494,
          1.0010612633350027,
          0.9759355832427776,
          1.102090801242981
        ]
      },
      {
        "metadata": [
          {
            "id": "ITA",
            "label": "Italy",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          1.3599537580986687,
          1.2634446483085942,
          1.1125215840923175,
          1.0836355436244527
        ]
      },
      {
        "metadata": [
          {
            "id": "JAM",
            "label": "Jamaica",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.4378003246966548,
          -0.4384319018924192,
          -0.43554919697030364,
          -0.4527965146173157
        ]
      },
      {
        "metadata": [
          {
            "id": "JOR",
            "label": "Jordan",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.46952377648812293,
          -0.4734921238352391,
          -0.4644946910608166,
          -0.45669361458810087
        ]
      },
      {
        "metadata": [
          {
            "id": "JPN",
            "label": "Japan",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          1.7683862053718098,
          1.667324147027438,
          1.715037053238024,
          1.2326584876591689
        ]
      },
      {
        "metadata": [
          {
            "id": "KAZ",
            "label": "Kazakhstan",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.19660160909677007,
          -0.12859318669514244,
          -0.0882170191015973,
          -0.032178571810639565
        ]
      },
      {
        "metadata": [
          {
            "id": "KEN",
            "label": "Kenya",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6665499849679933,
          -0.6625213608253628,
          -0.6598156900151022,
          -0.6572645121688501
        ]
      },
      {
        "metadata": [
          {
            "id": "KGZ",
            "label": "Kyrgyz Republic",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6722257446444689,
          -0.6560471394288152,
          -0.6591775506964797,
          -0.656358880353277
        ]
      },
      {
        "metadata": [
          {
            "id": "KHM",
            "label": "Cambodia",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6778828033067162,
          -0.6686999864162073,
          -0.6713081433246743,
          -0.6693290756287414
        ]
      },
      {
        "metadata": [
          {
            "id": "KIR",
            "label": "Kiribati",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6339574329788553,
          -0.624522197306895,
          -0.6300499762086786,
          -0.6367824408920743
        ]
      },
      {
        "metadata": [
          {
            "id": "KNA",
            "label": "St  Kitts and Nevis",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.04475247519674926,
          -0.005601439581185942,
          -0.0079137647167455,
          -0.005829351729476026
        ]
      },
      {
        "metadata": [
          {
            "id": "KOR",
            "label": "Korea  Rep ",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.5629789311225244,
          0.5309977157072963,
          0.5553420868868048,
          0.5928765415012235
        ]
      },
      {
        "metadata": [
          {
            "id": "KWT",
            "label": "Kuwait",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          1.517249488484495,
          1.8266452364218508,
          2.073234720934106,
          1.918281898964649
        ]
      },
      {
        "metadata": [
          {
            "id": "LAC",
            "label": "Latin America & Caribbean (developing only)",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.22281762178529987,
          -0.2218234912330074,
          -0.22948800451453122,
          -0.23389154339732296
        ]
      },
      {
        "metadata": [
          {
            "id": "LAO",
            "label": "Lao PDR",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6581256440246783,
          -0.6487375516250072,
          -0.6471604383206742,
          -0.636277014652452
        ]
      },
      {
        "metadata": [
          {
            "id": "LBN",
            "label": "Lebanon",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.21488186412210022,
          -0.2426660249391811,
          -0.2111610468281971,
          -0.21837450304962233
        ]
      },
      {
        "metadata": [
          {
            "id": "LBR",
            "label": "Liberia",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.7043633091111953,
          -0.6945444832796952,
          -0.6990536321302492,
          -0.6972573214642527
        ]
      },
      {
        "metadata": [
          {
            "id": "AFG",
            "label": "Afghanistan",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6907406090637351,
          -0.6823271110964334,
          -0.6847658159200025,
          -0.6866205144132635
        ]
      },
      {
        "metadata": [
          {
            "id": "LCA",
            "label": "St  Lucia",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.31601868143003076,
          -0.34324034243525176,
          -0.344837753854127,
          -0.3497841923538579
        ]
      },
      {
        "metadata": [
          {
            "id": "LCN",
            "label": "Latin America & Caribbean (all income levels)",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.20524997284371896,
          -0.20444424119778953,
          -0.21028100084511772,
          -0.21432987966164674
        ]
      },
      {
        "metadata": [
          {
            "id": "LDC",
            "label": "Least developed countries: UN classification",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.67954738762362,
          -0.671129149479445,
          -0.6755944943918385,
          -0.6740783835481647
        ]
      },
      {
        "metadata": [
          {
            "id": "LIC",
            "label": "Low income",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6891620177830269,
          -0.6808991106128615,
          -0.6843014073210468,
          -0.6827223981466167
        ]
      },
      {
        "metadata": [
          {
            "id": "LKA",
            "label": "Sri Lanka",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.5839615087424506,
          -0.567822225993612,
          -0.5681897080000244,
          -0.5544293735037915
        ]
      },
      {
        "metadata": [
          {
            "id": "LMC",
            "label": "Lower middle income",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6211867640572908,
          -0.6137772719082099,
          -0.6168399384794246,
          -0.6169472703168317
        ]
      },
      {
        "metadata": [
          {
            "id": "LMY",
            "label": "Low & middle income",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.5272778160049857,
          -0.5149618739393954,
          -0.5106322528094872,
          -0.5067182392427896
        ]
      },
      {
        "metadata": [
          {
            "id": "LSO",
            "label": "Lesotho",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.660438955799619,
          -0.6508050246816766,
          -0.6614272528764672,
          -0.6633265905866458
        ]
      },
      {
        "metadata": [
          {
            "id": "LTU",
            "label": "Lithuania",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.03508036541279091,
          0.019310518115873487,
          0.018853155184576316,
          0.06478103900397775
        ]
      },
      {
        "metadata": [
          {
            "id": "LUX",
            "label": "Luxembourg",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          5.249516107837909,
          5.148016009622987,
          4.811526892016935,
          4.873735298502064
        ]
      },
      {
        "metadata": [
          {
            "id": "LVA",
            "label": "Latvia",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.05863689056308145,
          -0.0013218705360211085,
          0.00709641240766748,
          0.057269606011073615
        ]
      },
      {
        "metadata": [
          {
            "id": "MAC",
            "label": "Macao SAR  China",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          2.3570146290324754,
          2.742364781091774,
          3.307378837197429,
          3.898711515445248
        ]
      },
      {
        "metadata": [
          {
            "id": "MAR",
            "label": "Morocco",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.5594145082863788,
          -0.5570805622443432,
          -0.5693251985048299,
          -0.5638963704111805
        ]
      },
      {
        "metadata": [
          {
            "id": "MDA",
            "label": "Moldova",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6285866850618264,
          -0.6123957802363643,
          -0.6138567987621103,
          -0.6070167695447151
        ]
      },
      {
        "metadata": [
          {
            "id": "MDG",
            "label": "Madagascar",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6992799984107272,
          -0.6904523106486276,
          -0.6974258512446038,
          -0.6968210128059303
        ]
      },
      {
        "metadata": [
          {
            "id": "MDV",
            "label": "Maldives",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.34283002905785526,
          -0.37815605957377085,
          -0.39484521246960586,
          -0.3832778822646762
        ]
      },
      {
        "metadata": [
          {
            "id": "MEA",
            "label": "Middle East & North Africa (all income levels)",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.3131153078260145,
          -0.28770368434624277,
          -0.2665480159491876,
          -0.2880258322419794
        ]
      },
      {
        "metadata": [
          {
            "id": "MEX",
            "label": "Mexico",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.20530975549032066,
          -0.20873906065082795,
          -0.2083576285972,
          -0.19920418153718547
        ]
      },
      {
        "metadata": [
          {
            "id": "MHL",
            "label": "Marshall Islands",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.5417740260596235,
          -0.5441638827471948,
          -0.537603230876237,
          -0.5368728574137527
        ]
      },
      {
        "metadata": [
          {
            "id": "MIC",
            "label": "Middle income",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.5005954047979313,
          -0.4873482268081486,
          -0.48138374922663146,
          -0.47673716309461306
        ]
      },
      {
        "metadata": [
          {
            "id": "MKD",
            "label": "Macedonia  FYR",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.4653672293998977,
          -0.45931893029992915,
          -0.48332468160688263,
          -0.47564572104727804
        ]
      },
      {
        "metadata": [
          {
            "id": "MLI",
            "label": "Mali",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6842079704806435,
          -0.6759066179279133,
          -0.6843170266793113,
          -0.6840744179261602
        ]
      },
      {
        "metadata": [
          {
            "id": "MLT",
            "label": "Malta",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.42036313089424104,
          0.43773722525734116,
          0.38189948538243185,
          0.4310201317013125
        ]
      },
      {
        "metadata": [
          {
            "id": "MNA",
            "label": "Middle East & North Africa (developing only)",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.49081819461084475,
          -0.4818083990513348,
          -0.47533441492025374,
          -0.5013648266746156
        ]
      },
      {
        "metadata": [
          {
            "id": "MNE",
            "label": "Montenegro",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.337976235422836,
          -0.34013970351649053,
          -0.38074100905129865,
          -0.36098117010005554
        ]
      },
      {
        "metadata": [
          {
            "id": "MNG",
            "label": "Mongolia",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.5906029202478241,
          -0.5500198907319912,
          -0.5280475261567876,
          -0.5151780173609568
        ]
      },
      {
        "metadata": [
          {
            "id": "MOZ",
            "label": "Mozambique",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6986997620560086,
          -0.6862008544908631,
          -0.6896857999238368,
          -0.6896398065091545
        ]
      },
      {
        "metadata": [
          {
            "id": "MRT",
            "label": "Mauritania",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6665864477002827,
          -0.6564005361666888,
          -0.6662296482052188,
          -0.6661882424172124
        ]
      },
      {
        "metadata": [
          {
            "id": "MUS",
            "label": "Mauritius",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.2720076551822106,
          -0.2509108416608076,
          -0.2452498988578498,
          -0.2411338583364833
        ]
      },
      {
        "metadata": [
          {
            "id": "MWI",
            "label": "Malawi",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.7024484555341441,
          -0.6952062799348132,
          -0.706732803975599,
          -0.7087764691739104
        ]
      },
      {
        "metadata": [
          {
            "id": "MYS",
            "label": "Malaysia",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.2149751902813447,
          -0.1950702367066524,
          -0.1758956042043706,
          -0.18753882339647124
        ]
      },
      {
        "metadata": [
          {
            "id": "NAC",
            "label": "North America",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          2.0811123792566186,
          1.8633674063257877,
          1.9714497062977636,
          1.9558449083645935
        ]
      },
      {
        "metadata": [
          {
            "id": "NAM",
            "label": "Namibia",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.42266406601367634,
          -0.42549803551029347,
          -0.41955391690748006,
          -0.43244345174604193
        ]
      },
      {
        "metadata": [
          {
            "id": "NER",
            "label": "Niger",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.7024355806601051,
          -0.6939653683626905,
          -0.70053634524561,
          -0.699224683262813
        ]
      },
      {
        "metadata": [
          {
            "id": "NGA",
            "label": "Nigeria",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.5891386915825049,
          -0.584727398365632,
          -0.5775567366280322,
          -0.5682987916825814
        ]
      },
      {
        "metadata": [
          {
            "id": "NIC",
            "label": "Nicaragua",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6341813062304937,
          -0.6275780152305306,
          -0.6279415439825762,
          -0.6266525598997228
        ]
      },
      {
        "metadata": [
          {
            "id": "NLD",
            "label": "Netherlands",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          2.199784450316354,
          2.045461454092258,
          1.8428142763927213,
          1.847269780382517
        ]
      },
      {
        "metadata": [
          {
            "id": "NOC",
            "label": "High income: nonOECD",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.22698898909040818,
          0.2966494920777253,
          0.3568927326894745,
          0.35799822086098027
        ]
      },
      {
        "metadata": [
          {
            "id": "NOR",
            "label": "Norway",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          4.276224027866863,
          4.393090849918527,
          4.47826316791804,
          4.380052936772902
        ]
      },
      {
        "metadata": [
          {
            "id": "NPL",
            "label": "Nepal",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6887329162860185,
          -0.6781956390455934,
          -0.6841658029330349,
          -0.6851374065251488
        ]
      },
      {
        "metadata": [
          {
            "id": "NZL",
            "label": "New Zealand",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          1.1915424191476969,
          1.2121749061162697,
          1.308960207754138,
          1.393939771550183
        ]
      },
      {
        "metadata": [
          {
            "id": "OEC",
            "label": "High income: OECD",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          1.6399337845434896,
          1.5241722198607714,
          1.5323189438212563,
          1.4729374194604798
        ]
      },
      {
        "metadata": [
          {
            "id": "OED",
            "label": "OECD members",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          1.3484753306086437,
          1.2474021835214268,
          1.2519696205033684,
          1.2016767037928486
        ]
      },
      {
        "metadata": [
          {
            "id": "OMN",
            "label": "Oman",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.49163760334424167,
          0.47061247333279077,
          0.4995540328764465,
          0.38825870929637274
        ]
      },
      {
        "metadata": [
          {
            "id": "OSS",
            "label": "Other small states",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.47425942816959965,
          -0.45789410334944247,
          -0.46843941285704294,
          -0.4741534095685138
        ]
      },
      {
        "metadata": [
          {
            "id": "PAK",
            "label": "Pakistan",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6639126430990084,
          -0.6514840918438969,
          -0.6552930915930848,
          -0.6557586790766754
        ]
      },
      {
        "metadata": [
          {
            "id": "PAN",
            "label": "Panama",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.26841876186130553,
          -0.2555215522077017,
          -0.19976665522386444,
          -0.1623277072804727
        ]
      },
      {
        "metadata": [
          {
            "id": "PER",
            "label": "Peru",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.4285990230197717,
          -0.41713649116694496,
          -0.3854677321148673,
          -0.3834890029153858
        ]
      },
      {
        "metadata": [
          {
            "id": "PHL",
            "label": "Philippines",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.5992974792671125,
          -0.592438194147165,
          -0.5856237646611967,
          -0.5804521646800013
        ]
      },
      {
        "metadata": [
          {
            "id": "PLW",
            "label": "Palau",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.16289327254830788,
          -0.17027345643946634,
          -0.1361527083773879,
          -0.1232394630016208
        ]
      },
      {
        "metadata": [
          {
            "id": "PNG",
            "label": "Papua New Guinea",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6410611633934136,
          -0.6193647139225876,
          -0.6085877680773388,
          -0.6138049104853907
        ]
      },
      {
        "metadata": [
          {
            "id": "POL",
            "label": "Poland",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.0016139099958317519,
          -0.012640925292889984,
          -0.04876142326936586,
          -0.0300462137245891
        ]
      },
      {
        "metadata": [
          {
            "id": "PRI",
            "label": "Puerto Rico",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.8119099558345363,
          0.6889636081944579,
          0.7237585742965804,
          0.7218789453615558
        ]
      },
      {
        "metadata": [
          {
            "id": "PRT",
            "label": "Portugal",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.5854776369264763,
          0.48153848606368965,
          0.36116514843059355,
          0.37861791979651743
        ]
      },
      {
        "metadata": [
          {
            "id": "PRY",
            "label": "Paraguay",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.5432653212320602,
          -0.517390060218905,
          -0.528612114184682,
          -0.5046511183908021
        ]
      },
      {
        "metadata": [
          {
            "id": "PSS",
            "label": "Pacific island small states",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.5549220005434357,
          -0.5430596274103039,
          -0.5387590546217299,
          -0.542659883365776
        ]
      },
      {
        "metadata": [
          {
            "id": "QAT",
            "label": "Qatar",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          3.4292245496520057,
          3.8658414707636615,
          4.121627870699986,
          4.016896333878523
        ]
      },
      {
        "metadata": [
          {
            "id": "ROU",
            "label": "Romania",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.2506934694725292,
          -0.2468376781503406,
          -0.27997552071450094,
          -0.24047860391377246
        ]
      },
      {
        "metadata": [
          {
            "id": "RUS",
            "label": "Russian Federation",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.10141888975473602,
          -0.027249750207994604,
          0.014593657935277227,
          0.01837834326715845
        ]
      },
      {
        "metadata": [
          {
            "id": "RWA",
            "label": "Rwanda",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6927929387104561,
          -0.6843418618489876,
          -0.6877647014828422,
          -0.6879397733217523
        ]
      },
      {
        "metadata": [
          {
            "id": "SAS",
            "label": "South Asia",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6479388510245694,
          -0.6416455701852043,
          -0.6479831492736534,
          -0.6485733190756492
        ]
      },
      {
        "metadata": [
          {
            "id": "SAU",
            "label": "Saudi Arabia",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.39895449213006573,
          0.5289539255187352,
          0.6331929833428523,
          0.5921110119537889
        ]
      },
      {
        "metadata": [
          {
            "id": "SDN",
            "label": "Sudan",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.639736748945716,
          -0.6306090199829317,
          -0.6320508265347081,
          -0.6315924242207722
        ]
      },
      {
        "metadata": [
          {
            "id": "SEN",
            "label": "Senegal",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6653409290901892,
          -0.6581407329965165,
          -0.6672489293675368,
          -0.6673199343361133
        ]
      },
      {
        "metadata": [
          {
            "id": "SGP",
            "label": "Singapore",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          1.9809459687517528,
          2.0109271626424996,
          2.0974072034989715,
          2.069176782505646
        ]
      },
      {
        "metadata": [
          {
            "id": "SLB",
            "label": "Solomon Islands",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6481469699833056,
          -0.6307633180848091,
          -0.6266605585331708,
          -0.6214737761504052
        ]
      },
      {
        "metadata": [
          {
            "id": "SLE",
            "label": "Sierra Leone",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.697301065310983,
          -0.6882661104454003,
          -0.689840924117507,
          -0.6859029097771734
        ]
      },
      {
        "metadata": [
          {
            "id": "SLV",
            "label": "El Salvador",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.5233114458751006,
          -0.523351427391093,
          -0.5233280101172463,
          -0.5268201485466126
        ]
      },
      {
        "metadata": [
          {
            "id": "SRB",
            "label": "Serbia",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.4097949268529092,
          -0.38295039229846994,
          -0.424985922574327,
          -0.39904609584325407
        ]
      },
      {
        "metadata": [
          {
            "id": "SSA",
            "label": "Sub-Saharan Africa (developing only)",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6344188105826708,
          -0.6277024139259528,
          -0.6314846166772526,
          -0.6314982926681634
        ]
      },
      {
        "metadata": [
          {
            "id": "SSD",
            "label": "South Sudan",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6314558419543631,
          -0.6204816928618543,
          -0.6707200123133596,
          -0.667400370590135
        ]
      },
      {
        "metadata": [
          {
            "id": "SSF",
            "label": "Sub-Saharan Africa (all income levels)",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6337032060261246,
          -0.6268521649296288,
          -0.6306055898034055,
          -0.6307209672383799
        ]
      },
      {
        "metadata": [
          {
            "id": "SST",
            "label": "Small states",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.4190632667186919,
          -0.4112164962536782,
          -0.41694080186757065,
          -0.4229322942198895
        ]
      },
      {
        "metadata": [
          {
            "id": "STP",
            "label": "Sao Tome and Principe",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6578277855646942,
          -0.6441125394527965,
          -0.647594908155691,
          -0.638849066266151
        ]
      },
      {
        "metadata": [
          {
            "id": "SUR",
            "label": "Suriname",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.2401105767990433,
          -0.28365000332202767,
          -0.23129770509639389,
          -0.22354533605163546
        ]
      },
      {
        "metadata": [
          {
            "id": "SVK",
            "label": "Slovak Republic",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.23539116443504238,
          0.21711627205145892,
          0.17429242376346785,
          0.1921384673218472
        ]
      },
      {
        "metadata": [
          {
            "id": "SVN",
            "label": "Slovenia",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.6365201139375722,
          0.5726924514349996,
          0.4527827240337573,
          0.4573245752789072
        ]
      },
      {
        "metadata": [
          {
            "id": "SWE",
            "label": "Sweden",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          2.3007091725939923,
          2.3574109823664386,
          2.2605593032211444,
          2.3319522044086254
        ]
      },
      {
        "metadata": [
          {
            "id": "SWZ",
            "label": "Swaziland",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.5339296202533089,
          -0.5376986431811849,
          -0.5489875203013659,
          -0.5668475707500545
        ]
      },
      {
        "metadata": [
          {
            "id": "SYC",
            "label": "Seychelles",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.09369248572237365,
          -0.08942911107160179,
          -0.11070562546258197,
          0.09795196933666633
        ]
      },
      {
        "metadata": [
          {
            "id": "TCD",
            "label": "Chad",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6705265071953267,
          -0.6621062448622002,
          -0.6666243748673378,
          -0.6669622482663116
        ]
      },
      {
        "metadata": [
          {
            "id": "TGO",
            "label": "Togo",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.69411071418539,
          -0.6840617500467938,
          -0.6898855877079852,
          -0.6880524637319523
        ]
      },
      {
        "metadata": [
          {
            "id": "THA",
            "label": "Thailand",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.44444116985093246,
          -0.4463740933134777,
          -0.4347144064604405,
          -0.4281039477276611
        ]
      },
      {
        "metadata": [
          {
            "id": "TJK",
            "label": "Tajikistan",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6803732091032104,
          -0.6709534988944456,
          -0.6709133786657634,
          -0.6678255801085416
        ]
      },
      {
        "metadata": [
          {
            "id": "TKM",
            "label": "Turkmenistan",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.4682463340493852,
          -0.41893352887994784,
          -0.3659437755080039,
          -0.31650658808368337
        ]
      },
      {
        "metadata": [
          {
            "id": "TON",
            "label": "Tonga",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.5173696852810372,
          -0.5054378065171027,
          -0.48616506431926426,
          -0.4964473781543673
        ]
      },
      {
        "metadata": [
          {
            "id": "TTO",
            "label": "Trinidad and Tobago",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.18429900090167486,
          0.20139407716822966,
          0.1937060763408466,
          0.20850212120146203
        ]
      },
      {
        "metadata": [
          {
            "id": "TUN",
            "label": "Tunisia",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.4787316347837121,
          -0.49209470984485737,
          -0.5016212520867773,
          -0.5020208164791509
        ]
      },
      {
        "metadata": [
          {
            "id": "TUR",
            "label": "Turkey",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.13475192802674285,
          -0.16742235841403003,
          -0.1643763601614176,
          -0.165621006708267
        ]
      },
      {
        "metadata": [
          {
            "id": "TUV",
            "label": "Tuvalu",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.535271426667815,
          -0.5081419595699003,
          -0.5096211586983125,
          -0.524076881361398
        ]
      },
      {
        "metadata": [
          {
            "id": "TZA",
            "label": "Tanzania",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.682220104758784,
          -0.6758230134293146,
          -0.6770818441854842,
          -0.6740876973601552
        ]
      },
      {
        "metadata": [
          {
            "id": "UGA",
            "label": "Uganda",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6912013932967516,
          -0.6866071822093518,
          -0.6865833039866341,
          -0.6869942674082555
        ]
      },
      {
        "metadata": [
          {
            "id": "UKR",
            "label": "Ukraine",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.5506307679291496,
          -0.5296935943616963,
          -0.5185301137714565,
          -0.5230601935454877
        ]
      },
      {
        "metadata": [
          {
            "id": "UMC",
            "label": "Upper middle income",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.37517251664996826,
          -0.3548802224809698,
          -0.3384677442082961,
          -0.3277667046376533
        ]
      },
      {
        "metadata": [
          {
            "id": "URY",
            "label": "Uruguay",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.053751549377674054,
          0.0055637030498263676,
          0.047835722706352064,
          0.10628383782543262
        ]
      },
      {
        "metadata": [
          {
            "id": "USA",
            "label": "United States",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          2.085918381929586,
          1.8528541884810195,
          1.9663632079853028,
          1.9609773179695709
        ]
      },
      {
        "metadata": [
          {
            "id": "UZB",
            "label": "Uzbekistan",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6433626644862002,
          -0.6343520501472234,
          -0.6309454719419861,
          -0.6252948907772873
        ]
      },
      {
        "metadata": [
          {
            "id": "VCT",
            "label": "St  Vincent and the Grenadines",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.36145703177224464,
          -0.395185949771073,
          -0.3898853320742804,
          -0.3923811160924809
        ]
      },
      {
        "metadata": [
          {
            "id": "VEN",
            "label": "Venezuela  RB",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          0.06404165662290004,
          -0.16106090820718114,
          -0.056470180793387476,
          0.00842292478859039
        ]
      },
      {
        "metadata": [
          {
            "id": "VNM",
            "label": "Vietnam",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6458886039622632,
          -0.6344448628719889,
          -0.6290550648591752,
          -0.6236496177054446
        ]
      },
      {
        "metadata": [
          {
            "id": "VUT",
            "label": "Vanuatu",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.5511095068391174,
          -0.5451109474040015,
          -0.5556824292859626,
          -0.5545889622782074
        ]
      },
      {
        "metadata": [
          {
            "id": "WLD",
            "label": "World",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.1730214359283054,
          -0.1802101356811485,
          -0.17596533264840403,
          -0.183727849132957
        ]
      },
      {
        "metadata": [
          {
            "id": "WSM",
            "label": "Samoa",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.5225964073212336,
          -0.5112965835925183,
          -0.49915141834700144,
          -0.5072941648313997
        ]
      },
      {
        "metadata": [
          {
            "id": "YEM",
            "label": "Yemen  Rep ",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6423493404878717,
          -0.6493768182634823,
          -0.6506563431273849,
          -0.6457602691191718
        ]
      },
      {
        "metadata": [
          {
            "id": "ZAF",
            "label": "South Africa",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.29419829299226247,
          -0.2974908223866745,
          -0.3244866683454034,
          -0.3721307560058535
        ]
      },
      {
        "metadata": [
          {
            "id": "COD",
            "label": "Congo  Dem  Rep ",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.7031961140122661,
          -0.6931435432249938,
          -0.6973699139349996,
          -0.6957472315738471
        ]
      },
      {
        "metadata": [
          {
            "id": "ZMB",
            "label": "Zambia",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.6342920917751482,
          -0.6242586955645183,
          -0.628187550042749,
          -0.626971355755665
        ]
      },
      {
        "metadata": [
          {
            "id": "ZWE",
            "label": "Zimbabwe",
            "dimension": "country",
            "dimensionLabel": "Country",
            "role": "geo"
          }
        ],
        "value": [
          -0.681335276800132,
          -0.6717010390789262,
          -0.6732237578142339,
          -0.6720313630653142
        ]
      }
    ],
    "metadata": {
      "type": "Query Result Table",
      "source": {
        "dataset": {
          "id": "3a37ea80-93a8-11e5-b62f-dfcea48fc8d9",
          "status": "public",
          "commit": {
            "id": "1112322212",
            "author": "Andriy Boldak",
            "note": "Add UA flag",
            "createdAt": "12/29/15",
            "HEAD": "HEAD"
          },
          "locale": [
            "English",
            "Українська"
          ],
          "label": "Gross Domestic Product per capita (current USD)",
          "note": "GDP per capita is gross domestic product divided by midyear population. GDP is the sum of gross value added by all resident producers in the economy plus any product taxes and minus any subsidies not included in the value of the products. It is calculated without making deductions for depreciation of fabricated assets or for depletion and degradation of natural resources. Data are in current U.S. dollars.",
          "source": "World Bank",
          "topics": [
            "GDP",
            "#WDI/#EC/#GDP",
            "#EC/#GDP",
            "#WDI/#GDP",
            "That's all folks"
          ]
        },
        "dimension": {
          "country": {
            "label": "Country",
            "role": "geo",
            "values": [
              {
                "id": "LBY",
                "label": "Libya",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "ABW",
                "label": "Aruba",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "AGO",
                "label": "Angola",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "ALB",
                "label": "Albania",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "ARB",
                "label": "Arab World",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "ARE",
                "label": "United Arab Emirates",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "ARG",
                "label": "Argentina",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "ARM",
                "label": "Armenia",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "ATG",
                "label": "Antigua and Barbuda",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "AUS",
                "label": "Australia",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "AUT",
                "label": "Austria",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "AZE",
                "label": "Azerbaijan",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "BDI",
                "label": "Burundi",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "BEL",
                "label": "Belgium",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "BEN",
                "label": "Benin",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "BFA",
                "label": "Burkina Faso",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "BGD",
                "label": "Bangladesh",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "BGR",
                "label": "Bulgaria",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "BHR",
                "label": "Bahrain",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "BHS",
                "label": "Bahamas  The",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "BIH",
                "label": "Bosnia and Herzegovina",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "BLR",
                "label": "Belarus",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "BLZ",
                "label": "Belize",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "BMU",
                "label": "Bermuda",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "BOL",
                "label": "Bolivia",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "BRA",
                "label": "Brazil",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "BRB",
                "label": "Barbados",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "BRN",
                "label": "Brunei Darussalam",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "BTN",
                "label": "Bhutan",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "BWA",
                "label": "Botswana",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "CAF",
                "label": "Central African Republic",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "CAN",
                "label": "Canada",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "CEB",
                "label": "Central Europe and the Baltics",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "CHE",
                "label": "Switzerland",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "CHL",
                "label": "Chile",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "CHN",
                "label": "China",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "CIV",
                "label": "Cote d'Ivoire",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "CMR",
                "label": "Cameroon",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "COG",
                "label": "Congo  Rep ",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "COL",
                "label": "Colombia",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "COM",
                "label": "Comoros",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "CPV",
                "label": "Cabo Verde",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "CRI",
                "label": "Costa Rica",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "CSS",
                "label": "Caribbean small states",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "CUB",
                "label": "Cuba",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "CYP",
                "label": "Cyprus",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "CZE",
                "label": "Czech Republic",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "DEU",
                "label": "Germany",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "DJI",
                "label": "Djibouti",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "DMA",
                "label": "Dominica",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "DNK",
                "label": "Denmark",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "DOM",
                "label": "Dominican Republic",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "DZA",
                "label": "Algeria",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "EAP",
                "label": "East Asia & Pacific (developing only)",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "EAS",
                "label": "East Asia & Pacific (all income levels)",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "ECA",
                "label": "Europe & Central Asia (developing only)",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "ECS",
                "label": "Europe & Central Asia (all income levels)",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "ECU",
                "label": "Ecuador",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "EGY",
                "label": "Egypt  Arab Rep",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "EMU",
                "label": "Euro area",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "ERI",
                "label": "Eritrea",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "ESP",
                "label": "Spain",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "EST",
                "label": "Estonia",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "ETH",
                "label": "Ethiopia",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "EUU",
                "label": "European Union",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "FCS",
                "label": "Fragile and conflict affected situations",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "FIN",
                "label": "Finland",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "FJI",
                "label": "Fiji",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "FRA",
                "label": "France",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "FSM",
                "label": "Micronesia Fed Sts",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "GAB",
                "label": "Gabon",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "GBR",
                "label": "United Kingdom",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "GEO",
                "label": "Georgia",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "GHA",
                "label": "Ghana",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "GIN",
                "label": "Guinea",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "GMB",
                "label": "Gambia  The",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "GNB",
                "label": "Guinea-Bissau",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "GNQ",
                "label": "Equatorial Guinea",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "GRC",
                "label": "Greece",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "GRD",
                "label": "Grenada",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "GTM",
                "label": "Guatemala",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "GUY",
                "label": "Guyana",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "HIC",
                "label": "High income",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "HKG",
                "label": "Hong Kong SAR  China",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "HND",
                "label": "Honduras",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "HPC",
                "label": "Heavily indebted poor countries (HIPC)",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "HRV",
                "label": "Croatia",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "HTI",
                "label": "Haiti",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "HUN",
                "label": "Hungary",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "IDN",
                "label": "Indonesia",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "IND",
                "label": "India",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "IRL",
                "label": "Ireland",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "IRN",
                "label": "Iran  Islamic Rep ",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "IRQ",
                "label": "Iraq",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "ISL",
                "label": "Iceland",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "ISR",
                "label": "Israel",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "ITA",
                "label": "Italy",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "JAM",
                "label": "Jamaica",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "JOR",
                "label": "Jordan",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "JPN",
                "label": "Japan",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "KAZ",
                "label": "Kazakhstan",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "KEN",
                "label": "Kenya",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "KGZ",
                "label": "Kyrgyz Republic",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "KHM",
                "label": "Cambodia",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "KIR",
                "label": "Kiribati",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "KNA",
                "label": "St  Kitts and Nevis",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "KOR",
                "label": "Korea  Rep ",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "KWT",
                "label": "Kuwait",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "LAC",
                "label": "Latin America & Caribbean (developing only)",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "LAO",
                "label": "Lao PDR",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "LBN",
                "label": "Lebanon",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "LBR",
                "label": "Liberia",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "AFG",
                "label": "Afghanistan",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "LCA",
                "label": "St  Lucia",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "LCN",
                "label": "Latin America & Caribbean (all income levels)",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "LDC",
                "label": "Least developed countries: UN classification",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "LIC",
                "label": "Low income",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "LKA",
                "label": "Sri Lanka",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "LMC",
                "label": "Lower middle income",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "LMY",
                "label": "Low & middle income",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "LSO",
                "label": "Lesotho",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "LTU",
                "label": "Lithuania",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "LUX",
                "label": "Luxembourg",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "LVA",
                "label": "Latvia",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "MAC",
                "label": "Macao SAR  China",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "MAR",
                "label": "Morocco",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "MCO",
                "label": "Monaco",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "MDA",
                "label": "Moldova",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "MDG",
                "label": "Madagascar",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "MDV",
                "label": "Maldives",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "MEA",
                "label": "Middle East & North Africa (all income levels)",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "MEX",
                "label": "Mexico",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "MHL",
                "label": "Marshall Islands",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "MIC",
                "label": "Middle income",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "MKD",
                "label": "Macedonia  FYR",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "MLI",
                "label": "Mali",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "MLT",
                "label": "Malta",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "MNA",
                "label": "Middle East & North Africa (developing only)",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "MNE",
                "label": "Montenegro",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "MNG",
                "label": "Mongolia",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "MOZ",
                "label": "Mozambique",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "MRT",
                "label": "Mauritania",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "MUS",
                "label": "Mauritius",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "MWI",
                "label": "Malawi",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "MYS",
                "label": "Malaysia",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "NAC",
                "label": "North America",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "NAM",
                "label": "Namibia",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "NER",
                "label": "Niger",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "NGA",
                "label": "Nigeria",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "NIC",
                "label": "Nicaragua",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "NLD",
                "label": "Netherlands",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "NOC",
                "label": "High income: nonOECD",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "NOR",
                "label": "Norway",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "NPL",
                "label": "Nepal",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "NZL",
                "label": "New Zealand",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "OEC",
                "label": "High income: OECD",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "OED",
                "label": "OECD members",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "OMN",
                "label": "Oman",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "OSS",
                "label": "Other small states",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "PAK",
                "label": "Pakistan",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "PAN",
                "label": "Panama",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "PER",
                "label": "Peru",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "PHL",
                "label": "Philippines",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "PLW",
                "label": "Palau",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "PNG",
                "label": "Papua New Guinea",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "POL",
                "label": "Poland",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "PRI",
                "label": "Puerto Rico",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "PRT",
                "label": "Portugal",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "PRY",
                "label": "Paraguay",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "PSS",
                "label": "Pacific island small states",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "QAT",
                "label": "Qatar",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "ROU",
                "label": "Romania",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "RUS",
                "label": "Russian Federation",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "RWA",
                "label": "Rwanda",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "SAS",
                "label": "South Asia",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "SAU",
                "label": "Saudi Arabia",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "SDN",
                "label": "Sudan",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "SEN",
                "label": "Senegal",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "SGP",
                "label": "Singapore",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "SLB",
                "label": "Solomon Islands",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "SLE",
                "label": "Sierra Leone",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "SLV",
                "label": "El Salvador",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "SRB",
                "label": "Serbia",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "SSA",
                "label": "Sub-Saharan Africa (developing only)",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "SSD",
                "label": "South Sudan",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "SSF",
                "label": "Sub-Saharan Africa (all income levels)",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "SST",
                "label": "Small states",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "STP",
                "label": "Sao Tome and Principe",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "SUR",
                "label": "Suriname",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "SVK",
                "label": "Slovak Republic",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "SVN",
                "label": "Slovenia",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "SWE",
                "label": "Sweden",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "SWZ",
                "label": "Swaziland",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "SYC",
                "label": "Seychelles",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "TCD",
                "label": "Chad",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "TGO",
                "label": "Togo",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "THA",
                "label": "Thailand",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "TJK",
                "label": "Tajikistan",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "TKM",
                "label": "Turkmenistan",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "TLS",
                "label": "Timor-Leste",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "TON",
                "label": "Tonga",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "TTO",
                "label": "Trinidad and Tobago",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "TUN",
                "label": "Tunisia",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "TUR",
                "label": "Turkey",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "TUV",
                "label": "Tuvalu",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "TZA",
                "label": "Tanzania",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "UGA",
                "label": "Uganda",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "UKR",
                "label": "Ukraine",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "UMC",
                "label": "Upper middle income",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "URY",
                "label": "Uruguay",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "USA",
                "label": "United States",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "UZB",
                "label": "Uzbekistan",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "VCT",
                "label": "St  Vincent and the Grenadines",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "VEN",
                "label": "Venezuela  RB",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "VNM",
                "label": "Vietnam",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "VUT",
                "label": "Vanuatu",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "PSE",
                "label": "West Bank and Gaza",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "WLD",
                "label": "World",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "WSM",
                "label": "Samoa",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "YEM",
                "label": "Yemen  Rep ",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "ZAF",
                "label": "South Africa",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "COD",
                "label": "Congo  Dem  Rep ",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "ZMB",
                "label": "Zambia",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              },
              {
                "id": "ZWE",
                "label": "Zimbabwe",
                "dimension": "country",
                "dimensionLabel": "Country",
                "role": "geo"
              }
            ]
          },
          "concept": {
            "label": "Indicator",
            "role": "metric",
            "values": [
              {
                "id": "GDP",
                "label": "GDP per capita (current US$)",
                "dimension": "concept",
                "dimensionLabel": "Indicator",
                "role": "metric"
              }
            ]
          },
          "year": {
            "label": "Year",
            "role": "time",
            "values": [
              {
                "id": "2010",
                "label": "2010",
                "dimension": "year",
                "dimensionLabel": "Year",
                "role": "time"
              },
              {
                "id": "2011",
                "label": "2011",
                "dimension": "year",
                "dimensionLabel": "Year",
                "role": "time"
              },
              {
                "id": "2012",
                "label": "2012",
                "dimension": "year",
                "dimensionLabel": "Year",
                "role": "time"
              },
              {
                "id": "2013",
                "label": "2013",
                "dimension": "year",
                "dimensionLabel": "Year",
                "role": "time"
              }
            ]
          }
        },
        "layout": {
          "sheet": "data",
          "value": "Value",
          "country": {
            "id": "Country Code",
            "label": "Country Name"
          },
          "concept": {
            "id": "Indicator Code",
            "label": "Indicator Name"
          },
          "year": {
            "id": "Year",
            "label": "Year"
          }
        }
      },
      "selection": [
        {
          "dimension": "country",
          "role": "Rows",
          "collection": [],
          "IDList": [
            {
              "id": "LBY",
              "label": "Libya",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "ABW",
              "label": "Aruba",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "AGO",
              "label": "Angola",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "ALB",
              "label": "Albania",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "ARB",
              "label": "Arab World",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "ARE",
              "label": "United Arab Emirates",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "ARG",
              "label": "Argentina",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "ARM",
              "label": "Armenia",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "ATG",
              "label": "Antigua and Barbuda",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "AUS",
              "label": "Australia",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "AUT",
              "label": "Austria",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "AZE",
              "label": "Azerbaijan",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "BDI",
              "label": "Burundi",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "BEL",
              "label": "Belgium",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "BEN",
              "label": "Benin",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "BFA",
              "label": "Burkina Faso",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "BGD",
              "label": "Bangladesh",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "BGR",
              "label": "Bulgaria",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "BHR",
              "label": "Bahrain",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "BHS",
              "label": "Bahamas  The",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "BIH",
              "label": "Bosnia and Herzegovina",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "BLR",
              "label": "Belarus",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "BLZ",
              "label": "Belize",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "BMU",
              "label": "Bermuda",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "BOL",
              "label": "Bolivia",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "BRA",
              "label": "Brazil",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "BRB",
              "label": "Barbados",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "BRN",
              "label": "Brunei Darussalam",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "BTN",
              "label": "Bhutan",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "BWA",
              "label": "Botswana",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "CAF",
              "label": "Central African Republic",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "CAN",
              "label": "Canada",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "CEB",
              "label": "Central Europe and the Baltics",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "CHE",
              "label": "Switzerland",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "CHL",
              "label": "Chile",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "CHN",
              "label": "China",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "CIV",
              "label": "Cote d'Ivoire",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "CMR",
              "label": "Cameroon",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "COG",
              "label": "Congo  Rep ",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "COL",
              "label": "Colombia",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "COM",
              "label": "Comoros",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "CPV",
              "label": "Cabo Verde",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "CRI",
              "label": "Costa Rica",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "CSS",
              "label": "Caribbean small states",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "CUB",
              "label": "Cuba",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "CYP",
              "label": "Cyprus",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "CZE",
              "label": "Czech Republic",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "DEU",
              "label": "Germany",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "DJI",
              "label": "Djibouti",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "DMA",
              "label": "Dominica",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "DNK",
              "label": "Denmark",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "DOM",
              "label": "Dominican Republic",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "DZA",
              "label": "Algeria",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "EAP",
              "label": "East Asia & Pacific (developing only)",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "EAS",
              "label": "East Asia & Pacific (all income levels)",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "ECA",
              "label": "Europe & Central Asia (developing only)",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "ECS",
              "label": "Europe & Central Asia (all income levels)",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "ECU",
              "label": "Ecuador",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "EGY",
              "label": "Egypt  Arab Rep",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "EMU",
              "label": "Euro area",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "ERI",
              "label": "Eritrea",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "ESP",
              "label": "Spain",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "EST",
              "label": "Estonia",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "ETH",
              "label": "Ethiopia",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "EUU",
              "label": "European Union",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "FCS",
              "label": "Fragile and conflict affected situations",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "FIN",
              "label": "Finland",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "FJI",
              "label": "Fiji",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "FRA",
              "label": "France",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "FSM",
              "label": "Micronesia Fed Sts",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "GAB",
              "label": "Gabon",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "GBR",
              "label": "United Kingdom",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "GEO",
              "label": "Georgia",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "GHA",
              "label": "Ghana",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "GIN",
              "label": "Guinea",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "GMB",
              "label": "Gambia  The",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "GNB",
              "label": "Guinea-Bissau",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "GNQ",
              "label": "Equatorial Guinea",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "GRC",
              "label": "Greece",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "GRD",
              "label": "Grenada",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "GTM",
              "label": "Guatemala",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "GUY",
              "label": "Guyana",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "HIC",
              "label": "High income",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "HKG",
              "label": "Hong Kong SAR  China",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "HND",
              "label": "Honduras",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "HPC",
              "label": "Heavily indebted poor countries (HIPC)",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "HRV",
              "label": "Croatia",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "HTI",
              "label": "Haiti",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "HUN",
              "label": "Hungary",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "IDN",
              "label": "Indonesia",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "IND",
              "label": "India",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "IRL",
              "label": "Ireland",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "IRN",
              "label": "Iran  Islamic Rep ",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "IRQ",
              "label": "Iraq",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "ISL",
              "label": "Iceland",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "ISR",
              "label": "Israel",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "ITA",
              "label": "Italy",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "JAM",
              "label": "Jamaica",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "JOR",
              "label": "Jordan",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "JPN",
              "label": "Japan",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "KAZ",
              "label": "Kazakhstan",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "KEN",
              "label": "Kenya",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "KGZ",
              "label": "Kyrgyz Republic",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "KHM",
              "label": "Cambodia",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "KIR",
              "label": "Kiribati",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "KNA",
              "label": "St  Kitts and Nevis",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "KOR",
              "label": "Korea  Rep ",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "KWT",
              "label": "Kuwait",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "LAC",
              "label": "Latin America & Caribbean (developing only)",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "LAO",
              "label": "Lao PDR",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "LBN",
              "label": "Lebanon",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "LBR",
              "label": "Liberia",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "AFG",
              "label": "Afghanistan",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "LCA",
              "label": "St  Lucia",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "LCN",
              "label": "Latin America & Caribbean (all income levels)",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "LDC",
              "label": "Least developed countries: UN classification",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "LIC",
              "label": "Low income",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "LKA",
              "label": "Sri Lanka",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "LMC",
              "label": "Lower middle income",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "LMY",
              "label": "Low & middle income",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "LSO",
              "label": "Lesotho",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "LTU",
              "label": "Lithuania",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "LUX",
              "label": "Luxembourg",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "LVA",
              "label": "Latvia",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "MAC",
              "label": "Macao SAR  China",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "MAR",
              "label": "Morocco",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "MCO",
              "label": "Monaco",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "MDA",
              "label": "Moldova",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "MDG",
              "label": "Madagascar",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "MDV",
              "label": "Maldives",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "MEA",
              "label": "Middle East & North Africa (all income levels)",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "MEX",
              "label": "Mexico",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "MHL",
              "label": "Marshall Islands",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "MIC",
              "label": "Middle income",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "MKD",
              "label": "Macedonia  FYR",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "MLI",
              "label": "Mali",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "MLT",
              "label": "Malta",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "MNA",
              "label": "Middle East & North Africa (developing only)",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "MNE",
              "label": "Montenegro",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "MNG",
              "label": "Mongolia",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "MOZ",
              "label": "Mozambique",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "MRT",
              "label": "Mauritania",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "MUS",
              "label": "Mauritius",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "MWI",
              "label": "Malawi",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "MYS",
              "label": "Malaysia",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "NAC",
              "label": "North America",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "NAM",
              "label": "Namibia",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "NER",
              "label": "Niger",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "NGA",
              "label": "Nigeria",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "NIC",
              "label": "Nicaragua",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "NLD",
              "label": "Netherlands",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "NOC",
              "label": "High income: nonOECD",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "NOR",
              "label": "Norway",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "NPL",
              "label": "Nepal",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "NZL",
              "label": "New Zealand",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "OEC",
              "label": "High income: OECD",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "OED",
              "label": "OECD members",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "OMN",
              "label": "Oman",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "OSS",
              "label": "Other small states",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "PAK",
              "label": "Pakistan",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "PAN",
              "label": "Panama",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "PER",
              "label": "Peru",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "PHL",
              "label": "Philippines",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "PLW",
              "label": "Palau",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "PNG",
              "label": "Papua New Guinea",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "POL",
              "label": "Poland",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "PRI",
              "label": "Puerto Rico",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "PRT",
              "label": "Portugal",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "PRY",
              "label": "Paraguay",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "PSS",
              "label": "Pacific island small states",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "QAT",
              "label": "Qatar",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "ROU",
              "label": "Romania",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "RUS",
              "label": "Russian Federation",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "RWA",
              "label": "Rwanda",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "SAS",
              "label": "South Asia",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "SAU",
              "label": "Saudi Arabia",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "SDN",
              "label": "Sudan",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "SEN",
              "label": "Senegal",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "SGP",
              "label": "Singapore",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "SLB",
              "label": "Solomon Islands",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "SLE",
              "label": "Sierra Leone",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "SLV",
              "label": "El Salvador",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "SRB",
              "label": "Serbia",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "SSA",
              "label": "Sub-Saharan Africa (developing only)",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "SSD",
              "label": "South Sudan",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "SSF",
              "label": "Sub-Saharan Africa (all income levels)",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "SST",
              "label": "Small states",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "STP",
              "label": "Sao Tome and Principe",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "SUR",
              "label": "Suriname",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "SVK",
              "label": "Slovak Republic",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "SVN",
              "label": "Slovenia",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "SWE",
              "label": "Sweden",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "SWZ",
              "label": "Swaziland",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "SYC",
              "label": "Seychelles",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "TCD",
              "label": "Chad",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "TGO",
              "label": "Togo",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "THA",
              "label": "Thailand",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "TJK",
              "label": "Tajikistan",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "TKM",
              "label": "Turkmenistan",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "TLS",
              "label": "Timor-Leste",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "TON",
              "label": "Tonga",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "TTO",
              "label": "Trinidad and Tobago",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "TUN",
              "label": "Tunisia",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "TUR",
              "label": "Turkey",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "TUV",
              "label": "Tuvalu",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "TZA",
              "label": "Tanzania",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "UGA",
              "label": "Uganda",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "UKR",
              "label": "Ukraine",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "UMC",
              "label": "Upper middle income",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "URY",
              "label": "Uruguay",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "USA",
              "label": "United States",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "UZB",
              "label": "Uzbekistan",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "VCT",
              "label": "St  Vincent and the Grenadines",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "VEN",
              "label": "Venezuela  RB",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "VNM",
              "label": "Vietnam",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "VUT",
              "label": "Vanuatu",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "PSE",
              "label": "West Bank and Gaza",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "WLD",
              "label": "World",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "WSM",
              "label": "Samoa",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "YEM",
              "label": "Yemen  Rep ",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "ZAF",
              "label": "South Africa",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "COD",
              "label": "Congo  Dem  Rep ",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "ZMB",
              "label": "Zambia",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            },
            {
              "id": "ZWE",
              "label": "Zimbabwe",
              "dimension": "country",
              "dimensionLabel": "Country",
              "role": "geo"
            }
          ]
        },
        {
          "dimension": "concept",
          "role": "Split Columns",
          "collection": [],
          "IDList": [
            {
              "id": "GDP",
              "label": "GDP per capita (current US$)",
              "dimension": "concept",
              "dimensionLabel": "Indicator",
              "role": "metric"
            }
          ]
        },
        {
          "dimension": "year",
          "role": "Columns",
          "collection": [],
          "IDList": [
            {
              "id": "2010",
              "label": "2010",
              "dimension": "year",
              "dimensionLabel": "Year",
              "role": "time"
            },
            {
              "id": "2011",
              "label": "2011",
              "dimension": "year",
              "dimensionLabel": "Year",
              "role": "time"
            },
            {
              "id": "2012",
              "label": "2012",
              "dimension": "year",
              "dimensionLabel": "Year",
              "role": "time"
            },
            {
              "id": "2013",
              "label": "2013",
              "dimension": "year",
              "dimensionLabel": "Year",
              "role": "time"
            }
          ]
        }
      ]
    },
    "createdAt": "2016-02-28T17:25:50.884Z",
    "postProcess": [
      {
        "shortName": "Select data(571f3508b44f82b41888ff3d)",
        "select": {
          "source": "data"
        }
      },
      {
        "shortName": "Reduce Rows (Has Null)",
        "reduce": {
          "enable": true,
          "mode": "Has Null",
          "direction": "Rows"
        }
      },
      {
        "shortName": "Normalize Columns(Standartization)",
        "normalization": {
          "enable": true,
          "mode": "Standartization",
          "direction": "Columns"
        }
      }
    ]
  };

var a = PCA(data)
