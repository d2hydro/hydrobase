function parseId(Id) {
    // Regular expression pattern to match "Node" and the following numeric part
    var pattern = /^([a-zA-Z]+)\.(\d+)$/;

    // Use the pattern to match the input string
    var match = Id.match(pattern);

    // Check if the match was successful
    if (match) {
        // Extract the matched parts
        var layer = match[1]; // "Node"
        var fid = parseInt(match[2]); // Convert the numeric part to an integer

        // Return an object with layer and fid properties
        return {
            layer: layer,
            fid: fid
        };
    } else {
        // Return null for invalid input format
        return null;
    }
}



// Function to toggle the visibility of the div and fetch content from "/info"
async function openInfo(Id) {
    var result = parseId(Id);

    if (result) {
    var infoContainer = document.getElementById("info-container");
    var infoDiv = document.getElementById("info");

    // make info visible
    infoContainer.style.display = 'block';

    // set layer-selector position
    var currentWidth = infoContainer.offsetWidth;
    var layerSelector = document.getElementById("layer-selector");
    layerSelector.style.left = (currentWidth + 20) + 'px';

    if (infoContainer.style.display === 'block') {
        try {
            // Fetch content from "/info" and update the "info" div
            const response = await fetch(`/info?fid=${result.fid}&layer=${result.layer}`);
            const html = await response.text();
            infoDiv.innerHTML = html;

            // Check if nodeType is "Basin" and fetch additional data
            if (result.layer === "Node") {  // we need to fix this by parsing the plotly graph in jinja2, or finding a better way.
                // Fetching basinData
                const basinResponse = await fetch(`/basin?node_id=${result.fid}`);
                const basinData = await basinResponse.json();

                // Create basin_profile chart
                var basinProfileDiv = document.getElementById('basin_profile');
                var trace = {
                x: basinData.profile.area,
                y: basinData.profile.level,
                type: 'scatter',
                mode: 'lines+markers'
                };
                var layout = {
                title: 'profiel',
                xaxis: {title: 'Oppervlak [m2]',fixedrange: true},
                yaxis: {title: 'Hoogte [m+NAP]',fixedrange: true},
                
                margin: {
                    t: 40,  // Top margin
                    l: 50,  // Left margin
                    r: 40,  // Right margin
                    b: 40   // Bottom margin
                },
                dragmode: false
                };
                
                var config = {
                    displayModeBar: false,
                    scrollZoom: false,
                };
                
                Plotly.newPlot(basinProfileDiv, [trace], layout, config);

            }
        } catch (error) {
            console.error('Error fetching content:', error);
        }
    }
}
}
// Function to close the div
function closeInfo() {
    var infoContainer = document.getElementById("info-container");
    var infoDiv = document.getElementById("info");

    // make info invisible
    infoDiv.innerHTML = "";
    infoContainer.style.display = 'none';

    // clear search-source
    searchSource.clear();

    // set layer-selector position
    var currentWidth = infoContainer.offsetWidth;
    var layerSelector = document.getElementById("layer-selector");
    layerSelector.style.left = '20px';
}

// function update orientation
function updateOrientation() {
    verticalOrientation = window.innerWidth > window.innerHeight;

    
    if (verticalOrientation) {
        console.log("vertical orientation");

    } else {
        console.log("horizontal orientation");
    }
}

// Function to handle window resize
function handleWindowResize() {
    // Get the current innerWidth
    var currentWidth = window.innerWidth;

    // Do something with the currentWidth
    console.log("Window width changed to: " + currentWidth);
 
     
 }



// Attach an event listener for the resize event
window.addEventListener('resize', handleWindowResize);

// function to hide addressbar
function hideAddressBar() {
    isMobile = /iPhone|iPad|iPod|Android|BlackBerry|Windows Phone/i.test(navigator.userAgent);
    if (isMobile) {
        window.scrollTo(0, 100); // Scroll down by 1 pixel
    }
    }