// var getProperty = require("wdc-flat").getProperty;
var getProperty = require("./index").getProperty;

var test = {
  "metadata": {
    "dataset": {
      "id": "3a37ea80-93a8-11e5-b62f-dfcea48fc8d9",
      "visibility": "public",
      "commit": {
        "id": "1112322212",
        "author": "Andrey Boldak",
        "note": "Add commit info",
        "createdAt": "11/28/15",
        "HEAD": "HEAD"
      },
      "locale": [
        "#en",
        "#ua"
      ],
      "label": "#GDP_LABEL",
      "note": "#GDP_NOTE",
      "source": "#WB",
      "topics": [
        "#GDP",
        "#WDI/#EC/#GDP",
        "#EC/#GDP",
        "#WDI/#GDP"
      ]
    },
    "dimension": {
      "country": {
        "label": "#DIM_COUNTRY",
        "role": "geo",
        "values": [
          {
            "id": "LBY",
            "label": "Libya"
          },
          {
            "id": "ABW",
            "label": "Aruba"
          },
          {
            "id": "AGO",
            "label": "Angola"
          },
          {
            "id": "ALB",
            "label": "Albania"
          },
          {
            "id": "ARB",
            "label": "Arab World"
          },
          {
            "id": "ARE",
            "label": "United Arab Emirates"
          },
          {
            "id": "ARG",
            "label": "Argentina"
          },
          {
            "id": "ARM",
            "label": "Armenia"
          },
          {
            "id": "ATG",
            "label": "Antigua and Barbuda"
          },
          {
            "id": "AUS",
            "label": "Australia"
          },
          {
            "id": "AUT",
            "label": "Austria"
          },
          {
            "id": "AZE",
            "label": "Azerbaijan"
          },
          {
            "id": "BDI",
            "label": "Burundi"
          },
          {
            "id": "BEL",
            "label": "Belgium"
          },
          {
            "id": "BEN",
            "label": "Benin"
          },
          {
            "id": "BFA",
            "label": "Burkina Faso"
          },
          {
            "id": "BGD",
            "label": "Bangladesh"
          },
          {
            "id": "BGR",
            "label": "Bulgaria"
          },
          {
            "id": "BHR",
            "label": "Bahrain"
          },
          {
            "id": "BHS",
            "label": "Bahamas  The"
          },
          {
            "id": "BIH",
            "label": "Bosnia and Herzegovina"
          },
          {
            "id": "BLR",
            "label": "Belarus"
          },
          {
            "id": "BLZ",
            "label": "Belize"
          },
          {
            "id": "BMU",
            "label": "Bermuda"
          },
          {
            "id": "BOL",
            "label": "Bolivia"
          },
          {
            "id": "BRA",
            "label": "Brazil"
          },
          {
            "id": "BRB",
            "label": "Barbados"
          },
          {
            "id": "BRN",
            "label": "Brunei Darussalam"
          },
          {
            "id": "BTN",
            "label": "Bhutan"
          },
          {
            "id": "BWA",
            "label": "Botswana"
          },
          {
            "id": "CAF",
            "label": "Central African Republic"
          },
          {
            "id": "CAN",
            "label": "Canada"
          },
          {
            "id": "CEB",
            "label": "Central Europe and the Baltics"
          },
          {
            "id": "CHE",
            "label": "Switzerland"
          },
          {
            "id": "CHL",
            "label": "Chile"
          },
          {
            "id": "CHN",
            "label": "China"
          },
          {
            "id": "CIV",
            "label": "Cote d'Ivoire"
          },
          {
            "id": "CMR",
            "label": "Cameroon"
          },
          {
            "id": "COG",
            "label": "Congo  Rep "
          },
          {
            "id": "COL",
            "label": "Colombia"
          },
          {
            "id": "COM",
            "label": "Comoros"
          },
          {
            "id": "CPV",
            "label": "Cabo Verde"
          },
          {
            "id": "CRI",
            "label": "Costa Rica"
          },
          {
            "id": "CSS",
            "label": "Caribbean small states"
          },
          {
            "id": "CUB",
            "label": "Cuba"
          },
          {
            "id": "CYP",
            "label": "Cyprus"
          },
          {
            "id": "CZE",
            "label": "Czech Republic"
          },
          {
            "id": "DEU",
            "label": "Germany"
          },
          {
            "id": "DJI",
            "label": "Djibouti"
          },
          {
            "id": "DMA",
            "label": "Dominica"
          },
          {
            "id": "DNK",
            "label": "Denmark"
          },
          {
            "id": "DOM",
            "label": "Dominican Republic"
          },
          {
            "id": "DZA",
            "label": "Algeria"
          },
          {
            "id": "EAP",
            "label": "East Asia & Pacific (developing only)"
          },
          {
            "id": "EAS",
            "label": "East Asia & Pacific (all income levels)"
          },
          {
            "id": "ECA",
            "label": "Europe & Central Asia (developing only)"
          },
          {
            "id": "ECS",
            "label": "Europe & Central Asia (all income levels)"
          },
          {
            "id": "ECU",
            "label": "Ecuador"
          },
          {
            "id": "EGY",
            "label": "Egypt  Arab Rep"
          },
          {
            "id": "EMU",
            "label": "Euro area"
          },
          {
            "id": "ERI",
            "label": "Eritrea"
          },
          {
            "id": "ESP",
            "label": "Spain"
          },
          {
            "id": "EST",
            "label": "Estonia"
          },
          {
            "id": "ETH",
            "label": "Ethiopia"
          },
          {
            "id": "EUU",
            "label": "European Union"
          },
          {
            "id": "FCS",
            "label": "Fragile and conflict affected situations"
          },
          {
            "id": "FIN",
            "label": "Finland"
          },
          {
            "id": "FJI",
            "label": "Fiji"
          },
          {
            "id": "FRA",
            "label": "France"
          },
          {
            "id": "FSM",
            "label": "Micronesia Fed Sts"
          },
          {
            "id": "GAB",
            "label": "Gabon"
          },
          {
            "id": "GBR",
            "label": "United Kingdom"
          },
          {
            "id": "GEO",
            "label": "Georgia"
          },
          {
            "id": "GHA",
            "label": "Ghana"
          },
          {
            "id": "GIN",
            "label": "Guinea"
          },
          {
            "id": "GMB",
            "label": "Gambia  The"
          },
          {
            "id": "GNB",
            "label": "Guinea-Bissau"
          },
          {
            "id": "GNQ",
            "label": "Equatorial Guinea"
          },
          {
            "id": "GRC",
            "label": "Greece"
          },
          {
            "id": "GRD",
            "label": "Grenada"
          },
          {
            "id": "GTM",
            "label": "Guatemala"
          },
          {
            "id": "GUY",
            "label": "Guyana"
          },
          {
            "id": "HIC",
            "label": "High income"
          },
          {
            "id": "HKG",
            "label": "Hong Kong SAR  China"
          },
          {
            "id": "HND",
            "label": "Honduras"
          },
          {
            "id": "HPC",
            "label": "Heavily indebted poor countries (HIPC)"
          },
          {
            "id": "HRV",
            "label": "Croatia"
          },
          {
            "id": "HTI",
            "label": "Haiti"
          },
          {
            "id": "HUN",
            "label": "Hungary"
          },
          {
            "id": "IDN",
            "label": "Indonesia"
          },
          {
            "id": "IND",
            "label": "India"
          },
          {
            "id": "IRL",
            "label": "Ireland"
          },
          {
            "id": "IRN",
            "label": "Iran  Islamic Rep "
          },
          {
            "id": "IRQ",
            "label": "Iraq"
          },
          {
            "id": "ISL",
            "label": "Iceland"
          },
          {
            "id": "ISR",
            "label": "Israel"
          },
          {
            "id": "ITA",
            "label": "Italy"
          },
          {
            "id": "JAM",
            "label": "Jamaica"
          },
          {
            "id": "JOR",
            "label": "Jordan"
          },
          {
            "id": "JPN",
            "label": "Japan"
          },
          {
            "id": "KAZ",
            "label": "Kazakhstan"
          },
          {
            "id": "KEN",
            "label": "Kenya"
          },
          {
            "id": "KGZ",
            "label": "Kyrgyz Republic"
          },
          {
            "id": "KHM",
            "label": "Cambodia"
          },
          {
            "id": "KIR",
            "label": "Kiribati"
          },
          {
            "id": "KNA",
            "label": "St  Kitts and Nevis"
          },
          {
            "id": "KOR",
            "label": "Korea  Rep "
          },
          {
            "id": "KWT",
            "label": "Kuwait"
          },
          {
            "id": "LAC",
            "label": "Latin America & Caribbean (developing only)"
          },
          {
            "id": "LAO",
            "label": "Lao PDR"
          },
          {
            "id": "LBN",
            "label": "Lebanon"
          },
          {
            "id": "LBR",
            "label": "Liberia"
          },
          {
            "id": "AFG",
            "label": "Afghanistan"
          },
          {
            "id": "LCA",
            "label": "St  Lucia"
          },
          {
            "id": "LCN",
            "label": "Latin America & Caribbean (all income levels)"
          },
          {
            "id": "LDC",
            "label": "Least developed countries: UN classification"
          },
          {
            "id": "LIC",
            "label": "Low income"
          },
          {
            "id": "LKA",
            "label": "Sri Lanka"
          },
          {
            "id": "LMC",
            "label": "Lower middle income"
          },
          {
            "id": "LMY",
            "label": "Low & middle income"
          },
          {
            "id": "LSO",
            "label": "Lesotho"
          },
          {
            "id": "LTU",
            "label": "Lithuania"
          },
          {
            "id": "LUX",
            "label": "Luxembourg"
          },
          {
            "id": "LVA",
            "label": "Latvia"
          },
          {
            "id": "MAC",
            "label": "Macao SAR  China"
          },
          {
            "id": "MAR",
            "label": "Morocco"
          },
          {
            "id": "MCO",
            "label": "Monaco"
          },
          {
            "id": "MDA",
            "label": "Moldova"
          },
          {
            "id": "MDG",
            "label": "Madagascar"
          },
          {
            "id": "MDV",
            "label": "Maldives"
          },
          {
            "id": "MEA",
            "label": "Middle East & North Africa (all income levels)"
          },
          {
            "id": "MEX",
            "label": "Mexico"
          },
          {
            "id": "MHL",
            "label": "Marshall Islands"
          },
          {
            "id": "MIC",
            "label": "Middle income"
          },
          {
            "id": "MKD",
            "label": "Macedonia  FYR"
          },
          {
            "id": "MLI",
            "label": "Mali"
          },
          {
            "id": "MLT",
            "label": "Malta"
          },
          {
            "id": "MNA",
            "label": "Middle East & North Africa (developing only)"
          },
          {
            "id": "MNE",
            "label": "Montenegro"
          },
          {
            "id": "MNG",
            "label": "Mongolia"
          },
          {
            "id": "MOZ",
            "label": "Mozambique"
          },
          {
            "id": "MRT",
            "label": "Mauritania"
          },
          {
            "id": "MUS",
            "label": "Mauritius"
          },
          {
            "id": "MWI",
            "label": "Malawi"
          },
          {
            "id": "MYS",
            "label": "Malaysia"
          },
          {
            "id": "NAC",
            "label": "North America"
          },
          {
            "id": "NAM",
            "label": "Namibia"
          },
          {
            "id": "NER",
            "label": "Niger"
          },
          {
            "id": "NGA",
            "label": "Nigeria"
          },
          {
            "id": "NIC",
            "label": "Nicaragua"
          },
          {
            "id": "NLD",
            "label": "Netherlands"
          },
          {
            "id": "NOC",
            "label": "High income: nonOECD"
          },
          {
            "id": "NOR",
            "label": "Norway"
          },
          {
            "id": "NPL",
            "label": "Nepal"
          },
          {
            "id": "NZL",
            "label": "New Zealand"
          },
          {
            "id": "OEC",
            "label": "High income: OECD"
          },
          {
            "id": "OED",
            "label": "OECD members"
          },
          {
            "id": "OMN",
            "label": "Oman"
          },
          {
            "id": "OSS",
            "label": "Other small states"
          },
          {
            "id": "PAK",
            "label": "Pakistan"
          },
          {
            "id": "PAN",
            "label": "Panama"
          },
          {
            "id": "PER",
            "label": "Peru"
          },
          {
            "id": "PHL",
            "label": "Philippines"
          },
          {
            "id": "PLW",
            "label": "Palau"
          },
          {
            "id": "PNG",
            "label": "Papua New Guinea"
          },
          {
            "id": "POL",
            "label": "Poland"
          },
          {
            "id": "PRI",
            "label": "Puerto Rico"
          },
          {
            "id": "PRT",
            "label": "Portugal"
          },
          {
            "id": "PRY",
            "label": "Paraguay"
          },
          {
            "id": "PSS",
            "label": "Pacific island small states"
          },
          {
            "id": "QAT",
            "label": "Qatar"
          },
          {
            "id": "ROU",
            "label": "Romania"
          },
          {
            "id": "RUS",
            "label": "Russian Federation"
          },
          {
            "id": "RWA",
            "label": "Rwanda"
          },
          {
            "id": "SAS",
            "label": "South Asia"
          },
          {
            "id": "SAU",
            "label": "Saudi Arabia"
          },
          {
            "id": "SDN",
            "label": "Sudan"
          },
          {
            "id": "SEN",
            "label": "Senegal"
          },
          {
            "id": "SGP",
            "label": "Singapore"
          },
          {
            "id": "SLB",
            "label": "Solomon Islands"
          },
          {
            "id": "SLE",
            "label": "Sierra Leone"
          },
          {
            "id": "SLV",
            "label": "El Salvador"
          },
          {
            "id": "SRB",
            "label": "Serbia"
          },
          {
            "id": "SSA",
            "label": "Sub-Saharan Africa (developing only)"
          },
          {
            "id": "SSD",
            "label": "South Sudan"
          },
          {
            "id": "SSF",
            "label": "Sub-Saharan Africa (all income levels)"
          },
          {
            "id": "SST",
            "label": "Small states"
          },
          {
            "id": "STP",
            "label": "Sao Tome and Principe"
          },
          {
            "id": "SUR",
            "label": "Suriname"
          },
          {
            "id": "SVK",
            "label": "Slovak Republic"
          },
          {
            "id": "SVN",
            "label": "Slovenia"
          },
          {
            "id": "SWE",
            "label": "Sweden"
          },
          {
            "id": "SWZ",
            "label": "Swaziland"
          },
          {
            "id": "SYC",
            "label": "Seychelles"
          },
          {
            "id": "TCD",
            "label": "Chad"
          },
          {
            "id": "TGO",
            "label": "Togo"
          },
          {
            "id": "THA",
            "label": "Thailand"
          },
          {
            "id": "TJK",
            "label": "Tajikistan"
          },
          {
            "id": "TKM",
            "label": "Turkmenistan"
          },
          {
            "id": "TLS",
            "label": "Timor-Leste"
          },
          {
            "id": "TON",
            "label": "Tonga"
          },
          {
            "id": "TTO",
            "label": "Trinidad and Tobago"
          },
          {
            "id": "TUN",
            "label": "Tunisia"
          },
          {
            "id": "TUR",
            "label": "Turkey"
          },
          {
            "id": "TUV",
            "label": "Tuvalu"
          },
          {
            "id": "TZA",
            "label": "Tanzania"
          },
          {
            "id": "UGA",
            "label": "Uganda"
          },
          {
            "id": "UKR",
            "label": "Ukraine"
          },
          {
            "id": "UMC",
            "label": "Upper middle income"
          },
          {
            "id": "URY",
            "label": "Uruguay"
          },
          {
            "id": "USA",
            "label": "United States"
          },
          {
            "id": "UZB",
            "label": "Uzbekistan"
          },
          {
            "id": "VCT",
            "label": "St  Vincent and the Grenadines"
          },
          {
            "id": "VEN",
            "label": "Venezuela  RB"
          },
          {
            "id": "VNM",
            "label": "Vietnam"
          },
          {
            "id": "VUT",
            "label": "Vanuatu"
          },
          {
            "id": "PSE",
            "label": "West Bank and Gaza"
          },
          {
            "id": "WLD",
            "label": "World"
          },
          {
            "id": "WSM",
            "label": "Samoa"
          },
          {
            "id": "YEM",
            "label": "Yemen  Rep "
          },
          {
            "id": "ZAF",
            "label": "South Africa"
          },
          {
            "id": "COD",
            "label": "Congo  Dem  Rep "
          },
          {
            "id": "ZMB",
            "label": "Zambia"
          },
          {
            "id": "ZWE",
            "label": "Zimbabwe"
          }
        ]
      },
      "concept": {
        "label": "#DIM_INDICATOR",
        "role": "metric",
        "values": [
          {
            "id": "GDP",
            "label": "GDP per capita (current US$)"
          }
        ]
      },
      "year": {
        "label": "#DIM_YEAR",
        "role": "time",
        "values": [
          {
            "id": "2010",
            "label": "2010"
          },
          {
            "id": "2011",
            "label": "2011"
          },
          {
            "id": "2012",
            "label": "2012"
          },
          {
            "id": "2013",
            "label": "2013"
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
  "data": [
    {
      "country": "Aruba",
      "#country": "ABW",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "24289.14152"
    },
    {
      "country": "Afghanistan",
      "#country": "AFG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "561.1976175"
    },
    {
      "country": "Angola",
      "#country": "AGO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "4218.649126"
    },
    {
      "country": "Albania",
      "#country": "ALB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "4094.360204"
    },
    {
      "country": "Arab World",
      "#country": "ARB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "6032.996658"
    },
    {
      "country": "United Arab Emirates",
      "#country": "ARE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "33885.92544"
    },
    {
      "country": "Argentina",
      "#country": "ARG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "11460.37615"
    },
    {
      "country": "Armenia",
      "#country": "ARM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "3124.784854"
    },
    {
      "country": "Antigua and Barbuda",
      "#country": "ATG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "13017.31039"
    },
    {
      "country": "Australia",
      "#country": "AUS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "51800.93139"
    },
    {
      "country": "Austria",
      "#country": "AUT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "46590.60734"
    },
    {
      "country": "Azerbaijan",
      "#country": "AZE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "5842.805784"
    },
    {
      "country": "Burundi",
      "#country": "BDI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "219.5297995"
    },
    {
      "country": "Belgium",
      "#country": "BEL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "44358.26064"
    },
    {
      "country": "Benin",
      "#country": "BEN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "690.0022811"
    },
    {
      "country": "Burkina Faso",
      "#country": "BFA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "578.6688869"
    },
    {
      "country": "Bangladesh",
      "#country": "BGD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "762.8037395"
    },
    {
      "country": "Bulgaria",
      "#country": "BGR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "6580.813875"
    },
    {
      "country": "Bahrain",
      "#country": "BHR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "20545.96702"
    },
    {
      "country": "Bahamas  The",
      "#country": "BHS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "21941.8693"
    },
    {
      "country": "Bosnia and Herzegovina",
      "#country": "BIH",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "4380.604285"
    },
    {
      "country": "Belarus",
      "#country": "BLR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "5818.854859"
    },
    {
      "country": "Belize",
      "#country": "BLZ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "4527.336639"
    },
    {
      "country": "Bermuda",
      "#country": "BMU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "88207.32756"
    },
    {
      "country": "Bolivia",
      "#country": "BOL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1934.666067"
    },
    {
      "country": "Brazil",
      "#country": "BRA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "10978.26024"
    },
    {
      "country": "Barbados",
      "#country": "BRB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "15812.27978"
    },
    {
      "country": "Brunei Darussalam",
      "#country": "BRN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "30880.34486"
    },
    {
      "country": "Bhutan",
      "#country": "BTN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "2211.340513"
    },
    {
      "country": "Botswana",
      "#country": "BWA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "6980.361812"
    },
    {
      "country": "Central African Republic",
      "#country": "CAF",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "456.5634087"
    },
    {
      "country": "Canada",
      "#country": "CAN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "47465.34593"
    },
    {
      "country": "Central Europe and the Baltics",
      "#country": "CEB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "12452.42393"
    },
    {
      "country": "Switzerland",
      "#country": "CHE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "74276.71842"
    },
    {
      "country": "Chile",
      "#country": "CHL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "12681.7652"
    },
    {
      "country": "China",
      "#country": "CHN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "4433.340886"
    },
    {
      "country": "Cote d'Ivoire",
      "#country": "CIV",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1311.326565"
    },
    {
      "country": "Cameroon",
      "#country": "CMR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1145.368992"
    },
    {
      "country": "Congo  Rep ",
      "#country": "COG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "2920.406708"
    },
    {
      "country": "Colombia",
      "#country": "COL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "6179.770329"
    },
    {
      "country": "Comoros",
      "#country": "COM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "756.8106118"
    },
    {
      "country": "Cabo Verde",
      "#country": "CPV",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "3413.26337"
    },
    {
      "country": "Costa Rica",
      "#country": "CRI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "7773.185487"
    },
    {
      "country": "Caribbean small states",
      "#country": "CSS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "8628.040548"
    },
    {
      "country": "Cuba",
      "#country": "CUB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "5701.962671"
    },
    {
      "country": "Cyprus",
      "#country": "CYP",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "27889.03718"
    },
    {
      "country": "Czech Republic",
      "#country": "CZE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "19764.01554"
    },
    {
      "country": "Germany",
      "#country": "DEU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "41723.3659"
    },
    {
      "country": "Djibouti",
      "#country": "DJI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1353.193028"
    },
    {
      "country": "Dominica",
      "#country": "DMA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "6926.847597"
    },
    {
      "country": "Denmark",
      "#country": "DNK",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "57647.92502"
    },
    {
      "country": "Dominican Republic",
      "#country": "DOM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "5295.39969"
    },
    {
      "country": "Algeria",
      "#country": "DZA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "4349.569325"
    },
    {
      "country": "East Asia & Pacific (developing only)",
      "#country": "EAP",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "3885.407192"
    },
    {
      "country": "East Asia & Pacific (all income levels)",
      "#country": "EAS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "7457.994977"
    },
    {
      "country": "Europe & Central Asia (developing only)",
      "#country": "ECA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "6196.916566"
    },
    {
      "country": "Europe & Central Asia (all income levels)",
      "#country": "ECS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "23403.77335"
    },
    {
      "country": "Ecuador",
      "#country": "ECU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "4636.693098"
    },
    {
      "country": "Egypt  Arab Rep",
      "#country": "EGY",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "2803.532963"
    },
    {
      "country": "Euro area",
      "#country": "EMU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "37574.21832"
    },
    {
      "country": "Eritrea",
      "#country": "ERI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "368.7477582"
    },
    {
      "country": "Spain",
      "#country": "ESP",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "30736.00228"
    },
    {
      "country": "Estonia",
      "#country": "EST",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "14629.64939"
    },
    {
      "country": "Ethiopia",
      "#country": "ETH",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "343.6901516"
    },
    {
      "country": "European Union",
      "#country": "EUU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "33560.43839"
    },
    {
      "country": "Fragile and conflict affected situations",
      "#country": "FCS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1334.543141"
    },
    {
      "country": "Finland",
      "#country": "FIN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "46202.41516"
    },
    {
      "country": "Fiji",
      "#country": "FJI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "3649.382362"
    },
    {
      "country": "France",
      "#country": "FRA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "40706.07833"
    },
    {
      "country": "Micronesia Fed Sts",
      "#country": "FSM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "2838.448547"
    },
    {
      "country": "Gabon",
      "#country": "GAB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "9362.113583"
    },
    {
      "country": "United Kingdom",
      "#country": "GBR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "38363.44144"
    },
    {
      "country": "Georgia",
      "#country": "GEO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "2613.756925"
    },
    {
      "country": "Ghana",
      "#country": "GHA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1326.092033"
    },
    {
      "country": "Guinea",
      "#country": "GIN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "435.448888"
    },
    {
      "country": "Gambia  The",
      "#country": "GMB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "566.3481084"
    },
    {
      "country": "Guinea-Bissau",
      "#country": "GNB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "534.1475781"
    },
    {
      "country": "Equatorial Guinea",
      "#country": "GNQ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "16638.13107"
    },
    {
      "country": "Greece",
      "#country": "GRC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "26861.4598"
    },
    {
      "country": "Grenada",
      "#country": "GRD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "7365.666529"
    },
    {
      "country": "Guatemala",
      "#country": "GTM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "2882.386026"
    },
    {
      "country": "Guyana",
      "#country": "GUY",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "2873.952008"
    },
    {
      "country": "High income",
      "#country": "HIC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "36033.62373"
    },
    {
      "country": "Hong Kong SAR  China",
      "#country": "HKG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "32549.99823"
    },
    {
      "country": "Honduras",
      "#country": "HND",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "2078.32576"
    },
    {
      "country": "Heavily indebted poor countries (HIPC)",
      "#country": "HPC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "742.2096397"
    },
    {
      "country": "Croatia",
      "#country": "HRV",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "13500.85443"
    },
    {
      "country": "Haiti",
      "#country": "HTI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "669.1869294"
    },
    {
      "country": "Hungary",
      "#country": "HUN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "12958.53036"
    },
    {
      "country": "Indonesia",
      "#country": "IDN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "2946.656061"
    },
    {
      "country": "India",
      "#country": "IND",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1417.073614"
    },
    {
      "country": "Ireland",
      "#country": "IRL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "47900.83929"
    },
    {
      "country": "Iran  Islamic Rep ",
      "#country": "IRN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "5674.923927"
    },
    {
      "country": "Iraq",
      "#country": "IRQ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "4473.71044"
    },
    {
      "country": "Iceland",
      "#country": "ISL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "41695.99365"
    },
    {
      "country": "Israel",
      "#country": "ISR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "30550.9204"
    },
    {
      "country": "Italy",
      "#country": "ITA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "35875.72655"
    },
    {
      "country": "Jamaica",
      "#country": "JAM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "4917.023202"
    },
    {
      "country": "Jordan",
      "#country": "JOR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "4370.721045"
    },
    {
      "country": "Japan",
      "#country": "JPN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "42909.24637"
    },
    {
      "country": "Kazakhstan",
      "#country": "KAZ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "9070.649972"
    },
    {
      "country": "Kenya",
      "#country": "KEN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "977.7787074"
    },
    {
      "country": "Kyrgyz Republic",
      "#country": "KGZ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "880.0377751"
    },
    {
      "country": "Cambodia",
      "#country": "KHM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "782.6188886"
    },
    {
      "country": "Kiribati",
      "#country": "KIR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1539.047436"
    },
    {
      "country": "St  Kitts and Nevis",
      "#country": "KNA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "13226.95231"
    },
    {
      "country": "Korea  Rep ",
      "#country": "KOR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "22151.20912"
    },
    {
      "country": "Kuwait",
      "#country": "KWT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "38584.4796"
    },
    {
      "country": "Latin America & Caribbean (developing only)",
      "#country": "LAC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "8619.190138"
    },
    {
      "country": "Lao PDR",
      "#country": "LAO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1122.852316"
    },
    {
      "country": "Lebanon",
      "#country": "LBN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "8755.849968"
    },
    {
      "country": "Liberia",
      "#country": "LBR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "326.6042804"
    },
    {
      "country": "Libya",
      "#country": "LBY",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "12375.44953"
    },
    {
      "country": "St  Lucia",
      "#country": "LCA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "7014.196449"
    },
    {
      "country": "Latin America & Caribbean (all income levels)",
      "#country": "LCN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "8921.718519"
    },
    {
      "country": "Least developed countries: UN classification",
      "#country": "LDC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "753.9534707"
    },
    {
      "country": "Low income",
      "#country": "LIC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "588.3821694"
    },
    {
      "country": "Sri Lanka",
      "#country": "LKA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "2400.015575"
    },
    {
      "country": "Lower middle income",
      "#country": "LMC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1758.968144"
    },
    {
      "country": "Low & middle income",
      "#country": "LMY",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "3376.152214"
    },
    {
      "country": "Lesotho",
      "#country": "LSO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1083.015314"
    },
    {
      "country": "Lithuania",
      "#country": "LTU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "11852.1696"
    },
    {
      "country": "Luxembourg",
      "#country": "LUX",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "102856.9717"
    },
    {
      "country": "Latvia",
      "#country": "LVA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "11446.50818"
    },
    {
      "country": "Macao SAR  China",
      "#country": "MAC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "53045.87903"
    },
    {
      "country": "Morocco",
      "#country": "MAR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "2822.733739"
    },
    {
      "country": "Monaco",
      "#country": "MCO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "145229.8379"
    },
    {
      "country": "Moldova",
      "#country": "MDA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1631.535832"
    },
    {
      "country": "Madagascar",
      "#country": "MDG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "414.1427872"
    },
    {
      "country": "Maldives",
      "#country": "MDV",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "6552.484491"
    },
    {
      "country": "Middle East & North Africa (all income levels)",
      "#country": "MEA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "7064.194768"
    },
    {
      "country": "Mexico",
      "#country": "MEX",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "8920.689016"
    },
    {
      "country": "Marshall Islands",
      "#country": "MHL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "3126.516365"
    },
    {
      "country": "Middle income",
      "#country": "MIC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "3835.643788"
    },
    {
      "country": "Macedonia  FYR",
      "#country": "MKD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "4442.299972"
    },
    {
      "country": "Mali",
      "#country": "MLI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "673.6946614"
    },
    {
      "country": "Malta",
      "#country": "MLT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "19695.25572"
    },
    {
      "country": "Middle East & North Africa (developing only)",
      "#country": "MNA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "4004.014842"
    },
    {
      "country": "Montenegro",
      "#country": "MNE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "6636.070538"
    },
    {
      "country": "Mongolia",
      "#country": "MNG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "2285.645378"
    },
    {
      "country": "Mozambique",
      "#country": "MOZ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "424.134902"
    },
    {
      "country": "Mauritania",
      "#country": "MRT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "977.1507912"
    },
    {
      "country": "Mauritius",
      "#country": "MUS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "7772.100057"
    },
    {
      "country": "Malawi",
      "#country": "MWI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "359.5795268"
    },
    {
      "country": "Malaysia",
      "#country": "MYS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "8754.24282"
    },
    {
      "country": "North America",
      "#country": "NAC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "48294.6308"
    },
    {
      "country": "Namibia",
      "#country": "NAM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "5177.681179"
    },
    {
      "country": "Niger",
      "#country": "NER",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "359.801242"
    },
    {
      "country": "Nigeria",
      "#country": "NGA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "2310.860518"
    },
    {
      "country": "Nicaragua",
      "#country": "NIC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1535.192167"
    },
    {
      "country": "Netherlands",
      "#country": "NLD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "50338.25483"
    },
    {
      "country": "High income: nonOECD",
      "#country": "NOC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "16365.20477"
    },
    {
      "country": "Norway",
      "#country": "NOR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "86096.13602"
    },
    {
      "country": "Nepal",
      "#country": "NPL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "595.7716261"
    },
    {
      "country": "New Zealand",
      "#country": "NZL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "32975.5542"
    },
    {
      "country": "High income: OECD",
      "#country": "OEC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "40697.19722"
    },
    {
      "country": "OECD members",
      "#country": "OED",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "35678.05923"
    },
    {
      "country": "Oman",
      "#country": "OMN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "20922.65677"
    },
    {
      "country": "Other small states",
      "#country": "OSS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "4289.169493"
    },
    {
      "country": "Pakistan",
      "#country": "PAK",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1023.195756"
    },
    {
      "country": "Panama",
      "#country": "PAN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "7833.903551"
    },
    {
      "country": "Peru",
      "#country": "PER",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "5075.47667"
    },
    {
      "country": "Philippines",
      "#country": "PHL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "2135.918407"
    },
    {
      "country": "Palau",
      "#country": "PLW",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "9651.133366"
    },
    {
      "country": "Papua New Guinea",
      "#country": "PNG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1416.715753"
    },
    {
      "country": "Poland",
      "#country": "POL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "12484.07315"
    },
    {
      "country": "Puerto Rico",
      "#country": "PRI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "26437.99218"
    },
    {
      "country": "Portugal",
      "#country": "PRT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "22538.65408"
    },
    {
      "country": "Paraguay",
      "#country": "PRY",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "3100.835119"
    },
    {
      "country": "Pacific island small states",
      "#country": "PSS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "2900.098166"
    },
    {
      "country": "Qatar",
      "#country": "QAT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "71510.15575"
    },
    {
      "country": "Romania",
      "#country": "ROU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "8139.146673"
    },
    {
      "country": "Russian Federation",
      "#country": "RUS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "10709.76936"
    },
    {
      "country": "Rwanda",
      "#country": "RWA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "525.8549278"
    },
    {
      "country": "South Asia",
      "#country": "SAS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1298.2767"
    },
    {
      "country": "Saudi Arabia",
      "#country": "SAU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "19326.58255"
    },
    {
      "country": "Sudan",
      "#country": "SDN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1439.523185"
    },
    {
      "country": "Senegal",
      "#country": "SEN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "998.5995764"
    },
    {
      "country": "Singapore",
      "#country": "SGP",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "46569.68843"
    },
    {
      "country": "Solomon Islands",
      "#country": "SLB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1294.692732"
    },
    {
      "country": "Sierra Leone",
      "#country": "SLE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "448.2215321"
    },
    {
      "country": "El Salvador",
      "#country": "SLV",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "3444.456148"
    },
    {
      "country": "Serbia",
      "#country": "SRB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "5399.29762"
    },
    {
      "country": "Sub-Saharan Africa (developing only)",
      "#country": "SSA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1531.10216"
    },
    {
      "country": "South Sudan",
      "#country": "SSD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1582.126751"
    },
    {
      "country": "Sub-Saharan Africa (all income levels)",
      "#country": "SSF",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1543.425419"
    },
    {
      "country": "Small states",
      "#country": "SST",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "5239.689703"
    },
    {
      "country": "Sao Tome and Principe",
      "#country": "STP",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1127.981667"
    },
    {
      "country": "Suriname",
      "#country": "SUR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "8321.392197"
    },
    {
      "country": "Slovak Republic",
      "#country": "SVK",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "16509.89667"
    },
    {
      "country": "Slovenia",
      "#country": "SVN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "23417.64466"
    },
    {
      "country": "Sweden",
      "#country": "SWE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "52076.25591"
    },
    {
      "country": "Swaziland",
      "#country": "SWZ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "3261.603046"
    },
    {
      "country": "Seychelles",
      "#country": "SYC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "10842.82396"
    },
    {
      "country": "Chad",
      "#country": "TCD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "909.2999465"
    },
    {
      "country": "Togo",
      "#country": "TGO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "503.161824"
    },
    {
      "country": "Thailand",
      "#country": "THA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "4802.662758"
    },
    {
      "country": "Tajikistan",
      "#country": "TJK",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "739.7321918"
    },
    {
      "country": "Turkmenistan",
      "#country": "TKM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "4392.719583"
    },
    {
      "country": "Timor-Leste",
      "#country": "TLS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "875.8365693"
    },
    {
      "country": "Tonga",
      "#country": "TON",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "3546.77782"
    },
    {
      "country": "Trinidad and Tobago",
      "#country": "TTO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "15630.05045"
    },
    {
      "country": "Tunisia",
      "#country": "TUN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "4212.154667"
    },
    {
      "country": "Turkey",
      "#country": "TUR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "10135.74889"
    },
    {
      "country": "Tuvalu",
      "#country": "TUV",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "3238.496111"
    },
    {
      "country": "Tanzania",
      "#country": "TZA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "707.9272329"
    },
    {
      "country": "Uganda",
      "#country": "UGA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "553.2625598"
    },
    {
      "country": "Ukraine",
      "#country": "UKR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "2973.996481"
    },
    {
      "country": "Upper middle income",
      "#country": "UMC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "5995.522063"
    },
    {
      "country": "Uruguay",
      "#country": "URY",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "11530.6375"
    },
    {
      "country": "United States",
      "#country": "USA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "48377.39385"
    },
    {
      "country": "Uzbekistan",
      "#country": "UZB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1377.08214"
    },
    {
      "country": "St  Vincent and the Grenadines",
      "#country": "VCT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "6231.713226"
    },
    {
      "country": "Venezuela  RB",
      "#country": "VEN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "13559.1268"
    },
    {
      "country": "Vietnam",
      "#country": "VNM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1333.583526"
    },
    {
      "country": "Vanuatu",
      "#country": "VUT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "2965.75223"
    },
    {
      "country": "West Bank and Gaza",
      "#country": "PSE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "2338.719877"
    },
    {
      "country": "World",
      "#country": "WLD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "9476.718629"
    },
    {
      "country": "Samoa",
      "#country": "WSM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "3456.76966"
    },
    {
      "country": "Yemen  Rep ",
      "#country": "YEM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1394.532356"
    },
    {
      "country": "South Africa",
      "#country": "ZAF",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "7389.960264"
    },
    {
      "country": "Congo  Dem  Rep ",
      "#country": "COD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "346.7042747"
    },
    {
      "country": "Zambia",
      "#country": "ZMB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "1533.284355"
    },
    {
      "country": "Zimbabwe",
      "#country": "ZWE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2010",
      "#year": "2010",
      "#value": "723.1646486"
    },
    {
      "country": "Aruba",
      "#country": "ABW",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "25354.78247"
    },
    {
      "country": "Afghanistan",
      "#country": "AFG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "613.9791916"
    },
    {
      "country": "Angola",
      "#country": "AGO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "5159.233877"
    },
    {
      "country": "Albania",
      "#country": "ALB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "4437.811725"
    },
    {
      "country": "Arab World",
      "#country": "ARB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "7005.479542"
    },
    {
      "country": "United Arab Emirates",
      "#country": "ARE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "38930.00818"
    },
    {
      "country": "Argentina",
      "#country": "ARG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "13693.70379"
    },
    {
      "country": "Armenia",
      "#country": "ARM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "3421.704509"
    },
    {
      "country": "Antigua and Barbuda",
      "#country": "ATG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "12817.84157"
    },
    {
      "country": "Australia",
      "#country": "AUS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "62133.67753"
    },
    {
      "country": "Austria",
      "#country": "AUT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "51134.14791"
    },
    {
      "country": "Azerbaijan",
      "#country": "AZE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "7189.691229"
    },
    {
      "country": "Burundi",
      "#country": "BDI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "246.9143271"
    },
    {
      "country": "Belgium",
      "#country": "BEL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "47814.08305"
    },
    {
      "country": "Benin",
      "#country": "BEN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "745.3918675"
    },
    {
      "country": "Burkina Faso",
      "#country": "BFA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "672.4195863"
    },
    {
      "country": "Bangladesh",
      "#country": "BGD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "841.5274955"
    },
    {
      "country": "Bulgaria",
      "#country": "BGR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "7588.808942"
    },
    {
      "country": "Bahrain",
      "#country": "BHR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "22466.88346"
    },
    {
      "country": "Bahamas  The",
      "#country": "BHS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "21649.81943"
    },
    {
      "country": "Bosnia and Herzegovina",
      "#country": "BIH",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "4771.269282"
    },
    {
      "country": "Belarus",
      "#country": "BLR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "6305.773662"
    },
    {
      "country": "Belize",
      "#country": "BLZ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "4701.547995"
    },
    {
      "country": "Bermuda",
      "#country": "BMU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "85973.15842"
    },
    {
      "country": "Bolivia",
      "#country": "BOL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "2319.595984"
    },
    {
      "country": "Brazil",
      "#country": "BRA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "12576.19559"
    },
    {
      "country": "Barbados",
      "#country": "BRB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "15503.32855"
    },
    {
      "country": "Brunei Darussalam",
      "#country": "BRN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "41059.94509"
    },
    {
      "country": "Bhutan",
      "#country": "BTN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "2495.386975"
    },
    {
      "country": "Botswana",
      "#country": "BWA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "7734.033935"
    },
    {
      "country": "Central African Republic",
      "#country": "CAF",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "494.9260803"
    },
    {
      "country": "Canada",
      "#country": "CAN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "51790.56695"
    },
    {
      "country": "Central Europe and the Baltics",
      "#country": "CEB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "13711.77482"
    },
    {
      "country": "Switzerland",
      "#country": "CHE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "87998.44468"
    },
    {
      "country": "Chile",
      "#country": "CHL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "14510.9661"
    },
    {
      "country": "China",
      "#country": "CHN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "5447.309378"
    },
    {
      "country": "Cote d'Ivoire",
      "#country": "CIV",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1309.008626"
    },
    {
      "country": "Cameroon",
      "#country": "CMR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1256.710574"
    },
    {
      "country": "Congo  Rep ",
      "#country": "COG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "3414.05471"
    },
    {
      "country": "Colombia",
      "#country": "COL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "7124.54892"
    },
    {
      "country": "Comoros",
      "#country": "COM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "808.3572438"
    },
    {
      "country": "Cabo Verde",
      "#country": "CPV",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "3801.449765"
    },
    {
      "country": "Costa Rica",
      "#country": "CRI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "8704.111887"
    },
    {
      "country": "Caribbean small states",
      "#country": "CSS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "9244.102588"
    },
    {
      "country": "Cuba",
      "#country": "CUB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "6051.222001"
    },
    {
      "country": "Cyprus",
      "#country": "CYP",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "29206.5106"
    },
    {
      "country": "Czech Republic",
      "#country": "CZE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "21656.37724"
    },
    {
      "country": "Germany",
      "#country": "DEU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "45870.61961"
    },
    {
      "country": "Djibouti",
      "#country": "DJI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1463.592224"
    },
    {
      "country": "Dominica",
      "#country": "DMA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "7122.008354"
    },
    {
      "country": "Denmark",
      "#country": "DNK",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "61303.92949"
    },
    {
      "country": "Dominican Republic",
      "#country": "DOM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "5729.959962"
    },
    {
      "country": "Algeria",
      "#country": "DZA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "5271.590312"
    },
    {
      "country": "East Asia & Pacific (developing only)",
      "#country": "EAP",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "4700.058167"
    },
    {
      "country": "East Asia & Pacific (all income levels)",
      "#country": "EAS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "8559.791116"
    },
    {
      "country": "Europe & Central Asia (developing only)",
      "#country": "ECA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "6876.735314"
    },
    {
      "country": "Europe & Central Asia (all income levels)",
      "#country": "ECS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "25644.20327"
    },
    {
      "country": "Ecuador",
      "#country": "ECU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "5199.669616"
    },
    {
      "country": "Egypt  Arab Rep ",
      "#country": "EGY",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "2972.583516"
    },
    {
      "country": "Euro area",
      "#country": "EMU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "40420.62883"
    },
    {
      "country": "Eritrea",
      "#country": "ERI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "439.5423714"
    },
    {
      "country": "Spain",
      "#country": "ESP",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "31975.00792"
    },
    {
      "country": "Estonia",
      "#country": "EST",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "17178.51738"
    },
    {
      "country": "Ethiopia",
      "#country": "ETH",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "357.4411931"
    },
    {
      "country": "European Union",
      "#country": "EUU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "36181.2097"
    },
    {
      "country": "Fragile and conflict affected situations",
      "#country": "FCS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1383.48451"
    },
    {
      "country": "Finland",
      "#country": "FIN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "50790.72415"
    },
    {
      "country": "Fiji",
      "#country": "FJI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "4201.330842"
    },
    {
      "country": "France",
      "#country": "FRA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "43809.65647"
    },
    {
      "country": "Micronesia  Fed  Sts ",
      "#country": "FSM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "3000.149869"
    },
    {
      "country": "Gabon",
      "#country": "GAB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "11791.58778"
    },
    {
      "country": "United Kingdom",
      "#country": "GBR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "40972.02729"
    },
    {
      "country": "Georgia",
      "#country": "GEO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "3219.605871"
    },
    {
      "country": "Ghana",
      "#country": "GHA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1594.022815"
    },
    {
      "country": "Guinea",
      "#country": "GIN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "454.0022776"
    },
    {
      "country": "Gambia  The",
      "#country": "GMB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "521.195244"
    },
    {
      "country": "Guinea-Bissau",
      "#country": "GNB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "679.4932985"
    },
    {
      "country": "Equatorial Guinea",
      "#country": "GNQ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "21963.40754"
    },
    {
      "country": "Greece",
      "#country": "GRC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "25963.99639"
    },
    {
      "country": "Grenada",
      "#country": "GRD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "7410.478833"
    },
    {
      "country": "Guatemala",
      "#country": "GTM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "3240.375913"
    },
    {
      "country": "Guyana",
      "#country": "GUY",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "3257.884864"
    },
    {
      "country": "High income",
      "#country": "HIC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "38839.40711"
    },
    {
      "country": "Hong Kong SAR  China",
      "#country": "HKG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "35142.54243"
    },
    {
      "country": "Honduras",
      "#country": "HND",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "2277.366515"
    },
    {
      "country": "Heavily indebted poor countries (HIPC)",
      "#country": "HPC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "806.8114586"
    },
    {
      "country": "Croatia",
      "#country": "HRV",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "14540.27354"
    },
    {
      "country": "Haiti",
      "#country": "HTI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "749.2211756"
    },
    {
      "country": "Hungary",
      "#country": "HUN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "13983.49764"
    },
    {
      "country": "Indonesia",
      "#country": "IDN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "3469.753726"
    },
    {
      "country": "India",
      "#country": "IND",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1509.238884"
    },
    {
      "country": "Ireland",
      "#country": "IRL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "51951.59194"
    },
    {
      "country": "Iran  Islamic Rep ",
      "#country": "IRN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "7006.047183"
    },
    {
      "country": "Iraq",
      "#country": "IRQ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "5848.537389"
    },
    {
      "country": "Iceland",
      "#country": "ISL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "45972.25663"
    },
    {
      "country": "Israel",
      "#country": "ISR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "33276.35938"
    },
    {
      "country": "Italy",
      "#country": "ITA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "38367.32116"
    },
    {
      "country": "Jamaica",
      "#country": "JAM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "5346.219339"
    },
    {
      "country": "Jordan",
      "#country": "JOR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "4665.954276"
    },
    {
      "country": "Japan",
      "#country": "JPN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "46203.69804"
    },
    {
      "country": "Kazakhstan",
      "#country": "KAZ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "11357.94549"
    },
    {
      "country": "Kenya",
      "#country": "KEN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "998.2654057"
    },
    {
      "country": "Kyrgyz Republic",
      "#country": "KGZ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1123.883168"
    },
    {
      "country": "Cambodia",
      "#country": "KHM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "878.3830178"
    },
    {
      "country": "Kiribati",
      "#country": "KIR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1735.554046"
    },
    {
      "country": "St  Kitts and Nevis",
      "#country": "KNA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "13744.32481"
    },
    {
      "country": "Korea  Rep ",
      "#country": "KOR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "24155.8293"
    },
    {
      "country": "Kuwait",
      "#country": "KWT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "49294.96686"
    },
    {
      "country": "Latin America & Caribbean (developing only)",
      "#country": "LAC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "9549.02029"
    },
    {
      "country": "Lao PDR",
      "#country": "LAO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1265.709344"
    },
    {
      "country": "Lebanon",
      "#country": "LBN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "9144.617616"
    },
    {
      "country": "Liberia",
      "#country": "LBR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "376.9284544"
    },
    {
      "country": "Libya",
      "#country": "LBY",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "5685.412227"
    },
    {
      "country": "St  Lucia",
      "#country": "LCA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "7193.198297"
    },
    {
      "country": "Latin America & Caribbean (all income levels)",
      "#country": "LCN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "9886.225703"
    },
    {
      "country": "Least developed countries: UN classification",
      "#country": "LDC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "831.2505505"
    },
    {
      "country": "Low income",
      "#country": "LIC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "641.6863419"
    },
    {
      "country": "Sri Lanka",
      "#country": "LKA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "2835.689967"
    },
    {
      "country": "Lower middle income",
      "#country": "LMC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1944.035252"
    },
    {
      "country": "Low & middle income",
      "#country": "LMY",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "3861.326678"
    },
    {
      "country": "Lesotho",
      "#country": "LSO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1225.594661"
    },
    {
      "country": "Lithuania",
      "#country": "LTU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "14227.68554"
    },
    {
      "country": "Luxembourg",
      "#country": "LUX",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "113738.726"
    },
    {
      "country": "Latvia",
      "#country": "LVA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "13827.36026"
    },
    {
      "country": "Macao SAR  China",
      "#country": "MAC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "67062.45318"
    },
    {
      "country": "Morocco",
      "#country": "MAR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "3044.107888"
    },
    {
      "country": "Monaco",
      "#country": "MCO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "163025.859"
    },
    {
      "country": "Moldova",
      "#country": "MDA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1970.840003"
    },
    {
      "country": "Madagascar",
      "#country": "MDG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "456.3278968"
    },
    {
      "country": "Maldives",
      "#country": "MDV",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "6515.737026"
    },
    {
      "country": "Middle East & North Africa (all income levels)",
      "#country": "MEA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "8270.762731"
    },
    {
      "country": "Mexico",
      "#country": "MEX",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "9802.894353"
    },
    {
      "country": "Marshall Islands",
      "#country": "MHL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "3294.727117"
    },
    {
      "country": "Middle income",
      "#country": "MIC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "4397.107639"
    },
    {
      "country": "Macedonia  FYR",
      "#country": "MKD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "4940.953345"
    },
    {
      "country": "Mali",
      "#country": "MLI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "738.554478"
    },
    {
      "country": "Malta",
      "#country": "MLT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "22346.31841"
    },
    {
      "country": "Middle East & North Africa (developing only)",
      "#country": "MNA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "4504.595586"
    },
    {
      "country": "Montenegro",
      "#country": "MNE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "7253.359249"
    },
    {
      "country": "Mongolia",
      "#country": "MNG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "3181.104401"
    },
    {
      "country": "Mozambique",
      "#country": "MOZ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "538.8178792"
    },
    {
      "country": "Mauritania",
      "#country": "MRT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1117.026296"
    },
    {
      "country": "Mauritius",
      "#country": "MUS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "8984.645418"
    },
    {
      "country": "Malawi",
      "#country": "MWI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "364.0877729"
    },
    {
      "country": "Malaysia",
      "#country": "MYS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "10068.10726"
    },
    {
      "country": "North America",
      "#country": "NAC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "50007.4783"
    },
    {
      "country": "Namibia",
      "#country": "NAM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "5597.172041"
    },
    {
      "country": "Niger",
      "#country": "NER",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "388.164882"
    },
    {
      "country": "Nigeria",
      "#country": "NGA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "2507.682969"
    },
    {
      "country": "Nicaragua",
      "#country": "NIC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1676.262745"
    },
    {
      "country": "Netherlands",
      "#country": "NLD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "53540.60536"
    },
    {
      "country": "High income: nonOECD",
      "#country": "NOC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "19608.82702"
    },
    {
      "country": "Norway",
      "#country": "NOR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "99091.0945"
    },
    {
      "country": "Nepal",
      "#country": "NPL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "694.1411512"
    },
    {
      "country": "New Zealand",
      "#country": "NZL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "37372.54667"
    },
    {
      "country": "High income: OECD",
      "#country": "OEC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "43426.15559"
    },
    {
      "country": "OECD members",
      "#country": "OED",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "38056.05307"
    },
    {
      "country": "Oman",
      "#country": "OMN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "22984.18895"
    },
    {
      "country": "Other small states",
      "#country": "OSS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "4968.59892"
    },
    {
      "country": "Pakistan",
      "#country": "PAK",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1212.418884"
    },
    {
      "country": "Panama",
      "#country": "PAN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "8895.184909"
    },
    {
      "country": "Peru",
      "#country": "PER",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "5759.409077"
    },
    {
      "country": "Philippines",
      "#country": "PHL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "2358.072251"
    },
    {
      "country": "Palau",
      "#country": "PLW",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "10549.23323"
    },
    {
      "country": "Papua New Guinea",
      "#country": "PNG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1835.623457"
    },
    {
      "country": "Poland",
      "#country": "POL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "13607.73936"
    },
    {
      "country": "Puerto Rico",
      "#country": "PRI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "27220.80356"
    },
    {
      "country": "Portugal",
      "#country": "PRT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "23196.18375"
    },
    {
      "country": "Paraguay",
      "#country": "PRY",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "3814.213163"
    },
    {
      "country": "Pacific island small states",
      "#country": "PSS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "3316.152718"
    },
    {
      "country": "Qatar",
      "#country": "QAT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "88861.00147"
    },
    {
      "country": "Romania",
      "#country": "ROU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "9063.676031"
    },
    {
      "country": "Russian Federation",
      "#country": "RUS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "13324.28784"
    },
    {
      "country": "Rwanda",
      "#country": "RWA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "574.8874668"
    },
    {
      "country": "South Asia",
      "#country": "SAS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1403.313356"
    },
    {
      "country": "Saudi Arabia",
      "#country": "SAU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "24116.17413"
    },
    {
      "country": "Sudan",
      "#country": "SDN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1617.452888"
    },
    {
      "country": "Senegal",
      "#country": "SEN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1083.261675"
    },
    {
      "country": "Singapore",
      "#country": "SGP",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "52870.5448"
    },
    {
      "country": "Solomon Islands",
      "#country": "SLB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1614.459079"
    },
    {
      "country": "Sierra Leone",
      "#country": "SLE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "498.7462141"
    },
    {
      "country": "El Salvador",
      "#country": "SLV",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "3698.546188"
    },
    {
      "country": "Serbia",
      "#country": "SRB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "6422.71374"
    },
    {
      "country": "Sub-Saharan Africa (developing only)",
      "#country": "SSA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1673.849067"
    },
    {
      "country": "South Sudan",
      "#country": "SSD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1813.950983"
    },
    {
      "country": "Sub-Saharan Africa (all income levels)",
      "#country": "SSF",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1690.346244"
    },
    {
      "country": "Small states",
      "#country": "SST",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "5874.273316"
    },
    {
      "country": "Sao Tome and Principe",
      "#country": "STP",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1355.447344"
    },
    {
      "country": "Suriname",
      "#country": "SUR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "8349.41533"
    },
    {
      "country": "Slovak Republic",
      "#country": "SVK",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "18065.66306"
    },
    {
      "country": "Slovenia",
      "#country": "SVN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "24964.82224"
    },
    {
      "country": "Sweden",
      "#country": "SWE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "59593.28711"
    },
    {
      "country": "Swaziland",
      "#country": "SWZ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "3420.170607"
    },
    {
      "country": "Seychelles",
      "#country": "SYC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "12117.83664"
    },
    {
      "country": "Chad",
      "#country": "TCD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1006.319801"
    },
    {
      "country": "Togo",
      "#country": "TGO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "580.3224088"
    },
    {
      "country": "Thailand",
      "#country": "THA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "5192.118907"
    },
    {
      "country": "Tajikistan",
      "#country": "TJK",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "834.6586566"
    },
    {
      "country": "Turkmenistan",
      "#country": "TKM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "5724.541586"
    },
    {
      "country": "Timor-Leste",
      "#country": "TLS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1002.327757"
    },
    {
      "country": "Tonga",
      "#country": "TON",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "4046.11987"
    },
    {
      "country": "Trinidad and Tobago",
      "#country": "TTO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "17760.60909"
    },
    {
      "country": "Tunisia",
      "#country": "TUN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "4305.012769"
    },
    {
      "country": "Turkey",
      "#country": "TUR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "10604.5524"
    },
    {
      "country": "Tuvalu",
      "#country": "TUV",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "3993.651838"
    },
    {
      "country": "Tanzania",
      "#country": "TZA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "740.176636"
    },
    {
      "country": "Uganda",
      "#country": "UGA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "530.9340001"
    },
    {
      "country": "Ukraine",
      "#country": "UKR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "3575.490646"
    },
    {
      "country": "Upper middle income",
      "#country": "UMC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "6967.352501"
    },
    {
      "country": "Uruguay",
      "#country": "URY",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "13960.95939"
    },
    {
      "country": "United States",
      "#country": "USA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "49803.49286"
    },
    {
      "country": "Uzbekistan",
      "#country": "UZB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1544.827773"
    },
    {
      "country": "St  Vincent and the Grenadines",
      "#country": "VCT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "6185.310158"
    },
    {
      "country": "Venezuela  RB",
      "#country": "VEN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "10727.98209"
    },
    {
      "country": "Vietnam",
      "#country": "VNM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1543.02695"
    },
    {
      "country": "Vanuatu",
      "#country": "VUT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "3276.351449"
    },
    {
      "country": "West Bank and Gaza",
      "#country": "PSE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "2664.951385"
    },
    {
      "country": "World",
      "#country": "WLD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "10356.43423"
    },
    {
      "country": "Samoa",
      "#country": "WSM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "3932.443426"
    },
    {
      "country": "Yemen  Rep ",
      "#country": "YEM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1253.305807"
    },
    {
      "country": "South Africa",
      "#country": "ZAF",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "8080.865243"
    },
    {
      "country": "Congo  Dem  Rep ",
      "#country": "COD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "404.1105577"
    },
    {
      "country": "Zambia",
      "#country": "ZMB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "1740.666707"
    },
    {
      "country": "Zimbabwe",
      "#country": "ZWE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2011",
      "#year": "2011",
      "#value": "820.154314"
    },
    {
      "country": "Afghanistan",
      "#country": "AFG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "687.5813677"
    },
    {
      "country": "Angola",
      "#country": "AGO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "5539.800724"
    },
    {
      "country": "Albania",
      "#country": "ALB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "4256.016702"
    },
    {
      "country": "Arab World",
      "#country": "ARB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "7571.402403"
    },
    {
      "country": "United Arab Emirates",
      "#country": "ARE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "40444.06699"
    },
    {
      "country": "Argentina",
      "#country": "ARG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "14679.92524"
    },
    {
      "country": "Armenia",
      "#country": "ARM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "3353.973125"
    },
    {
      "country": "Antigua and Barbuda",
      "#country": "ATG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "13525.61622"
    },
    {
      "country": "Australia",
      "#country": "AUS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "67511.68833"
    },
    {
      "country": "Austria",
      "#country": "AUT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "48348.23206"
    },
    {
      "country": "Azerbaijan",
      "#country": "AZE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "7393.771877"
    },
    {
      "country": "Burundi",
      "#country": "BDI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "251.014523"
    },
    {
      "country": "Belgium",
      "#country": "BEL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "44827.66283"
    },
    {
      "country": "Benin",
      "#country": "BEN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "750.5131242"
    },
    {
      "country": "Burkina Faso",
      "#country": "BFA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "705.4549629"
    },
    {
      "country": "Bangladesh",
      "#country": "BGD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "862.0538953"
    },
    {
      "country": "Bulgaria",
      "#country": "BGR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "7198.045618"
    },
    {
      "country": "Bahrain",
      "#country": "BHR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "23339.01944"
    },
    {
      "country": "Bahamas  The",
      "#country": "BHS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "22096.46199"
    },
    {
      "country": "Bosnia and Herzegovina",
      "#country": "BIH",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "4409.59212"
    },
    {
      "country": "Belarus",
      "#country": "BLR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "6721.834908"
    },
    {
      "country": "Belize",
      "#country": "BLZ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "4856.715732"
    },
    {
      "country": "Bermuda",
      "#country": "BMU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "84470.75527"
    },
    {
      "country": "Bolivia",
      "#country": "BOL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "2575.683695"
    },
    {
      "country": "Brazil",
      "#country": "BRA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "11319.97371"
    },
    {
      "country": "Barbados",
      "#country": "BRB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "14917.14951"
    },
    {
      "country": "Brunei Darussalam",
      "#country": "BRN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "41126.61284"
    },
    {
      "country": "Bhutan",
      "#country": "BTN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "2458.395828"
    },
    {
      "country": "Botswana",
      "#country": "BWA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "7254.560471"
    },
    {
      "country": "Central African Republic",
      "#country": "CAF",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "479.4709839"
    },
    {
      "country": "Canada",
      "#country": "CAN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "52412.48679"
    },
    {
      "country": "Central Europe and the Baltics",
      "#country": "CEB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "12840.31087"
    },
    {
      "country": "Switzerland",
      "#country": "CHE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "83295.25883"
    },
    {
      "country": "Chile",
      "#country": "CHL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "15245.468"
    },
    {
      "country": "China",
      "#country": "CHN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "6092.781886"
    },
    {
      "country": "Cote d'Ivoire",
      "#country": "CIV",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1365.873574"
    },
    {
      "country": "Cameroon",
      "#country": "CMR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1219.931075"
    },
    {
      "country": "Congo  Rep ",
      "#country": "COG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "3153.739525"
    },
    {
      "country": "Colombia",
      "#country": "COL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "7762.970829"
    },
    {
      "country": "Comoros",
      "#country": "COM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "767.2114252"
    },
    {
      "country": "Cabo Verde",
      "#country": "CPV",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "3554.411133"
    },
    {
      "country": "Costa Rica",
      "#country": "CRI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "9442.66454"
    },
    {
      "country": "Caribbean small states",
      "#country": "CSS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "9384.84336"
    },
    {
      "country": "Cyprus",
      "#country": "CYP",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "26352.27122"
    },
    {
      "country": "Czech Republic",
      "#country": "CZE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "19670.40261"
    },
    {
      "country": "Germany",
      "#country": "DEU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "43931.69171"
    },
    {
      "country": "Djibouti",
      "#country": "DJI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1574.628968"
    },
    {
      "country": "Dominica",
      "#country": "DMA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "7181.725557"
    },
    {
      "country": "Denmark",
      "#country": "DNK",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "57636.12531"
    },
    {
      "country": "Dominican Republic",
      "#country": "DOM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "5870.769044"
    },
    {
      "country": "Algeria",
      "#country": "DZA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "5309.822369"
    },
    {
      "country": "East Asia & Pacific (developing only)",
      "#country": "EAP",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "5187.308918"
    },
    {
      "country": "East Asia & Pacific (all income levels)",
      "#country": "EAS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "9085.010446"
    },
    {
      "country": "Europe & Central Asia (developing only)",
      "#country": "ECA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "6928.445136"
    },
    {
      "country": "Europe & Central Asia (all income levels)",
      "#country": "ECS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "24571.99982"
    },
    {
      "country": "Ecuador",
      "#country": "ECU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "5655.946155"
    },
    {
      "country": "Egypt  Arab Rep ",
      "#country": "EGY",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "3256.018469"
    },
    {
      "country": "Euro area",
      "#country": "EMU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "37664.03485"
    },
    {
      "country": "Eritrea",
      "#country": "ERI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "504.3234084"
    },
    {
      "country": "Spain",
      "#country": "ESP",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "28985.33333"
    },
    {
      "country": "Estonia",
      "#country": "EST",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "17132.24672"
    },
    {
      "country": "Ethiopia",
      "#country": "ETH",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "472.160306"
    },
    {
      "country": "European Union",
      "#country": "EUU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "34121.16474"
    },
    {
      "country": "Fragile and conflict affected situations",
      "#country": "FCS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1560.095349"
    },
    {
      "country": "Finland",
      "#country": "FIN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "47243.73771"
    },
    {
      "country": "Fiji",
      "#country": "FJI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "4401.096566"
    },
    {
      "country": "France",
      "#country": "FRA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "40925.21229"
    },
    {
      "country": "Micronesia  Fed  Sts ",
      "#country": "FSM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "3154.514242"
    },
    {
      "country": "Gabon",
      "#country": "GAB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "10929.87964"
    },
    {
      "country": "United Kingdom",
      "#country": "GBR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "41050.77194"
    },
    {
      "country": "Georgia",
      "#country": "GEO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "3528.731511"
    },
    {
      "country": "Ghana",
      "#country": "GHA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1645.516293"
    },
    {
      "country": "Guinea",
      "#country": "GIN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "493.4899526"
    },
    {
      "country": "Gambia  The",
      "#country": "GMB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "509.3875908"
    },
    {
      "country": "Guinea-Bissau",
      "#country": "GNB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "576.3898489"
    },
    {
      "country": "Equatorial Guinea",
      "#country": "GNQ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "22404.75465"
    },
    {
      "country": "Greece",
      "#country": "GRC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "22494.41293"
    },
    {
      "country": "Grenada",
      "#country": "GRD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "7583.043088"
    },
    {
      "country": "Guatemala",
      "#country": "GTM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "3340.782301"
    },
    {
      "country": "Guyana",
      "#country": "GUY",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "3584.693489"
    },
    {
      "country": "High income",
      "#country": "HIC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "38818.3734"
    },
    {
      "country": "Hong Kong SAR  China",
      "#country": "HKG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "36707.86433"
    },
    {
      "country": "Honduras",
      "#country": "HND",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "2339.292439"
    },
    {
      "country": "Heavily indebted poor countries (HIPC)",
      "#country": "HPC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "843.5546381"
    },
    {
      "country": "Croatia",
      "#country": "HRV",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "13234.62176"
    },
    {
      "country": "Haiti",
      "#country": "HTI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "775.5446241"
    },
    {
      "country": "Hungary",
      "#country": "HUN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "12784.29561"
    },
    {
      "country": "Indonesia",
      "#country": "IDN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "3551.423737"
    },
    {
      "country": "India",
      "#country": "IND",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1484.46503"
    },
    {
      "country": "Ireland",
      "#country": "IRL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "48391.32573"
    },
    {
      "country": "Iran  Islamic Rep ",
      "#country": "IRN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "6578.121526"
    },
    {
      "country": "Iraq",
      "#country": "IRQ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "6631.558745"
    },
    {
      "country": "Iceland",
      "#country": "ISL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "44221.72548"
    },
    {
      "country": "Israel",
      "#country": "ISR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "32514.55143"
    },
    {
      "country": "Italy",
      "#country": "ITA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "35132.19152"
    },
    {
      "country": "Jamaica",
      "#country": "JAM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "5463.762007"
    },
    {
      "country": "Jordan",
      "#country": "JOR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "4909.028101"
    },
    {
      "country": "Japan",
      "#country": "JPN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "46679.26543"
    },
    {
      "country": "Kazakhstan",
      "#country": "KAZ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "12120.30534"
    },
    {
      "country": "Kenya",
      "#country": "KEN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1165.744938"
    },
    {
      "country": "Kyrgyz Republic",
      "#country": "KGZ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1177.974735"
    },
    {
      "country": "Cambodia",
      "#country": "KHM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "945.4946464"
    },
    {
      "country": "Kiribati",
      "#country": "KIR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1736.198171"
    },
    {
      "country": "St  Kitts and Nevis",
      "#country": "KNA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "13659.29921"
    },
    {
      "country": "Korea  Rep ",
      "#country": "KOR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "24453.97135"
    },
    {
      "country": "Kuwait",
      "#country": "KWT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "53544.04344"
    },
    {
      "country": "Latin America & Caribbean (developing only)",
      "#country": "LAC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "9412.878571"
    },
    {
      "country": "Lao PDR",
      "#country": "LAO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1408.28"
    },
    {
      "country": "Lebanon",
      "#country": "LBN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "9764.110607"
    },
    {
      "country": "Liberia",
      "#country": "LBR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "413.7585727"
    },
    {
      "country": "Libya",
      "#country": "LBY",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "13302.79085"
    },
    {
      "country": "St  Lucia",
      "#country": "LCA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "7202.226481"
    },
    {
      "country": "Latin America & Caribbean (all income levels)",
      "#country": "LCN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "9780.976491"
    },
    {
      "country": "Least developed countries: UN classification",
      "#country": "LDC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "863.347689"
    },
    {
      "country": "Low income",
      "#country": "LIC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "696.4816544"
    },
    {
      "country": "Sri Lanka",
      "#country": "LKA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "2921.736345"
    },
    {
      "country": "Lower middle income",
      "#country": "LMC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1989.365583"
    },
    {
      "country": "Low & middle income",
      "#country": "LMY",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "4024.812072"
    },
    {
      "country": "Lesotho",
      "#country": "LSO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1134.859697"
    },
    {
      "country": "Lithuania",
      "#country": "LTU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "14172.28123"
    },
    {
      "country": "Luxembourg",
      "#country": "LUX",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "106022.7991"
    },
    {
      "country": "Latvia",
      "#country": "LVA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "13946.96589"
    },
    {
      "country": "Macao SAR  China",
      "#country": "MAC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "77196.13879"
    },
    {
      "country": "Morocco",
      "#country": "MAR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "2899.974924"
    },
    {
      "country": "Moldova",
      "#country": "MDA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "2046.536787"
    },
    {
      "country": "Madagascar",
      "#country": "MDG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "444.9546285"
    },
    {
      "country": "Maldives",
      "#country": "MDV",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "6243.844746"
    },
    {
      "country": "Middle East & North Africa (all income levels)",
      "#country": "MEA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "8702.631759"
    },
    {
      "country": "Mexico",
      "#country": "MEX",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "9817.837489"
    },
    {
      "country": "Marshall Islands",
      "#country": "MHL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "3507.919323"
    },
    {
      "country": "Middle income",
      "#country": "MIC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "4585.353087"
    },
    {
      "country": "Macedonia  FYR",
      "#country": "MKD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "4548.155553"
    },
    {
      "country": "Mali",
      "#country": "MLI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "696.1823129"
    },
    {
      "country": "Malta",
      "#country": "MLT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "21129.98277"
    },
    {
      "country": "Middle East & North Africa (developing only)",
      "#country": "MNA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "4701.287223"
    },
    {
      "country": "Montenegro",
      "#country": "MNE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "6514.148643"
    },
    {
      "country": "Mongolia",
      "#country": "MNG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "3691.052262"
    },
    {
      "country": "Mozambique",
      "#country": "MOZ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "593.2909771"
    },
    {
      "country": "Mauritania",
      "#country": "MRT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1042.822867"
    },
    {
      "country": "Mauritius",
      "#country": "MUS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "9110.805399"
    },
    {
      "country": "Malawi",
      "#country": "MWI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "266.5889656"
    },
    {
      "country": "Malaysia",
      "#country": "MYS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "10439.96491"
    },
    {
      "country": "North America",
      "#country": "NAC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "51593.35645"
    },
    {
      "country": "Namibia",
      "#country": "NAM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "5770.307964"
    },
    {
      "country": "Niger",
      "#country": "NER",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "385.3427082"
    },
    {
      "country": "Nigeria",
      "#country": "NGA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "2742.219341"
    },
    {
      "country": "Nicaragua",
      "#country": "NIC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1776.605802"
    },
    {
      "country": "Netherlands",
      "#country": "NLD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "49128.08727"
    },
    {
      "country": "High income: nonOECD",
      "#country": "NOC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "20650.73396"
    },
    {
      "country": "Norway",
      "#country": "NOR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "99635.87453"
    },
    {
      "country": "Nepal",
      "#country": "NPL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "699.0804821"
    },
    {
      "country": "New Zealand",
      "#country": "NZL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "38896.89371"
    },
    {
      "country": "High income: OECD",
      "#country": "OEC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "43177.51382"
    },
    {
      "country": "OECD members",
      "#country": "OED",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "37804.68188"
    },
    {
      "country": "Oman",
      "#country": "OMN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "23384.8058"
    },
    {
      "country": "Other small states",
      "#country": "OSS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "4833.428392"
    },
    {
      "country": "Pakistan",
      "#country": "PAK",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1252.419523"
    },
    {
      "country": "Panama",
      "#country": "PAN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "9982.481568"
    },
    {
      "country": "Peru",
      "#country": "PER",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "6423.562055"
    },
    {
      "country": "Philippines",
      "#country": "PHL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "2587.616557"
    },
    {
      "country": "Palau",
      "#country": "PLW",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "11201.6286"
    },
    {
      "country": "Papua New Guinea",
      "#country": "PNG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "2147.516579"
    },
    {
      "country": "Poland",
      "#country": "POL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "12876.46299"
    },
    {
      "country": "Puerto Rico",
      "#country": "PRI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "27681.63558"
    },
    {
      "country": "Portugal",
      "#country": "PRT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "20732.61385"
    },
    {
      "country": "Paraguay",
      "#country": "PRY",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "3680.232059"
    },
    {
      "country": "Pacific island small states",
      "#country": "PSS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "3485.76822"
    },
    {
      "country": "Qatar",
      "#country": "QAT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "92801.039"
    },
    {
      "country": "Romania",
      "#country": "ROU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "8445.29664"
    },
    {
      "country": "Russian Federation",
      "#country": "RUS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "14090.64892"
    },
    {
      "country": "Rwanda",
      "#country": "RWA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "630.1083981"
    },
    {
      "country": "South Asia",
      "#country": "SAS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1392.512929"
    },
    {
      "country": "Saudi Arabia",
      "#country": "SAU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "25945.96633"
    },
    {
      "country": "Sudan",
      "#country": "SDN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1697.852323"
    },
    {
      "country": "Senegal",
      "#country": "SEN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1023.288572"
    },
    {
      "country": "Singapore",
      "#country": "SGP",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "54007.30365"
    },
    {
      "country": "Solomon Islands",
      "#country": "SLB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1801.155601"
    },
    {
      "country": "Sierra Leone",
      "#country": "SLE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "590.3180567"
    },
    {
      "country": "El Salvador",
      "#country": "SLV",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "3781.500729"
    },
    {
      "country": "Serbia",
      "#country": "SRB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "5666.204793"
    },
    {
      "country": "Sub-Saharan Africa (developing only)",
      "#country": "SSA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1708.703608"
    },
    {
      "country": "South Sudan",
      "#country": "SSD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "956.7660454"
    },
    {
      "country": "Sub-Saharan Africa (all income levels)",
      "#country": "SSF",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1725.549961"
    },
    {
      "country": "Small states",
      "#country": "SST",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "5820.387728"
    },
    {
      "country": "Sao Tome and Principe",
      "#country": "STP",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1399.953483"
    },
    {
      "country": "Suriname",
      "#country": "SUR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "9378.196065"
    },
    {
      "country": "Slovak Republic",
      "#country": "SVK",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "17151.23997"
    },
    {
      "country": "Slovenia",
      "#country": "SVN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "22488.44415"
    },
    {
      "country": "Sweden",
      "#country": "SWE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "57134.07707"
    },
    {
      "country": "Swaziland",
      "#country": "SWZ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "3289.741968"
    },
    {
      "country": "Seychelles",
      "#country": "SYC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "11689.31624"
    },
    {
      "country": "Chad",
      "#country": "TCD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1035.258019"
    },
    {
      "country": "Togo",
      "#country": "TGO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "589.462089"
    },
    {
      "country": "Thailand",
      "#country": "THA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "5479.76058"
    },
    {
      "country": "Tajikistan",
      "#country": "TJK",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "953.0602226"
    },
    {
      "country": "Turkmenistan",
      "#country": "TKM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "6797.734307"
    },
    {
      "country": "Timor-Leste",
      "#country": "TLS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1105.349369"
    },
    {
      "country": "Tonga",
      "#country": "TON",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "4493.720255"
    },
    {
      "country": "Trinidad and Tobago",
      "#country": "TTO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "17523.29827"
    },
    {
      "country": "Tunisia",
      "#country": "TUN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "4197.505881"
    },
    {
      "country": "Turkey",
      "#country": "TUR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "10660.72864"
    },
    {
      "country": "Tuvalu",
      "#country": "TUV",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "4044.189464"
    },
    {
      "country": "Tanzania",
      "#country": "TZA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "834.8429636"
    },
    {
      "country": "Uganda",
      "#country": "UGA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "652.7496163"
    },
    {
      "country": "Ukraine",
      "#country": "UKR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "3873.451337"
    },
    {
      "country": "Upper middle income",
      "#country": "UMC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "7324.306288"
    },
    {
      "country": "Uruguay",
      "#country": "URY",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "14727.72564"
    },
    {
      "country": "United States",
      "#country": "USA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "51495.87485"
    },
    {
      "country": "Uzbekistan",
      "#country": "UZB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1719.036196"
    },
    {
      "country": "St  Vincent and the Grenadines",
      "#country": "VCT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "6338.899742"
    },
    {
      "country": "Venezuela  RB",
      "#country": "VEN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "12728.72638"
    },
    {
      "country": "Vietnam",
      "#country": "VNM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1755.265424"
    },
    {
      "country": "Vanuatu",
      "#country": "VUT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "3161.435538"
    },
    {
      "country": "West Bank and Gaza",
      "#country": "PSE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "2782.905026"
    },
    {
      "country": "World",
      "#country": "WLD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "10438.62858"
    },
    {
      "country": "Samoa",
      "#country": "WSM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "4244.839691"
    },
    {
      "country": "Yemen  Rep ",
      "#country": "YEM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1341.281768"
    },
    {
      "country": "South Africa",
      "#country": "ZAF",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "7592.250473"
    },
    {
      "country": "Congo  Dem  Rep ",
      "#country": "COD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "446.0266545"
    },
    {
      "country": "Zambia",
      "#country": "ZMB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "1771.891151"
    },
    {
      "country": "Zimbabwe",
      "#country": "ZWE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2012",
      "#year": "2012",
      "#value": "908.7823241"
    },
    {
      "country": "Afghanistan",
      "#country": "AFG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "664.7645892"
    },
    {
      "country": "Angola",
      "#country": "AGO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "5783.36676"
    },
    {
      "country": "Albania",
      "#country": "ALB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "4460.340971"
    },
    {
      "country": "Arab World",
      "#country": "ARB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "7715.977809"
    },
    {
      "country": "United Arab Emirates",
      "#country": "ARE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "43048.85015"
    },
    {
      "country": "Argentina",
      "#country": "ARG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "14715.18002"
    },
    {
      "country": "Armenia",
      "#country": "ARM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "3504.766758"
    },
    {
      "country": "Antigua and Barbuda",
      "#country": "ATG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "13342.085"
    },
    {
      "country": "Australia",
      "#country": "AUS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "67463.02193"
    },
    {
      "country": "Austria",
      "#country": "AUT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "50510.71203"
    },
    {
      "country": "Azerbaijan",
      "#country": "AZE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "7811.621418"
    },
    {
      "country": "Burundi",
      "#country": "BDI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "267.1093219"
    },
    {
      "country": "Belgium",
      "#country": "BEL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "46929.63546"
    },
    {
      "country": "Benin",
      "#country": "BEN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "804.6924986"
    },
    {
      "country": "Burkina Faso",
      "#country": "BFA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "760.8529512"
    },
    {
      "country": "Bangladesh",
      "#country": "BGD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "957.824266"
    },
    {
      "country": "Bulgaria",
      "#country": "BGR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "7498.831484"
    },
    {
      "country": "Bahrain",
      "#country": "BHR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "24689.10563"
    },
    {
      "country": "Bahamas  The",
      "#country": "BHS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "22312.08297"
    },
    {
      "country": "Bosnia and Herzegovina",
      "#country": "BIH",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "4661.764245"
    },
    {
      "country": "Belarus",
      "#country": "BLR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "7575.48211"
    },
    {
      "country": "Belize",
      "#country": "BLZ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "4893.926635"
    },
    {
      "country": "Bolivia",
      "#country": "BOL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "2867.639791"
    },
    {
      "country": "Brazil",
      "#country": "BRA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "11208.08274"
    },
    {
      "country": "Brunei Darussalam",
      "#country": "BRN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "38563.31451"
    },
    {
      "country": "Bhutan",
      "#country": "BTN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "2362.581737"
    },
    {
      "country": "Botswana",
      "#country": "BWA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "7315.019289"
    },
    {
      "country": "Central African Republic",
      "#country": "CAF",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "333.1968806"
    },
    {
      "country": "Canada",
      "#country": "CAN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "51964.33023"
    },
    {
      "country": "Central Europe and the Baltics",
      "#country": "CEB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "13605.75633"
    },
    {
      "country": "Switzerland",
      "#country": "CHE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "84748.36531"
    },
    {
      "country": "Chile",
      "#country": "CHL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "15732.31377"
    },
    {
      "country": "China",
      "#country": "CHN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "6807.430824"
    },
    {
      "country": "Cote d'Ivoire",
      "#country": "CIV",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1528.937539"
    },
    {
      "country": "Cameroon",
      "#country": "CMR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1328.640205"
    },
    {
      "country": "Congo  Rep ",
      "#country": "COG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "3167.045322"
    },
    {
      "country": "Colombia",
      "#country": "COL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "7831.215313"
    },
    {
      "country": "Comoros",
      "#country": "COM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "814.9571488"
    },
    {
      "country": "Cabo Verde",
      "#country": "CPV",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "3767.115364"
    },
    {
      "country": "Costa Rica",
      "#country": "CRI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "10184.60567"
    },
    {
      "country": "Caribbean small states",
      "#country": "CSS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "9572.858472"
    },
    {
      "country": "Cyprus",
      "#country": "CYP",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "25248.98107"
    },
    {
      "country": "Czech Republic",
      "#country": "CZE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "19858.34346"
    },
    {
      "country": "Germany",
      "#country": "DEU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "46251.3818"
    },
    {
      "country": "Djibouti",
      "#country": "DJI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1668.336703"
    },
    {
      "country": "Dominica",
      "#country": "DMA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "7175.626941"
    },
    {
      "country": "Denmark",
      "#country": "DNK",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "59818.63153"
    },
    {
      "country": "Dominican Republic",
      "#country": "DOM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "5878.996721"
    },
    {
      "country": "Algeria",
      "#country": "DZA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "5360.701146"
    },
    {
      "country": "East Asia & Pacific (developing only)",
      "#country": "EAP",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "5690.320887"
    },
    {
      "country": "East Asia & Pacific (all income levels)",
      "#country": "EAS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "9116.159502"
    },
    {
      "country": "Europe & Central Asia (developing only)",
      "#country": "ECA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "7347.539848"
    },
    {
      "country": "Europe & Central Asia (all income levels)",
      "#country": "ECS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "25484.64309"
    },
    {
      "country": "Ecuador",
      "#country": "ECU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "6002.885459"
    },
    {
      "country": "Egypt  Arab Rep ",
      "#country": "EGY",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "3314.462928"
    },
    {
      "country": "Euro area",
      "#country": "EMU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "39116.30051"
    },
    {
      "country": "Eritrea",
      "#country": "ERI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "543.8219083"
    },
    {
      "country": "Spain",
      "#country": "ESP",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "29882.13579"
    },
    {
      "country": "Estonia",
      "#country": "EST",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "18877.33049"
    },
    {
      "country": "Ethiopia",
      "#country": "ETH",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "505.0457458"
    },
    {
      "country": "European Union",
      "#country": "EUU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "35416.87843"
    },
    {
      "country": "Fragile and conflict affected situations",
      "#country": "FCS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1598.431238"
    },
    {
      "country": "Finland",
      "#country": "FIN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "49150.5773"
    },
    {
      "country": "Fiji",
      "#country": "FJI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "4375.406022"
    },
    {
      "country": "France",
      "#country": "FRA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "42560.41373"
    },
    {
      "country": "Micronesia  Fed  Sts ",
      "#country": "FSM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "3054.068122"
    },
    {
      "country": "Gabon",
      "#country": "GAB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "11571.08292"
    },
    {
      "country": "United Kingdom",
      "#country": "GBR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "41781.14902"
    },
    {
      "country": "Georgia",
      "#country": "GEO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "3596.90832"
    },
    {
      "country": "Ghana",
      "#country": "GHA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1858.242598"
    },
    {
      "country": "Guinea",
      "#country": "GIN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "523.1190322"
    },
    {
      "country": "Gambia  The",
      "#country": "GMB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "488.5655946"
    },
    {
      "country": "Guinea-Bissau",
      "#country": "GNB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "563.7527714"
    },
    {
      "country": "Equatorial Guinea",
      "#country": "GNQ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "20581.60594"
    },
    {
      "country": "Greece",
      "#country": "GRC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "21965.92677"
    },
    {
      "country": "Grenada",
      "#country": "GRD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "7890.513319"
    },
    {
      "country": "Guatemala",
      "#country": "GTM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "3477.890061"
    },
    {
      "country": "Guyana",
      "#country": "GUY",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "3739.469995"
    },
    {
      "country": "High income",
      "#country": "HIC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "39108.39103"
    },
    {
      "country": "Hong Kong SAR  China",
      "#country": "HKG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "38123.52212"
    },
    {
      "country": "Honduras",
      "#country": "HND",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "2290.780533"
    },
    {
      "country": "Heavily indebted poor countries (HIPC)",
      "#country": "HPC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "889.3405969"
    },
    {
      "country": "Croatia",
      "#country": "HRV",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "13597.92145"
    },
    {
      "country": "Haiti",
      "#country": "HTI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "819.9039143"
    },
    {
      "country": "Hungary",
      "#country": "HUN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "13485.47207"
    },
    {
      "country": "Indonesia",
      "#country": "IDN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "3475.250474"
    },
    {
      "country": "India",
      "#country": "IND",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1497.549864"
    },
    {
      "country": "Ireland",
      "#country": "IRL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "50478.41033"
    },
    {
      "country": "Iran  Islamic Rep ",
      "#country": "IRN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "4763.303309"
    },
    {
      "country": "Iraq",
      "#country": "IRQ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "6862.495681"
    },
    {
      "country": "Iceland",
      "#country": "ISL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "47349.48255"
    },
    {
      "country": "Israel",
      "#country": "ISR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "36050.69793"
    },
    {
      "country": "Italy",
      "#country": "ITA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "35685.59904"
    },
    {
      "country": "Jamaica",
      "#country": "JAM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "5290.486134"
    },
    {
      "country": "Jordan",
      "#country": "JOR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "5213.390116"
    },
    {
      "country": "Japan",
      "#country": "JPN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "38633.70806"
    },
    {
      "country": "Kazakhstan",
      "#country": "KAZ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "13611.53736"
    },
    {
      "country": "Kenya",
      "#country": "KEN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1245.512041"
    },
    {
      "country": "Kyrgyz Republic",
      "#country": "KGZ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1263.428083"
    },
    {
      "country": "Cambodia",
      "#country": "KHM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1006.839744"
    },
    {
      "country": "Kiribati",
      "#country": "KIR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1650.707224"
    },
    {
      "country": "St  Kitts and Nevis",
      "#country": "KNA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "14132.80188"
    },
    {
      "country": "Korea  Rep ",
      "#country": "KOR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "25976.95283"
    },
    {
      "country": "Kuwait",
      "#country": "KWT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "52197.34134"
    },
    {
      "country": "Latin America & Caribbean (developing only)",
      "#country": "LAC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "9621.065726"
    },
    {
      "country": "Lao PDR",
      "#country": "LAO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1660.706031"
    },
    {
      "country": "Lebanon",
      "#country": "LBN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "9928.038098"
    },
    {
      "country": "Liberia",
      "#country": "LBR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "454.3374834"
    },
    {
      "country": "Libya",
      "#country": "LBY",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "11964.7307"
    },
    {
      "country": "St  Lucia",
      "#country": "LCA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "7328.370692"
    },
    {
      "country": "Latin America & Caribbean (all income levels)",
      "#country": "LCN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "10008.05256"
    },
    {
      "country": "Least developed countries: UN classification",
      "#country": "LDC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "912.8845641"
    },
    {
      "country": "Low income",
      "#country": "LIC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "741.8807125"
    },
    {
      "country": "Sri Lanka",
      "#country": "LKA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "3279.89139"
    },
    {
      "country": "Lower middle income",
      "#country": "LMC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "2043.104822"
    },
    {
      "country": "Low & middle income",
      "#country": "LMY",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "4223.756955"
    },
    {
      "country": "Lesotho",
      "#country": "LSO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1125.586427"
    },
    {
      "country": "Lithuania",
      "#country": "LTU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "15529.68161"
    },
    {
      "country": "Luxembourg",
      "#country": "LUX",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "110664.8403"
    },
    {
      "country": "Latvia",
      "#country": "LVA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "15381.08353"
    },
    {
      "country": "Macao SAR  China",
      "#country": "MAC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "91376.02254"
    },
    {
      "country": "Morocco",
      "#country": "MAR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "3092.606545"
    },
    {
      "country": "Moldova",
      "#country": "MDA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "2239.559127"
    },
    {
      "country": "Madagascar",
      "#country": "MDG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "462.9689428"
    },
    {
      "country": "Maldives",
      "#country": "MDV",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "6665.767695"
    },
    {
      "country": "Middle East & North Africa (all income levels)",
      "#country": "MEA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "8550.131406"
    },
    {
      "country": "Mexico",
      "#country": "MEX",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "10307.28304"
    },
    {
      "country": "Marshall Islands",
      "#country": "MHL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "3627.210548"
    },
    {
      "country": "Middle income",
      "#country": "MIC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "4816.870194"
    },
    {
      "country": "Macedonia  FYR",
      "#country": "MKD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "4838.462105"
    },
    {
      "country": "Mali",
      "#country": "MLI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "715.133813"
    },
    {
      "country": "Malta",
      "#country": "MLT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "22774.96038"
    },
    {
      "country": "Middle East & North Africa (developing only)",
      "#country": "MNA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "4329.663089"
    },
    {
      "country": "Montenegro",
      "#country": "MNE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "7106.861774"
    },
    {
      "country": "Mongolia",
      "#country": "MNG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "4056.397839"
    },
    {
      "country": "Mozambique",
      "#country": "MOZ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "605.0341744"
    },
    {
      "country": "Mauritania",
      "#country": "MRT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1068.974597"
    },
    {
      "country": "Mauritius",
      "#country": "MUS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "9477.791587"
    },
    {
      "country": "Malawi",
      "#country": "MWI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "226.4551027"
    },
    {
      "country": "Malaysia",
      "#country": "MYS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "10538.05789"
    },
    {
      "country": "North America",
      "#country": "NAC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "52940.44736"
    },
    {
      "country": "Namibia",
      "#country": "NAM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "5693.129154"
    },
    {
      "country": "Niger",
      "#country": "NER",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "415.4173218"
    },
    {
      "country": "Nigeria",
      "#country": "NGA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "3005.513796"
    },
    {
      "country": "Nicaragua",
      "#country": "NIC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1851.105852"
    },
    {
      "country": "Netherlands",
      "#country": "NLD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "50792.51426"
    },
    {
      "country": "High income: nonOECD",
      "#country": "NOC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "21330.37374"
    },
    {
      "country": "Norway",
      "#country": "NOR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "100898.3615"
    },
    {
      "country": "Nepal",
      "#country": "NPL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "694.1047943"
    },
    {
      "country": "New Zealand",
      "#country": "NZL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "41824.32284"
    },
    {
      "country": "High income: OECD",
      "#country": "OEC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "43387.12701"
    },
    {
      "country": "OECD members",
      "#country": "OED",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "38020.7979"
    },
    {
      "country": "Oman",
      "#country": "OMN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "21929.01457"
    },
    {
      "country": "Other small states",
      "#country": "OSS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "4867.984384"
    },
    {
      "country": "Pakistan",
      "#country": "PAK",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1275.301817"
    },
    {
      "country": "Panama",
      "#country": "PAN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "11036.80739"
    },
    {
      "country": "Peru",
      "#country": "PER",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "6661.591112"
    },
    {
      "country": "Philippines",
      "#country": "PHL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "2765.084587"
    },
    {
      "country": "Palau",
      "#country": "PLW",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "11810.08701"
    },
    {
      "country": "Papua New Guinea",
      "#country": "PNG",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "2105.269876"
    },
    {
      "country": "Poland",
      "#country": "POL",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "13653.72163"
    },
    {
      "country": "Puerto Rico",
      "#country": "PRI",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "28528.9971"
    },
    {
      "country": "Portugal",
      "#country": "PRT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "21738.2916"
    },
    {
      "country": "Paraguay",
      "#country": "PRY",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "4264.650642"
    },
    {
      "country": "Pacific island small states",
      "#country": "PSS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "3512.726275"
    },
    {
      "country": "Qatar",
      "#country": "QAT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "93714.06338"
    },
    {
      "country": "Romania",
      "#country": "ROU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "9490.754433"
    },
    {
      "country": "Russian Federation",
      "#country": "RUS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "14611.70078"
    },
    {
      "country": "Rwanda",
      "#country": "RWA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "638.6657954"
    },
    {
      "country": "South Asia",
      "#country": "SAS",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1417.449221"
    },
    {
      "country": "Saudi Arabia",
      "#country": "SAU",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "25961.80842"
    },
    {
      "country": "Sudan",
      "#country": "SDN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1753.38091"
    },
    {
      "country": "Senegal",
      "#country": "SEN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1046.586426"
    },
    {
      "country": "Singapore",
      "#country": "SGP",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "55182.48279"
    },
    {
      "country": "Solomon Islands",
      "#country": "SLB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1953.557318"
    },
    {
      "country": "Sierra Leone",
      "#country": "SLE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "678.9609045"
    },
    {
      "country": "El Salvador",
      "#country": "SLV",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "3826.082486"
    },
    {
      "country": "Serbia",
      "#country": "SRB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "6353.826383"
    },
    {
      "country": "Sub-Saharan Africa (developing only)",
      "#country": "SSA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1755.243107"
    },
    {
      "country": "South Sudan",
      "#country": "SSD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1044.995162"
    },
    {
      "country": "Sub-Saharan Africa (all income levels)",
      "#country": "SSF",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1770.620874"
    },
    {
      "country": "Small states",
      "#country": "SST",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "5881.287625"
    },
    {
      "country": "Sao Tome and Principe",
      "#country": "STP",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1609.823339"
    },
    {
      "country": "Suriname",
      "#country": "SUR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "9825.743921"
    },
    {
      "country": "Slovak Republic",
      "#country": "SVK",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "18049.18346"
    },
    {
      "country": "Slovenia",
      "#country": "SVN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "23295.33909"
    },
    {
      "country": "Sweden",
      "#country": "SWE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "60380.94801"
    },
    {
      "country": "Swaziland",
      "#country": "SWZ",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "3034.223184"
    },
    {
      "country": "Seychelles",
      "#country": "SYC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "16185.89948"
    },
    {
      "country": "Chad",
      "#country": "TCD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1053.662501"
    },
    {
      "country": "Togo",
      "#country": "TGO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "636.43645"
    },
    {
      "country": "Thailand",
      "#country": "THA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "5778.977216"
    },
    {
      "country": "Tajikistan",
      "#country": "TJK",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1036.583276"
    },
    {
      "country": "Turkmenistan",
      "#country": "TKM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "7986.698884"
    },
    {
      "country": "Tonga",
      "#country": "TON",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "4426.944581"
    },
    {
      "country": "Trinidad and Tobago",
      "#country": "TTO",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "18372.90432"
    },
    {
      "country": "Tunisia",
      "#country": "TUN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "4316.685695"
    },
    {
      "country": "Turkey",
      "#country": "TUR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "10971.65631"
    },
    {
      "country": "Tuvalu",
      "#country": "TUV",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "3880.352322"
    },
    {
      "country": "Tanzania",
      "#country": "TZA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "912.7003097"
    },
    {
      "country": "Uganda",
      "#country": "UGA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "657.3706635"
    },
    {
      "country": "Ukraine",
      "#country": "UKR",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "3900.465376"
    },
    {
      "country": "Upper middle income",
      "#country": "UMC",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "7763.940896"
    },
    {
      "country": "Uruguay",
      "#country": "URY",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "16350.72817"
    },
    {
      "country": "United States",
      "#country": "USA",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "53041.98141"
    },
    {
      "country": "Uzbekistan",
      "#country": "UZB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1877.964512"
    },
    {
      "country": "St  Vincent and the Grenadines",
      "#country": "VCT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "6485.679146"
    },
    {
      "country": "Venezuela  RB",
      "#country": "VEN",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "14414.75353"
    },
    {
      "country": "Vietnam",
      "#country": "VNM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1910.512818"
    },
    {
      "country": "Vanuatu",
      "#country": "VUT",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "3276.734258"
    },
    {
      "country": "World",
      "#country": "WLD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "10613.45009"
    },
    {
      "country": "Samoa",
      "#country": "WSM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "4212.363465"
    },
    {
      "country": "Yemen  Rep ",
      "#country": "YEM",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1473.099564"
    },
    {
      "country": "South Africa",
      "#country": "ZAF",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "6886.290405"
    },
    {
      "country": "Congo  Dem  Rep ",
      "#country": "COD",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "484.2114713"
    },
    {
      "country": "Zambia",
      "#country": "ZMB",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "1844.799139"
    },
    {
      "country": "Zimbabwe",
      "#country": "ZWE",
      "concept": "GDP per capita (current US$)",
      "#concept": "GDP",
      "year": "2013",
      "#year": "2013",
      "#value": "953.3806071"
    }
  ],
  "createdAt": "2015-11-29T09:46:19.128Z",
  "dataset/id": "3a37ea80-93a8-11e5-b62f-dfcea48fc8d9",
  "commit/HEAD": true,
  "commit/author": "AAB",
  "updatedAt": "2015-11-29T09:46:19.382Z",
  "id": "565ac96b4532163c208ba7d6"
};


// console.log("dataset.id",getProperty(test.metadata,"dataset.id"));
// console.log("dataset.commit.createdAt", getProperty(test.metadata,"dataset.commit.createdAt"));
// console.log("dataset.note", getProperty(test.metadata,"dataset.note"));
// console.log("dataset.topics", getProperty(test.metadata,"dataset.topics"));
console.log("dataset.commit", getProperty(test.metadata,"dataset.commit"));
// console.log("dataset", getProperty(test.metadata,"dataset"));

// console.log("dimension.country.values.0.label", getProperty(test.metadata,"dimension.country.values.0.label"));
console.log("dimension.country.values.*.label", 
  getProperty(test,"data.*.#value"));//values.*.label"));
// console.log("dimension.country.values.*.label", getProperty(test.metadata,"dimension.country.values.*.label"));
// console.log("dimension.*.values", JSON.stringify(getProperty(test.metadata,"dimension.*.values.*.label")));




    
