// let color = d3.scaleOrdinal(d3.schemeSet3);

// do not set d3.schemeSet3, to keep rectangle color not set
// d3.schemeSet3 applies a colorscheme on its own
// see <https://github.com/d3/d3-scale-chromatic>
// and <https://www.d3-graph-gallery.com/graph/custom_color.html>
let color = d3.scaleOrdinal();

let y = d3.scalePoint();
let x = d3.scalePoint();

let width = 2400;
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
      .range([300, width - 100]);

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
        termsdisability = d3.set(["gehandicapten",
                                 "handicaps",
                                 "handicapisme",
                                 "visueel_gehandicapten",
                                 "visuele_handicaps",
                                 "lichamelijk_gehandicapten",
                                 "lichamelijke_handicaps",
                                 "auditief_gehandicapten",
                                 "doven", "gehoorproblemen",
                                 "verstandelijk_gehandicapten",
                                 "gehandicaptenstudies",
                                 "lichamelijke_stoornissen",
                                 "lichamelijke gezondheid"]).has(d.other_descriptions);
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
               "blanken",
               "migranten",
               "vluchtelingen",
               "etnische_studies",
               "etnische_verhoudingen",
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
                                     "handicapisme",
                                     "klassisme",
                                     "homofobie",
                                     "transfobie",
                                     "discriminatie",
                                     "pesten",
                                     "etnische_verhoudingen"]).has(d.other_descriptions);

        // set if / else condition
        if (d.other_descriptions.length > 0) {
          if (termsdisability) {
            // set intersectional color
              return '#81afd2';
          } else if (termsgender) {
            return '#bb7fba';
          } else if (termssexuality){
            return '#fb7f71';
          } else if (termsstructural_oppression){
            return '#fdb264';
            // if (termsgender || termssexuality || termsdisability || termsrace){
            //   return 'purple';
            // } else {return '#fdb264';}
          } else if (termsrace){
            return '#fccbe4';
            // if (termsgender || termssexuality || termsdisability || termsstructural_oppression){
            //   console.log(d.other_descriptions);
            //   return 'purple';
            // } else {console.log(d.other_descriptions);return '#fccbe4';}
          }
            else {
              if (filename === 'disability'){
                return '#81afd2';
              } else if (filename === 'gender'){
                return '#bb7fba';
              } else if (filename === 'sexuality'){
                return '#fb7f71';
              } else if (filename === 'structural-oppression'){
                return '#fdb264';
              } else if (filename === 'race'){
                return '#fccbe4';
              }
          }
        }
        else if (d.description !== '') {
          if (filename === 'disability'){
            return '#81afd2';
          } else if (filename === 'gender'){
            return '#bb7fba';
          } else if (filename === 'sexuality'){
            return '#fb7f71';
          } else if (filename === 'structural-oppression'){
            return '#fdb264';
          } else if (filename === 'race'){
            return '#fccbe4';
          }
        }
        else {
          if (filename === 'disability'){
            return '#81afd2';
          } else if (filename === 'gender'){
            return '#bb7fba';
          } else if (filename === 'sexuality'){
            return '#fb7f71';
          } else if (filename === 'structural-oppression'){
            return '#fdb264';
          } else if (filename === 'race'){
            return '#fccbe4';
          }
          // set basic color in case both `other_description`
          // and `description` are empty? maybe not necessary,
          // depends on the python code your write
        }
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
        tooltip.html(`Title: ${d.title} <br> Author: ${d.author} <br> Other descriptions from this cluster: ${d.description_second} <br> Other descriptions: ${d.other_descriptions}`);
        return tooltip.style("visibility", "visible").style("font-size","0.7em");
      })
      .on("mousemove", () => {
        return tooltip
          .style("top", (d3.event.pageY-10) + "px")
          .style("left",(d3.event.pageX+10)+"px");
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




//end

if (filename === 'disability') {
      // give ids to the terms of x-axis
      d3.select(".x-axis").selectAll("text").attr("id", function(d, i) {
        return "disabilityText" + i
      });
      // hover on the terms of x-axis. The tooltip block show related terms,
      // red links terms and sometimes definition of each term

      //begin tooltip gehandicapten

      d3.select("#disabilityText3")
        .on("mouseover", (d) => {
          tooltip.html(`
<div class="tooltipxaxis">

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li>mensen met een beperking <s>USE gehandicapten</s> (red link) </li>

    <li>mensen met een handicap <s>USE gehandicapten</s> (red link) </li>

    <li>lichamelijk gehandicapten </li>

    <li>verstandelijk gehandicapten </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>gehandicaptenstudies </li>

    <li><s>handicapisme</s> USE validisme (red link) </li>

    </ul>

</div>
`);
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

  // end of tooltip gehandicapten

  //begin tooltip handicaps
      d3.select("#disabilityText7")
        .style('color', 'red')
        .style('text-decoration', 'line-through')
        .on("mouseover", (d) => {
          tooltip.html(`
<div class="tooltipxaxis">
USE [to be filled in] (red link)

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li>lichamelijke handicaps </li>

    <li><s>ontwikkelingsstoornissen</s> [to be filled in] (red link) </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>gehandicaptenstudies </li>

    </ul>

</div>
`);
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

  // end of tooltip handicaps


  //begin tooltip handicapisme
      d3.select("#disabilityText8")
        .style('color', 'red')
        .style('text-decoration', 'line-through')
        .on("mouseover", (d) => {
          tooltip.html(`<div class="tooltipxaxis">
          USE validisme (red-link)

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li>discriminatie van gehandicapten </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>discriminatie </li>

    <li>gehandicapten </li>

    </ul>

</div>
`);
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

  // end of tooltip handicapisme


  //begin tooltip visueel gehandicapten
      d3.select("#disabilityText1")
        .on("mouseover", (d) => {
          tooltip.html(`
<div class="tooltipxaxis">

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li>mensen met een visuele beperking </li>

    <li>mensen met een visuele handicap </li>

    <li>blinden </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>lichamelijk gehandicapten </li>

    <li><s>visuele handicaps</s> USE [to be filled in] (red link) </li>

    </ul>

</div>
`);
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

  // end of tooltip gender visueel gehandicapten


  //begin tooltip visuele handicaps
      d3.select("#disabilityText9")
        .style('color', 'red')
        .style('text-decoration', 'line-through')
        .on("mouseover", (d) => {
          tooltip.html(`<div class="tooltipxaxis">
          USE [to be filled in] (red link)

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li>visuele beperkingen </li>

    <li>blindheid </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li><s>lichamelijke handicaps</s> USE [to be filled in] (red link) </li>

    <li>visueel gehandicapten </li>

    </ul>

</div>
`);
          return tooltip.style("visibility", "visible");
        })
        .on("mousemove", () => {
          return tooltip
            .style("top", (d3.event.pageY+15) + "px")
            .style("left",(d3.event.pageX-170)+"px");
        })
        .on("mouseout", () => {
          return tooltip.style("visibility", "hidden");
        });

  // end of tooltip visuele handicaps


  //begin tooltip lichamelijk gehandicapten
      d3.select("#disabilityText2")
        .on("mouseover", (d) => {
          tooltip.html(`
<div class="tooltipxaxis">

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li><s>invaliden</s> USE lichamelijk gehandicapten </li>

    <li>motorisch gehandicapten <s>USE lichamelijk gehandicapten</s> (red link)</li>

    <li>auditief gehandicapten </li>

    <li>visueel gehandicapten </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>gehandicapten </li>

    <li><s>lichamelijke handicaps</s> USE [to be filled in] (red link)</li>

    </ul>

</div>
`);
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

  // end of tooltip lichamelijk gehandicapten



  //begin tooltip auditief gehandicapten
      d3.select("#disabilityText0")
        .on("mouseover", (d) => {
          tooltip.html(`
<div class="tooltipxaxis">

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li><s>mensen met hoorproblemen</s> USE auditief gehandicapten</li>

    <li>slechthorenden</li>

    <li><s>doven</s> (red link)</li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>lichamelijk gehandicapten </li>

    <li>gehoorproblemen </li>

    <li>doven (red link) </li>

    </ul>

</div>
`);
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

  // end of tooltip auditief gehandicapten


  //begin tooltip verstandelijk gehandicapten
      d3.select("#disabilityText4")
        .on("mouseover", (d) => {
          tooltip.html(`
<div class="tooltipxaxis">

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li><s>geestelijk gehandicapten</s> USE verstandelijk gehandicapten </li>

    <li>mensen met cognitieve beperkingen USE <s>verstandelijk gehandicapten</s>  [to be filled in] (red link) </li>

    <li><s>mensen met een verstandelijke beperking</s> USE verstandelijk gehandicapten </li>

    <li>mensen met een verstandelijke handicap USE <s>verstandelijk gehandicapten </s> [to be filled in] (red link)</li>

    <li><s>verstandelijk beperkten</s> USE verstandelijk gehandicapten </li>

    <li><s>zwakzinnigen</s> USE verstandelijk gehandicapten </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>gehandicapten </li>

    </ul>

</div>
`);
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

  // end of tooltip verstandelijk gehandicapten


  //begin tooltip doven
      d3.select("#disabilityText5")
        .on("mouseover", (d) => {
          tooltip.html(`
<div class="tooltipxaxis">

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li>dove mensen </li>

    <li>slechthorenden </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>auditief gehandicapten </li>

    <li>doofheid </li>

    <li>gebarentaal </li>

    </ul>

</div>`);
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

  // end of tooltip doven


  //begin tooltip lichamelijke_stoornissen
      d3.select("#disabilityText6")
      .style('color', 'red')
      .style('text-decoration', 'line-through')
        .on("mouseover", (d) => {
          tooltip.html(`
<div class="tooltipxaxis">
USE [to be filled] (red link)

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li>lichamelijke aandoeningen USE <s>lichamlijke stornissen</s> [to be filled] (red link) </li>

    <li><s>somatische stoornissen</s> USE [to be filled] (red link) </li>

    <li>allergieën </li>

    <li>chronisch vermoeidheidssyndroom </li>

    <li>gynaecologische aandoeningen </li>

    <li>hemofilie </li>

    <li>kanker </li>

    <li>MS </li>

    <li>scabies </li>

    <li>soa's </li>

    <li>tuberculose </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>ziekten </li>

    <li>besmetting </li>

    <li><s>lichamelijke handicaps</s> USE [to be filled] (red link) </li>

    </ul>

</div>`);
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

  // end of tooltip lichamelijke_stoornissen

   //begin tooltip lichamelijke_handicaps
      d3.select("#disabilityText10")
        .style('color', 'red')
        .style('text-decoration', 'line-through')
        .on("mouseover", (d) => {
          tooltip.html(`
<div class="tooltipxaxis">
USE [to be filled] (red link)

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li>gehoorproblemen </li>

    <li><s>visuele handicaps</s> USE [to be filled in] (red link) </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li><s>handicaps</s> USE [to be filled in] (red link)</li>

    <li>lichamelijk gehandicapten </li>

    <li>lichamelijke gezondheid </li>

    <li><s>lichamelijke stoornissen</s> USE [to be filled in] (red link)</li>

    </ul>

</div>`);
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

  // end of tooltip lichamelijke_handicaps

   //begin tooltip gehoorproblemen
      d3.select("#disabilityText11")
        .style('color', 'red')
        .style('text-decoration', 'line-through')
        .on("mouseover", (d) => {
          tooltip.html(`
<div class="tooltipxaxis">
USE <s>auditieve handicaps</s>[to be filled] (red link)

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li><s>gehoorstoornissen</s> USE [to be filled in](red link)</li>

    <li>doofheid </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li><s>lichamelijke handicaps</s> USE [to be filled in] (red link)</li>

    <li>auditief gehandicapten </li>

    </ul>

</div>`);
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

  // end of tooltip gehoorproblemen

   //begin tooltip gehandicaptenstudies
      d3.select("#disabilityText12")
        .style('color', 'red')
        .on("mouseover", (d) => {
          tooltip.html(`
<div class="tooltipxaxis">

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>wetenschappelijke disciplines </li>

    <li>gehandicapten </li>

    <li><s>handicaps</s> USE [to be filled in] (red link) </li>

    </ul>

</div>`);
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

  // end of tooltip gehandicaptenstudies

   //begin tooltip lichamelijke gezondheid
      d3.select("#disabilityText13")
        .style('color', 'red')
        .on("mouseover", (d) => {
          tooltip.html(`
<div class="tooltipxaxis">

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li>fitness </li>

    <li> </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>gezondheid </li>

    <li><s>lichamelijke handicaps</s> USE [to be filled] (red link) </li>

    </ul>

</div>`);
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

  // end of tooltip lichamelijke gezondheid
}

//end disability



if (filename === 'sexuality') {
      // give ids to the terms of x-axis
      d3.select(".x-axis").selectAll("text").attr("id", function(d, i) {
        return "sexualityText" + i
      });
      // hover on the terms of x-axis. The tooltip block show related terms,
      // red links terms and sometimes definition of each term
      d3.select("#sexualityText0")
        .on("mouseover", (d) => {
          tooltip.html(`
<div class="tooltipxaxis">

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li><s>flikkers</s> USE homomannen </li>

    <li>mannen die seks hebben met mannen </li>

    <li>homo-ouderen </li>

    <li>kastnichten </li>

    <li>ADD chubs (homomannen) (red link) </li>

    <li>ADD faeries (homomannen)(red link) </li>

    <li>ADD katoeys (red link) </li>

    <li>ADD homo-identiteit (red link) </li>

    <li>ADD homocultuur(red link) </li>

    <li>ADD homoseksualiteit (red link) </li>

    <li>ADD homostudies(red link) </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>mannen </li>

    <li>seksuele minderheden </li>

    <li>homo-identiteit </li>

    <li>homojongens </li>

    <li>homopersonages </li>

    <li>ouders van homomannen </li>

    <li>partners van homomannen </li>

    <li>verhoudingen tussen lesbische vrouwen en homomannen </li>

    </ul>

</div>`);
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

  // end of tooltip homomannen

  //begin tooltip lesbische vrouwen
      d3.select("#sexualityText1")
        .on("mouseover", (d) => {
          tooltip.html(`
<div class="tooltipxaxis">

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li><s>homovrouwen</s> USE lesbische vrouwen </li>

    <li>ADD vrouwen die seks hebben met vrouwen (red link) </li>

    <li>lesbiennes <s>USE lesbische vrouwen</s> (red link) </li>

    <li><s>potten</s> USE lesbische vrouwen </li>

    <li>butches </li>

    <li>femmes </li>

    <li>kastpotten </li>

    <li>lesbische ouderen </li>

    <li>ADD mati (red link) </li>

    <li>ADD lesbisch feminisme (red link) </li>

    <li>ADD lesbianisme (red link) </li>

    <li>ADD lesbische beweging (red link) </li>

    <li>ADD lesbische cultuur (red link) </li>

    <li>ADD lesbische gemeenschap (red link) </li>

    <li>ADD lesbische identiteit (red link) </li>

    <li>ADD lesbische studies (red link) </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>seksuele minderheden </li>

    <li>vrouwen </li>

    <li>lesbische identiteit </li>

    <li>lesbische meiden </li>

    <li>lesbische personages </li>

    <li>ouders van lesbische vrouwen </li>

    <li>partners van lesbische vrouwen </li>

    <li>tribadisme </li>

    <li>verhoudingen tussen lesbische vrouwen en homomannen </li>

    </ul>

</div>`);
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

  // end of tooltip lesbische_vrouwen


  //begin tooltip seksuele identiteit
      d3.select("#sexualityText2")
        .on("mouseover", (d) => {
          tooltip.html(`<div class="tooltipxaxis">

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li>biseksuele identiteit </li>

    <li><s>heteroseksuele identiteit</s> (exclude) (red link) </li>

    <li>homo-identiteit </li>

    <li>lesbische identiteit </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>identiteit </li>

    <li>genderidentiteit </li>

    <li>LHBTI </li>

    <li>seksuele diversiteit </li>

    </ul>

</div>`);
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

  // end of tooltip seksuele identiteit


  //begin tooltip seksuele minderheden
      d3.select("#sexualityText3")
        .on("mouseover", (d) => {
          tooltip.html(`
<div class="tooltipxaxis">

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li>biseksuelen </li>

    <li>homomannen </li>

    <li>katoeys </li>

    <li>lesbische vrouwen </li>

    <li>mannen die seks hebben met mannen </li>

    <li>two-spirit people </li>

    <li>vrouwen die seks hebben met vrouwen </li>

    <li>ADD mati (red link) </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>genderminderheden </li>

    <li>LHBTI </li>

    <li>seksualiteit </li>

    <li>seksuele oriëntatie </li>

    </ul>

</div>`);
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

  // end of tooltip seksuele minderheden


  //begin tooltip biseksuelen
      d3.select("#sexualityText4")
        .on("mouseover", (d) => {
          tooltip.html(`<div class="tooltipxaxis">

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li><s>biseksuele mensen</s> USE biseksuelen </li>

    <li>biseksuele dochters </li>

    <li>biseksuele jongeren </li>

    <li>biseksuele mannen </li>

    <li>biseksuele ouderen </li>

    <li>biseksuele vrouwen </li>

    <li>biseksuele zonen </li>

    <li>ADD biseksuele identiteit (red link) </li>

    <li>ADD biseksualiteit(red link) </li>

    <li>ADD biseksuele gemeenschap (red link) </li>

    <li>ADD bi-beweging (red link) </li>

    <li>ADD biseksuele studies (red link)</li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>seksuele minderheden </li>

    <li>biseksuele gezinnen </li>

    <li>biseksuele paren </li>

    <li>biseksuele personages </li>

    <li>biseksuele rechten </li>

    <li>ouders van biseksuelen </li>

    <li>partners van biseksuelen </li>

    </ul>

</div>`);
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

  // end of tooltip biseksuelen


  //begin tooltip seksuele orientatie
      d3.select("#sexualityText5")
        .on("mouseover", (d) => {
          tooltip.html(`<div class="tooltipxaxis">

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li><s>seksuele geaardheid</s> USE seksuele oriëntatie </li>

    <li><s>seksuele objectkeuze</s> USE seksuele oriëntatie </li>

    <li><s>seksuele voorkeur</s> USE seksuele oriëntatie </li>

    <li>aseksualiteit </li>

    <li>biseksualiteit </li>

    <li>efebofilie </li>

    <li>fetischisme </li>

    <li>gerontofilie </li>

    <li>hebefilie </li>

    <li><s>heteroseksualiteit</s> (exclude) (red link) </li>

    <li>homoseksualiteit </li>

    <li>lesbianisme </li>

    <li>necrofilie </li>

    <li>pedoseksualiteit </li>

    <li>zoöfilie </li>

    <li>ADD demiseksualiteit (red link) </li>

    <li>ADD Gray Sexuality (red link) </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>RT gaydar </li>

    <li>LHBTI </li>

    <li>seksuele diversiteit </li>

    <li>seksuele heroriëntatie </li>

    <li>seksuele minderheden </li>

    <li>seksuele relaties </li>

    <li>situationeel seksueel gedrag </li>

    </ul>

</div>`);
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

  // end of tooltip lesbische_vrouwen


  //begin tooltip LHBTI
      d3.select("#sexualityText6")
        .style('color', 'red')
        .on("mouseover", (d) => {
          tooltip.html(`
<div class="tooltipxaxis">

    <ul class="def">

    <li>def. gebruik alleen voor lesbisch+homo+ </li>

    <li>bi+transgender+interseks en in </li>

    <li>combinatie met andere termen </li>

    </ul>

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li>queer </li>

    <li>LHBT </li>

    <li>ADD LHBTI-gemeenschap (red link) </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>genderdiversiteit </li>

    <li>genderidentiteit </li>

    <li>genderminderheden </li>

    <li>interseks </li>

    <li>LHBTI-beleid </li>

    <li>LHBTI-beweging </li>

    <li>LHBTI-rechten </li>

    <li>seksuele diversiteit </li>

    <li>seksuele identiteit </li>

    <li>seksuele minderheden </li>

    <li>seksuele oriëntatie </li>

    <li>transgenderisme </li>

    </ul>

</div>`);
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

  // end of tooltip lhbti
     }
//end sexuality

if (filename === 'gender') {
      // give ids to the terms of x-axis
      d3.select(".x-axis").selectAll("text").attr("id", function(d, i) {
        return "genderText" + i
      });
      // hover on the terms of x-axis. The tooltip block show related terms,
      // red links terms and sometimes definition of each term
      d3.select("#genderText0")
        .on("mouseover", (d) => {
          tooltip.html(`<div class="tooltipxaxis">

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li>biseksuele vrouwen</li>

    <li><s>heterovrouwen</s> (exclude) (red link)</li>

    <li>lesbische vrouwen</li>

    <li>plattelandsvrouwen</li>

    <li>ADD transvrouwen (red link)</li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>vrouwen die seks hebben met vrouwen </li>

    <li>meiden </li>

    </ul>

</div>`);
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

  // end of tooltip vrouwen

  //begin tooltip mannen
      d3.select("#genderText1")
        .on("mouseover", (d) => {
          tooltip.html(`<div class="tooltipxaxis">

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li>biseksuele mannen </li>

    <li><s>heteromannen</s> (exclude) (red link)</li>

    <li>homomannen </li>

    <li>mannen die seks hebben met mannen </li>

    <li>ADD transmannen (red link) </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li><s>transmannen </s></li>

    </ul>

</div>`);
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

  // end of tooltip mannen


  //begin tooltip transgenders
      d3.select("#genderText2")
        .on("mouseover", (d) => {
          tooltip.html(`<div class="tooltipxaxis">

    <ul class="def">

    <li>def. mensen wiens genderidentiteit en/of </li>

    <li>expressie afwijkt van de sekse die </li>

    <li>hen bij de geboorte is toegewezen </li>

    </ul>

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li>transgendermensen </li>

    <li>transgenderjongeren </li>

    <li>transgenderkinderen </li>

    <li>transgenderouderen </li>

    <li>transmannen </li>

    <li>transvrouwen </li>

    <li>ADD gender non-binariteit (red link) </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>genderminderheden </li>

    <li>anti-transgender geweld </li>

    <li>ouders van transgenders </li>

    <li>partners van transgenders </li>

    <li>passing </li>

    <li>stealth </li>

    <li>transgenderbeweging </li>

    <li>transgendergemeenschap </li>

    <li>transgendergezinnen </li>

    <li>transgenderidentiteit </li>

    <li>transgenderisme </li>

    <li>transgenderpersonages </li>

    <li>transgenderrechten </li>

    <li>vervolging van transgenders </li>

    </ul>

</div>`);
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

  // end of tooltip transgenders


  //begin tooltip gender identiteit
      d3.select("#genderText3")
        .on("mouseover", (d) => {
          tooltip.html(`<div class="tooltipxaxis">

    <ul class="def">

    <li>def. diepgevoelde persoonlijke over- </li>

    <li>tuiging te behoren tot het mannelijk </li>

    <li>geslacht of het vrouwelijk geslacht, </li>

    <li>tot beide of tot geen van beide </li>

    </ul>

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li>genderqueer identiteit </li>

    <li>gendervariante identiteit </li>

    <li>genderdysforie </li>

    <li>gender-fluid </li>

    <li>transgenderidentiteit </li>

    <li>ADD gender non-binariteit (red link) </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>identiteit </li>

    <li>androgynie </li>

    <li>gender </li>

    <li>genderdiversiteit </li>

    <li>genderminderheden </li>

    <li>genderrol </li>

    <li>LHBTI </li>

    <li>mannelijkheid </li>

    <li>seksuele identiteit </li>

    <li>transgenderisme </li>

    <li>transitie </li>

    <li>vrouwelijkheid </li>

    </ul>

</div>`);
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

  // end of tooltip gender identiteit


  //begin tooltip interseks
      d3.select("#genderText4")
        .on("mouseover", (d) => {
          tooltip.html(`<div class="tooltipxaxis">

    <ul class="def">

    <li>def. overkoelende term die vele </li>

    <li>verschillende vormen van seksuele </li>

    <li>anatomie bestrijkt die niet als </li>

    <li>standaard worden beschouwd voor </li>

    <li>mannen of vrouwen, waaronder </li>

    <li>chromosomale, genitale en </li>

    <li>gonodale verschillen </li>

    </ul>

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li><s>differences in sex development</s> USE interseks </li>

    <li><s>disorders of sex development</s> USE interseks </li>

    <li><s>divergences in sex development</s> USE interseks </li>

    <li><s>DSDs</s> USE interseks </li>

    <li><s>hermafroditisme</s> USE interseks </li>

    <li><s>interseksualiteit</s> USE interseks </li>

    <li><s>variations in sex development</s> USE interseks </li>

    <li><s>vsd's</s> USE interseks </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>lichamelijke kenmerken </li>

    <li>androgynie </li>

    <li>gender </li>

    <li>interseksbeweging </li>

    <li>interseksuelen </li>

    <li>LHBTI </li>

    <li>transgenderisme </li>

    </ul>

</div>`);
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

  // end of tooltip interseks


  //begin tooltip gender relaties
      d3.select("#genderText5")
        .on("mouseover", (d) => {
          tooltip.html(`<div class="tooltipxaxis">

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li><s>genderverhoudingen</s> USE genderrelaties </li>

    <li><s>sekseverhoudingen</s> USE genderrelaties</li>

    <li>verhoudingen tussen lesbische vrouwen en homomannen </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>sociale processen </li>

    <li>gender </li>

    <li>gendersegregatie op de arbeidsmarkt </li>

    <li>lesbisch separatisme </li>

    </ul>

</div>`);
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

  // end of tooltip genderrelaties

  //begin tooltip gender
      d3.select("#genderText6")
        .on("mouseover", (d) => {
          tooltip.html(`<div class="tooltipxaxis">

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li>sekse <s>USE gender</s> (red link)</li>

    <li>derde geslacht </li>

    <li>gendertoewijzing </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>androgynie </li>

    <li>eunuchen </li>

    <li>gender-bending </li>

    <li>genderdiversiteit </li>

    <li>genderidentiteit </li>

    <li>genderisme </li>

    <li>genderrelaties </li>

    <li>interseks </li>

    <li>mannelijkheid </li>

    <li>passing </li>

    <li>vrouwelijkheid </li>

    <li>transgenderisme </li>

    </ul>

</div>`);
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

  // end of tooltip gender


  //begin tooltip genderstudies
      d3.select("#genderText7")
        .on("mouseover", (d) => {
          tooltip.html(`<div class="tooltipxaxis">

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li>biseksuele studies </li>

    <li>homostudies </li>

    <li>lesbische studies </li>

    <li>mannenstudies </li>

    <li>transgenderstudies </li>

    <li>vrouwenstudies </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>wetenschappelijke disciplines </li>

    <li>queer theory </li>

    </ul>

</div>`);
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

  // end of tooltip genderstudies


  //begin tooltip genderdiversiteit
      d3.select("#genderText8")
        .on("mouseover", (d) => {
          tooltip.html(`<div class="tooltipxaxis">

    <ul class="def">

    <li>def. verscheidenheid in gedrag of gender- </li>

    <li>expressie dat zich niet conformeert </li>

    <li>aan dominante gendernormen van </li>

    <li>mannelijkheid en vrouwelijkheid </li>

    </ul>

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li>gender non-conformiteit <s>USE genderdiversiteit </s> (red link)</li>

    <li>genderqueerheid <s>USE genderdiversiteit</s> (red link)</li>

    <li>gendervariatie </li>

    <li>pangender </li>

    <li>ADD gender non-binariteit (red link)</li>

    <li>crossdressing </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>diversiteit </li>

    <li>gender </li>

    <li>genderidentiteit </li>

    <li>genderminderheden </li>

    <li>genderrol </li>

    <li>LHBTI </li>

    <li>mannelijkheid </li>

    <li>vrouwelijkheid </li>

    <li>transgenderisme  </li>

    </ul>

</div>`);
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

  // end of tooltip genderdiversiteit


  //begin tooltip genderisme
      d3.select("#genderText9")
        .style('color', 'red')
        .on("mouseover", (d) => {
          tooltip.html(`<div class="tooltipxaxis">

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li><s>genderdiscriminatie</s> USE genderisme</li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>discriminatie </li>

    <li>gender </li>

    <li>seksisme </li>

    </ul>

</div>`);
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

  // end of tooltip genderisme


  //begin tooltip gender minderheden
      d3.select("#genderText10")
        .style('color', 'red')
        .on("mouseover", (d) => {
          tooltip.html(`<div class="tooltipxaxis">

    <ul class="searched">

    <li class="titles">Searched for:</li>

    <li><s>genderqueer oriëntatie </s> USE genderminderheden </li>

    <li>genderqueers <s>USE genderminderheden</s> (red link)</li>

    <li>gendervariante mensen <s>USE genderminderheden</s> (red link)</li>

    <li>bi-genders </li>

    <li>crossdressers </li>

    <li>drag kings </li>

    <li>drag queens </li>

    <li>hijra's </li>

    <li>katoeys </li>

    <li>mahu </li>

    <li>sistergirls </li>

    <li>transgenders </li>

    <li>transseksuelen </li>

    <li>trigenders </li>

    <li>two-spirit people </li>

    <li>waria </li>

    </ul>

    <ul class="related">

    <li class="titles">Not searched for but related:</li>

    <li>derde geslacht </li>

    <li>gender-bending </li>

    <li>genderdiversiteit </li>

    <li>genderidentiteit </li>

    <li>genderrol </li>

    <li>LHBTI </li>

    <li>seksuele minderheden </li>

    </ul>

</div>`);
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

  // end of tooltip genderminderheden
     }

//end gender


if (filename === 'structural-oppression') {
  // give ids to the terms of x-axis
  d3.select(".x-axis").selectAll("text").attr("id", function(d, i) {
    return "structuralText" + i
  });
  // hover on the terms of x-axis. The tooltip block show related terms,
  // red links terms and sometimes definition of each term
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
          <li>ADD white supremacy - red link</li>
      </ul>

  </div>`);
        return tooltip.style("visibility", "visible");
      })
        .on("mousemove", () => {
          return tooltip
            .style("top", (d3.event.pageY+15)+"px")
            .style("left",(d3.event.pageX-170)+"px");
        })
        .on("mouseout", () => {
          return tooltip.style("visibility", "hidden");
        });
  // end of tooltip racisme

  // beginning of tooltip homofobie
      d3.select("#structuralText1")
      .on("mouseover", (d) => {
        tooltip.html(`<div class="tooltipxaxis">

      <ul class="def">
          <li>def:  gevoelens van ongemak, angst, </li>
          <li>minachting, vijandigheid en/of </li>
          <li>haat tegen homoseksuelen en </li>
          <li>homoseksualiteit </li>
      </ul>
      <ul class="searched">
          <li class="titles">Searched for:</li>
          <li><s>discriminatie van homo's</s> USE homofobie</li>
          <li><s>homo-aversie </s> USE homofobie</li>
          <li><s>homodiscriminatie </s> USE homofobie</li>
          <li><s>homonegativiteit </s> USE homofobie (red link)</li>
          <li>geïnternaliseerde homofobie </li>
      </ul>
      <ul class="related">
          <li class="titles">Not searched for but related:</li>
          <li>discriminatie </li>
          <li>bifobie </li>
          <li>fobieën </li>
          <li><s>heteroseksisme<s> USE heteronormativiteit (red link) </li>
          <li>lesbofobie </li>
          <li><s>pesten</s> USE microagressie (red link) </li>
      </ul>

  </div>`);
        return tooltip.style("visibility", "visible");
      })
        .on("mousemove", () => {
          return tooltip
            .style("top", (d3.event.pageY+15)+"px")
            .style("left",(d3.event.pageX-170)+"px");
        })
        .on("mouseout", () => {
          return tooltip.style("visibility", "hidden");
        });
  // end of tooltip homofobie

  // beginning of tooltip discriminatie
      d3.select("#structuralText2")
      .on("mouseover", (d) => {
        tooltip.html(`<div class="tooltipxaxis">

      <ul class="searched">
          <li class="titles">Searched for:</li>
          <li>AIDS-angst</li>
          <li>anti-semitisme</li>
          <li>bifobie</li>
          <li>discriminatie op de werkvloer</li>
          <li>genderisme</li>
          <li>handicapisme</li>
          <li>homofobie</li>
          <li>islamofobie</li>
          <li>klassisme</li>
          <li>leeftijdsdiscriminatie</li>
          <li>lesbofobie</li>
          <li>positieve actie</li>
          <li>racisme</li>
          <li>seksisme</li>
          <li>transfobie</li>
      </ul>
      <ul class="related">
          <li class="titles">Not searched for but related:</li>
          <li>anti-discriminatiewetgeving </li>
          <li>intimidatie </li>
          <li>onderdrukking </li>
          <li>vervolgingen </li>
          <li>vooroordelen </li>
      </ul>

  </div>`);
        return tooltip.style("visibility", "visible");
      })
        .on("mousemove", () => {
          return tooltip
            .style("top", (d3.event.pageY+15)+"px")
            .style("left",(d3.event.pageX-170)+"px");
        })
        .on("mouseout", () => {
          return tooltip.style("visibility", "hidden");
        });
  // end of tooltip discriminatie

  // beginning of tooltip seksisme
      d3.select("#structuralText3")
      .on("mouseover", (d) => {
        tooltip.html(`<div class="tooltipxaxis">

      <ul class="searched">
          <li class="titles">Searched for:</li>
          <li><s>seksediscriminatie</s> USE seksisme</li>
      </ul>
      <ul class="related">
          <li class="titles">Not searched for but related:</li>
          <li>discriminatie </li>
          <li>genderisme </li>
          <li>heteroseksisme </li>
      </ul>

  </div>`);
        return tooltip.style("visibility", "visible");
      })
        .on("mousemove", () => {
          return tooltip
            .style("top", (d3.event.pageY+15)+"px")
            .style("left",(d3.event.pageX-170)+"px");
        })
        .on("mouseout", () => {
          return tooltip.style("visibility", "hidden");
        });
  // end of tooltip seksisme

  // beginning of tooltip transfobie
      d3.select("#structuralText4")
      .on("mouseover", (d) => {
        tooltip.html(`<div class="tooltipxaxis">

      <ul class="related">
          <li class="titles">Not searched for but related:</li>
          <li>discriminatie </li>
          <li>bifobie </li>
          <li>fobieën </li>
          <li>heteroseksisme </li>
          <li>homofobie </li>
          <li>lesbofobie </li>
          <li>pesten </li>
      </ul>

  </div>`);
        return tooltip.style("visibility", "visible");
      })
        .on("mousemove", () => {
          return tooltip
            .style("top", (d3.event.pageY+15)+"px")
            .style("left",(d3.event.pageX-170)+"px");
        })
        .on("mouseout", () => {
          return tooltip.style("visibility", "hidden");
        });
  // end of tooltip transfobie

  // beginning of tooltip klassisme
      d3.select("#structuralText5")
      .on("mouseover", (d) => {
        tooltip.html(`<div class="tooltipxaxis">

      <ul class="def">
          <li>def: discriminatie op basis van klasse </li>
      </ul>
      <ul class="related">
          <li class="titles">Not searched for but related:</li>
          <li>discriminatie </li>
          <li>klassenstrijd </li>
          <li>sociale klassen </li>
      </ul>

  </div>`);
        return tooltip.style("visibility", "visible");
      })
        .on("mousemove", () => {
          return tooltip
            .style("top", (d3.event.pageY+15)+"px")
            .style("left",(d3.event.pageX-170)+"px");
        })
        .on("mouseout", () => {
          return tooltip.style("visibility", "hidden");
        });
  // end of tooltip klassisme

  // beginning of tooltip genderisme
      d3.select("#structuralText6")
      .style("color","red")
      .on("mouseover", (d) => {
        tooltip.html(`<div class="tooltipxaxis">

      <ul class="searched">
          <li class="titles">Searched for:</li>
          <li><s>genderdiscriminatie</s> USE genderisme</li>
      </ul>
      <ul class="related">
          <li class="titles">Not searched for but related:</li>
          <li>discriminatie </li>
          <li>gender </li>
          <li>seksisme </li>
      </ul>

  </div>`);
        return tooltip.style("visibility", "visible");
      })
        .on("mousemove", () => {
          return tooltip
            .style("top", (d3.event.pageY+15)+"px")
            .style("left",(d3.event.pageX-170)+"px");
        })
        .on("mouseout", () => {
          return tooltip.style("visibility", "hidden");
        });
  // end of tooltip genderisme

  // d3.append("#structuralText7")
  //   .text("tessss");
  // beginning of tooltip validisme
      d3.select("#structuralText7")
      .style("color","red")
      .style("text-decoration", "line-through")
      .on("mouseover", (d) => {
        tooltip.html(`<div class="tooltipxaxis">
        validisme
      <ul class="searched">
          <li class="titles">Searched for:</li>
          <li><s>discriminatie van gehandicapten: </s> USE validisme - red link</li>
      </ul>
      <ul class="related">
          <li class="titles">Not searched for but related:</li>
          <li>discriminatie </li>
          <li>gehandicapten </li>
      </ul>

  </div>`);
        return tooltip.style("visibility", "visible");
      })
        .on("mousemove", () => {
          return tooltip
            .style("top", (d3.event.pageY+15)+"px")
            .style("left",(d3.event.pageX-170)+"px");
        })
        .on("mouseout", () => {
          return tooltip.style("visibility", "hidden");
        });
  // end of tooltip validisme


  // beginning of tooltip microaggressie
      d3.select("#structuralText8")
      .style("color","red")
      .style("text-decoration", "line-through")
      .on("mouseover", (d) => {
        tooltip.html(`<div class="tooltipxaxis">
      USE microaggressie
      <ul class="def">
          <li>def: SN een vorm van gedrag waarbij personen </li>
          <li>herhaaldelijk en gedurende langere </li>
          <li>tijd door één of meerdere anderen op </li>
          <li>agressieve wijze bejegend worden; </li>
          <li>het kan daarbij gaan om verbale </li>
          <li>intimidatie, fysiek geweld of dwang </li>
          <li>en kan gericht zijn tegen specifieke </li>
          <li>slachtoffers, mogelijk op grond van </li>
          <li>etniciteit, religie, gender of </li>
          <li>seksualiteit </li>
      </ul>
      <ul class="searched">
          <li class="titles">Searched for:</li>
          <li>cyberpesten: USE online intimidatie - red link</li>
      </ul>
      <ul class="related">
          <li class="titles">Not searched for but related:</li>
          <li>agressie </li>
          <li>bifobie </li>
          <li>homofobie  </li>
          <li>intimidatie </li>
          <li>lesbofobie </li>
          <li>transfobie </li>
          <li>vroegtijdige schoolverlaters </li>
      </ul>

  </div>`);
        return tooltip.style("visibility", "visible");
      })
        .on("mousemove", () => {
          return tooltip
            .style("top", (d3.event.pageY+15)+"px")
            .style("left",(d3.event.pageX-170)+"px");
        })
        .on("mouseout", () => {
          return tooltip.style("visibility", "hidden");
        });
  // end of tooltip microaggressie


  // beginning of tooltip institutionele segregatie
      d3.select("#structuralText9")
      .style("color","red")
      .style("text-decoration", "line-through")
      .on("mouseover", (d) => {
        tooltip.html(`<div class="tooltipxaxis">
        USE institutionele segregatie (red link)
      <ul class="def">
          <li><s>def: SN verhoudingen tussen etnische groepen</s> institutionele segregatie</li>
          <li><s>rassenverhoudingen</s> USE institutionele segregatie (red link)</li>
      </ul>
      <ul class="searched">
          <li class="titles">Searched for:</li>
          <li>anti-semitisme</li>
          <li>apartheid </li>
          <li>racisme </li>
      </ul>
      <ul class="related">
          <li class="titles">Not searched for but related:</li>
          <li>sociale processen</li>
          <li>etnische diversiteit </li>
          <li>etnische groepen </li>
          <li>etnische studies </li>
          <li>etnocentrisme</li>
      </ul>

  </div>`);
        return tooltip.style("visibility", "visible");
      })
        .on("mousemove", () => {
          return tooltip
            .style("top", (d3.event.pageY+15)+"px")
            .style("left",(d3.event.pageX-170)+"px");
        })
        .on("mouseout", () => {
          return tooltip.style("visibility", "hidden");
        });
  // end of tooltip institutionele segregatie
}
//end structural


if (filename === 'race') {
  // give ids to the terms of x-axis
  d3.select(".x-axis").selectAll("text").attr("id", function(d, i) {
    return "raceText" + i
  });
  // hover on the terms of x-axis. The tooltip block show related terms,
  // red links terms and sometimes definition of each term

  // beginning of tooltip zwarten

      d3.select("#raceText0")
      .on("mouseover", (d) => {
        tooltip.html(`<div class="tooltipxaxis">

      <ul class="def">
          <li>def: SN alleen gebruiken voor mensen van </li>
          <li>zwart-Afrikaanse afkomst en niet voor </li>
          <li>andere 'people of colour' </li>
      </ul>
      <ul class="searched">
          <li class="titles">Searched for:</li>
          <li>afro-amerikanen </li>
          <li>afro-aziaten </li>
          <li>afro-canadezen </li>
          <li>afro-caribiërs </li>
          <li>afro-latijns-amerikanen </li>
      </ul>
      <ul class="related">
          <li class="titles">Not searched for but related:</li>
          <li>etnische groepen </li>
          <li>zwarte studies </li>
      </ul>

  </div>
  `);
        return tooltip.style("visibility", "visible");
      })
        .on("mousemove", () => {
          return tooltip
            .style("top", (d3.event.pageY+15)+"px")
            .style("left",(d3.event.pageX-170)+"px");
        })
        .on("mouseout", () => {
          return tooltip.style("visibility", "hidden");
        });
        // end of tooltip racisme

        // beginning of tooltip kolonialisme

          d3.select("#raceText3")
          .on("mouseover", (d) => {
            tooltip.html(`<div class="tooltipxaxis">
      <ul class="searched">
          <li class="titles">Searched for:</li>
          <li>ethnocentrisme </li>
          <li>imperialisme </li>
      </ul>
      <ul class="related">
          <li class="titles">Not searched for but related:</li>
          <li>etnocentrisme </li>
      </ul>

  </div>

      `);
            return tooltip.style("visibility", "visible");
          })
            .on("mousemove", () => {
              return tooltip
                .style("top", (d3.event.pageY+15)+"px")
                .style("left",(d3.event.pageX-170)+"px");
            })
            .on("mouseout", () => {
              return tooltip.style("visibility", "hidden");
            });
            // end of tooltip kolonialisme

            // beginning of tooltip vluchtelingen

              d3.select("#raceText10")
              .on("mouseover", (d) => {
                tooltip.html(`
  <div class="tooltipxaxis">

      <ul class="searched">
          <li class="titles">Searched for:</li>
          <li><s>asielzoekers</s> USE vluchtelingen</li>
      </ul>
      <ul class="related">
          <li class="titles">Not searched for but related:</li>
          <li><s>asielzoekerscentra </s> USE vluchtelingencentrum (red link)</li>
          <li>asielmigratie </li>
          <li><s>illegalen </s> USE ongedocumenteerde- (red link)</li>
          <li>immigratiebeleid </li>
          <li>migratie </li>
          <li>vervolgingen </li>
          <li>vreemdelingendetentiecentra </li>
      </ul>

  </div>

          `);
                return tooltip.style("visibility", "visible");
              })
                .on("mousemove", () => {
                  return tooltip
                    .style("top", (d3.event.pageY+15)+"px")
                    .style("left",(d3.event.pageX-170)+"px");
                })
                .on("mouseout", () => {
                  return tooltip.style("visibility", "hidden");
                });
                // end of tooltip vluchtelingen

                // beginning of tooltip racisme

                  d3.select("#raceText4")
                  .on("mouseover", (d) => {
                    tooltip.html(`
                      <div class="tooltipxaxis">

                          <ul class="searched">
                              <li class="titles">Searched for:</li>
                              <li><s>rassendiscriminatie</s> USE racsime</li>
                              <li>ADD: xenofobie</li>
                          </ul>
                          <ul class="related">
                              <li class="titles">Not searched for but related:</li>
                              <li>discriminatie </li>
                              <li>etnische verhoudingen </li>
                              <li>anti-racisme </li>
                              <li>etnocentrisme </li>
                              <li>ADD white supremacy - red link</li>
                          </ul>

                      </div>

              `);
                    return tooltip.style("visibility", "visible");
                  })
                    .on("mousemove", () => {
                      return tooltip
                        .style("top", (d3.event.pageY+15)+"px")
                        .style("left",(d3.event.pageX-170)+"px");
                    })
                    .on("mouseout", () => {
                      return tooltip.style("visibility", "hidden");
                    });
                    // end of tooltip racisme

                    // beginning of tooltip etnische groepen

                      d3.select("#raceText5")
                      .on("mouseover", (d) => {
                        tooltip.html(`
                          <div class="tooltipxaxis">

      <ul class="def">
          <li>def: SN bevolkingsgroepen met een eigen </li>
          <li>sociaal-culturele identiteit </li>
          <li>NIET gebruiken voor migranten  </li>
      </ul>
      <ul class="searched">
          <li class="titles">Searched for:</li>
          <li><s>rassen </s> USE race (red link) </li>
          <li><s>blanken </s> USE witte (red link) (excluded) </li>
          <li>inuit </li>
          <li>joden </li>
          <li>latino's </li>
          <li>roma </li>
          <li>zwarten </li>
      </ul>
      <ul class="related">
          <li class="titles">Not searched for but related:</li>
          <li>etnische diversiteit </li>
          <li>etnische studies </li>
          <li><s>etnische verhoudingen </s> USE institutionele segregratie</li>
          <li>inheemse volken </li>
          <li>migranten </li>
          <li>migratie </li>
          <li>multiculturalisme </li>
      </ul>

  </div>

                  `);
                        return tooltip.style("visibility", "visible");
                      })
                        .on("mousemove", () => {
                          return tooltip
                            .style("top", (d3.event.pageY+15)+"px")
                            .style("left",(d3.event.pageX-170)+"px");
                        })
                        .on("mouseout", () => {
                          return tooltip.style("visibility", "hidden");
                        });
                        // end of tooltip etnische groepen

                        // beginning of tooltip migranten

                          d3.select("#raceText6")
                          .on("mouseover", (d) => {
                            tooltip.html(`
                              <div class="tooltipxaxis">

      <ul class="def">
          <li>def: SN kijk bij bevolkingsgroepen voor </li>
          <li>meer specifieke descriptoren; </li>
          <li>gebruik bevolkingsgroep land van  </li>
          <li>herkomst in combinatie met naam </li>
          <li>van land van vestiging; bijv.: </li>
          <li>mexicanen + usa, of </li>
          <li>turken + nederland </li>
      </ul>
      <ul class="searched">
          <li class="titles">Searched for:</li>
          <li><s>allochtonen </s> USE migranten </li>
      </ul>
      <ul class="related">
          <li class="titles">Not searched for but related:</li>
          <li>etnische groepen </li>
          <li>inburgeringscursussen </li>
          <li>migratie </li>
      </ul>

  </div>
                      `);
                            return tooltip.style("visibility", "visible");
                          })
                            .on("mousemove", () => {
                              return tooltip
                                .style("top", (d3.event.pageY+15)+"px")
                                .style("left",(d3.event.pageX-170)+"px");
                            })
                            .on("mouseout", () => {
                              return tooltip.style("visibility", "hidden");
                            });
                            // end of tooltip migranten

                            // beginning of tooltip inheemse volken

                              d3.select("#raceText7")
                              .on("mouseover", (d) => {
                                tooltip.html(`

                                  <div class="tooltipxaxis">

                              <ul class="def">
                                  <li>def: SN oorspronkelijke bewoners van een </li>
                                  <li>land die de oude cultuur bewaard </li>
                                  <li>hebben na overheersing door een </li>
                                  <li>ander volk </li>
                              </ul>
                              <ul class="searched">
                                  <li class="titles">Searched for:</li>
                                  <li>natuurvolken </li>
                                  <li>aboriginals </li>
                                  <li>indianen </li>
                                  <li>maori's </li>
                                  <li>papoea's </li>
                              </ul>
                              <ul class="related">
                                  <li class="titles">Not searched for but related:</li>
                                  <li>culturen </li>
                                  <li>etnische groepen </li>
                                  <li>rituele homoseksualiteit </li>
                              </ul>

                          </div>
                          `);
                                return tooltip.style("visibility", "visible");
                              })
                                .on("mousemove", () => {
                                  return tooltip
                                    .style("top", (d3.event.pageY+15)+"px")
                                    .style("left",(d3.event.pageX-170)+"px");
                                })
                                .on("mouseout", () => {
                                  return tooltip.style("visibility", "hidden");
                                });
                                // end of tooltip inheemse volken

                                // beginning of tooltip culturen

                                  d3.select("#raceText8")
                                  .on("mouseover", (d) => {
                                    tooltip.html(`
                                      <div class="tooltipxaxis">

      <ul class="searched">
          <li class="titles">Searched for:</li>
          <li>afrikaanse culturen </li>
          <li>amerikaanse culturen </li>
          <li>aziatische culturen </li>
          <li><s>europese culturen</s> (exclude) </li>
          <li>mediterrane culturen </li>
          <li>oceanische culturen </li>
          <li>oude culturen </li>
          <li><s>westerse culturen </s> (exclude)</li>
          <li>interculturele relaties </li>
      </ul>
      <ul class="related">
          <li class="titles">Not searched for but related:</li>
          <li>culturele diversiteit </li>
          <li>inheemse volken </li>
          <li>rituele homoseksualiteit </li>
      </ul>

  </div>
                              `);
                                    return tooltip.style("visibility", "visible");
                                  })
                                    .on("mousemove", () => {
                                      return tooltip
                                        .style("top", (d3.event.pageY+15)+"px")
                                        .style("left",(d3.event.pageX-170)+"px");
                                    })
                                    .on("mouseout", () => {
                                      return tooltip.style("visibility", "hidden");
                                    });
                                    // end of tooltip culturen
                                    // beginning of tooltip etnische studies

                                      d3.select("#raceText9")
                                      .on("mouseover", (d) => {
                                        tooltip.html(`
                                          <div class="tooltipxaxis">

      <ul class="searched">
          <li class="titles">Searched for:</li>
          <li>azië studies </li>
          <li>indiaanse studies </li>
          <li>latijns-amerikaanse studies </li>
          <li>zwarte studies </li>
      </ul>
      <ul class="related">
          <li class="titles">Not searched for but related:</li>
          <li>wetenschappelijke disciplines </li>
          <li>etnische groepen  </li>
          <li>etnische verhoudingen </li>
      </ul>

  </div>
                                    `);
                                        return tooltip.style("visibility", "visible");
                                      })
                                        .on("mousemove", () => {
                                          return tooltip
                                            .style("top", (d3.event.pageY+15)+"px")
                                            .style("left",(d3.event.pageX-170)+"px");
                                        })
                                        .on("mouseout", () => {
                                          return tooltip.style("visibility", "hidden");
                                        });
                                        // end of tooltip etnische studies

                                        // beginning of tooltip blanken

                                          d3.select("#raceText1")
                                          .style('text-decoration', 'line-through')
                                          .on("mouseover", (d) => {
                                            tooltip.html(`
                                              <div class="tooltipxaxis">
                                              USE witte


      <ul class="related">
          <li class="titles">Not searched for but related:</li>
          <li>etnische groepen </li>
      </ul>

  </div>
                                        `);
                                            return tooltip.style("visibility", "visible");
                                          })
                                            .on("mousemove", () => {
                                              return tooltip
                                                .style("top", (d3.event.pageY+15)+"px")
                                                .style("left",(d3.event.pageX-170)+"px");
                                            })
                                            .on("mouseout", () => {
                                              return tooltip.style("visibility", "hidden");
                                            });
                                            // end of tooltip blanken

                                            // beginning of tooltip institutionele segregatie

                                              d3.select("#raceText2")
                                              .style('text-decoration', 'line-through')
                                              .on("mouseover", (d) => {
                                                tooltip.html(`
                                                  <div class="tooltipxaxis">
      USE institutionele segregatie
      <ul class="searched">
          <li class="titles">Searched for:</li>
          <li>anti-semitisme </li>
          <li>apartheid </li>
          <li>racisme </li>
          <li>ADD xenofobie </li>
      </ul>
      <ul class="related">
          <li class="titles">Not searched for but related:</li>
          <li>sociale processen </li>
          <li>etnische diversiteit </li>
          <li>etnische groepen </li>
          <li>etnische studies </li>
          <li>etnocentrisme </li>
      </ul>

  </div>
                                            `);
                                                return tooltip.style("visibility", "visible");
                                              })
                                                .on("mousemove", () => {
                                                  return tooltip
                                                    .style("top", (d3.event.pageY+15)+"px")
                                                    .style("left",(d3.event.pageX-170)+"px");
                                                })
                                                .on("mouseout", () => {
                                                  return tooltip.style("visibility", "hidden");
                                                });
                                                // end of tooltip institutionele segregatie
}
//end race

  })
  .catch(function(error) {

  })
