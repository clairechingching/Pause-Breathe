//
//
const activeTimers = {};
//
//
chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set({ delaySeconds: 12 }, function() {
		console.log("Default delay set to 12 seconds.");
  	});
});
//
// Modify the main listener to include a return true and proper error handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'START_BROWSING_TIMER') {
        console.log('Starting timer for tab:', sender.tab.id);
        const tabId = sender.tab.id;
        const browsingTime = message.browsingTime;

        // Clear any existing timer for this tab
        if (activeTimers[tabId]) {
            clearTimeout(activeTimers[tabId]);
        }

        // Set a new timer
        activeTimers[tabId] = setTimeout(() => {
            chrome.tabs.sendMessage(tabId, { type: 'TIME_UP' });
        }, browsingTime * 60000);
    }

    if (message.type === 'CLOSE_TAB') {
        console.log('Closing tab:', sender.tab.id);
        // Add validation here if needed
        if (activeTimers[sender.tab.id]) {
            chrome.tabs.remove(sender.tab.id);
            delete activeTimers[sender.tab.id];
        }
    }

    return true; // Important: indicates async response
});

