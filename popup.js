//
//
document.addEventListener('DOMContentLoaded', function () {
  	const sliders = document.querySelectorAll('.slider');

  	// Automatically save preferences when the slider value changes
  	sliders.forEach(slider => {
    	const valueDisplay = slider.nextElementSibling; // Display span next to the slider

    	// Update value display and save on slider input change
    	slider.addEventListener('input', function () {
      		const delay = parseInt(slider.value, 10);
      		const site = slider.getAttribute('data-site');
			
      		valueDisplay.textContent = `${delay}s`; // Display the current value in seconds
      		// Save the updated delay time for the site
      		chrome.storage.sync.get('delaySites', function(result) {
				const delaySites = result.delaySites || {};
        
				// If delay is 0, remove the site from storage; otherwise, save it
				if (delay === 0) {
						delete delaySites[site];
				} else {
						delaySites[site] = delay;
				}

				chrome.storage.sync.set({ delaySites }, function () {
						console.log('Auto-saved delay for', site, ':', delay, 'seconds');
				});
      		});
    	});
  	});

  	// Load saved preferences
  	chrome.storage.sync.get('delaySites', function (result) {
    	const delaySites = result.delaySites || {};

    	sliders.forEach(slider => {
			const site = slider.getAttribute('data-site');
			const savedValue = delaySites[site] || 0;
			slider.value = savedValue;
      		slider.nextElementSibling.textContent = `${savedValue}s`;
    	});
  	});
	
	
	const today = new Date().toDateString(); // Get today's date as a string

  	// Retrieve and reset the close count if necessary
  	chrome.storage.sync.get(['closeCount', 'lastResetDate'], function(result) {
    	let closeCount = result.closeCount || 0;
    	const lastResetDate = result.lastResetDate || today;

    	if (lastResetDate !== today) {
      		// Reset the counter if it's a new day
      		closeCount = 0;
      		chrome.storage.sync.set({ closeCount: 0, lastResetDate: today }, () => {
        		console.log('Daily close count reset');
      		});
    	}
		
		// Display the close count in the popup
    	document.getElementById('closeCountDisplay').textContent = `${closeCount}`;
  	});
});

