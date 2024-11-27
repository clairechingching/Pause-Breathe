//
console.log('Hello from content.js');
//
chrome.storage.sync.get(['delaySites'
						, 'browseTimes'
						, 'closeCount'
						, 'lastResetDate'], function(result) {
 	//	
	const delaySites = result.delaySites || {};
	const currentSite = window.location.hostname;
	const closeCount = result.closeCount || 0;
	//	
	for (let site in delaySites) {
		if (currentSite.includes(site)) {
		//	
		const delay = delaySites[site] * 1000; // Convert to milliseconds
		//	
		// Breathing exercise overlay
		const overlay = document.createElement('div');
		overlay.style.position = 'fixed';
		overlay.style.top = 0;
		overlay.style.left = 0;
		overlay.style.width = '100%';
		overlay.style.height = '100%';
		overlay.style.backgroundColor = 'rgba(34, 34, 34, 1.0)';
		overlay.style.display = 'flex';
		overlay.style.alignItems = 'center';
		overlay.style.justifyContent = 'center';
		overlay.style.zIndex = 9999;
		///
		/// Breathing circle
		const circle = document.createElement('div');
		circle.classList.add('breathing-circle');
		//	
		overlay.appendChild(circle);
		//	
		function addOverlayWhenReady() {
			if (document.body) {
				document.body.appendChild(overlay);
			} else {
				requestAnimationFrame(addOverlayWhenReady);
			}
		}
		//	
		addOverlayWhenReady();	
		//
		// Remove the breathing overlay after the delay
    	setTimeout(() => {
      		overlay.innerHTML = `
        		<div style="color: white; font-size: 24px; text-align: center;">
          		<p>Do you still want to visit this site?</p>
          		<button id="stayButton" style="margin-right: 10px;">Yes</button>
          		<button id="closeButton">No</button>
				</div>
      		`;

      		// Add event listeners to the buttons
      		document.getElementById('stayButton').addEventListener('click', () => {
        		overlay.remove(); // User chooses to stay
      		});
      
			document.getElementById('closeButton').addEventListener('click', () => {
        		// Update the close count
        		let newCloseCount = closeCount + 1;
				const today = new Date().toDateString();
        		// Store the updated close count and the current date if resetting daily
        		chrome.storage.sync.set({ closeCount: newCloseCount, lastResetDate: today }, function() {
						console.log(`Close count updated to ${newCloseCount}`);
				});

        		// Attempt to close the tab
				chrome.runtime.sendMessage({ type: 'CLOSE_TAB' });
      		});
    	
		}, delay); // Show the prompt after the breathing delay
		}	
	}
	
	const browseTimes = result.browseTimes || {};
	for (let site in browseTimes) {
    	if (currentSite.includes(site)) {
			const browsingTime = browseTimes[site];
			console.log(`Start timer for ${site}: ${browsingTime} minutes`);

			// Send message to background script with browsing time
			chrome.runtime.sendMessage({
				type: "START_BROWSING_TIMER",
				browsingTime: browsingTime,
        	});
    	}
	}
	
});
//
//
// content.js

// Function to display the overlay
function showTimeUpOverlay() {
    // Create the overlay div
    const overlay = document.createElement('div');
    overlay.id = 'timeUpOverlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.color = '#fff';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '10000';
    overlay.style.fontFamily = 'Arial, sans-serif';
    
    // Add a message
    const message = document.createElement('p');
    message.textContent = "Time's up for this application!";
    message.style.fontSize = '24px';
    message.style.marginBottom = '20px';
    overlay.appendChild(message);

    // Add a close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close Tab';
    closeButton.style.padding = '10px 20px';
    closeButton.style.fontSize = '16px';
    closeButton.style.backgroundColor = '#ff4d4d';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.style.borderRadius = '5px';
    closeButton.style.transition = 'background-color 0.3s';

    closeButton.addEventListener('mouseenter', () => {
        closeButton.style.backgroundColor = '#ff6666';
    });
    closeButton.addEventListener('mouseleave', () => {
        closeButton.style.backgroundColor = '#ff4d4d';
    });

    // Close the tab when the button is clicked
    closeButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({ type: 'CLOSE_TAB' });
    });

    overlay.appendChild(closeButton);
    document.body.appendChild(overlay);
}

// Listen for the time-up message
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'TIME_UP') {
        showTimeUpOverlay();
    }
});

