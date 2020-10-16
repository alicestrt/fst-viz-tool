let color = d3.scaleOrdinal(d3.schemeSet3);

let y = d3.scalePoint();
let x = d3.scalePoint();

let width = 1500;
let height = 5000;

let svg;

d3.json('data/dataset_sexuality2.json')
  .then(function(data) {

    x.domain(data.map((d)=> {
      if (d.description!=""){
      return d.description;
    }}))
    .range([200, width-50]);

    y.domain(data.map((d)=> {
      return d.publisher;
    }))
    .range([50, height - 50]);

    color.domain(data.map((d)=> {
      if (d.description_second!="")
      return d.description_second;
    }));

    console.log(y.domain());
//initial simulation, change speed by changing number of iterations
    let simulation = d3.forceSimulation(data)
      .force('x', d3.forceX( (d) => {
        if (d.description!=""){
        return x(d.description)
      }}).strength(0.99))
      .force('y', d3.forceY( (d) => {
        return y(d.publisher);
      } ).strength(0.99))
      .force('collide', d3.forceCollide(5).iterations(1))
      .alphaDecay(0)
      .alpha(0.1)
      .on('tick', tick)

      let init_decay;
      init_decay = setTimeout(function(){
        console.log('init alpha decay')
        simulation.alphaDecay(0.1);
      }, 5000);

    svg = d3.selectAll("#fst").append("svg")
    .attr("width", width)
    .attr("height", height);

    let item = svg.append("g");

    item.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("width", 8)
    .attr("height", 10)
    .attr("x", width / 2)
    .attr("y", height / 2)
    .attr("fill", (d) => {
      return color(d.th)}
    )
    .attr("stroke", "rgba(0,0,0,.2)");

    // create single tooltip to display when hovering over specific rectangle
    // <https://chartio.com/resources/tutorials/how-to-show-data-on-mouseover-in-d3js/#creating-a-tooltip-using-mouseover-events>
    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "#fff")
        .style("width", "20rem")
        .attr("data-html", "true")
        .text("...");

    // display / hide tooltip on mouse hovering
    d3.selectAll("rect").on("mouseover", (d) => {
      console.log(d.description_second + "\n" + d.title + "\n" + d.author)
    })
      .on("mousemove", () => {
        return tooltip
          .style("top", (d3.event.pageY-10)+"px")
          .style("left",(d3.event.pageX+10)+"px");
      })
      .on("mouseout", () => {
        return tooltip.style("visibility", "hidden");
      });

    function tick () {
      d3.selectAll('rect')
        .attr('x', function (d) { return d.x })
        .attr('y', function (d) { return d.y })
    };


    // append y-axis to svg (horizontal)
    svgY.append("g")
      .attr("transform", "translate(0," + 0 + ")")
      .call(d3.axisRight(y));

    // add new svg to x-axis div
    let svgX = d3.select('.x-axis')
        .append('svg')
        .attr('height', 40)
        .attr("width", width);

    // append x-axis to svg
    svgX.append("g")
      .attr("transform", "translate(0," + 0 + ")")
      .call(d3.axisBottom(x));

  })
  .catch(function(error){

  })
