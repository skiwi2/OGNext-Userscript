// ==UserScript==
// @name                OLog
// @namespace           http://www.olog.com/
// @description         OLog Userscript
// @downloadURL         https://github.com/skiwi2/OLog-Userscript/raw/master/olog.user.js
// @updateURL           https://github.com/skiwi2/OLog-Userscript/raw/master/olog.user.js
// @version             0.3pre
// @include             http://s*-*.ogame.gameforge.com/game/*
// @grant               GM_xmlhttpRequest
// @grant               GM_getValue
// @grant               GM_setValue
// ==/UserScript==

"use strict";

var oLogInstanceUrl = getSetting("settings.ologinstanceurl", "http://localhost:8080/");

var menuTable = document.getElementById("menuTable");

menuTable.insertAdjacentHTML("beforeend", '' +
    '<li id="ologMenuLi">\n' +
    '    <a id="ologMenuAnchor" class="menubutton" href="#ologsettings">\n' +
    '        <span class="textlabel">OLog Settings</span>\n' +
    '    </a>\n' +
    '</li>\n');

var oLogMenuLi = document.getElementById("ologMenuLi");
oLogMenuLi.addEventListener("focus", function(c) {
    if (b(c.target).closest(".dropdown").length == 0) {
        b(".currentlySelected a").removeClass("hover");
        b(".currentlySelected").removeClass("focus");
    }
});

var oLogMenuAnchor = document.getElementById("ologMenuAnchor");
oLogMenuAnchor.addEventListener("click", function() {
    showOLogSettings();
});

if (window.location.hash === "#ologsettings") {
    showOLogSettings();
}

function showOLogSettings() {
    var menuTableLiList = menuTable.querySelectorAll("li");
    for (var i = 0; i < menuTableLiList.length; i++) {
        menuTableLiList[i].querySelector(".menubutton").classList.remove("selected");
    }
    
    oLogMenuAnchor.classList.add("selected");

    var contentWrapperDiv = document.getElementById("contentWrapper");
    while (contentWrapperDiv.firstChild) {
        contentWrapperDiv.removeChild(contentWrapperDiv.firstChild);
    }
    
    contentWrapperDiv.insertAdjacentHTML("beforeend", '' +
        '<div id="inhalt">\n' +
        '    <div id="planet" style="background-image: url(http://gf2.geo.gfsrv.net/cdndd/09a2a0d07394b5a7b5db40f5cbb8cc.jpg);">\n' +
        '        <div id="detailwrapper">\n' +
        '            <div id="header_text">\n' +
        '                <h2>OLog Settings</h2>\n' +
        '            </div>\n' +
        '            <div id="planetdata">\n' +
        '                <div class="overlay"></div>\n' +
        '                <div id="planetDetails">\n' +
        '                    <table width="100%" cellspacing="0" cellpadding="0">\n' +
        '                        <tbody>\n' +
        '                            <tr>\n' +
        '                                <td class="desc">Server Group</td>\n' +
        '                                <td class="data">' + getWindowVariable("constants.language") + '</td>\n' +
        '                            </tr>\n' +
        '                            <tr>\n' +
        '                                <td class="desc">Universe ID</td>\n' +
        '                                <td class="data">' + getWindowVariable("constants.name") + '</td>\n' +
        '                            </tr>\n' +
        '                            <tr>\n' +
        '                                <td class="desc">Player ID</td>\n' +
        '                                <td class="data">' + getWindowVariable("playerId") + '</td>\n' +
        '                            </tr>\n' +
        '                            <tr>\n' +
        '                                <td class="desc">Player Name</td>\n' +
        '                                <td class="data">' + getWindowVariable("playerName") + '</td>\n' +
        '                            </tr>\n' +
        '                            <tr>\n' +
        '                                <td class="desc">Userscript Version</td>\n' +
        '                                <td class="data">' + GM_info.script.version + '</td>\n' +
        '                            </tr>\n' +
        '                        </tbody>\n' +
        '                    </table>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <div class="c-left"></div>\n' +
        '    <div class="c-right"></div>\n' +
        '    <div id="buttonz">\n' +
        '        <div class="header">\n' +
        '            <h2>Your settings</h2>\n' +
        '        </div>\n' +
        '        <div class="content">\n' +
        '            <div class="fieldwrapper">\n' +
        '                <label class="styled textBeefy">OLog Instance URL:</label>\n' +
        '                <div class="thefield">\n' +
        '                    <input class="textinput w200" type="text" size="30" value="' + oLogInstanceUrl + '" id="ologInstanceUrlInput" />\n' +
        '                </div>\n' +
        '            </div>\n' +
        '            <div class="textCenter">\n' +
        '                <input class="btn_blue" type="submit" value="Save settings" id="ologSaveSettingsInput" />\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '');

    var oLogInstanceUrlInput = document.getElementById("ologInstanceUrlInput");

    var oLogSaveSettingsInput = document.getElementById("ologSaveSettingsInput");
    oLogSaveSettingsInput.addEventListener("click", function() {
        saveSetting("settings.ologinstanceurl", oLogInstanceUrlInput.value);
        showSuccessMessage("Settings have been saved.");
    });
}

var page = getWindowVariable("currentPage");

if (page === "messages") {
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            for(var i = 0; i < mutation.addedNodes.length; i++) {
                var node = mutation.addedNodes[i];
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
    var reportKeys = {
        sr: [],     //spy report
        cr: [],     //combat report
        rr: [],     //recycle report
        mr: []      //missile report
    };
    
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var apiElement = node.querySelector(".icon_apikey");
        if (apiElement !== null) {
            var key = apiElement.parentNode.href.replace(/.*?:\/\//g, "");
            var type = key.substring(0, 2);
            if (reportKeys.hasOwnProperty(type)) {
                reportKeys[type].push(key);
            }
        }
    }
    
    console.log(reportKeys);
    
    postData({
        endpoint: "keys",
        data: {
            reportKeys: reportKeys
        }
    });
}

function postData(object) {
    addPlayerData(object.data);
    console.log(JSON.stringify(object.data));
    GM_xmlhttpRequest({
        method: "POST",
        url: oLogInstanceUrl + "api/userscript/" + object.endpoint,
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
    data.serverGroup = getWindowVariable("constants.language");
    data.universe = getWindowVariable("constants.name");
    data.playerId = getWindowVariable("playerId");
    data.playerName = getWindowVariable("playerName");
}

/**
 * Returns a global variable.
 *
 * Needed because a @grant other than none puts the script
 * in a separate scope.
 *
 * @param {string} name The name of the global variable.
 */
function getWindowVariable(name) {
    return window.eval(name);
}

function showSuccessMessage(message) {
    getWindowVariable("fadeBox")(message, false);
}

function showErrorMessage(message) {
    getWindowVariable("fadeBox")(message, true);
}

function saveSetting(key, value) {
    var fullKey = getWindowVariable("constants.language") + ":" + getWindowVariable("constants.name") + ":" + getWindowVariable("playerId") + ":" + key;
    GM_setValue(fullKey, value);
}

function getSetting(key, defaultValue) {
    var fullKey = getWindowVariable("constants.language") + ":" + getWindowVariable("constants.name") + ":" + getWindowVariable("playerId") + ":" + key;
    return GM_getValue(fullKey, defaultValue);
}