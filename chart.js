const WIDTH = 1500;
const HEIGHT = 900;
const RADIUS = Math.min(WIDTH, HEIGHT) / 2;
const LEGEND_RECT_SIZE = 20;
const LEGEND_SPACING = 4;
const LEGEND_X = WIDTH - 950;
const SIZECIRCLE = {
    SMALL: 17,
    MEDIUM: 24,
    LARGE: 31,
}

class Chart
{
	constructor(_svg, _d3, _data)
	{
		//
		//
		this.svg = _svg;
		this.data = _data;
		
		_d3 == undefined ? this.d3 = d3 : this.d3 = _d3;
		
		this.arc = this.d3.arc()
			.innerRadius(0)
			.outerRadius(RADIUS);
		
		this.pie = this.d3.pie()
			.value(30)
			.padAngle(.01)
			.sort(null);
		
		this.color = this.d3.scaleOrdinal(this.d3.schemeCategory20b);
	}
	
	convert_stakeholder_data(sortData)
	{
		var stakeholder_data = [];
		var color = this.color;
		var color_id = 0;
		
		for(let cat = 0; cat < this.pie(this.data).length; cat++)
			for(let sth = 0; sth < this.data[cat].stakeholders.length; sth++)
				if(sortData == "pie")
					stakeholder_data.push({ label: this.data[cat].stakeholders[sth].label, stakeholder: this.data[cat].stakeholders[sth], pie: this.pie(this.data)[cat] });
				else
					if (!(this.contains(this.data[cat].stakeholders[sth].label, stakeholder_data)))
						stakeholder_data.push({ label: this.data[cat].stakeholders[sth].label, color: color(color_id++) });
		
		return stakeholder_data;
	}
	
	contains(value, array)
	{
		for(let i = 0; i < array.length; i++)
			if(value == array[i].label)
				return true;
	}
	
	add_piechart()
	{
		var arcModel = this.d3.arc();
		var color_dict = this.convert_stakeholder_data("legend");
		
		var path = this.svg.selectAll("arc") // select erverything that has the class arc
			.data(this.pie(this.data))
			.enter()
				.append("g") // append a group for each data element
				.attr("class", "arc"); // every group has the class of arc
		
		path.append("path") // create path out of those objects
			.attr("id", function(d,i) { return "pieChart"+i;  })
			.attr("d", this.arc) // the d attribuut will fetch it's path data from the arc path generator, this arc generator will also get the data from pie(data)
			.attr('fill', "#808080")
		
		var circle = this.svg.selectAll(".stakeholder")
			.data(this.convert_stakeholder_data("pie"))
			.enter()
				.append("circle")
				.attr("class", "stakeholder")
				.attr("transform", function (d, i) {
					var involvement;
					if (d.stakeholder.involvement[0].label == "4. high") { involvement = 0; }
					else if (d.stakeholder.involvement[0].label == "3. medium") { involvement = 100; }
					else if (d.stakeholder.involvement[0].label == "2. low") { involvement = 300; }
					else if (d.stakeholder.involvement[0].label == "1. very low") { involvement = 500; }
					else involvement = 0;
					
					var arc = arcModel
						.innerRadius(0)
						.outerRadius(280 + involvement);
					return "translate(" + arc.centroid(d.pie) + ")";
				})
				.attr("x", 0)
				.style("stroke-width", 2)    // set the stroke width
				.style("stroke", function(d) {
				   if (d.stakeholder.attitude[0].label == "2. neutral") { return "#C0C0C0" }
				   else if (d.stakeholder.attitude[0].label == "3. positive") { return "#7CFC00" }
				   else if (d.stakeholder.attitude[0].label == "1. negative") { return "red" }
				;})      // set the line colour
				.style("fill", function (d, i) {
					for (let i = 0; i < color_dict.length; i++)
						if (d.label == color_dict[i].label)
							return color_dict[i].color;
				})
				.attr("r", function(d) {
				   if (d.stakeholder.impact[0].label == "2. medium impact") { return SIZECIRCLE.MEDIUM }
				   else if (d.stakeholder.impact[0].label == "1. low impact") { return SIZECIRCLE.SMALL }
				   else if (d.stakeholder.impact[0].label == "3. high impact") { return SIZECIRCLE.LARGE }
				});
		console.log(circle);
		this.svg.selectAll(".g")
			.data(this.convert_stakeholder_data("pie"))
			.enter()
				.append("text")
				.attr("transform", function (d, i) { 
				var involvement;
				if (d.stakeholder.involvement[0].label == "4. high") {involvement = 0;}
				else if (d.stakeholder.involvement[0].label == "3. medium") {involvement = 100;}
				else if (d.stakeholder.involvement[0].label == "2. low") {involvement = 300;}
				else if (d.stakeholder.involvement[0].label == "1. very low") {involvement = 500;}
				else involvement = 0;
				var arc = arcModel
				.innerRadius(0)
				.outerRadius(280 + involvement); 
				return "translate(" + arc.centroid(d.pie) + ")";
				})
				.attr("dx", function(d){return -12})
				.attr("dy", function(d){return 5})
				.text(function(d, i){ return d.label.substring(0, 2); });
	}
	
	add_project_circle(project_name)
	{
		var maxProjectLength = 19;
		var circle = this.svg.append("circle")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", 100)
			.style("stroke", "black")
			.style("fill", "white");
		
		this.svg.append('text')
			.attr('x', -100)
			.attr('y', 0)
			.text(project_name);
	}
	
	add_legend()
	{
		var stakeholders = this.convert_stakeholder_data("legend");
		var color = this.color;
		
		var legend = this.svg.selectAll('.legend')
			.data(stakeholders)
			.enter()
				.append('g')
				.attr('class', 'legend')
				.attr('transform', function(d, i) {
					var height = LEGEND_RECT_SIZE + LEGEND_SPACING;
					var offset =  height * color.domain().length / 2;
					var horz = -2 * LEGEND_RECT_SIZE;
					var vert = i * height - offset;
					return 'translate(' + horz + ',' + vert + ')';
				});
		
		legend.append('rect')
			.attr('x', LEGEND_X)
			.attr('width', LEGEND_RECT_SIZE)
			.attr('height', LEGEND_RECT_SIZE)
			.style('fill', function(d) { return d.color; })
			.style('stroke', function(d) { return d.color; });
		
		legend.append('text')
			.attr('x', LEGEND_X + (LEGEND_RECT_SIZE + LEGEND_SPACING))
			.attr('y', LEGEND_RECT_SIZE - LEGEND_SPACING)
			.text(function(d) { return d.label; });
	}
	
	add_slice_names()
	{
		var maxCategoryLength = 19;
		this.svg.selectAll(".categoryText")
			.data(this.data)
			.enter()
				.append("text")
				.attr("class", "categoryText")
				.attr("x", 5)
				.attr("dy", 18)
				.append("textPath")
				.attr("xlink:href",function(d,i){return "#pieChart"+i;})
				.style('fill', "white")
				.text(function(d){ var category = d.category.substring((d.category.indexOf(' ') + 1), d.category.length); return category.length > maxCategoryLength ?
				category.substring(0, maxCategoryLength - 3) + "..." : category;});
	}
}

if ( typeof module !== 'undefined' && module.hasOwnProperty('exports') )
	module.exports = Chart;