// Configure page titles
var a = API.widget('a').widget;
a.title = "HOT NEWS MINER"
a.intro = "RSS feeds mining and visualization";
a.text = "Search latest relevant news by keywords form selected rss feeds";

// Add event listeners for mediator
var widgets = ['hbar', 'vbar', 'wordList', 'rssList', 'tags', 'deps', 'scatter', 'wordsAssoc', 'feed']

API.addListeners({ event: 'updateWithOptions', widgets: widgets });
API.addListeners({ event: 'updateWithData', widgets: widgets });
API.emit('updateWithOptions', { options: { hidden: true } })

// Define available rss channels
var rss = [{
        url: "http://127.0.0.1:8088/libs/rss/pravda.xml",
        encoding: 'win1251',
        title: "pravda.ua"
    }, {
        url: "http://127.0.0.1:8088/libs/rss/tyzhden.xml",
        encoding: 'utf8',
        title: "tyshden.ua"
    }, {
        url: "http://127.0.0.1:8088/libs/rss/all-news.xml",
        encoding: 'utf8',
        title: "liga.net"
    }, {
        url: "http://127.0.0.1:8088/libs/rss/finance.xml",
        encoding: 'win1251',
        title: "finance.ua"
    }, {
        url: "http://127.0.0.1:8088/libs/rss/bbc.xml",
        encoding: 'win1251',
        title: "BBC News"
    }

]

// provide event listener for rss panel interaction
API.provide({ event: 'changeRss', widgets: ['rssList'], callback: function() { process() } })

// define addRss callback

var addRss = function() {
    API.dialog({
            title: " New rss channel settings",
            fields: {
                title: { title: "Channel Title", type: 'text', required: true },
                url: { title: "Channel URL", type: 'text', required: true },
                encoding: { title: "Encoding", type: 'select', options: ['utf8', 'win1251'], required: true }
            }
        })
        .then(function(form) {
            rss.push({ url: form.fields.url.value, encoding: form.fields.encoding.value, title: form.fields.title.value })
            process()
        })
}

// provide event listener for rss panel interaction
API.provide({ event: 'addRss', widgets: ['rssList'], callback: addRss })


// local variables
var wordListId, headLinesId, tableId, tagList, selectedChannels, relevantNews;


// define function getFeed
var getFeed = function() {
    API
        .runDPS({
            script: API.widget('rssFeed').widget.script,
            state: {
                relevantNews: relevantNews,
                selectedChannels: selectedChannels
            }
        })
        .then(function(r) {
            API.emit('updateWithData', {
                widget: 'feed',
                key: r.type,
                data: r.data,
                options: { hidden: false }
            })
        })
        .catch(function(error) {
            API.error("getFeed: " + error)
        })
}

// define function getLikedWords

var getLikedWords = function() {
    API
        .runDPS({
            script: API.widget('getLikedWords').widget.script,
            state: { id: wordListId, tags: tagList }
        })
        .then(function(r) {
            API.emit('updateWithData', { widget: 'wordList', data: r.data })
        })
        .catch(function(error) {
            API.error("getLikedWords: ", error)
        })
}

// define function getHbar
var getHbar = function(r) {

    tableId = r.data;
    API.runDPS({
            script: API.widget('getHbar').widget.script,
            state: { id: tableId }
        })
        .then(function(r) {
            relevantNews = r.data[0].values.map(function(item) {
                return item });
            API.emit('updateWithData', {
                widget: 'hbar',
                key: r.type,
                data: r.data,
                options: { hidden: false }
            })
            getFeed();
        })
    .catch(function(error) {
        API.error("getHbar: ", error)
    })
    return r;
}


// define function getVbar
var getVbar = function(r) {

    tableId = r.data;

    API.runDPS({
        script: API.widget('getVbar').widget.script,
        state: { id: tableId }
    })
    .then(function(r) {
        API.emit('updateWithData', {
            widget: 'vbar',
            key: r.type,
            data: r.data,
            options: { hidden: false }
        })
    })
    .catch(function(error) {
        API.error("getVbar: ", error)
    })
    return r;
}

// define function getPca
var getPca = function(r) {

    tableId = r.data;

    API.runDPS({
        script: API.widget('pca').widget.script,
        state: { id: tableId }
    })
    .then(function(r) {

        if (r.type == "scatter") {
            API.emit('updateWithData', {
                widget: 'scatter',
                key: r.type,
                data: r.data,
                options: { hidden: false }
            })
        }
    })
    .catch(function(error) {
        API.error("getPca: ", error)
    })

    return r;
}

