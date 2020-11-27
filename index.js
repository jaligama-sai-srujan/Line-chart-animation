 var keys;
 var count_data;
 var parseDate = d3.timeParse("%Y-%m-%d %H");  
var FinalData;
var refData;
var selected_arc = undefined;
var selected_index = -1;

 document.addEventListener('DOMContentLoaded', function() {
	scatter_plot = d3.select("#scatter_plot");
	Promise.all([d3.csv('Data/new_YInt_with_GroupBy_counts.csv').then(data=> {data.forEach(function(d) {
	d.sewer_and_water = +d.sewer_and_water;
	d.power_energy = +d.power_energy;
	d.roads_and_bridges = +d.roads_and_bridges;
	d.medical = +d.medical;
	d.buildings = +d.buildings;
	return d;
	
    });
	return data;}),d3.csv('Data/new_YInt_deleted_adv_accounts.csv').then(data=>data)
	
	])
          .then(function(values){
    console.log(values);
    FinalData = values[0];
	refData=values[1];
	  })
  .catch(function(err) {
  console.log(err.message); // some coding error in handling happened
});

	setTimeout(function(){bar_graph(); 
 });})
 
function bar_graph(){
var margin = {top: 20, right: 30, bottom: 20, left: 30},
    width = 950 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#scatter_plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
		  
		  d3.csv('Data/new_YInt_sentiments_counts.csv').then( function(data) {
			data.forEach(function(d) {
				
				d.new_time=parseDate(d.new_time);
				d.EmotionCount = +d.EmotionCount;
				
				return d;
	
		  });
data = data.filter(d => d.location == "Broadview")
var x = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.new_time; }))
    .range([ 0, width ]);
  var xAxis = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + height+ ")")
    .call(d3.axisBottom(x).ticks(5))

  // Add X axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height+40 )
      .text("Time");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.EmotionCount; })])
    .range([ height, 0 ]);
  svg.append("g")
	.attr("transform", "translate(" + margin.left + ",0)")
    .call(d3.axisLeft(y).ticks(5))


// define the 1st line
var valueline = d3.line()
    .x(function(d) { return x(d.new_time); })
    .y(function(d) { return y(d.EmotionCount); });

	
	var HappyData = data.filter(d =>d.Emotion == "Happy")
	var SadData = data.filter(d =>d.Emotion == "Sad")
  // Add the valueline path.
 let ids = 1 
 const lineSvg = svg.selectAll("lines")
    .data([HappyData,SadData])
    .enter()
    .append("g");
  linePath = lineSvg.append("path")
      
      .attr("class", function () {
    return "line-"+ids++;
}  )
      .attr("d", function(d){return valueline(d);})
	
	function tweenDash() {
        var l = this.getTotalLength(),
            i = d3.interpolateString("0," + l, l + "," + l);
        return function (t) { return i(t); };
    }

	linePath.transition()
            .duration(6000)
            .attrTween("stroke-dasharray", tweenDash);
			
	var ImageLinePath = svg.append("path")
			.attr("d", valueline(HappyData))
			.style("stroke", "None")
			.style("fill", "none");
		
	console.log(y(d3.min(HappyData, function(d) { return d.EmotionCount; })))
	/*ImageSvg = svg.append("svg:image")
          .attr("href","./Images/Happy.png")
          .attr("width", 10)
          .attr("height", 10)
		  .attr("transform","translate(" +x(d3.min(HappyData, function(d) { return d.new_time; }))+","+ y(d3.min(HappyData, function(d) { return d.EmotionCount; }))+")")
	ImageSvg.transition()
            .duration(6000)
            .attrTween("stroke-dasharray", pathTween(ImageLinePath));*/
	function pathTween(path){
			var length = path.node().getTotalLength(); // Get the length of the path
			var r = d3.interpolate(0, length); //Set up interpolation from 0 to the path length
			
			return function(t){
				console.log(t)
				var point = path.node().getPointAtLength(r(t)); // Get the next point along the path
				d3.select(this) // Select the circle
					.attr("transform","translate(" +point.x+","+point.y+")") // Set the cx
					
			}
		}
});
	
	
	
}



