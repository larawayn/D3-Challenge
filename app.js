// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 60, left: 60},
    width = 1200 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

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
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d['poverty']);})
        .attr("cy", function (d) { return y(d['healthcare']);})
        .attr("r", 16)
        .style("fill", "#69b3a2")

    svg.append('g')
        .selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .text(d => d['abbr'])
        .attr('x', (d) => x(d['poverty']))
        .attr('y', (d) => y(d['healthcare']))
        .attr('fontsize', '12px')
        .style('font', 'bold Verdana')
        .attr('text-anchor', 'middle')
        .style('opacity', 0.85)
        .style('fill', 'white')

    
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