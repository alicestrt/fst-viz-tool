let color = d3.scaleOrdinal(d3.schemeSet3);

let y = d3.scalePoint();
let x = d3.scalePoint();

let width = 1500;
let height = 5000;

let svg;

d3.json('data/dataset_sexuality_addcontext.json')
  .then(function(data) {

    x.domain(data.map((d)=> {
      if (d.description!=""){
      return d.description;
    };
      // if (d.description="homomannen"){
      //   return (d.description
      //   .append('title') // append title with text
      //   .text("..."))};
    }))
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

    let simulation = d3.forceSimulation(data)
      .force('x', d3.forceX( (d) => {
        if (d.description!=""){
        return x(d.description)
        // return also term that is not assigned in book
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

    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "#fff")
        .style("width", "20rem")
        .text("...");

    // display / hide tooltip on mouse hovering
    d3.selectAll("rect").on("mouseover", (d) => {
      tooltip.html(`${d.description_second} <br> ${d.title} <br> ${d.author}`);
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




    function tick(){

        d3.selectAll('rect')
        .attr('x', function(d){return d.x})
        .attr('y', function(d){return d.y})

      };

      svg.append("g")
        .attr("transform", "translate(0," + 0 + ")")
        .attr("class", "xaxis")
        .call(d3.axisBottom(x));


        d3.select(".xaxis").selectAll("text").attr("id", function(d,i) {return "axisText" + i});
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


// something wrong with tooltip
      // d3.selectAll("g")
      //   .on("mouseover", (d) => {
      //   tooltip.text(`${d.context_first}`);
      //   return tooltip.style("visibility", "visible");
      // })
      //   .on("mousemove", () => {
      //     return tooltip
      //       .style("top", (d3.event.pageY-10)+"px")
      //       .style("left",(d3.event.pageX+10)+"px");
      //   })
      //   .on("mouseout", () => {
      //     return tooltip.style("visibility", "hidden");
      //   });



      svg.append("g")
        .attr("transform", "translate(0," + 0 + ")")
        .call(d3.axisRight(y));
  })
  .catch(function(error){

  })
