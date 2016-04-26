module.exports.defaultAppConfigBase = {
  "skinName": "default",
  "title": "Title",
  "description": "Description",
  "keywords": [
    ""
  ],
  "isPublished": true,
  "appWidgets": [
    {
      "type": "language-selector",
      "instanceName": "language-selector",
      "showFlags": true
    },
    {
      "type": "page-list",
      "instanceName": "page-list-nav"
    },
    {
      "instanceName": "AppTopbar",
      "type": "v2.topbar",
      "icon": "/widgets/v2.topbar/icon.png",
      "decoration": {
        "languageSelector": {
          "enable": true,
          "showFlag": true,
          "showTitle": true
        },
        "loginButton": true,
        "gotoApps": true
      },
      "content": [
        {
          "key": "qtzzi8mqy0huamuwdusypsyvi",
          "title": "About",
          "href": "/app/dj/about"
        },
        {
          "key": "dlbwln8wa4xic3td4af5pzaor",
          "title": "Home",
          "href": "/app/dj/"
        }
      ]
    }
  ],
  "pages": [
    {
      "shortTitle": "Home",
      "href": "",
      "template": "1-col",
      "holders": {
        "column": {
          "widgets": [
            {
              "text": "<div><font size=\"6\">Home Page</font></div>Empty home page. You can switch to design mode to edit this contents or add new widgets",
              "type": "htmlwidget",
              "instanceName": "main-page-html-widget",
              "icon": "/widgets/htmlwidget/icon.png"
            }
          ],
          "width": 1318
        }
      },
      "subscriptions": []
    },
    {
      "shortTitle": "About",
      "href": "about",
      "template": "1-col",
      "holders": {
        "column": {
          "widgets": [
            {
              "text": "<p><font size=\"6\">About App</font></p>",
              "type": "htmlwidget",
              "instanceName": "4dvg3sv7mjz1d83acqefnoecdi",
              "icon": "/widgets/htmlwidget/icon.png"
            },
            {
              "masterWidget": "",
              "type": "app-info",
              "instanceName": "zg5zqh9y4cejt53bhk9be29",
              "icon": "/widgets/app-info/icon.png"
            }
          ],
          "width": 1328
        }
      },
      "subscriptions": []
    },
    {
      "href": "404",
      "template": "1-col",
      "holders": {
        "column": {
          "widgets": [
            {
              "type": "title",
              "title": "404 error",
              "instanceName": "title"
            },
            {
              "type": "htmlwidget",
              "text": "Page not found",
              "instanceName": "error-message"
            }
          ]
        }
      }
    }
  ],
  "name": "dj",
  "i18n": {}
}