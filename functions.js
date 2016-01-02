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
    
    postData({
        endpoint: "keys",
        data: {
            reportKeys: reportKeys
        }
    });
}

function processPlanetNodes(nodes) {
    var planets = [];
    
    for (var i = 0; i < nodes.length; i++) {
        var planetDiv = nodes[i];
        var planetId = planetDiv.id.replace("planet-", "");
        var planetName = planetDiv.querySelector(".planet-name").innerHTML;
        var planetCoordsRaw = planetDiv.querySelector(".planet-koords").innerHTML;
        var planetCoordsList = planetCoordsRaw.slice(1, -1).split(":");
        planets.push({
            id: planetId,
            name: planetName,
            galaxy: planetCoordsList[0],
            solarSystem: planetCoordsList[1],
            position: planetCoordsList[2]
        });
    }
    
    var planetsString = JSON.stringify(planets);
    if (getSetting("planets_cache", "") !== planetsString) {
        postData({
            endpoint: "planets",
            data: {
                planets: planets
            }
        });
        saveSetting("planets_cache", planetsString);
    }
}

function processResearchNodes(nodes) {
    var researches = [];

    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var detailButtonElement = node.querySelector(".detail_button");
        if (detailButtonElement !== null) {
            var researchId = detailButtonElement.getAttribute("ref");
            var cloneLevelNode = detailButtonElement.querySelector(".level").cloneNode(true);
            var children = [].slice.call(cloneLevelNode.children);
            
            for (var j = 0; j < children.length; j++) {
                var child = children[j];
                if (child.className === "textlabel" || child.className === "undermark") {
                    cloneLevelNode.removeChild(child);
                }
            }
            var researchLevel = cloneLevelNode.innerHTML.trim();
            
            researches.push({
                id: researchId,
                level: researchLevel
            });
        }
    }
    
    var researchesString = JSON.stringify(researches);
    if (getSetting("researches_cache", "") !== researchesString) {
        postData({
            endpoint: "researches",
            data: {
                researches: researches
            }
        });
        saveSetting("researches_cache", researchesString);
    }
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