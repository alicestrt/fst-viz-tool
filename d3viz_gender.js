let color = d3.scaleOrdinal(d3.schemeSet3);

let y = d3.scalePoint();
let x = d3.scalePoint();

let width = 2000;
let height = 6000;

let svg;

d3.json('data/dataset_gender.json')
  .then(function(data) {

    // set x-axis
    x.domain(data.map((d) => {
      if (d.description != "") {
        return d.description;
      }
    }))
      .range([300, width - 80]);

    // set y-axis
    y.domain(data.map((d) => {
      return d.publisher;
    }))
      .range([100, height - 50]);

    color.domain(data.map((d) => {
      if (d.description_second != "") {
        return d.description_second;
      }
    }));

    console.log(y.domain());

    let simulation = d3.forceSimulation(data)
        .force('x', d3.forceX((d) => {
          if (d.description != ""){
            return x(d.description)
          }}).strength(0.99))
        .force('y', d3.forceY((d) => {
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

    // -- add new svg to y-axis div (vertical)
    // use this svg element to add all data (eg rectangles, etc)
    // this way we keep x-axis above it in a different div, which we can set
    // to `position: fixed`
    svgY = d3.select(".y-axis").append("svg")
      .attr("width", width)
      .attr("height", height);

    let item = svgY.append("g").attr("class", "canvas");

let filtered = data.filter(function(d){ return d.show != "false"})

  //  debugger;
  //filter newdata variable for items that do not have show key
    // create rectangles with data available
    item.selectAll(".canvas")
      .data(filtered)
      .enter()
      .append("rect")
      .attr("width", 8)
      .attr("height", 10)
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("fill", (d) => {
        if (d.show != "") {
          return color("rgba(255,0,0,1)");
        }
        else {return color(d.th);}
      })
    .attr("stroke", "rgba(0,0,0,.2)");

    // create single tooltip to display when hovering over specific rectangle
    // <https://chartio.com/resources/tutorials/how-to-show-data-on-mouseover-in-d3js/#creating-a-tooltip-using-mouseover-events>
    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "#fff")
        .text("...");

    // display / hide tooltip on mouse hovering
    d3.selectAll("rect").on("mouseover", (d) => {
      tooltip.html(`${d.title} <br> ${d.author}`);
      return tooltip.style("visibility", "visible");
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

    // style the terms in y-axis
    d3.select(".y-axis").selectAll("text").style("max-width", '20px').style("height", '200px');


    // add new svg to x-axis div
    let svgX = d3.select('.x-axis')
        .append('svg')
        .attr('height', 20)
        .attr("width", width);

    // append x-axis to svg
    svgX.append("g")
      .attr("transform", "translate(0," + 0 + ")")
      .call(d3.axisBottom(x));

    // give ids to the terms of x-axis
    d3.select(".x-axis").selectAll("text").attr("id", function(d,i) {return "axisText" + i});
    // hover on the terms of x-axis. The tooltip block show related terms,
    // redlinks terms and sometimes definition of each term
    d3.select("#axisText0")
    .on("mouseover", (d) => {
      tooltip.html(`<div class="tooltipxaxis">
      <ul class="synonyms">
      <li>UF <s>homovrouwen</s></li>
      <li>USE lesbische vrouwen</li>
      </ul>
      <ul class="redterms">
      <li class="searched">searched for:</li>
      <li>ADD UF vrouwen die seks hebben met vrouwen</li>
      <li>UF lesbiennes USE lesbische vrouwen (red link)</li>
      <li>UF potten  USE lesbische vrouwen</li>
      </ul></div>`);
      return tooltip.style("visibility", "visible");
    })
      .on("mousemove", () => {
        return tooltip
          .style("top", (d3.event.pageY-10)+"px")
          .style("left",(d3.event.pageX+10)+"px");
      })
      .on("mouseout", () => {
        return tooltip.style("visibility", "hidden");
      });

  })
  .catch(function(error){

  })
