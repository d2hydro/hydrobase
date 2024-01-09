// Function to toggle the visibility of the div and fetch content from "/info"
async function openInfo(nodeId, nodeType) {
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
            const response = await fetch(`/info?node_id=${nodeId}`);
            const html = await response.text();
            infoDiv.innerHTML = html;

            // Check if nodeType is "Basin" and fetch additional data
            if (nodeType === "Basin") {
                // Fetching basinData
                const basinResponse = await fetch(`/basin?node_id=${nodeId}`);
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
                xaxis: { title: 'Oppervlak [m2]' },
                yaxis: { title: 'Hoogte [m+NAP]' },
                margin: {
                    t: 40,  // Top margin
                    l: 50,  // Left margin
                    r: 40,  // Right margin
                    b: 40   // Bottom margin
                },
                };
                var config = {
                    displayModeBar: false
                };
                Plotly.newPlot(basinProfileDiv, [trace], layout, config);

            }
        } catch (error) {
            console.error('Error fetching content:', error);
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