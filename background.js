chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.executeScript(tab.id, {
		file: 'inject.js'
	});
});

chrome.runtime.onInstalled.addListener(function() {
	chrome.contextMenus.create({
		id: "ussabout",
		title: "About",
		contexts: ["browser_action"]
	});
	chrome.contextMenus.onClicked.addListener(function(info/*, tab*/) {
		if(info.menuItemId !== "ussabout") return;
		chrome.tabs.create({url: "https://github.com/Kuass"});
	});
});