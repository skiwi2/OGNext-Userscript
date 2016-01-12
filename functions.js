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
    var moons = [];
    
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

        var moonAnchor = planetDiv.querySelector(".moonlink");
        if (moonAnchor !== null) {
            var moonHref = moonAnchor.href;
            var moonHrefParts = moonHref.split("&cp=");
            var moonId = moonHrefParts[1];
            var moonName = "Moon";  //TODO find a way to extract this, currently it is only possible if you are on the associated planet or moon, which is not good enough
            moons.push({
                id: moonId,
                name: moonName,
                galaxy: planetCoordsList[0],
                solarSystem: planetCoordsList[1],
                position: planetCoordsList[2]
            });
        }
    }
    
    executeIfNotCached("planets", planets, function () {
        postData({
            endpoint: "planets",
            data: {
                planets: planets
            }
        });
    });

    executeIfNotCached("moons", moons, function () {
        postData({
            endpoint: "moons",
            data: {
                moons: moons
            }
        });
    });
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
    
    executeIfNotCached("researches", researches, function () {
        postData({
            endpoint: "researches",
            data: {
                researches: researches
            }
        });
    });
}

function processResourceBuildingNodes(supplyNodes, itemBoxNodes) {
    var buildings = [];

    for (var i = 0; i < supplyNodes.length; i++) {
        var node = supplyNodes[i];
        var detailButtonElement = node.querySelector("[id='details']");
        if (detailButtonElement !== null) {
            var buildingId = detailButtonElement.getAttribute("ref");
            var cloneLevelNode = detailButtonElement.querySelector(".level").cloneNode(true);
            var children = [].slice.call(cloneLevelNode.children);
            
            for (var j = 0; j < children.length; j++) {
                var child = children[j];
                if (child.className === "textlabel" || child.className === "undermark") {
                    cloneLevelNode.removeChild(child);
                }
            }
            var buildingLevel = cloneLevelNode.innerHTML.trim();
            
            buildings.push({
                id: buildingId,
                level: buildingLevel
            });
        }
    }
    
    for (var i = 0; i < itemBoxNodes.length; i++) {
        var node = itemBoxNodes[i];
        var detailButtonElement = node.querySelector("[id^='details']");
        if (detailButtonElement !== null) {
            var buildingId = detailButtonElement.getAttribute("ref");
            var cloneLevelNode = detailButtonElement.querySelector(".level").cloneNode(true);
            var children = [].slice.call(cloneLevelNode.children);
            
            for (var j = 0; j < children.length; j++) {
                var child = children[j];
                if (child.className === "textlabel" || child.className === "undermark") {
                    cloneLevelNode.removeChild(child);
                }
            }
            var buildingLevel = cloneLevelNode.innerHTML.trim();
            
            buildings.push({
                id: buildingId,
                level: buildingLevel
            });
        }
    }

    var planetType = getPlanetType();
    if (planetType === "planet") {
        executeIfNotCachedForPlanet("resource_buildings", buildings, function () {
            var data = {
                buildings: buildings
            };
            addPlanetData(data);
            postData({
                endpoint: "planetResourceBuildings",
                data: data
            });
        });
    }
    else if (planetType === "moon") {
        executeIfNotCachedForMoon("resource_buildings", buildings, function () {
            var data = {
                buildings: buildings
            };
            addMoonData(data);
            postData({
                endpoint: "moonResourceBuildings",
                data: data
            });
        });
    }
}

function processFacilityBuildingNodes(nodes) {
    var buildings = [];

    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var detailButtonElement = node.querySelector(".detail_button");
        if (detailButtonElement !== null) {
            var buildingId = detailButtonElement.getAttribute("ref");
            var cloneLevelNode = detailButtonElement.querySelector(".level").cloneNode(true);
            var children = [].slice.call(cloneLevelNode.children);
            
            for (var j = 0; j < children.length; j++) {
                var child = children[j];
                if (child.className === "textlabel" || child.className === "undermark") {
                    cloneLevelNode.removeChild(child);
                }
            }
            var buildingLevel = cloneLevelNode.innerHTML.trim();
            
            buildings.push({
                id: buildingId,
                level: buildingLevel
            });
        }
    }

    var planetType = getPlanetType();
    if (planetType === "planet") {
        executeIfNotCachedForPlanet("facility_buildings", buildings, function () {
            var data = {
                buildings: buildings
            };
            addPlanetData(data);
            postData({
                endpoint: "planetFacilityBuildings",
                data: data
            });
        });
    }
    else if (planetType === "moon") {
        executeIfNotCachedForMoon("facility_buildings", buildings, function () {
            var data = {
                buildings: buildings
            };
            addMoonData(data);
            postData({
                endpoint: "moonFacilityBuildings",
                data: data
            });
        });
    }
}

