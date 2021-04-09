var svgWidth = 1200;
var svgHeight = 900;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";

var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
      d3.max(data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

function yScale(data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
        d3.max(data, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  
  }

// function used for updating xAxis and yAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

// function used for updating circles group with a transition to
// new circles
function renderXCircles(circlesGroup, xScale, chosenXAxis, stateLabels) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => xScale(d[chosenXAxis]));

  stateLabels.transition()
    .duration(1000)
    .attr('x', d => xScale(d[chosenXAxis]))

  return circlesGroup;
}

function renderYCircles(circlesGroup, yScale, chosenYAxis, stateLabels) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => yScale(d[chosenYAxis]));

    stateLabels.transition()
      .duration(1000)
      .attr('y', d => yScale(d[chosenYAxis]))
  
    return circlesGroup;
  }

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, stateLabels) {

  var labelx;
  var labely;

  if (chosenXAxis === "poverty") {
    labelx = "Poverty Rate (%):";
  }
  else if (chosenXAxis === "age") {
    labelx = "Median Age:";
  }

  else {
    labelx = "Household Income($):";
  }

  if (chosenYAxis === "healthcare") {
    labely = "Lack of Healthcare Rate(%):";
  }
  else if (chosenXAxis === "Smokes") {
    labely = "Smoking Rate(%):";
  }

  else {
    labely = "Obesity Rate(%):";
  }


  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${labelx} ${d[chosenXAxis]}
      <br>${labely} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);
  
  
  circlesGroup.on("mouseover", toolTip.show)
    
    // onmouseout event
    .on("mouseout", toolTip.hide);


  return circlesGroup;
};

//  stateLabels.call(toolTip);

//   stateLabels.on("mouseover", toolTip.show)

//     .on("mouseout", toolTip.hide)
// Retrieve data from the CSV file and execute everything below
d3.csv("data.csv").then(function(data, err) {
  if (err) throw err;

  // parse data
  data.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.age = +data.age;
    data.income = +data.income;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(data, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(data, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
    


  

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.append("g").selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "teal")
    .attr("opacity", ".5");
 
    // create state Labels
  var stateLabels = chartGroup.append("g").selectAll("states")
    .data(data)
    .enter()
    .append("text")
    .text(d => d['abbr'])
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("text-anchor", "middle")
    .attr("opacity", "1")
    .style("fill", "black");

  // Create group for three x-axis labels
  var XlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);
    

  var povertyLabel = XlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty Rate");

  var ageLabel = XlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Median Age");

  var householdIncomeLabel = XlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income");  

  // Create group for three y-axis labels
  var YlabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  var healthcareLabel = YlabelsGroup.append("text")
    .attr("y", 70 - margin.left)
    .attr("x", 0- (height/2))
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Lacks Healthcare");

  var smokesLabel = YlabelsGroup.append("text")
    .attr("x", 0- (height/2))
    .attr("y", 50 - margin.left)
    .attr("value", "smokes") // value to grab for event listener
    .classed("active", true)
    .text("Smoking Rate");

  var obeseLabel = YlabelsGroup.append("text")
    .attr("x", 0- (height/2))
    .attr("y", 30 - margin.left)
    .attr("value", "obesity") // value to grab for event listener
    .classed("active", true)
    .text("Obesity Rate");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  XlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var xValue = d3.select(this).attr("value");
      if (xValue !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = xValue;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(data, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis, stateLabels);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          householdIncomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === 'age') {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          householdIncomeLabel
            .classed("active", false)
            .classed("inactive", true);

        }

        else {
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            householdIncomeLabel
              .classed("active", true)
              .classed("inactive", false);
  
          }
      }
    });

  // y axis labels event listener
  YlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var yValue = d3.select(this).attr("value");
      if (yValue !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = yValue;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(data, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis, stateLabels);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "healthcare") {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
        }

        else if (chosenYAxis === "smokes") {
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", true)
              .classed("inactive", false);
            obeseLabel
              .classed("active", false)
              .classed("inactive", true);
          }

          else {
            healthcareLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            obeseLabel
              .classed("active", true)
              .classed("inactive", false);
          }

      }
    });


}).catch(function(error) {
  console.log(error);
});

