const margin = {top: 10, right: 10, bottom: 100, left:100};
const width = 600;
const height = 400;

//SVG
let group = d3.select("#chart-area")
	.append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

//Escalas y colores
let x = d3.scaleLog().domain([142, 150000]).range([0, width]).base(10);
let y = d3.scaleLinear().domain([0, 90]).range([height, 0]);
let area = d3.scaleLinear().domain([2000, 1400000000]).range([25 * Math.PI, 1500 * Math.PI]);
let color = d3.scaleOrdinal().range(d3.schemePastel1);

//Ejes
const axisBottom = d3.axisBottom(x).tickValues([400, 4000, 40000]).tickFormat(d3.format("$"));
const axisLeft = d3.axisLeft(y);

//Ejes en group
const xGroup = group.append("g").attr("class", "bottom axis").attr("transform", `translate(0, ${height})`);

const yGroup  = group.append("g").attr("class", "y axis");

//Legend
const legend = group.append("g").attr("transform", `translate(${width - 10},${height - 170})`);

//gdp per capita label
let x_label = group.append("text")
    .attr("class", "x axis-label")
    .attr("x", (width / 2))
    .attr("y", height + 140)
    .attr("font-size", "30px")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(0, -70)")
    .text("GDP Per Capita ($)");

//life expectancy label
let y_label = group.append("text")
	.attr("class", "y axis-label")
	.attr("x", - (height / 2))
	.attr("y", -60)
	.attr("font-size", "30px")
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)")
	.text("Life Expectancy (Years)");

//counter
const legendArea = group.append("text")
	.attr("class", "x axis-label")
	.attr("x", width - 50)
	.attr("y", height - 20)
	.attr("font-size", "50px")
	.attr("text-anchor", "middle")
	.attr("fill", "gray")

let yearIndex=0;

//cargar json
d3.json("data/data.json").then((data)=>{    
	data.forEach((d)=>{
		d.year = +d.year;
	});
    console.log(data);


	const formattedData = data.map((year) => {
		return year["countries"].filter((country) => {
		let dataExists = (country.income && country.life_exp);
		return dataExists;
		}).map((country) => {
			country.income =+ country.income;
			country.life_exp =+ country.life_exp;
			return country;
		})
	});

	//años y continents
	let years = data.map((d) => {return d.year;});
	let contin = formattedData[0].map((d) => {return d.continent;});
	let continents = [...new Set(contin)];

	color.domain(continents);

	//agrega legend a continents
	continents.forEach((c, i) => {
		let continent_row = legend.append("g")
			.attr("transform", "translate(0, " + (i * 20) + ")");

		continent_row.append("rect")
			.attr("width", 10)
			.attr("height", 10)
			.attr("fill", color(c))
			.attr("stroke", "white");

		continent_row.append("text")
			.attr("x", -20)
			.attr("y", 10)
			.attr("text-anchor", "end")
			.text(c);
	});

	//actualiza datos
	d3.interval( ( ) => {
		update(years[yearIndex % years.length], formattedData[yearIndex % years.length]);
		yearIndex += 1;
	}, 1000);
	update(years[yearIndex % years.length], formattedData[yearIndex % years.length]);
	yearIndex += 1;

}).catch((error)=> {
	console.log(error);
});

//func. update
function update(year, data) {
	legendArea.text(year);

	xGroup.call(axisBottom) //Actualiza ejes
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("filled", "white")
    .attr("text-anchor", "middle");

	yGroup .call(axisLeft);

	// Actualiza círculos
	let circles = group.selectAll("circle").data(data, (d) => d.country);

	// Eliminar círculos
	circles.exit().transition(1000).attr("fill", (d) => color(d.continent)).attr("cx", (d) => y(d.income))
	  .attr("cy", (d) => y(d.life_exp)).attr("r", (d) => Math.sqrt(area(d.population) / Math.PI))
	  .remove();
	
	// Actualiza círculos
	circles.transition(1000)
	  .attr("fill", (d) => color(d.continent))
	  .attr("cx", (d) => x(d.income))
	  .attr("cy", (d) => y(d.life_exp))
	  .attr("r", (d) => Math.sqrt(area(d.population) / Math.PI));
	
	// Agrega nuevos círculos
	circles.enter().append("circle")
	  .attr("fill", (d) => color(d.continent))
	  .attr("cx", (d) => x(d.income))
	  .attr("cy", (d) => y(d.life_exp))
	  .attr("r", (d) => Math.sqrt(area(d.population) / Math.PI))
	  .merge(circles)
	  .transition(1000)
	  .attr("cx", (d) => x(d.income))
	  .attr("cy", (d) => y(d.life_exp))
	  .attr("r", (d) => Math.sqrt(area(d.population) / Math.PI));
}