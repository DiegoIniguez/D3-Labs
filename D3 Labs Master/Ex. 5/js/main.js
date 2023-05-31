let margin = { top: 10, right: 10, bottom: 100, left: 100 },
	width = 600 - margin.left - margin.right,
	height = 600 - margin.top - margin.bottom;

let svg = d3.select("#chart-area").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom);

	let group = svg.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    d3.json("data/buildings.json").then((data) => {
    
        data.forEach((d) => {
			d.height =+ d.height;
		});
    
        bName=data.map((d) => {return d.name});
		bMaxHeight=d3.max(data,(d) => {return d.height});
		
        let x = d3.scaleBand()
		.domain(bName)
		.range([0,400])
		.paddingInner(0.3)
		.paddingOuter(0.3);
		console.log(data);
    
        let y = d3.scaleLinear()
		.domain([0,828])
		.range([0,400]);

		let colors = d3.scaleOrdinal()
		.domain([0,828])
		.range(d3.schemeSet3);
		console.log(colors);

		let buildings = svg.selectAll("rect").data(data);
		buildings.enter()
			.append("rect")
			.attr("x",(d) => {return 100 + x(d.name);})
			.attr("y",(d) => {return 500-y(d.height);})
			.attr("height", (d)=>{return y(d.height);})
			.attr("width",x.bandwidth())
			.attr("fill","gray");
    
			var axisBottom = d3.axisBottom(x);
			group.append("g")
				.attr("class", "bottom axis")
				.attr("transform", "translate(0, " + height+ ")")
				.call(axisBottom)
				.selectAll("text")
				.attr("y", "10")
				.attr("x", "-5")
				.attr("text-anchor", "end")
				.attr("transform", "rotate(-20)");
	
			var axisLeft = d3.axisLeft(y)
				.ticks(5)
				.tickFormat((d)=>{return d + " m";});
			
			group.append("g")
			.attr("class", "left axis")
			.attr("transform", "translate(0, 90)")
				.call(axisLeft);
	
			group.append("text")
				.attr("class", "x axis-label")
				.attr("x", (width / 2))
				.attr("y", height + 140)
				.attr("font-size", "20px")
				.attr("text-anchor", "middle")
				.attr("transform", "translate(-120, -50)")
				.text("The world's tallest buildings");
	
			group.append("text")
				.attr("class", "y axis-label")
				.attr("x", - (height / 2))
				.attr("y", -60)
				.attr("font-size", "20px")
				.attr("text-anchor", "middle")
				.attr("transform", "rotate(-90)")
				.text("Height (m)");
	
    
    
    }).catch((error) => {
        console.log(error);
    });
