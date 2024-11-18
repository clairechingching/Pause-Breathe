//
//
chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set({ delaySeconds: 12 }, function() {
		console.log("Default delay set to 12 seconds.");
  	});
});
//
//
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'closeTab' && sender.tab) {
    	chrome.tabs.remove(sender.tab.id, () => {
      		console.log('Tab closed by user request');
    	});
  	}
});

