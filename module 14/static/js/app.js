// Declare the data variable globally
var data;

// Read data from samples.json
d3.json("samples.json").then(function(responseData) {
    // Assign the data to the global variable
    data = responseData;

    // Log the data to the console for inspection
    console.log(data);

    // Call the init function to initialize the dashboard
    init();
});

// Function to initialize the dashboard
function init() {
    console.log("Initializing the dashboard");

    // Populate the dropdown menu with subject IDs
    var dropdownMenu = d3.select("#selDataset");

    data.names.forEach((subjectID) => {
        dropdownMenu.append("option").property("value", subjectID).text(subjectID);
    });

    // Display charts for the first subject in the list
    optionChanged(data.names[0]);
}

// Function to handle changes in the dropdown menu
function optionChanged(subjectID) {
    // Filter the data for the selected subject
    var selectedSubject = data.samples.find((sample) => sample.id === subjectID);

    // Update the bar chart
    var trace1 = {
        x: selectedSubject.sample_values.slice(0, 10).reverse(),
        y: selectedSubject.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
        text: selectedSubject.otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
    };

    var layout1 = {
        title: `Top 10 OTUs for Subject ${subjectID}`,
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU IDs" },
    };

    var barData = [trace1];

    Plotly.newPlot("bar", barData, layout1);

    // Update the bubble chart
    var trace2 = {
        x: selectedSubject.otu_ids,
        y: selectedSubject.sample_values,
        text: selectedSubject.otu_labels,
        mode: 'markers',
        marker: {
            size: selectedSubject.sample_values,
            color: selectedSubject.otu_ids,
            colorscale: "Viridis"  // Specify a colorscale for better visualization
        }
    };

    var layout2 = {
        title: `Bubble Chart for Subject ${subjectID}`,
        xaxis: { title: "OTU IDs" },
        yaxis: { title: "Sample Values" },
    };

    var bubbleData = [trace2];

    Plotly.newPlot("bubble", bubbleData, layout2);

    // Display the sample metadata
    displayMetadata(subjectID);
}


// Function to display sample metadata
function displayMetadata(subjectID) {
    // Find the metadata for the selected subject
    var selectedMetadata = data.metadata.find((meta) => meta.id == subjectID);

    // Select the metadata div
    var metadataDiv = d3.select("#sample-metadata");

    // Clear existing metadata
    metadataDiv.html("");

    // Append each key-value pair from the metadata to the metadata div
    Object.entries(selectedMetadata).forEach(([key, value]) => {
        metadataDiv.append("p").text(`${key}: ${value}`);
    });
}


  
  