// define function getWordsAssoc
var getWordsAssoc = function(r) {

    tableId = r.data;

    API.runDPS({
        script: API.widget('getWordsAssoc').widget.script,
        state: { id: tableId }
    })
    .then(function(r) {

            API.emit('updateWithData', {
                widget: 'wordsAssoc',
                key: r.type,
                data: r.data,
                options: { hidden: false }
            })
        })
        .catch(function(error) {
            API.error("at line 333", error)
        })

    return r;
}

// define function getDeps
var getDeps = function(r) {

    tableId = r.data;

    API.runDPS({
        script: API.widget('getDeps').widget.script,
        state: { id: tableId }
    })
    .then(function(r) {

        API.emit('updateWithData', {
            widget: 'deps',
            key: r.type,
            data: r.data,
            options: { hidden: false }
        })
    })
    .catch(function(error) {
        API.error("getDeps: ", error)
    })
    return r
}

API.provide({
    event: 'selectObject',
    widgets: 'tags',
    callback: function(e, d) {

        tagList = d
            .filter(function(item) {
                return !item.disabled
            })
            .map(function(item) {
                return item.key
            })

        if (tagList.length === 0) {
            API.info("One or more words must be selected for analysis")
            return
        }

        API.emit('updateWithData', { widget: 'wordList', data: '<h4>wait...</h4>' })

        getLikedWords();

        API.runDPS({
                script: API.widget('getWNTable').widget.script,
                state: { id: headLinesId, tags: tagList }
            })
        .then(getHbar)
        .then(getVbar)
        .then(getPca)
        .then(getWordsAssoc)
        .then(getDeps)
        .catch(function(error) {
            API.error("getTable:", error)
        })
    }    
})

var getTimeline = function() {
    API.runDPS({
            script: API.widget('rssTimeline').widget.script,
            state: {
                relevantNews: relevantNews,
                selectedChannels: selectedChannels
            }
        })
        .then(function(r) {

            API.emit('updateWithData', {
                widget: 'timeline',
                data: r.data,
                options: { hidden: false }
            })
        })
        .catch(function(error) {
            API.error("getTimeline: " + error)
        })
}


var process = function() {
    API.emit('updateWithOptions', { widget: ['hbar', 'vbar', 'deps', 'scatter', 'wordsAssoc', 'feed'], options: { hidden: true } })

    // Start dialog
    API.dialog({
            title: "Select RSS channels",
            note: 'Select one or more channels for analysis',
            cancelable: false,
            fields: {
                channels: {
                    title: 'Available RSS channels',
                    type: "multiselect",
                    options: rss.map(function(item) {
                        return { title: item.title, value: item }
                    })
                }
            }
        })
        .then(function(form) {
            // fill rssList widget
            selectedChannels = form.fields.channels.value
                .map(function(item) {
                    return JSON.parse(item)
                })

            API.runDPS({
                    script: API.widget('getChannelsHTML').widget.script,
                    state: { channels: selectedChannels }
                })
                .then(function(res) {
                    API.emit('updateWithData', {
                        widget: 'rssList',
                        data: res.data,
                        key: res.type,
                        options: { hidden: false }
                    })
                })
                .catch(function(error) {
                    API.error(error)
                })

            API.emit('updateWithOptions', {
                widget: 'tags',
                options: {
                    hidden: false,
                    title: "wait one moment ...",
                    view: "Typeahead",
                    button: "Analyze...",
                    runnable: true
                }
            })
            return selectedChannels
        })
        .then(function(selectedChannels) {

            // Run dps that returns cache Id for headlines of news

            return API.runDPS({
                script: API.widget('fetchData').widget.script,
                state: { selectedChannels: selectedChannels }
            })
        })

    .then(function(r) {
        headLinesId = r.data;

        // Run dps that returns words of headlines
        API.emit('updateWithOptions', { widget: 'tags', options: { title: "rss channels received..." } })

        return API.runDPS({
                script: API.widget('getWordList').widget.script,
                state: { id: r.data }
            })
            .catch(function(error) {
                API.error("getWordList: ", error)
            })
    })

    .then(function(r) {
        wordListId = r.data.data_id;

        // Prepare hints for word selector 

        API.emit('updateWithData', {
            widget: 'tags',
            data: r.data.data.map(function(item) {
                return { key: item, disabled: true }
            }),
            options: { title: "Select words..." }
        })

        // Set start title for html widget

        API.emit('updateWithData', {
            widget: 'wordList',
            data: '<h4>No words for analysis</h5>',
            options: { hidden: false }
        })

    })

    .catch(function(error) {
        API.info("One or more channels must be selected. Reload page and select it.")
    })
}

process()
