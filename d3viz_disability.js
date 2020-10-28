// let color = d3.scaleOrdinal(d3.schemeSet3);

// do not set d3.schemeSet3, to keep rectangle color not set
// d3.schemeSet3 applies a colorscheme on its own
// see <https://github.com/d3/d3-scale-chromatic>
// and <https://www.d3-graph-gallery.com/graph/custom_color.html>
let color = d3.scaleOrdinal();

let y = d3.scalePoint();
let x = d3.scalePoint();

let width = 1500;
let height = 8000;

let svg;

const view = window.location.href.split('/').slice(-1)[0].split('.')[0]
const filename = view === 'index' ?
  'disability' :
  view

d3.json(`data/dataset_${filename}.json`)
  .then(function(data) {

    // set x-axis
    x.domain(data.map((d) => {
        if (d.description != "") {
          return d.description;
        }
      }))
      .range([300, width - 50]);

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
        if (d.description != "") {
          return x(d.description)
        }
      }).strength(0.99))
      .force('y', d3.forceY((d) => {
        return y(d.publisher);
      }).strength(0.99))
      .force('collide', d3.forceCollide(5).iterations(1))
      .alphaDecay(0)
      .alpha(0.1)
      .on('tick', tick)

    let init_decay;
    init_decay = setTimeout(function() {
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

    let filtered = data.filter(function(d) {
      return d.show != "false"
    })



    // debugger;
    // filter newdata variable for items that do not have show key
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
        termsdisability = d3.set(["invaliden",
                                 "blinden",
                                 "blindheid",
                                 "lichamelijk_gehandicapten",
                                 "gehoorproblemen", "gehandicaptenstudies"]).has(d.other_descriptions);
       termsgender = d3.set(["gender",
                  "genderidentiteit",
                  "genderisme",
                  "genderminderheden",
                  "vrouwen",
                  "mannen",
                  "transgenders",
                  "genderdiversiteit",
                  "genderrelaties", "genderstudies",
                  "interseks"]).has(d.other_descriptions);

      termsrace = d3.set(["culturen",
               "etnische_groepen",
               "zwarten",
               "niet-witte mensen",
               "inheemse_volken",
               "witte",
               "migranten",
               "vluchtelingen",
               "etnische_studies",
               "institutionele_segregatie",
               "kolonialisme",
               "racisme"]).has(d.other_descriptions);

       termssexuality = d3.set(["seksuele_identiteit",
                     "seksuele_orientatie",
                     "seksuele_minderheden",
                     "biseksuelen",
                     "homomannen",
                     "lesbische_vrouwen",
                     "LHBTI"]).has(d.other_descriptions);

       termsstructural_oppression = d3.set(["racisme",
                                     "seksisme",
                                     "genderisme",
                                     "validisme",
                                     "klassisme",
                                     "homofobie",
                                     "transfobie",
                                     "discriminatie",
                                     "microaggressie",
                                     "institutionele_segregatie"]).has(d.other_descriptions);

        // set if / else condition
        if (d.other_descriptions.length > 0) {
          // console.log(termssexuality);
          if (termsdisability == true) {
            // set intersectional color
            return "red";
          } else if (termsgender == true) {
            return "green";
          } else if (termsrace == true){
            return 'blue';
          } else if (termssexuality == true){
            return 'yellow';
          } else if (termsstructural_oppression == true){
            return 'pink';
          } else {
            return 'white';
          }
        }
        else if (d.description !== '') {
          // return topic color
          return 'white';
        }
        // else {
        //   // set basic color in case both `other_description`
        //   // and `description` are empty? maybe not necessary,
        //   // depends on the python code your write
        // }
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
          .style("top", (d3.event.pageY - 10) + "px")
          .style("left", (d3.event.pageX + 10) + "px");
      })
      .on("mouseout", () => {
        return tooltip.style("visibility", "hidden");
      });

    function tick() {
      d3.selectAll('rect')
        .attr('x', function(d) {
          return d.x
        })
        .attr('y', function(d) {
          return d.y
        })
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



    if (filename === 'disability') {
      // give ids to the terms of x-axis
      d3.select(".x-axis").selectAll("text").attr("id", function(d, i) {
        return "disabilityText" + i
      });
      // hover on the terms of x-axis. The tooltip block show related terms,
      // redlinks terms and sometimes definition of each term
      d3.select("#disabilityText0")
        .style('color', 'red')
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
            .style("top", (d3.event.pageY - 10) + "px")
            .style("left", (d3.event.pageX + 10) + "px");
        })
        .on("mouseout", () => {
          return tooltip.style("visibility", "hidden");
        });
    }
//end

if (filename === 'structural-oppression') {
  // give ids to the terms of x-axis
  d3.select(".x-axis").selectAll("text").attr("id", function(d, i) {
    return "structuralText" + i
  });
  // hover on the terms of x-axis. The tooltip block show related terms,
  // redlinks terms and sometimes definition of each term
  // beginning of tooltip racisme
      d3.select("#structuralText0")
      .on("mouseover", (d) => {
        tooltip.html(`<div class="tooltipxaxis">

      <ul class="searched">
          <li class="titles">Searched for:</li>
          <li><s>rassendiscriminatie</s> USE racsime</li>
          <li>ADD: xenofobie</li>
          <li>ADD: kolonialisme</li>
      </ul>
      <ul class="related">
          <li class="titles">Not searched for but related:</li>
          <li>discriminatie </li>
          <li>etnische verhoudingen </li>
          <li>anti-racisme </li>
          <li>etnocentrisme </li>
          <li>ADD white supremacy - redlink</li>
      </ul>

  </div>`);
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
        }
  // end of tooltip racisme
//end2

  })
  .catch(function(error) {

  })
