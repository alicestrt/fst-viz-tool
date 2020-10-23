let color = d3.scaleOrdinal(d3.schemeSet3);

let y = d3.scalePoint();
let x = d3.scalePoint();

let width = 1800;
let height = 3200;

let svg;

d3.json('data/dataset_race.json')
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
    d3.select(".x-axis").selectAll("text").attr("id", function(d,i) {return "raceText" + i});
    // hover on the terms of x-axis. The tooltip block show related terms,
    // redlinks terms and sometimes definition of each term

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
          .style("top", (d3.event.pageY-10)+"px")
          .style("left",(d3.event.pageX+10)+"px");
      })
      .on("mouseout", () => {
        return tooltip.style("visibility", "hidden");
      });
      // end of tooltip racisme

      // beginning of tooltip kolonialisme

        d3.select("#raceText1")
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
              .style("top", (d3.event.pageY-10)+"px")
              .style("left",(d3.event.pageX+10)+"px");
          })
          .on("mouseout", () => {
            return tooltip.style("visibility", "hidden");
          });
          // end of tooltip kolonialisme

          // beginning of tooltip vluchtelingen

            d3.select("#raceText2")
            .on("mouseover", (d) => {
              tooltip.html(`
<div class="tooltipxaxis">

    <ul class="searched">
        <li class="titles">Searched for:</li>
        <li><s>asielzoekers</s> USE vluchtelingen</li>
    </ul>
    <ul class="related">
        <li class="titles">Not searched for but related:</li>
        <li><s>asielzoekerscentra </s> USE vluchtelingencentrum (redlink)</li>
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
                  .style("top", (d3.event.pageY-10)+"px")
                  .style("left",(d3.event.pageX+10)+"px");
              })
              .on("mouseout", () => {
                return tooltip.style("visibility", "hidden");
              });
              // end of tooltip vluchtelingen

              // beginning of tooltip racisme

                d3.select("#raceText3")
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
                            <li>ADD white supremacy - redlink</li>
                        </ul>

                    </div>

            `);
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
                  // end of tooltip racisme

                  // beginning of tooltip etnische groepen

                    d3.select("#raceText4")
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
                          .style("top", (d3.event.pageY-10)+"px")
                          .style("left",(d3.event.pageX+10)+"px");
                      })
                      .on("mouseout", () => {
                        return tooltip.style("visibility", "hidden");
                      });
                      // end of tooltip etnische groepen

                      // beginning of tooltip migranten

                        d3.select("#raceText5")
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
                              .style("top", (d3.event.pageY-10)+"px")
                              .style("left",(d3.event.pageX+10)+"px");
                          })
                          .on("mouseout", () => {
                            return tooltip.style("visibility", "hidden");
                          });
                          // end of tooltip migranten

                          // beginning of tooltip inheemse volken

                            d3.select("#raceText6")
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
                                <li>UF natuurvolken </li>
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
                                  .style("top", (d3.event.pageY-10)+"px")
                                  .style("left",(d3.event.pageX+10)+"px");
                              })
                              .on("mouseout", () => {
                                return tooltip.style("visibility", "hidden");
                              });
                              // end of tooltip inheemse volken

                              // beginning of tooltip culturen

                                d3.select("#raceText7")
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
                                      .style("top", (d3.event.pageY-10)+"px")
                                      .style("left",(d3.event.pageX+10)+"px");
                                  })
                                  .on("mouseout", () => {
                                    return tooltip.style("visibility", "hidden");
                                  });
                                  // end of tooltip culturen
                                  // beginning of tooltip etnische studies

                                    d3.select("#raceText8")
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
                                          .style("top", (d3.event.pageY-10)+"px")
                                          .style("left",(d3.event.pageX+10)+"px");
                                      })
                                      .on("mouseout", () => {
                                        return tooltip.style("visibility", "hidden");
                                      });
                                      // end of tooltip etnische studies

                                      // beginning of tooltip witte

                                        d3.select("#raceText10")
                                        .on("mouseover", (d) => {
                                          tooltip.html(`
                                            <div class="tooltipxaxis">

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
                                              .style("top", (d3.event.pageY-10)+"px")
                                              .style("left",(d3.event.pageX+10)+"px");
                                          })
                                          .on("mouseout", () => {
                                            return tooltip.style("visibility", "hidden");
                                          });
                                          // end of tooltip witte

                                          // beginning of tooltip institutionele segregatie

                                            d3.select("#raceText11")
                                            .on("mouseover", (d) => {
                                              tooltip.html(`
                                                <div class="tooltipxaxis">

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
                                                  .style("top", (d3.event.pageY-10)+"px")
                                                  .style("left",(d3.event.pageX+10)+"px");
                                              })
                                              .on("mouseout", () => {
                                                return tooltip.style("visibility", "hidden");
                                              });
                                              // end of tooltip institutionele segregatie
  })
  .catch(function(error){

  })
