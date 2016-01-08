// ==UserScript==
// @name                OGNext
// @namespace           http://www.ognext.com/
// @description         OGNext Userscript
// @downloadURL         https://github.com/skiwi2/OGNext-Userscript/raw/master/ognext.user.js
// @updateURL           https://github.com/skiwi2/OGNext-Userscript/raw/master/ognext.user.js
// @version             0.3pre
// @include             http://s*-*.ogame.gameforge.com/game/*
// @grant               GM_xmlhttpRequest
// @grant               GM_getValue
// @grant               GM_setValue
// @require             functions.js
// ==/UserScript==

"use strict";

var oLogInstanceUrl = getSetting("settings.ognextinstanceurl", "http://localhost:8080/");

var menuTable = document.getElementById("menuTable");

menuTable.insertAdjacentHTML("beforeend", '' +
    '<li id="ognextMenuLi">\n' +
    '    <a id="ognextMenuAnchor" class="menubutton" href="#ognextsettings">\n' +
    '        <span class="textlabel">OGNext Settings</span>\n' +
    '    </a>\n' +
    '</li>\n');

var oLogMenuLi = document.getElementById("ognextMenuLi");
oLogMenuLi.addEventListener("focus", function(c) {
    if (b(c.target).closest(".dropdown").length == 0) {
        b(".currentlySelected a").removeClass("hover");
        b(".currentlySelected").removeClass("focus");
    }
});

var oLogMenuAnchor = document.getElementById("ognextMenuAnchor");
oLogMenuAnchor.addEventListener("click", function() {
    showOGNextSettings();
});

if (window.location.hash === "#ognextsettings") {
    showOGNextSettings();
}

function showOGNextSettings() {
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
        '                <h2>OGNext Settings</h2>\n' +
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
        '                <label class="styled textBeefy">OGNext Instance URL:</label>\n' +
        '                <div class="thefield">\n' +
        '                    <input class="textinput w200" type="text" size="30" value="' + oLogInstanceUrl + '" id="ognextInstanceUrlInput" />\n' +
        '                </div>\n' +
        '            </div>\n' +
        '            <div class="textCenter">\n' +
        '                <input class="btn_blue" type="submit" value="Save settings" id="ognextSaveSettingsInput" />\n' +
        '            </div>\n' +
        '            <div class="footer"></div>\n' +
        '            <br class="clearfloat" />\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '');

    var oLogInstanceUrlInput = document.getElementById("ognextInstanceUrlInput");

    var oLogSaveSettingsInput = document.getElementById("ognextSaveSettingsInput");
    oLogSaveSettingsInput.addEventListener("click", function() {
        saveSetting("settings.ognextinstanceurl", oLogInstanceUrlInput.value);
        saveSetting(getFullCacheKey("planets"), "");
        saveSetting(getFullCacheKey("researches"), "");
        saveSetting(getFullCacheKey("resource_buildings"), "");
        saveSetting(getFullCacheKey("facility_buildings"), "");
        saveSetting(getFullCacheKey("defences"), "");
        saveSetting(getFullCacheKey("fleet"), "");
        saveSetting(getFullCacheKey("shipyard"), "");
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
                    //send all messages at once such that all report keys can be sent at once to the server
                    processMessageNodes(node.querySelectorAll(".msg"));
                }
            }
        });
    });
    
    observer.observe(document, { childList: true, subtree: true });
}
else if (page === "research") {
    var itemBoxDivs = document.querySelectorAll(".item_box");
    processResearchNodes(itemBoxDivs);
}
else if (page === "resources") {
    var itemBoxDivs = document.querySelectorAll("[class^='supply']");
    processResourceBuildingNodes(itemBoxDivs);
}
else if (page === "station") {
    var itemBoxDivs = document.querySelectorAll(".item_box");
    processFacilityBuildingNodes(itemBoxDivs);
}
else if (page === "defense") {
    var itemBoxDivs = document.querySelectorAll(".item_box");
    processDefenceNodes(itemBoxDivs);
}
else if (page === "fleet1") {
    var liButtonDivs = document.querySelectorAll("li[id^='button']");
    processFleetNodes(liButtonDivs);
}
else if (page === "shipyard") {
    var itemBoxDivs = document.querySelectorAll(".item_box");
    processShipyardNodes(itemBoxDivs);
}

var planetListDiv = document.getElementById("planetList");
if (planetListDiv !== null) {
    processPlanetNodes(planetListDiv.children);
}