// ==UserScript==
// @name                OLog
// @namespace           http://www.olog.com/
// @description         OLog Userscript
// @downloadURL         https://github.com/skiwi2/OLog-Userscript/raw/master/olog.user.js
// @updateURL           https://github.com/skiwi2/OLog-Userscript/raw/master/olog.user.js
// @version             0.2
// @include             http://s*-*.ogame.gameforge.com/game/*
// @include             https://s*-*.ogame.gameforge.com/game/*
// @grant               GM_xmlhttpRequest
// @grant               GM_getValue
// @grant               GM_setValue
// ==/UserScript==

"use strict";

var oLogInstanceUrl = getSetting("settings.ologinstanceurl", "http://localhost:8080/");

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

    var contentWrapperDiv = document.getElementById("contentWrapper");
    while (contentWrapperDiv.firstChild) {
        contentWrapperDiv.removeChild(contentWrapperDiv.firstChild);
    }
    
    var inhaltDiv = document.createElement("div");
    inhaltDiv.id = "inhalt";
    
    var buttonzDiv = document.createElement("div");
    buttonzDiv.id = "buttonz";
    
    var headerDiv = document.createElement("div");
    headerDiv.className = "header";
    
    var headerH2 = document.createElement("h2");
    
    var headerText = document.createTextNode("Your settings");
    
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
        saveSetting("settings.ologinstanceurl", oLogInstanceUrlInput.value);
        showSuccessMessage("Settings have been saved.");
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
    
    var planetDiv = document.createElement("div");
    planetDiv.id = "planet";
    planetDiv.style = "background-image: url(http://gf2.geo.gfsrv.net/cdndd/09a2a0d07394b5a7b5db40f5cbb8cc.jpg);";
    
    var detailWrapperDiv = document.createElement("div");
    detailWrapperDiv.id = "detailWrapper";
    
    var headerTextDiv = document.createElement("div");
    headerTextDiv.id = "header_text";
    
    var headerTextH2 = document.createElement("h2");
    
    var headerTextText = document.createTextNode("OLog Settings");
    
    headerTextH2.appendChild(headerTextText);
    headerTextDiv.appendChild(headerTextH2);
    
    var planetdataDiv = document.createElement("div");
    planetdataDiv.id = "planetdata";
    
    var overlayDiv = document.createElement("div");
    overlayDiv.className = "overlay";
    
    var planetDetailsDiv = document.createElement("div");
    planetDetailsDiv.id = "planetDetails";
    
    var planetDetailsTable = document.createElement("table");
    planetDetailsTable.width = "100%";
    planetDetailsTable.cellspacing = "0";
    planetDetailsTable.cellpadding = "0";
    
    var planetDetailsTbody = document.createElement("tbody");
    
    var planetDetailsTr1 = document.createElement("tr");
    
    var planetDetailsTr1DescTd = document.createElement("td");
    planetDetailsTr1DescTd.className = "desc";
    
    var planetDetailsTr1DescTdContent = document.createTextNode("Server Group");
    planetDetailsTr1DescTd.appendChild(planetDetailsTr1DescTdContent);
    
    var planetDetailsTr1DataTd = document.createElement("td");
    planetDetailsTr1DataTd.className = "data";
    
    var planetDetailsTr1DataTdContent = document.createTextNode(getWindowVariable("constants.language"));
    planetDetailsTr1DataTd.appendChild(planetDetailsTr1DataTdContent);
    
    planetDetailsTr1.appendChild(planetDetailsTr1DescTd);
    planetDetailsTr1.appendChild(planetDetailsTr1DataTd);
    
    var planetDetailsTr2 = document.createElement("tr");
    
    var planetDetailsTr2DescTd = document.createElement("td");
    planetDetailsTr2DescTd.className = "desc";
    
    var planetDetailsTr2DescTdContent = document.createTextNode("Universe ID");
    planetDetailsTr2DescTd.appendChild(planetDetailsTr2DescTdContent);
    
    var planetDetailsTr2DataTd = document.createElement("td");
    planetDetailsTr2DataTd.className = "data";
    
    var planetDetailsTr2DataTdContent = document.createTextNode(getWindowVariable("constants.name"));
    planetDetailsTr2DataTd.appendChild(planetDetailsTr2DataTdContent);
    
    planetDetailsTr2.appendChild(planetDetailsTr2DescTd);
    planetDetailsTr2.appendChild(planetDetailsTr2DataTd);
    
    var planetDetailsTr3 = document.createElement("tr");
    
    var planetDetailsTr3DescTd = document.createElement("td");
    planetDetailsTr3DescTd.className = "desc";
    
    var planetDetailsTr3DescTdContent = document.createTextNode("Player ID");
    planetDetailsTr3DescTd.appendChild(planetDetailsTr3DescTdContent);
    
    var planetDetailsTr3DataTd = document.createElement("td");
    planetDetailsTr3DataTd.className = "data";
    
    var planetDetailsTr3DataTdContent = document.createTextNode(getWindowVariable("playerId"));
    planetDetailsTr3DataTd.appendChild(planetDetailsTr3DataTdContent);
    
    planetDetailsTr3.appendChild(planetDetailsTr3DescTd);
    planetDetailsTr3.appendChild(planetDetailsTr3DataTd);
    
    var planetDetailsTr4 = document.createElement("tr");
    
    var planetDetailsTr4DescTd = document.createElement("td");
    planetDetailsTr4DescTd.className = "desc";
    
    var planetDetailsTr4DescTdContent = document.createTextNode("Player Name");
    planetDetailsTr4DescTd.appendChild(planetDetailsTr4DescTdContent);
    
    var planetDetailsTr4DataTd = document.createElement("td");
    planetDetailsTr4DataTd.className = "data";
    
    var planetDetailsTr4DataTdContent = document.createTextNode(getWindowVariable("playerName"));
    planetDetailsTr4DataTd.appendChild(planetDetailsTr4DataTdContent);
    
    planetDetailsTr4.appendChild(planetDetailsTr4DescTd);
    planetDetailsTr4.appendChild(planetDetailsTr4DataTd);
    
    var planetDetailsTr5 = document.createElement("tr");
    
    var planetDetailsTr5DescTd = document.createElement("td");
    planetDetailsTr5DescTd.className = "desc";
    
    var planetDetailsTr5DescTdContent = document.createTextNode("Userscript Version");
    planetDetailsTr5DescTd.appendChild(planetDetailsTr5DescTdContent);
    
    var planetDetailsTr5DataTd = document.createElement("td");
    planetDetailsTr5DataTd.className = "data";
    
    var planetDetailsTr5DataTdContent = document.createTextNode(GM_info.script.version);
    planetDetailsTr5DataTd.appendChild(planetDetailsTr5DataTdContent);
    
    planetDetailsTr5.appendChild(planetDetailsTr5DescTd);
    planetDetailsTr5.appendChild(planetDetailsTr5DataTd);
    
    planetDetailsTbody.appendChild(planetDetailsTr1);
    planetDetailsTbody.appendChild(planetDetailsTr2);
    planetDetailsTbody.appendChild(planetDetailsTr3);
    planetDetailsTbody.appendChild(planetDetailsTr4);
    planetDetailsTbody.appendChild(planetDetailsTr5);
    
    planetDetailsTable.appendChild(planetDetailsTbody);
    planetDetailsDiv.appendChild(planetDetailsTable);
    
    planetdataDiv.appendChild(overlayDiv);
    planetdataDiv.appendChild(planetDetailsDiv);
    
    detailWrapperDiv.appendChild(headerTextDiv);
    detailWrapperDiv.appendChild(planetdataDiv);
    
    planetDiv.appendChild(detailWrapperDiv);
    
    var cLeftDiv = document.createElement("div");
    cLeftDiv.className = "c-left";
    
    var cRightDiv = document.createElement("div");
    cRightDiv.className = "c-right";
    
    inhaltDiv.appendChild(planetDiv);
    inhaltDiv.appendChild(cLeftDiv);
    inhaltDiv.appendChild(cRightDiv);
    inhaltDiv.appendChild(buttonzDiv);
    
    contentWrapperDiv.appendChild(inhaltDiv);
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