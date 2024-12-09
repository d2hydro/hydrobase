var selectedNode = null;

document.addEventListener('DOMContentLoaded', () => {
  // GLOBAL CONSTANTS

  // Info elements
  const infoContainer = document.getElementById('info-container');
  const infoHeader = document.getElementById('info-header');
  const infoBody = document.getElementById('info-body');

  // Feedback elements
  const feedbackContainer = document.getElementById('feedback-container');
  const feedbackButton = document.getElementById('feedback-button');
  const closeFeedbackButton = document.getElementById('feedback-close-button');
  const feedbackForm = document.getElementById('feedback-form');

  // EVENT LISTENERS

  // Feedback
  feedbackButton.addEventListener('click', () => {
    feedbackContainer.style.display = 'block';
  });

  closeFeedbackButton.addEventListener('click', () => {
    feedbackContainer.style.display = 'none';
  });

  feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitFeedback();
  });
});

// FUNCTIONS

// Add a graph to info-body
async function addGraph(graphData) {
  var div = document.getElementById('info-graph');
  var trace = {
    x: graphData.x,
    y: graphData.y,
    type: 'scatter',
    mode: 'lines+markers',
  };
  var layout = {
    title: graphData.title,
    xaxis: { title: graphData.x_axis_title, fixedrange: true },
    yaxis: { title: graphData.y_axis_title, fixedrange: true },

    margin: {
      t: 40, // Top margin
      l: 50, // Left margin
      r: 40, // Right margin
      b: 40, // Bottom margin
    },
    dragmode: false,
  };

  var config = {
    displayModeBar: false,
    scrollZoom: false,
  };

  Plotly.newPlot(div, [trace], layout, config);
}

function addTable(tableData) {
  // Find the target div
  var div = document.getElementById('info-table');

  // Clear any existing content in the target div
  div.innerHTML = '';

  // Create the table element
  const table = document.createElement('table');

  // Iterate over the array of rows
  tableData.forEach((rowData) => {
    // Create a new table row
    const row = document.createElement('tr');

    // Iterate over the items in the row
    rowData.forEach((cellData) => {
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
async function openInfo(node_id) {
  if (node_id) {
    var infoContainer = document.getElementById('info-container');
    var infoHeader = document.getElementById('info-header');
    var infoBody = document.getElementById('info-body');

    // make info visible
    infoContainer.style.display = 'block';

    // add info-header and info-body
    if (infoContainer.style.display === 'block') {
      try {
        // update header
        var response = await fetch(`/info_header?node_id=${node_id}`);
        var html = await response.text();
        infoHeader.innerHTML = html;

        // update body
        var response = await fetch(`/info_body?node_id=${node_id}`);
        var html = await response.text();
        infoBody.innerHTML = html;

        // addGraph if element info-graph in body
        if (document.getElementById('info-graph') !== null) {
          var url = `/graph_data?node_id=${node_id}`;
          var response = await fetch(url);
          var graphData = await response.json();
          if (graphData !== null) {
            addGraph(graphData);
          }
        }

        // addTable if element info-table in body
        if (document.getElementById('info-table') !== null) {
          var url = `/static_data?node_id=${node_id}`;
          var response = await fetch(url);
          var tableData = await response.json();
          if (tableData !== null) {
            addTable(tableData);
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
  const infoContainer = document.getElementById('info-container');
  const infoHeader = document.getElementById('info-header');
  const infoBody = document.getElementById('info-body');

  // erase info
  infoHeader.innerHTML = '';
  infoBody.innerHTML = '';
  infoContainer.style.display = 'none';

  // clear search-source
  searchSource.clear();
}

// Function to submit review
function submitFeedback() {
  const feedbackContainer = document.getElementById('feedback-container');
  const feedback = document.getElementById('feedback-input').value;
  const reviewer = document.getElementById('feedback-reviewer').value;

  console.log('submit feedback');
  console.log(selectedNode);

  // Post data to the server
  fetch('./feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ feedback: feedback, reviewer: reviewer, node_id: selectedNode }),
  })
    .then((response) => {
      if (response.ok) {
        alert('Feedback submitted successfully!');
      } else {
        alert('Failed to submit feedback.');
      }
    })
    .catch((error) => {
      console.error('Error submitting feedback:', error);
      alert('An error occurred.');
    })
    .finally(() => {
      feedbackContainer.style.display = 'none';
    });
}

// function to hide addressbar
function hideAddressBar() {
  isMobile = /iPhone|iPad|iPod|Android|BlackBerry|Windows Phone/i.test(navigator.userAgent);
  if (isMobile) {
    window.scrollTo(0, 100); // Scroll down by 1 pixel
  }
}
