function parseId(feature) {
    // Regular expression pattern to match "Node" and the following numeric part
    var pattern = /^([a-zA-Z]+)\.(\d+)$/;

    // Use the pattern to match the input string
    var match = feature.id.match(pattern);

    // Check if the match was successful
    if (match) {
        // Extract the matched parts
        var layer = match[1]; // "Node"
        var fid = parseInt(match[2]); // Convert the numeric part to an integer

        // Return an object with layer and fid properties
        return {
            layer: layer,
            fid: fid,
            node_id:feature.properties.node_id
        };
    } else {
        // Return null for invalid input format
        return null;
    }
}

function addGraph(graphData){
                var div = document.getElementById('info_graph')
                var trace = {
                x: graphData.x,
                y: graphData.y,
                type: 'scatter',
                mode: 'lines+markers'
                };
                var layout = {
                title: graphData.title,
                xaxis: {title: graphData.x_axis_title,fixedrange: true},
                yaxis: {title: graphData.y_axis_title,fixedrange: true},
                
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
                
                Plotly.newPlot(div, [trace], layout, config);

            }

function addTable(tableData) {
    // Find the target div
    var div = document.getElementById("info_table");

    // Clear any existing content in the target div
    div.innerHTML = '';

    // Create the table element
    const table = document.createElement('table');

    // Iterate over the array of rows
    tableData.forEach(rowData => {
        // Create a new table row
        const row = document.createElement('tr');

        // Iterate over the items in the row
        rowData.forEach(cellData => {
            // Create a new table cell
            const cell = document.createElement('td');
            cell.textContent = cellData;
            // cell.style.border = '1px solid black';
            // cell.style.padding = '5px';

            // Append the cell to the row
            row.appendChild(cell);
        });

        // Append the row to the table
        table.appendChild(row);
    });

    // Append the table to the target div
    div.appendChild(table);
}

// Function to toggle the visibility of the div and fetch content from "/info"
async function openInfo(node_id, node_type) {

    if (node_id) {
    var infoContainer = document.getElementById("info-container");
    var infoDiv = document.getElementById("info");
    

    // make info visible
    infoContainer.style.display = 'block';

    // add info
    if (infoContainer.style.display === 'block') {
        try {
            const response = await fetch(`/info?node_id=${node_id}`);
            const html = await response.text();
            infoDiv.innerHTML = html;

            // addGraph if element info_graph exists
            if (document.getElementById('info_graph') !== null){
                var url = `/graph_data?node_id=${node_id}`
                const response = await fetch(url);
                const graphData = await response.json();
                if (graphData !== null) { 
                addGraph(graphData)
                }
            }

            // addStatic if exists
            if (document.getElementById('info_table') !== null){
                var url = `/static_data?node_id=${node_id}`
                const response = await fetch(url);
                const tableData = await response.json();
                if (tableData !== null) {
                addTable(tableData)
            }
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