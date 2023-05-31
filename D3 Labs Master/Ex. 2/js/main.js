var svg = d3.select("#chart-area").append("svg")

	.attr("width", 400)

	.attr("height", 400);

var data = [25, 20, 15, 10, 5];

var rectWidth = 40;  //With of rectangles (height is given in data)
var rectSpacing = 5; // Adjust the spacing between rectangles

svg.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", function(d, i) {
    return i * (rectWidth + rectSpacing);
  })
  .attr("y", function(d) {
    return 400 - d;
  })
  .attr("width", rectWidth)
  .attr("height", function(d) {
    return d;
  })
  .attr("fill", "red");