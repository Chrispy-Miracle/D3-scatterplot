// const datas= [[1990, 45], [2000, 9],[2015, 345]];
const h = 750;
const w = 900;
const padding = 50;

document.addEventListener('DOMContentLoaded', function(){
    const req = new XMLHttpRequest();
    req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true);
    req.send();
    req.onload = function(){
      const datas = JSON.parse(req.responseText);

// const datas = json.data;

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
 
const minSecs = datas.map(function(d) {
  return d.Time;
  });
  
const dataObj = datas.map(function(d) {
    return d;
    });
  
console.log(dataObj);
const yScale = d3.scaleLinear(datas)
  .domain(d3.extent(parsedData))
  //[40,36.5]
    //   d3.min(datas, (d)=> d.Time), d3.min(datas, (d)=> d.Time)])
  .range([h-padding, padding]);

//   let thing2 = datas[0].Time.d3.time.format("%M:%S")
//   new Date(0, 0, 0, 0, datas[0].Time);
//   let thing2 = new Date(0, 0, 0, 0, (datas[0]).split(":")[0], (datas[0]).split(":")[1]);
//   console.log(d3.extent(parsedData));
  


const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale).tickFormat(function(d){
    return d3.timeFormat(format)(d)
});

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
  .attr("data-yvalue", (d)=>d3.timeParse(format)(d.Time))
  .attr("dataObj", (d)=>{d})
//   .getMinutes() + ":" + d3.timeParse(format)(d.Time).getSeconds()<10 ? 00 : 23)
  .attr("index", (d, i)=> i)
  .attr("cx", (d)=> xScale(new Date(d.Year, 0)))
  .attr("cy", (d)=> yScale(d3.timeParse(format)(d.Time)))
  .attr("r", "7px")
  .on("mouseover", function(d, event){
    let date = this.getAttribute('data-xvalue');
    let time = this.getAttribute("data-yvalue");
    // const doping(d) = (d) => d.Doping;
    // console.log(this.getAttribute("dataObj"));
    tooltip.style("visibility", "visible")
      .html(date + ": <br>" + time )
      .attr("data-year", date) 
      .attr("data-yvalue", time)})
  .on("mousemove", function(e, d){var index = this.getAttribute("index");
  return tooltip.style('left', (e.pageX+10) + "px").style('top', (e.pageY+10) + 'px')
    ;})
  .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

svg.append("rect")
  .attr("id", "legend")
  .attr("height", "100px")
  .attr("width", "200px")
  .attr("fill", "blue")
  .attr("stroke", "green")
  .attr("x", "650px")
  .attr("y", "500px")
  .append("h2")
  .text("legend")
  .style("color", "green")
   }
});
