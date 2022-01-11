const h = 650;
const w = 900;
const padding = 50;

document.addEventListener('DOMContentLoaded', function(){
    const req = new XMLHttpRequest();
    req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true);
    req.send();
    req.onload = function(){
      const datas = JSON.parse(req.responseText);

d3.select("body")
  .append("h1")
  .attr("id", "title")
  .style("padding","10px")
  .text("Scatterplot of Doper Bicyclists")

d3.select("body")
  .append("h2")
  .style("padding","10px")
  .text("The Fast and the Fraudulent")

const svg = d3.select("body")
  .append("svg")
  .attr("height", h)
  .attr("width", w)
  .attr("padding", padding)
  .style("border", "1px solid black")
  .style("border-radius", "10px");

const xScale = d3.scaleTime(datas)
  .domain([d3.min(datas, (d)=>new Date((d.Year), 0)), d3.max(datas, (d)=> new Date((d.Year), 0))])
  .range([padding, w-padding]);

const format = "%M:%S";
var parsedData = datas.map(function(d) {
    return d3.timeParse(format)(d.Time)
  });
  
const minY=new Date(0,0,0,0,d3.min(parsedData).getMinutes(),d3.min(parsedData).getSeconds());
const maxY= new Date(0,0,0,0,d3.max(parsedData).getMinutes(),d3.max(parsedData).getSeconds())

const yScale = d3.scaleTime(datas)
  .domain([minY, maxY])
  .range([h-padding, padding]);
  
const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale)
.tickFormat(d3.timeFormat(format));

svg.append("g")
  .attr("transform", "translate(0," + (h-padding) + ")")
  .attr("id", "x-axis")
  .call(xAxis);
  
svg.append("g")
  .attr("transform", "translate(" + padding + ", 0)")
  .attr("id", "y-axis")
  .call(yAxis);

  const tooltip = 
  d3.select("body")
      .data(datas)
      .enter()
      .append("div")
      .attr("id", "tooltip")
      .style("padding", " 15px")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("background", "lightgrey")
      .style("border", "1px solid black")
      .style("border-radius", "10px");  

// here is the url for stack overflow search I used to parse the data properly: 
// https://stackoverflow.com/questions/50690567/formating-minutes-and-seconds-on-a-d3-axis

svg.selectAll("circle")
  .data(datas)
  .enter()
  .append("circle")
  .attr("class", "dot")
  .style("fill",function(d) {if (d.Doping == "") { return"green"}else{ return "orange"}})
  .attr("data-xvalue", (d)=>d.Year)
  .attr("data-yvalue", (d)=>new Date(0, 0, 0, 0, d.Time.split(":")[0], d.Time.split(":")[1]))
  .attr("time", (d)=>d.Time)
  .attr("nation", (d)=>d.Nationality)
  .attr("data-dope", function(d) {if (d.Doping == ""){return "No doping allegations"}else{return d.Doping}})
  .attr("data-name", (d)=>d.Name)
  .attr("index", (d, i)=> i)
  .attr("cx", (d)=> xScale(new Date(d.Year, 0)))
  .attr("cy", (d)=> yScale(new Date(0, 0, 0, 0, d.Time.split(":")[0], d.Time.split(":")[1])))
    // d3.timeParse(format)(d.Time)))
  .attr("r", "7px")
  .on("mouseover", function(d, event){
    let date = this.getAttribute('data-xvalue');
    let time = this.getAttribute('time');
    let nation = this.getAttribute('nation')
    let doping = this.getAttribute('data-dope');
    let name = this.getAttribute('data-name');
    tooltip.style("visibility", "visible")
      .html(name + "- " + nation + ",  " + date + "<br> Time: " + time + "<br>" + doping)
      .style("line-height", "1.5")
      .attr("data-year", date) 
      .attr("data-yvalue", time)})
  .on("mousemove", function(e, d){var index = this.getAttribute("index");
  return tooltip.style('left', (e.pageX+10) + "px").style('top', (e.pageY+10) + 'px')
    ;})
  .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

d3.select("body")
  .append("h3")
  .text("Legend: ");

d3.select("body")
  .append("svg")
  .attr("id", "legend")
  .attr("height", "100px")
  .attr("width", "260px")
  .style("display", "flex")
  .style("flex-wrap", "wrap");

d3.select("#legend")
  .append("rect")
  .attr("height", "20px")
  .attr("width", "20px")
  .style("fill", "green" )
  .style("stroke", "black")
  .style("border", "1px solid black");
  
d3.select("body")
  .append("p")
  .style("top", "562px")
  .style("right", "205px")
  .style("position", "absolute")
  .text(":  No Doping Allegations");

  d3.select("#legend")
  .append("rect")
  .attr("height", "20px")
  .attr("width", "20px")
  .style("fill", "orange")
  .style("stroke", "black")
  .attr("y", "40px")
  .style("border", "1px solid black");

  d3.select("body")
  .append("p")
  .style("top", "602px")
  .style("right", "170px")
  .style("position", "absolute")
  .html(":  Doping Allegations Present")

   }
});
