// // @TODO: YOUR CODE HERE!
// var svgWidth = 1000;
// var svgHeight = 700;

// // Define the chart's margins as an object
// var chartMargin = {
//     top: 30,
//     right: 30,
//     bottom: 30,
//     left: 30
//   };
  
//   // Define dimensions of the chart area
//   var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
//   var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// // create an SVG element
// var svg = d3.select("#scatter")
//   .append("svg")
//   .attr("width", svgWidth)
//   .attr("height", svgHeight);

// d3.csv("data.csv").then(function(demographics) {

//     console.log(demographics);

//     var state = demographics.map(data => data.state);
//     console.log("states", state);   

//     var poverty = demographics.map(data => data.poverty);
//     console.log("poverty", poverty)

//     var healthcare = demographics.map(data => data.healthcare);
//     console.log("healthcare", healthcare)



//     var xScale = d3.scaleLinear()
//                     .domain([8, 24])
//                     .range([0, chartWidth]);
//     svg.append("g")
//         .attr("transform", "translate(0," + chartHeight + ")")
//         .call(d3.axisBottom(xScale))



//     var yScale = d3.scaleLinear()
//                     .domain([4, 28] )
//                     .range([chartHeight, 0]);
//     svg.append("g")
//         .call(d3.axisLeft(yScale));

//   // Add dots
//   svg.append('g')
//     .selectAll("dot")
//     .data(demographics)
//     .enter()
//     .append("circle")
//       .attr("cx", function (d) { return xScale(d.poverty); } )
//       .attr("cy", function (d) { return yScale(d.healthcare); } )
//       .attr("r", 10)
//       .style("fill", "#69b3a2")



// }).catch(function(error) {
//   console.log(error);


// })

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 60, left: 60},
    width = 700 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#scatter")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

//Read the data
d3.csv("data.csv").then(function(data) {

  // Add X axis
    var x = d3.scaleLinear()
        .domain([8, 24])
        .range([ 0, width ]);
    
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([4, 28])
        .range([ height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add dots
    svg.append('g')
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.poverty); } )
        .attr("cy", function (d) { return y(d.healthcare); } )
        .attr("r", 6)
        .style("fill", "#69b3a2")


    var circleLabels = chartGroup
                        .selectAll(null)
                        .data(data)
                        .enter()
                        .append("text");

    circleLabels
            .attr("x", function(d) {
                return x(d.poverty);
            })
            .attr("y", function(d) {
                return y(d.healthcare);
            })
            .text(function(d) {
                return d.state;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("text-anchor", "middle")
            .attr("fill", "white");
    
    // Create axes labels
    chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left - 50)
            .attr("x", -50 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Lacks Healthcare (%)");
    
    chartGroup.append("text")
            .attr("transform", `translate(${width / 2 - 75}, ${height + margin.top + 20})`)
            .attr("class", "axisText")
            .text("In Poverty (%)");

})