var margin = {top: 10, right: 10, bottom: 100, left:100}
var width = 600;
var height = 400;

var svg = d3.select("#chart-area").append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom);

var group = svg.append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

d3.json("data/revenues.json").then((data)=> {
	data.forEach(d=>{
		d.revenue = +d.revenue;
	});

    revenue = d3.max(data, d=>{return d.revenue});
    months = data.map(d=>{return d.month});

    var x = d3.scaleBand()
	    .domain(months)
	    .range([0,400])
	    .paddingInner(.3)
	    .paddingOuter(.3);

    var y = d3.scaleLinear()
	    .domain([revenue, 0])
	    .range([0, 400]);

	var months = group.selectAll("rect")
        .data(data);

    months.enter()
        .append("rect")
            .attr("x", d=>{return x(d.month);})
            .attr("y", d=>{return y(d.revenue);})
            .attr("height", d=>{return  height - y(d.revenue);})
            .attr("width", x.bandwidth())
            .attr("fill", "yellow");

    var axisBottom = d3.axisBottom(x);
    group.append("g")
        .attr("class", "bottom axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(axisBottom)
    .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
    	.attr("transform", "rotate(-20)");

    var axisLeft = d3.axisLeft(y)
		.ticks(10)
		.tickFormat(d=>{return "$" + d/1000 + "K";});

    group.append("g")
        .attr("class", "left axis")
        .call(axisLeft);

    group.append("text")
			.attr("class", "y axis-label")
			.attr("x", - (height / 2))
			.attr("y", -60)
			.attr("font-size", "20px")
			.attr("text-anchor", "middle")
			.attr("transform", "rotate(-90)")
			.text("Revenue (dlls.)");

    group.append("text")
        .attr("class", "x axis-label")
        .attr("x", (width / 2))
        .attr("y", height + 140)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(-120, -50)")
        .text("Month");

   
}).catch((error)=>{
    console.log(error);
});