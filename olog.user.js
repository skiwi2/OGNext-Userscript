// ==UserScript==
// @name                OLog
// @namespace	        http://www.olog.com/
// @description	        OLog Userscript
// @include		http://s135-en.ogame.gameforge.com/game/*
// ==/UserScript==

var page = getQueryVariable("page");

if (page === "messages") {
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			for (var node of mutation.addedNodes) {
				if (node.localName === "ul" && node.classList.contains("tab_inner")) {
					for (var messageNode of node.querySelectorAll(".msg")) {
						processMessageNode(messageNode);
					}
				}
			}
		});
	});
	
	observer.observe(document, { childList: true, subtree: true });
}

function processMessageNode(node) {
	console.log(node);
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}