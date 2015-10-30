// ==UserScript==
// @name                OLog
// @namespace           http://www.olog.com/
// @description         OLog Userscript
// @include             http://s135-en.ogame.gameforge.com/game/*
// @grant               GM_xmlhttpRequest
// ==/UserScript==

var page = getWindowVariable("currentPage");

if (page === "messages") {
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            for (var node of mutation.addedNodes) {
                if (node.localName === "ul" && node.classList.contains("tab_inner")) {
                    //send all messages at once such that all SR keys can be sent at once to the server
                    processMessageNodes(node.querySelectorAll(".msg"));
                }
            }
        });
    });
    
    observer.observe(document, { childList: true, subtree: true });
}

function processMessageNodes(nodes) {
    var rKeys = {
        srKeys: [],     //spy report
        crKeys: [],     //combat report
        rrKeys: [],     //recycle report
        mrKeys: []      //missile report
    }
    for (var node of nodes) {
        var apiElement = node.querySelector(".icon_apikey");
        if (apiElement !== null) {
            var key = node.querySelector(".icon_apikey").title;
            var type = key.substring(0, 2);
            if(rKeys.hasOwnChild(type)) {
                rKeys[type].push(key);
            }
        }
    }
    console.log(rKeys.srKeys, rKeys.crKeys, rKeys.rrKeys, rKeys.mrKeys);
    
    postData({
        endpoint: "keys",
        data: rKeys
    });
}

function postData(object) {
    addPlayerData(object.data);
    console.log(JSON.stringify(object.data));
    GM_xmlhttpRequest({
        method: "POST",
        url: "http://localhost/api/" + object.endpoint,
        data: JSON.stringify(object.data),
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(response) {
            console.log("load");
        },
        onerror: function(response) {
            console.log("error");
        }
    });
}

function addPlayerData(data) {
    data["server"] = getWindowVariable("constants.language");
    data["universe"] = getWindowVariable("constants.name");
    data["playerId"] = getWindowVariable("playerId");
    data["playerName"] = getWindowVariable("playerName");
}

function getWindowVariable(name) {
    return window.eval(name);
}