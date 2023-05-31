let svg = d3.select("#chart-area").append("svg")
	.attr("width", 500)
	.attr("height", 500);

    d3.json("data/buildings.json").then((data)=>{
    
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
			.attr("x",(d) => {return x(d.name);})
			.attr("y",(d) => {return 500-y(d.height);})
			.attr("height", (d)=>{return y(d.height);})
			.attr("width",x.bandwidth())
			.attr("fill",(d) => {return colors(d.name)});
    
    
    
    
    }).catch((error) => {
        console.log(error);
    });
