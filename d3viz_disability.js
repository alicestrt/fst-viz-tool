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
            return '#b0dd6b';
          }
        }
        else if (d.description !== '') {
          // return topic color
          return '#b0dd6b';
        }
        else {
          return '#b0dd6b';
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
        tooltip.html(`Title: ${d.title} <br> Author: ${d.author}`);
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
          <li><s>homonegativiteit </s> USE homofobie (redlink)</li>
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
            .style("top", (d3.event.pageY-10)+"px")
            .style("left",(d3.event.pageX+10)+"px");
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
            .style("top", (d3.event.pageY-10)+"px")
            .style("left",(d3.event.pageX+10)+"px");
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
            .style("top", (d3.event.pageY-10)+"px")
            .style("left",(d3.event.pageX+10)+"px");
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
            .style("top", (d3.event.pageY-10)+"px")
            .style("left",(d3.event.pageX+10)+"px");
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
            .style("top", (d3.event.pageY-10)+"px")
            .style("left",(d3.event.pageX+10)+"px");
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
            .style("top", (d3.event.pageY-10)+"px")
            .style("left",(d3.event.pageX+10)+"px");
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
            .style("top", (d3.event.pageY-10)+"px")
            .style("left",(d3.event.pageX+10)+"px");
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
            .style("top", (d3.event.pageY-10)+"px")
            .style("left",(d3.event.pageX+10)+"px");
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

      <ul class="def">
          <li><s>def: SN verhoudingen tussen etnische groepen</s> institutionele segregatie</li>
          <li><s>UF rassenverhoudingen</s> USE institutionele segregatie (redlink)</li>
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
            .style("top", (d3.event.pageY-10)+"px")
            .style("left",(d3.event.pageX+10)+"px");
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
}
//end race

  })
  .catch(function(error) {

  })
