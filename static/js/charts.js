function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  
  //Deliverable 1: Create a Horizontal Bar Chart
  // 1. Create the buildCharts function.
  function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
      var samples = data.samples;
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var desired_samples = samples.filter (sampleObj => sampleObj.id == sample);
      //  5. Create a variable that holds the first sample in the array.
      var result = desired_samples[0];
  
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var sampleValues = result.sample_values;
      console.log(sampleValues.sort((a,b) => b-a));
      var otuID = result.otu_ids;
      console.log(otuID);
      var otuLabel = result.otu_labels;
  
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
      var yticks = otuID.slice(0,10).map(obj => 'OTU '+obj).reverse();
      var Top10_sampleValues = sampleValues.sort((a,b) => b-a).slice(0,10).reverse();
      console.log(yticks);
      // 8. Create the trace for the bar chart. 
      var barData = [{
        x: Top10_sampleValues,
        y: yticks ,
        text: otuLabel,
        type: 'bar',
        labels: yticks,
        //make the bar chart horizontal
        orientation: 'h'
    
      }];
      // 9. Create the layout for the bar chart. 
      var barLayout = {
       title: 'Top 10 Bacteria Cultures Found'
  
      };
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot('bar',barData, barLayout);
  
      //Deliverable 2: Create a Bubblt Chart
      // 1. Create the trace for the bubble chart.
      var bubbleData = [{
        x: otuID,
        y: sampleValues,
        mode: 'markers',
        marker: { size: sampleValues,
                  color: otuID },
        text: otuLabel
      }];
  
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: 'Bacteria Cultures Per Sample',
        xaxis: { title: 'OTU ID'},
        hovermode: 'closest'
      };
  
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot('bubble',bubbleData,bubbleLayout);
  
      // Deliverable 3: Create a Guage Chart
      // 1. Create a variable that filters the metadata array for the object with the desired sample number.
      var desired_metadata = data.metadata.filter((metaData) => metaData.id == sample);
  
      // 2. Create a variable that holds the first sample in the metadata array.
      var metaData_result = desired_metadata[0];
      console.log(metaData_result);
  
      // 3. Create a variable that holds the washing frequency.
      var washFreq = parseFloat(metaData_result.wfreq);
      console.log(washFreq);
      // 4. Create the trace for the gauge chart.
      var gaugeData = [{
        type: 'indicator',
        value: washFreq,
        title: {text: 'Belly Button Washing Frequency<br> Scrubs per Week'},
        gauge: {axis: { range: [0,10] },
                bar: {color: 'darkslategray'},
                steps: [
                  {range: [0,2], color: 'red'},
                  {range: [2,4], color: 'orange'},
                  {range: [4,6], color: 'yellow'},
                  {range: [6,8], color: 'yellowgreen'},
                  {range: [8,10],color: 'green'}  
                ]},
        mode: 'gauge+number'
      }];
      
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
        autosize: true,
        automargin: true
      };
  
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot('gauge',gaugeData,gaugeLayout);
  
    });
  }