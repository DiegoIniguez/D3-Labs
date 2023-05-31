let max_height = 0;
var svg = d3.select("#chart-area").append("svg")
	.attr("width", 1000)
	.attr("height", 1000);

d3.json("data/buildings.json").then((data)=>{
	data.forEach((d) => {
		d.height =+ d.height;
	
		if(d.height > max_height){
			max_height = d.height
		}
	});

	console.log(data);

	let tower = svg.selectAll("rect").data(data);
	tower.enter()
	.append("rect")
	.attr("X", (d,i) => {return(i*50) + 30;})
	.attr("Y", (d)=>{return max_height - d.height;})
	.attr("height", (d)=>{return d.height;})
	.attr("width",45)
	.attr("fill","red");


}).catch((error) => {
	console.log(error);
});