function processDefenceNodes(nodes) {
    var defences = [];

    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var detailButtonElement = node.querySelector(".detail_button");
        if (detailButtonElement !== null) {
            var defenceId = detailButtonElement.getAttribute("ref");
            var cloneLevelNode = detailButtonElement.querySelector(".level").cloneNode(true);
            var children = [].slice.call(cloneLevelNode.children);
            
            for (var j = 0; j < children.length; j++) {
                var child = children[j];
                if (child.className === "textlabel" || child.className === "undermark") {
                    cloneLevelNode.removeChild(child);
                }
            }
            var defenceAmount = cloneLevelNode.innerHTML.trim();
            
            defences.push({
                id: defenceId,
                amount: defenceAmount
            });
        }
    }

    var planetType = getPlanetType();
    if (planetType === "planet") {
        executeIfNotCachedForPlanet("defences", defences, function () {
            var data = {
                defences: defences
            };
            addPlanetData(data);
            postData({
                endpoint: "planetDefences",
                data: data
            });
        });
    }
    else if (planetType === "moon") {
        executeIfNotCachedForMoon("defences", defences, function () {
            var data = {
                defences: defences
            };
            addMoonData(data);
            postData({
                endpoint: "moonDefences",
                data: data
            });
        });
    }
}

function processFleetNodes(nodes) {
    var fleet = [];

    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var aTooltipElement = node.querySelector(".tooltip");
        if (aTooltipElement !== null) {
            var fleetId = node.id.replace(/\D/g, "");
            var cloneLevelNode = aTooltipElement.querySelector(".level").cloneNode(true);
            var children = [].slice.call(cloneLevelNode.children);
            
            for (var j = 0; j < children.length; j++) {
                var child = children[j];
                if (child.className === "textlabel" || child.className === "undermark") {
                    cloneLevelNode.removeChild(child);
                }
            }
            var fleetAmount = cloneLevelNode.innerHTML.trim();
            
            fleet.push({
                id: fleetId,
                amount: fleetAmount
            });
        }
    }

    var planetType = getPlanetType();
    if (planetType === "planet") {
        executeIfNotCachedForPlanet("fleet", fleet, function () {
            var data = {
                fleet: fleet
            };
            addPlanetData(data);
            postData({
                endpoint: "planetFleet",
                data: data
            });
        });
    }
    else if (planetType === "moon") {
        executeIfNotCachedForMoon("fleet", fleet, function () {
            var data = {
                fleet: fleet
            };
            addMoonData(data);
            postData({
                endpoint: "moonFleet",
                data: data
            });
        });
    }
}

