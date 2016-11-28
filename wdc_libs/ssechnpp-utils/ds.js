console.log("attach ds")
module.exports =       {
        "metadata": {
          "dataset": {
            "id": "47611d63-b230-11e6-8a1a-0f91ca29d77e_2016_01",
            "status": "public",
            "commit": {
              "id": "5836ce6730c0f1580c1a2fad",
              "author": "Andrey Boldak",
              "note": "Upload from SSE ChNPP source at 2016/11/24 01:26:30",
              "HEAD": true,
              "createdAt": "2016-11-24T11:26:30.796Z"
            },
            "locale": [
              "#en",
              "#ukr",
              "#ru"
            ],
            "label": "#NSMS_DAU_NFD",
            "note": "#NSMS_DAU_NFD_NOTE",
            "source": "#CNPP_Data",
            "topics": [
              "#NSMS",
              "#DAU",
              "#IENFDI",
              "#CH",
              "#room_304-3",
              "#room_505-3",
              "#room_504-2",
              "#room_305-2",
              "#well_3.10.g",
              "#well_v.19.103",
              "#well_3.15.j",
              "#well_3.22.b",
              "#well_3.9.68",
              "#well_3.9.j",
              "#n-cm2*sec"
            ],
            "units": "#n-cm2*sec",
            "periodicity": "day",
            "ext": "( 2016.01 )"
          },
          "dimension": {
            "indicator": {
              "label": "Index",
              "role": "metric",
              "unit": "#n-cm2*sec",
              "scale": "nominal",
              "values": [
                {
                  "id": "NSMS_DAU001_NFD004",
                  "label": "#NSMS_DAU001_NFD004"
                },
                {
                  "id": "NSMS_DAU001_NFD009",
                  "label": "#NSMS_DAU001_NFD009"
                },
                {
                  "id": "NSMS_DAU002_NFD015",
                  "label": "#NSMS_DAU002_NFD015"
                },
                {
                  "id": "NSMS_DAU003_NFD016",
                  "label": "#NSMS_DAU003_NFD016"
                },
                {
                  "id": "NSMS_DAU006_NFD005",
                  "label": "#NSMS_DAU006_NFD005"
                }
              ]
            },
            "time": {
              "label": "Time",
              "role": "time",
              "scale": "ordinal",
              "values": [
                {
                  "id": "2016/01/02",
                  "label": "2016/01/02"
                },
                {
                  "id": "2016/02/01",
                  "label": "2016/02/01"
                },
                {
                  "id": "2016/01/04",
                  "label": "2016/01/04"
                },
                {
                  "id": "2016/01/05",
                  "label": "2016/01/05"
                },
                {
                  "id": "2016/01/06",
                  "label": "2016/01/06"
                },
                {
                  "id": "2016/01/07",
                  "label": "2016/01/07"
                },
                {
                  "id": "2016/01/08",
                  "label": "2016/01/08"
                },
                {
                  "id": "2016/01/09",
                  "label": "2016/01/09"
                },
                {
                  "id": "2016/01/10",
                  "label": "2016/01/10"
                },
                {
                  "id": "2016/01/11",
                  "label": "2016/01/11"
                },
                {
                  "id": "2016/01/12",
                  "label": "2016/01/12"
                },
                {
                  "id": "2016/01/13",
                  "label": "2016/01/13"
                },
                {
                  "id": "2016/01/14",
                  "label": "2016/01/14"
                },
                {
                  "id": "2016/01/15",
                  "label": "2016/01/15"
                },
                {
                  "id": "2016/01/16",
                  "label": "2016/01/16"
                },
                {
                  "id": "2016/01/03",
                  "label": "2016/01/03"
                },
                {
                  "id": "2016/01/18",
                  "label": "2016/01/18"
                },
                {
                  "id": "2016/01/19",
                  "label": "2016/01/19"
                },
                {
                  "id": "2016/01/20",
                  "label": "2016/01/20"
                },
                {
                  "id": "2016/01/21",
                  "label": "2016/01/21"
                },
                {
                  "id": "2016/01/22",
                  "label": "2016/01/22"
                },
                {
                  "id": "2016/01/23",
                  "label": "2016/01/23"
                },
                {
                  "id": "2016/01/24",
                  "label": "2016/01/24"
                },
                {
                  "id": "2016/01/25",
                  "label": "2016/01/25"
                },
                {
                  "id": "2016/01/26",
                  "label": "2016/01/26"
                },
                {
                  "id": "2016/01/27",
                  "label": "2016/01/27"
                },
                {
                  "id": "2016/01/28",
                  "label": "2016/01/28"
                },
                {
                  "id": "2016/01/29",
                  "label": "2016/01/29"
                },
                {
                  "id": "2016/01/30",
                  "label": "2016/01/30"
                },
                {
                  "id": "2016/01/31",
                  "label": "2016/01/31"
                },
                {
                  "id": "2016/01/17",
                  "label": "2016/01/17"
                }
              ],
              "format": "YYYY/MM/DD"
            }
          },
          "layout": {
            "aggregation": {
              "periodicity": [
                "month",
                "day"
              ],
              "method": "avg"
            },
            "indicator": {
              "NSMS_DAU001_NFD004": {
                "files": [
                  "./data/NSMS-DAU001-NFD004-VAL_2016_01.CSV",
                  "./data/NSMS-DAU001-NFD004-VAL_2016_02.CSV",
                  "./data/NSMS-DAU001-NFD004-VAL_2016_03.CSV",
                  "./data/NSMS-DAU001-NFD004-VAL_2016_04.CSV",
                  "./data/NSMS-DAU001-NFD004-VAL_2016_05.CSV",
                  "./data/NSMS-DAU001-NFD004-VAL_2016_06.CSV",
                  "./data/NSMS-DAU001-NFD004-VAL_2016_07.CSV",
                  "./data/NSMS-DAU001-NFD004-VAL_2016_08.CSV",
                  "./data/NSMS-DAU001-NFD004-VAL_2016_09.CSV",
                  "./data/NSMS-DAU001-NFD004-VAL_2016_10.CSV"
                ],
                "label": "#NSMS_DAU001_NFD004"
              },
              "NSMS_DAU001_NFD009": {
                "files": [
                  "./data/NSMS-DAU001-NFD009-VAL_2016_01.CSV",
                  "./data/NSMS-DAU001-NFD009-VAL_2016_02.CSV",
                  "./data/NSMS-DAU001-NFD009-VAL_2016_03.CSV",
                  "./data/NSMS-DAU001-NFD009-VAL_2016_04.CSV",
                  "./data/NSMS-DAU001-NFD009-VAL_2016_05.CSV",
                  "./data/NSMS-DAU001-NFD009-VAL_2016_06.CSV",
                  "./data/NSMS-DAU001-NFD009-VAL_2016_07.CSV",
                  "./data/NSMS-DAU001-NFD009-VAL_2016_08.CSV",
                  "./data/NSMS-DAU001-NFD009-VAL_2016_09.CSV",
                  "./data/NSMS-DAU001-NFD009-VAL_2016_10.CSV"
                ],
                "label": "#NSMS_DAU001_NFD009"
              },
              "NSMS_DAU002_NFD015": {
                "files": [
                  "./data/NSMS-DAU002-NFD015-VAL_2016_01.CSV",
                  "./data/NSMS-DAU002-NFD015-VAL_2016_02.CSV",
                  "./data/NSMS-DAU002-NFD015-VAL_2016_03.CSV",
                  "./data/NSMS-DAU002-NFD015-VAL_2016_04.CSV",
                  "./data/NSMS-DAU002-NFD015-VAL_2016_05.CSV",
                  "./data/NSMS-DAU002-NFD015-VAL_2016_06.CSV",
                  "./data/NSMS-DAU002-NFD015-VAL_2016_07.CSV",
                  "./data/NSMS-DAU002-NFD015-VAL_2016_08.CSV",
                  "./data/NSMS-DAU002-NFD015-VAL_2016_09.CSV",
                  "./data/NSMS-DAU002-NFD015-VAL_2016_10.CSV"
                ],
                "label": "#NSMS_DAU002_NFD015"
              },
              "NSMS_DAU003_NFD016": {
                "files": [
                  "./data/NSMS-DAU003-NFD016-VAL_2016_01.CSV",
                  "./data/NSMS-DAU003-NFD016-VAL_2016_02.CSV",
                  "./data/NSMS-DAU003-NFD016-VAL_2016_03.CSV",
                  "./data/NSMS-DAU003-NFD016-VAL_2016_04.CSV",
                  "./data/NSMS-DAU003-NFD016-VAL_2016_05.CSV",
                  "./data/NSMS-DAU003-NFD016-VAL_2016_06.CSV",
                  "./data/NSMS-DAU003-NFD016-VAL_2016_07.CSV",
                  "./data/NSMS-DAU003-NFD016-VAL_2016_08.CSV",
                  "./data/NSMS-DAU003-NFD016-VAL_2016_09.CSV",
                  "./data/NSMS-DAU003-NFD016-VAL_2016_10.CSV"
                ],
                "label": "#NSMS_DAU003_NFD016"
              },
              "NSMS_DAU006_NFD005": {
                "files": [
                  "./data/NSMS-DAU006-NFD005-VAL_2016_01.CSV",
                  "./data/NSMS-DAU006-NFD005-VAL_2016_02.CSV",
                  "./data/NSMS-DAU006-NFD005-VAL_2016_03.CSV",
                  "./data/NSMS-DAU006-NFD005-VAL_2016_04.CSV",
                  "./data/NSMS-DAU006-NFD005-VAL_2016_05.CSV",
                  "./data/NSMS-DAU006-NFD005-VAL_2016_06.CSV",
                  "./data/NSMS-DAU006-NFD005-VAL_2016_07.CSV",
                  "./data/NSMS-DAU006-NFD005-VAL_2016_08.CSV",
                  "./data/NSMS-DAU006-NFD005-VAL_2016_09.CSV",
                  "./data/NSMS-DAU006-NFD005-VAL_2016_10.CSV"
                ],
                "label": "#NSMS_DAU006_NFD005"
              },
              "id": "indicatorAbbr",
              "label": "indicator"
            },
            "ftp": {
              "host": "193.108.226.67",
              "user": "iask01",
              "password": "kuhgyf503",
              "dest": "./data/",
              "patterns": [
                "NSMS-DAU001-NFD004-VAL*.CSV",
                "NSMS-DAU001-NFD009-VAL*.CSV",
                "NSMS-DAU002-NFD015-VAL*.CSV",
                "NSMS-DAU003-NFD016-VAL*.CSV",
                "NSMS-DAU006-NFD005-VAL*.CSV"
              ]
            },
            "sheet": "data",
            "value": "Value",
            "time": {
              "id": "timestamp",
              "label": "timestamp"
            }
          }
        },
        "validation": {
          
        },
        "data": [
          {
            "time": "2016/01/02",
            "#time": "2016/01/02",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 366.3595833333333
          },
          {
            "time": "2016/01/02",
            "#time": "2016/01/02",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 930.2916666666665
          },
          {
            "time": "2016/01/02",
            "#time": "2016/01/02",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 339.1454166666667
          },
          {
            "time": "2016/01/02",
            "#time": "2016/01/02",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 38.30833333333333
          },
          {
            "time": "2016/01/02",
            "#time": "2016/01/02",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1150.1370833333333
          },
          {
            "time": "2016/01/03",
            "#time": "2016/01/03",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 369.2908333333334
          },
          {
            "time": "2016/01/03",
            "#time": "2016/01/03",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 922.8462499999999
          },
          {
            "time": "2016/01/03",
            "#time": "2016/01/03",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 338.5025
          },
          {
            "time": "2016/01/03",
            "#time": "2016/01/03",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 37.454166666666666
          },
          {
            "time": "2016/01/03",
            "#time": "2016/01/03",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1152.9012500000001
          },
          {
            "time": "2016/01/04",
            "#time": "2016/01/04",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 366.8775
          },
          {
            "time": "2016/01/04",
            "#time": "2016/01/04",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 928.52125
          },
          {
            "time": "2016/01/04",
            "#time": "2016/01/04",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 339.9216666666667
          },
          {
            "time": "2016/01/04",
            "#time": "2016/01/04",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 38.284583333333345
          },
          {
            "time": "2016/01/04",
            "#time": "2016/01/04",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1155.5270833333332
          },
          {
            "time": "2016/01/05",
            "#time": "2016/01/05",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 370.94916666666677
          },
          {
            "time": "2016/01/05",
            "#time": "2016/01/05",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 934.8070833333334
          },
          {
            "time": "2016/01/05",
            "#time": "2016/01/05",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 342.3433333333333
          },
          {
            "time": "2016/01/05",
            "#time": "2016/01/05",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 40.11291666666668
          },
          {
            "time": "2016/01/05",
            "#time": "2016/01/05",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1154.3083333333334
          },
          {
            "time": "2016/01/06",
            "#time": "2016/01/06",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 370.3325
          },
          {
            "time": "2016/01/06",
            "#time": "2016/01/06",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 935.2154166666667
          },
          {
            "time": "2016/01/06",
            "#time": "2016/01/06",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 341.05375
          },
          {
            "time": "2016/01/06",
            "#time": "2016/01/06",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 39.66541666666666
          },
          {
            "time": "2016/01/06",
            "#time": "2016/01/06",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1160.0354166666666
          },
          {
            "time": "2016/01/07",
            "#time": "2016/01/07",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 371.26499999999993
          },
          {
            "time": "2016/01/07",
            "#time": "2016/01/07",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 931.9345833333333
          },
          {
            "time": "2016/01/07",
            "#time": "2016/01/07",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 339.46333333333337
          },
          {
            "time": "2016/01/07",
            "#time": "2016/01/07",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 39.42
          },
          {
            "time": "2016/01/07",
            "#time": "2016/01/07",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1162.8129166666668
          },
          {
            "time": "2016/01/08",
            "#time": "2016/01/08",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 371.1358333333333
          },
          {
            "time": "2016/01/08",
            "#time": "2016/01/08",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 932.7270833333332
          },
          {
            "time": "2016/01/08",
            "#time": "2016/01/08",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 338.95083333333326
          },
          {
            "time": "2016/01/08",
            "#time": "2016/01/08",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 39.38499999999999
          },
          {
            "time": "2016/01/08",
            "#time": "2016/01/08",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1159.1358333333333
          },
          {
            "time": "2016/01/09",
            "#time": "2016/01/09",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 370.9791666666666
          },
          {
            "time": "2016/01/09",
            "#time": "2016/01/09",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 937.1054166666668
          },
          {
            "time": "2016/01/09",
            "#time": "2016/01/09",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 340.26333333333326
          },
          {
            "time": "2016/01/09",
            "#time": "2016/01/09",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 39.91375
          },
          {
            "time": "2016/01/09",
            "#time": "2016/01/09",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1161.2958333333336
          },
          {
            "time": "2016/01/10",
            "#time": "2016/01/10",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 371.9708333333333
          },
          {
            "time": "2016/01/10",
            "#time": "2016/01/10",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 927.4016666666668
          },
          {
            "time": "2016/01/10",
            "#time": "2016/01/10",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 338.67875000000004
          },
          {
            "time": "2016/01/10",
            "#time": "2016/01/10",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 38.87416666666666
          },
          {
            "time": "2016/01/10",
            "#time": "2016/01/10",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1163.8804166666666
          },
          {
            "time": "2016/01/11",
            "#time": "2016/01/11",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 369.4529166666667
          },
          {
            "time": "2016/01/11",
            "#time": "2016/01/11",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 932.2475000000001
          },
          {
            "time": "2016/01/11",
            "#time": "2016/01/11",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 337.61333333333334
          },
          {
            "time": "2016/01/11",
            "#time": "2016/01/11",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 38.297083333333326
          },
          {
            "time": "2016/01/11",
            "#time": "2016/01/11",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1156.9504166666663
          },
          {
            "time": "2016/01/12",
            "#time": "2016/01/12",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 368.44124999999997
          },
          {
            "time": "2016/01/12",
            "#time": "2016/01/12",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 933.9600000000002
          },
          {
            "time": "2016/01/12",
            "#time": "2016/01/12",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 336.8054166666667
          },
          {
            "time": "2016/01/12",
            "#time": "2016/01/12",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 37.84625000000001
          },
          {
            "time": "2016/01/12",
            "#time": "2016/01/12",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1155.9016666666664
          },
          {
            "time": "2016/01/13",
            "#time": "2016/01/13",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 368.94375
          },
          {
            "time": "2016/01/13",
            "#time": "2016/01/13",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 925.49625
          },
          {
            "time": "2016/01/13",
            "#time": "2016/01/13",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 336.58624999999995
          },
          {
            "time": "2016/01/13",
            "#time": "2016/01/13",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 37.909583333333345
          },
          {
            "time": "2016/01/13",
            "#time": "2016/01/13",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1149.3708333333334
          },
          {
            "time": "2016/01/14",
            "#time": "2016/01/14",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 367.12666666666667
          },
          {
            "time": "2016/01/14",
            "#time": "2016/01/14",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 927.9145833333333
          },
          {
            "time": "2016/01/14",
            "#time": "2016/01/14",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 336.0579166666666
          },
          {
            "time": "2016/01/14",
            "#time": "2016/01/14",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 37.68833333333333
          },
          {
            "time": "2016/01/14",
            "#time": "2016/01/14",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1152.3149999999996
          },
          {
            "time": "2016/01/15",
            "#time": "2016/01/15",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 368.20541666666674
          },
          {
            "time": "2016/01/15",
            "#time": "2016/01/15",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 923.8699999999999
          },
          {
            "time": "2016/01/15",
            "#time": "2016/01/15",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 335.3766666666666
          },
          {
            "time": "2016/01/15",
            "#time": "2016/01/15",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 37.35416666666667
          },
          {
            "time": "2016/01/15",
            "#time": "2016/01/15",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1150.0041666666668
          },
          {
            "time": "2016/01/16",
            "#time": "2016/01/16",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 366.8641666666667
          },
          {
            "time": "2016/01/16",
            "#time": "2016/01/16",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 926.4791666666666
          },
          {
            "time": "2016/01/16",
            "#time": "2016/01/16",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 335.52833333333336
          },
          {
            "time": "2016/01/16",
            "#time": "2016/01/16",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 37.36666666666667
          },
          {
            "time": "2016/01/16",
            "#time": "2016/01/16",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1143.1416666666667
          },
          {
            "time": "2016/01/17",
            "#time": "2016/01/17",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 367.0470833333333
          },
          {
            "time": "2016/01/17",
            "#time": "2016/01/17",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 924.2512500000001
          },
          {
            "time": "2016/01/17",
            "#time": "2016/01/17",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 335.65166666666664
          },
          {
            "time": "2016/01/17",
            "#time": "2016/01/17",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 37.41708333333334
          },
          {
            "time": "2016/01/17",
            "#time": "2016/01/17",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1147.7512499999998
          },
          {
            "time": "2016/01/18",
            "#time": "2016/01/18",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 368.81499999999994
          },
          {
            "time": "2016/01/18",
            "#time": "2016/01/18",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 925.6087499999998
          },
          {
            "time": "2016/01/18",
            "#time": "2016/01/18",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 336.9025
          },
          {
            "time": "2016/01/18",
            "#time": "2016/01/18",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 37.72125
          },
          {
            "time": "2016/01/18",
            "#time": "2016/01/18",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1166.7612500000002
          },
          {
            "time": "2016/01/19",
            "#time": "2016/01/19",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 368.71791666666667
          },
          {
            "time": "2016/01/19",
            "#time": "2016/01/19",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 930.1995833333335
          },
          {
            "time": "2016/01/19",
            "#time": "2016/01/19",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 338.4579166666666
          },
          {
            "time": "2016/01/19",
            "#time": "2016/01/19",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 38.34583333333334
          },
          {
            "time": "2016/01/19",
            "#time": "2016/01/19",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1168.1679166666665
          },
          {
            "time": "2016/01/20",
            "#time": "2016/01/20",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 368.5533333333333
          },
          {
            "time": "2016/01/20",
            "#time": "2016/01/20",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 928.4829166666666
          },
          {
            "time": "2016/01/20",
            "#time": "2016/01/20",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 338.6216666666666
          },
          {
            "time": "2016/01/20",
            "#time": "2016/01/20",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 38.695833333333326
          },
          {
            "time": "2016/01/20",
            "#time": "2016/01/20",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1171.2475
          },
          {
            "time": "2016/01/21",
            "#time": "2016/01/21",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 368.82708333333335
          },
          {
            "time": "2016/01/21",
            "#time": "2016/01/21",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 930.35125
          },
          {
            "time": "2016/01/21",
            "#time": "2016/01/21",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 337.9691666666667
          },
          {
            "time": "2016/01/21",
            "#time": "2016/01/21",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 37.872916666666676
          },
          {
            "time": "2016/01/21",
            "#time": "2016/01/21",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1172.3083333333336
          },
          {
            "time": "2016/01/22",
            "#time": "2016/01/22",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 366.46250000000003
          },
          {
            "time": "2016/01/22",
            "#time": "2016/01/22",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 925.6324999999999
          },
          {
            "time": "2016/01/22",
            "#time": "2016/01/22",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 337.0091666666666
          },
          {
            "time": "2016/01/22",
            "#time": "2016/01/22",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 37.59875
          },
          {
            "time": "2016/01/22",
            "#time": "2016/01/22",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1175.107083333333
          },
          {
            "time": "2016/01/23",
            "#time": "2016/01/23",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 368.80250000000007
          },
          {
            "time": "2016/01/23",
            "#time": "2016/01/23",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 935.1733333333333
          },
          {
            "time": "2016/01/23",
            "#time": "2016/01/23",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 337.91083333333336
          },
          {
            "time": "2016/01/23",
            "#time": "2016/01/23",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 38.12958333333333
          },
          {
            "time": "2016/01/23",
            "#time": "2016/01/23",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1180.5925000000002
          },
          {
            "time": "2016/01/24",
            "#time": "2016/01/24",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 369.1091666666667
          },
          {
            "time": "2016/01/24",
            "#time": "2016/01/24",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 927.2879166666668
          },
          {
            "time": "2016/01/24",
            "#time": "2016/01/24",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 338.135
          },
          {
            "time": "2016/01/24",
            "#time": "2016/01/24",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 37.73416666666667
          },
          {
            "time": "2016/01/24",
            "#time": "2016/01/24",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1188.1937500000001
          },
          {
            "time": "2016/01/25",
            "#time": "2016/01/25",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 369.46375000000006
          },
          {
            "time": "2016/01/25",
            "#time": "2016/01/25",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 928.9833333333333
          },
          {
            "time": "2016/01/25",
            "#time": "2016/01/25",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 339.06874999999997
          },
          {
            "time": "2016/01/25",
            "#time": "2016/01/25",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 38.03000000000001
          },
          {
            "time": "2016/01/25",
            "#time": "2016/01/25",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1186.1433333333334
          },
          {
            "time": "2016/01/26",
            "#time": "2016/01/26",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 370.3266666666666
          },
          {
            "time": "2016/01/26",
            "#time": "2016/01/26",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 927.7841666666667
          },
          {
            "time": "2016/01/26",
            "#time": "2016/01/26",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 337.35749999999996
          },
          {
            "time": "2016/01/26",
            "#time": "2016/01/26",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 37.88458333333333
          },
          {
            "time": "2016/01/26",
            "#time": "2016/01/26",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1176.0554166666664
          },
          {
            "time": "2016/01/27",
            "#time": "2016/01/27",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 368.63666666666677
          },
          {
            "time": "2016/01/27",
            "#time": "2016/01/27",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 929.1429166666666
          },
          {
            "time": "2016/01/27",
            "#time": "2016/01/27",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 336.49249999999995
          },
          {
            "time": "2016/01/27",
            "#time": "2016/01/27",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 37.60375
          },
          {
            "time": "2016/01/27",
            "#time": "2016/01/27",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1186.2391666666667
          },
          {
            "time": "2016/01/28",
            "#time": "2016/01/28",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 369.19083333333344
          },
          {
            "time": "2016/01/28",
            "#time": "2016/01/28",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 928.1904166666666
          },
          {
            "time": "2016/01/28",
            "#time": "2016/01/28",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 336.8508333333333
          },
          {
            "time": "2016/01/28",
            "#time": "2016/01/28",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 37.57166666666667
          },
          {
            "time": "2016/01/28",
            "#time": "2016/01/28",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1182.6791666666668
          },
          {
            "time": "2016/01/29",
            "#time": "2016/01/29",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 370.38375
          },
          {
            "time": "2016/01/29",
            "#time": "2016/01/29",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 932.2579166666667
          },
          {
            "time": "2016/01/29",
            "#time": "2016/01/29",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 334.6075
          },
          {
            "time": "2016/01/29",
            "#time": "2016/01/29",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 36.86625
          },
          {
            "time": "2016/01/29",
            "#time": "2016/01/29",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1159.039166666667
          },
          {
            "time": "2016/01/30",
            "#time": "2016/01/30",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 368.40375
          },
          {
            "time": "2016/01/30",
            "#time": "2016/01/30",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 929.7745833333333
          },
          {
            "time": "2016/01/30",
            "#time": "2016/01/30",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 335.6641666666667
          },
          {
            "time": "2016/01/30",
            "#time": "2016/01/30",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 36.560416666666676
          },
          {
            "time": "2016/01/30",
            "#time": "2016/01/30",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1135.645416666667
          },
          {
            "time": "2016/01/31",
            "#time": "2016/01/31",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 370.7875
          },
          {
            "time": "2016/01/31",
            "#time": "2016/01/31",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 930.0358333333332
          },
          {
            "time": "2016/01/31",
            "#time": "2016/01/31",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 334.96333333333337
          },
          {
            "time": "2016/01/31",
            "#time": "2016/01/31",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 36.71375
          },
          {
            "time": "2016/01/31",
            "#time": "2016/01/31",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1140.3733333333332
          },
          {
            "time": "2016/02/01",
            "#time": "2016/02/01",
            "indicator": "#NSMS_DAU001_NFD004",
            "#indicator": "NSMS_DAU001_NFD004",
            "#value": 369.3654166666667
          },
          {
            "time": "2016/02/01",
            "#time": "2016/02/01",
            "indicator": "#NSMS_DAU001_NFD009",
            "#indicator": "NSMS_DAU001_NFD009",
            "#value": 925.6295833333334
          },
          {
            "time": "2016/02/01",
            "#time": "2016/02/01",
            "indicator": "#NSMS_DAU002_NFD015",
            "#indicator": "NSMS_DAU002_NFD015",
            "#value": 334.8016666666666
          },
          {
            "time": "2016/02/01",
            "#time": "2016/02/01",
            "indicator": "#NSMS_DAU003_NFD016",
            "#indicator": "NSMS_DAU003_NFD016",
            "#value": 36.73833333333334
          },
          {
            "time": "2016/02/01",
            "#time": "2016/02/01",
            "indicator": "#NSMS_DAU006_NFD005",
            "#indicator": "NSMS_DAU006_NFD005",
            "#value": 1127.2908333333335
          }
        ]
      }