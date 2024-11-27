//
//
const browsingTimes = [
	"1 min",
	"2 mins",
	"5 mins",
	"10 mins",
	"15 mins",
	"20 mins",
	"30 mins",
	"45 mins",
	"1 hour",
	"No Limit"
];
//
//
document.querySelectorAll('.delay-slider').forEach(slider => {
    const sliderValue = slider.nextElementSibling; // The associated .slider-value element

    // Function to update visibility based on mouse position
    const updateVisibility = (event) => {
        const thumbHover = event.offsetX >= slider.value * (slider.offsetWidth / slider.max) - 10 && 
                           event.offsetX <= slider.value * (slider.offsetWidth / slider.max) + 10;

        if (thumbHover) {
            sliderValue.style.visibility = 'visible';
            sliderValue.style.opacity = '1';
        } else {
            sliderValue.style.visibility = 'hidden';
            sliderValue.style.opacity = '0';
        }
    };

    // Ensure the value updates dynamically
    slider.addEventListener('input', function () {
        sliderValue.textContent = `${this.value}s`;
    });

    // Handle mouse movement on the slider
    slider.addEventListener('mousemove', updateVisibility);

    // Hide value when mouse leaves the slider
    slider.addEventListener('mouseleave', function () {
        sliderValue.style.visibility = 'hidden';
        sliderValue.style.opacity = '0';
    });
});
//
//
document.querySelectorAll('.browse-slider').forEach(slider => {
    const sliderValue = slider.nextElementSibling; // The associated .slider-value element

    // Function to update visibility based on mouse position
    const updateVisibility = (event) => {
        const thumbHover = event.offsetX >= slider.value * (slider.offsetWidth / slider.max) - 10 && 
                           event.offsetX <= slider.value * (slider.offsetWidth / slider.max) + 10;

        if (thumbHover) {
            sliderValue.style.visibility = 'visible';
            sliderValue.style.opacity = '1';
        } else {
            sliderValue.style.visibility = 'hidden';
            sliderValue.style.opacity = '0';
        }
    };

    // Ensure the value updates dynamically
    slider.addEventListener('input', function () {
        sliderValue.textContent = `${this.value}s`;
    });

    // Handle mouse movement on the slider
    slider.addEventListener('mousemove', updateVisibility);

    // Hide value when mouse leaves the slider
    slider.addEventListener('mouseleave', function () {
        sliderValue.style.visibility = 'hidden';
        sliderValue.style.opacity = '0';
    });
});
//
//
document.addEventListener('DOMContentLoaded', function () {
  	const sliders = document.querySelectorAll('.delay-slider');

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
  

	
	browse_sliders = document.querySelectorAll('.browse-slider');

  	// Automatically save preferences when the slider value changes
  	browse_sliders.forEach(slider => {
    	const valueDisplay = slider.nextElementSibling; // Display span next to the slider

    	// Update value display and save on slider input change
    	slider.addEventListener('input', function () {
      		const time = parseInt(slider.value, 10);
			const val = event.target.value;
			const selectedTime = browsingTimes[val];	
      		valueDisplay.textContent = `${selectedTime}`;

      		// Save the updated delay time for the site
      		const site = slider.getAttribute('data-site');
      		chrome.storage.sync.get('browseTimes', function(result) {
				const browseTimes = result.browseTimes || {};
       			const minutes = val == 9 ? 
						null : [1, 2, 5, 10, 15, 20, 30, 45, 60][val]; 
				// If delay is 0, remove the site from storage; otherwise, save it
				if (minutes === 0) {
						delete browseTimes[site];
				} else {
						browseTimes[site] = minutes;
				}

				chrome.storage.sync.set({ browseTimes }, function () {
						console.log('Auto-saved browse time for', site, ':', minutes, 'minutes');
				});
      		});
    	});
  	});


  	// Load saved preferences - delaySites
  	chrome.storage.sync.get('delaySites', function (result) {
    	const delaySites = result.delaySites || {};
		
		delay_sliders = document.querySelectorAll('.delay-slider');
    	delay_sliders.forEach(slider => {
			const site = slider.getAttribute('data-site');
			const savedValue = delaySites[site] || 0;
			slider.value = savedValue;
      		slider.nextElementSibling.textContent = `${savedValue}s`;
    	});
  	});
	
  	// Load saved preferences - browseTimes
  	chrome.storage.sync.get('browseTimes', function (result) {
    	const browseTimes = result.browseTimes || {};

		browse_sliders = document.querySelectorAll('.browse-slider');
    	browse_sliders.forEach(slider => {
			const site = slider.getAttribute('data-site');
			const browseTime = browseTimes[site] || null;
    		let sliderValue;
			if (browseTime === null) {
				sliderValue = 9;
			} else {
				const minuteValues = [1, 2, 5, 10, 15, 20, 30, 45, 60];
				sliderValue = minuteValues.indexOf(browseTime);
			}
			slider.value = sliderValue;
			const valueDisplay = slider.nextElementSibling;
			if (valueDisplay) {
				valueDisplay.textContent = browsingTimes[sliderValue];
			}
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

