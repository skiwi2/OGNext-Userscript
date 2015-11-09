// ==UserScript==
// @name                OLog
// @namespace           http://www.olog.com/
// @description         OLog Userscript
// @include             http://s*-*.ogame.gameforge.com/game/*
// @grant               GM_xmlhttpRequest
// @grant               GM_getValue
// @grant               GM_setValue
// ==/UserScript==

"use strict";

var oLogInstanceUrl = GM_getValue("settings.ologinstanceurl", "http://localhost:8080/");

var menuTable = document.getElementById("menuTable");

var oLogLi = document.createElement("li");
oLogLi.onfocus = function(c) {
    if (b(c.target).closest(".dropdown").length == 0) {
        b(".currentlySelected a").removeClass("hover");
        b(".currentlySelected").removeClass("focus");
    }
}

var oLogAnchor = document.createElement("a");
oLogAnchor.className = "menubutton";
oLogAnchor.href = "#ologsettings";
oLogAnchor.onclick = function() {
    showOLogSettings();
};

var oLogSpan = document.createElement("span");
oLogSpan.className = "textlabel"

var oLogText = document.createTextNode("OLog Settings");

oLogSpan.appendChild(oLogText);
oLogAnchor.appendChild(oLogSpan);
oLogLi.appendChild(oLogAnchor);
menuTable.appendChild(oLogLi);

if (window.location.hash === "#ologsettings") {
    showOLogSettings();
}

function showOLogSettings() {
    var menuTableLiList = menuTable.querySelectorAll("li");
    for (var i = 0; i < menuTableLiList.length; i++) {
        menuTableLiList[i].querySelector(".menubutton").classList.remove("selected");
    }
    
    oLogAnchor.classList.add("selected");

    var inhaltDiv = document.getElementById("inhalt");
    while (inhaltDiv.firstChild) {
        inhaltDiv.removeChild(inhaltDiv.firstChild);
    }
    
    var buttonzDiv = document.createElement("div");
    buttonzDiv.id = "buttonz";
    
    var headerDiv = document.createElement("div");
    headerDiv.className = "header";
    
    var headerH2 = document.createElement("h2");
    
    var headerText = document.createTextNode("OLog Settings");
    
    var contentDiv = document.createElement("div");
    contentDiv.className = "content";
    
    var fieldwrapperDiv = document.createElement("div");
    fieldwrapperDiv.className = "fieldwrapper";
    
    var oLogInstanceUrlLabel = document.createElement("label");
    oLogInstanceUrlLabel.className = "styled textBeefy";
    
    var oLogInstanceUrlText = document.createTextNode("OLog Instance URL:");
    
    var oLogInstanceUrlTheFieldDiv = document.createElement("div");
    oLogInstanceUrlTheFieldDiv.className = "thefield";
    
    var oLogInstanceUrlInput = document.createElement("input");
    oLogInstanceUrlInput.className = "textinput w200";
    oLogInstanceUrlInput.type = "text";
    oLogInstanceUrlInput.size = "30";
    oLogInstanceUrlInput.value = oLogInstanceUrl;
    oLogInstanceUrlInput.maxlength = "20";
    
    var settingsSaveDiv = document.createElement("div");
    settingsSaveDiv.className = "textCenter";
    
    var settingsSaveInput = document.createElement("input");
    settingsSaveInput.className = "btn_blue";
    settingsSaveInput.type = "submit";
    settingsSaveInput.value = "Save settings";
    settingsSaveInput.onclick = function() {
        GM_setValue("settings.ologinstanceurl", oLogInstanceUrlInput.value);
    };
    
    oLogInstanceUrlLabel.appendChild(oLogInstanceUrlText);
    oLogInstanceUrlTheFieldDiv.appendChild(oLogInstanceUrlInput);
    fieldwrapperDiv.appendChild(oLogInstanceUrlLabel);
    fieldwrapperDiv.appendChild(oLogInstanceUrlTheFieldDiv);
    
    settingsSaveDiv.appendChild(settingsSaveInput);
    
    contentDiv.appendChild(fieldwrapperDiv);
    contentDiv.appendChild(settingsSaveDiv);
    
    headerH2.appendChild(headerText);
    headerDiv.appendChild(headerH2);
    buttonzDiv.appendChild(headerDiv);
    buttonzDiv.appendChild(contentDiv);
    inhaltDiv.appendChild(buttonzDiv);
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
            var key = node.querySelector(".icon_apikey").title;
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
        url: oLogInstanceUrl + "/api/userscript/" + object.endpoint,
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