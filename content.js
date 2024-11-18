//
console.log('Hello from content.js');
//
chrome.storage.sync.get(['delaySites'
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
				chrome.runtime.sendMessage({ action: 'closeTab' });
      		});
    	
		}, delay); // Show the prompt after the breathing delay
		}	
	}
});