function processShipyardNodes(nodes) {
    var shipyard = [];

    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var detailButtonElement = node.querySelector(".detail_button");
        if (detailButtonElement !== null) {
            var fleetId = detailButtonElement.getAttribute("ref");
            var cloneLevelNode = detailButtonElement.querySelector(".level").cloneNode(true);
            var children = [].slice.call(cloneLevelNode.children);
            
            for (var j = 0; j < children.length; j++) {
                var child = children[j];
                if (child.className === "textlabel" || child.className === "undermark") {
                    cloneLevelNode.removeChild(child);
                }
            }
            var fleetAmount = cloneLevelNode.innerHTML.trim();
            
            shipyard.push({
                id: fleetId,
                amount: fleetAmount
            });
        }
    }

    var planetType = getPlanetType();
    if (planetType === "planet") {
        executeIfNotCachedForPlanet("shipyard", shipyard, function () {
            var data = {
                shipyard: shipyard
            };
            addPlanetData(data);
            postData({
                endpoint: "planetShipyard",
                data: data
            });
        });
    }
    else if (planetType === "moon") {
        executeIfNotCachedForMoon("shipyard", shipyard, function () {
            var data = {
                shipyard: shipyard
            };
            addMoonData(data);
            postData({
                endpoint: "moonShipyard",
                data: data
            });
        });
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

function addPlanetData(data) {
    data.planetId = getMetaValue("ogame-planet-id");
    data.planetName = getMetaValue("ogame-planet-name");
    var coordinate = getMetaValue("ogame-planet-coordinates").split(":");
    data.planetGalaxy = coordinate[0];
    data.planetSolarSystem = coordinate[1];
    data.planetPosition = coordinate[2];
}

function addMoonData(data) {
    data.moonId = getMetaValue("ogame-planet-id");
    data.moonName = getMetaValue("ogame-planet-name");
    var coordinate = getMetaValue("ogame-planet-coordinates").split(":");
    data.moonGalaxy = coordinate[0];
    data.moonSolarSystem = coordinate[1];
    data.moonPosition = coordinate[2];
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

function getMetaValue(name) {
    return document.querySelector("meta[name='" + name + "']").content;
}

function showSuccessMessage(message) {
    getWindowVariable("fadeBox")(message, false);
}

function showErrorMessage(message) {
    getWindowVariable("fadeBox")(message, true);
}

function saveSetting(key, value) {
    GM_setValue(getFullSettingsKey(key), value);
}

function getSetting(key, defaultValue) {
    return GM_getValue(getFullSettingsKey(key), defaultValue);
}

function getFullSettingsKey(key) {
    return getWindowVariable("constants.language") + ":" + getWindowVariable("constants.name") + ":" + getWindowVariable("playerId") + ":" + key;
}

function executeIfNotCached(cacheKey, value, callback) {
    var valueString = JSON.stringify(value);
    var fullCacheKey = getFullCacheKey(cacheKey);
    if (getSetting(fullCacheKey, "") !== valueString) {
        callback();
        saveSetting(fullCacheKey, valueString);
    }
}

function executeIfNotCachedForPlanet(cacheKey, value, callback) {
    var valueString = JSON.stringify(value);
    var planetCacheKey = getPlanetCacheKey(cacheKey);
    var fullCacheKey = getFullCacheKey(planetCacheKey);
    if (getSetting(fullCacheKey, "") !== valueString) {
        callback();
        saveSetting(fullCacheKey, valueString);
        addPlanetCacheKeyToUsedCacheKeys(planetCacheKey);
    }
}

function executeIfNotCachedForMoon(cacheKey, value, callback) {
    var valueString = JSON.stringify(value);
    var moonCacheKey = getMoonCacheKey(cacheKey);
    var fullCacheKey = getFullCacheKey(moonCacheKey);
    if (getSetting(fullCacheKey, "") !== valueString) {
        callback();
        saveSetting(fullCacheKey, valueString);
        addMoonCacheKeyToUsedCacheKeys(moonCacheKey);
    }
}

function getPlanetCacheKey(cacheKey) {
    return getMetaValue("ogame-planet-id") + "_" + cacheKey;
}

function getMoonCacheKey(cacheKey) {
    return getMetaValue("ogame-planet-id") + "_" + cacheKey;
}

function getFullCacheKey(cacheKey) {
    return "cache." + cacheKey;
}

function addPlanetCacheKeyToUsedCacheKeys(planetCacheKey) {
    var planetCacheKeys = getSetting("planetCacheKeys", "");
    if (planetCacheKeys.indexOf(planetCacheKey) === -1) {
        planetCacheKeys = planetCacheKeys + ";" + planetCacheKey;
        saveSetting("planetCacheKeys", planetCacheKeys);
    }
}

function getUsedPlanetCacheKeys() {
    var planetCacheKeys = getSetting("planetCacheKeys", "");
    return planetCacheKeys.split(";").filter(function (value) {
        return value !== "";
    });
}

function addMoonCacheKeyToUsedCacheKeys(moonCacheKey) {
    var moonCacheKeys = getSetting("moonCacheKeys", "");
    if (moonCacheKeys.indexOf(moonCacheKey) === -1) {
        moonCacheKeys = moonCacheKeys + ";" + moonCacheKey;
        saveSetting("moonCacheKeys", moonCacheKeys);
    }
}

function getUsedMoonCacheKeys() {
    var moonCacheKeys = getSetting("moonCacheKeys", "");
    return moonCacheKeys.split(";").filter(function (value) {
        return value !== "";
    });
}

function getPlanetType() {
    return getMetaValue("ogame-planet-type");
}