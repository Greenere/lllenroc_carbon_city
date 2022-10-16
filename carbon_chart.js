const svg_carbon = d3.select("svg#carbon_chart");
const carbon_margin = { left: 50, right: 50, top: 50, bottom: 50 };
const carbon_width =
  svg_carbon.attr("width") - carbon_margin.left - carbon_margin.right;
const carbon_height =
  svg_carbon.attr("height") - carbon_margin.top - carbon_margin.bottom;

const carbon_chart_labels = svg_carbon
.append("g")
.attr("id", "carbon_label_group")
.attr("transform", `translate(${carbon_margin.left}, ${carbon_margin.top})`);

const carbon_chart = svg_carbon
  .append("g")
  .attr("id", "carbon_group")
  .attr("transform", `translate(${carbon_margin.left}, ${carbon_margin.top})`);

const iteration_scale = d3.scaleLinear([0, 19], [0, carbon_width]);
let bars = new Array();
for (i = 0; i < stat_size; i++){
  bars.push(i);
}

carbon_chart_labels.selectAll('line.iteration_label')
.data(bars)
.join('line')
.attr('class', 'iteration_label')
.attr('x1', d=>iteration_scale(d))
.attr('y1', 0)
.attr('x2', d=>iteration_scale(d))
.attr('y2', carbon_height)
.attr('stroke', 'slategray')

carbon_chart.append("text") 
.attr("x", 1100)
.attr("y", 430)
.attr("text-anchor","middle")
.text("Iteration");
carbon_chart.append("text") 
.attr("x", -30)
.attr("y", 200)
.attr("transform",`rotate(-90, -30 ${carbon_height / 2})`)
.attr("text-anchor","middle")
.text("Carbon Emissions")

function get_emission_data(carbon_stats){
  var carbon_emission_data = new Array();
  for (i = 0; i < carbon_stats.length; i++) {
    carbon_stats[i].forEach((d) => {
      carbon_emission_data.push({
        iteration: i,
        emission: d,
      });
    });
  }
  return carbon_emission_data;
}

function update_carbon_chart() {
  carbon_emission_data = get_emission_data(carbon_stats);

  carbon_range = d3.extent(carbon_emission_data.map((d) => d.emission));
  emission_scale = d3.scaleLinear(carbon_range, [carbon_height, 0]);

  carbon_chart
    .selectAll("circle.carbon_dots")
    .data(carbon_emission_data)
    .join((enter) => {
      enter
        .append("circle")
        .attr("class", "carbon_dots")
        .attr("cx", (d) => iteration_scale(d.iteration))
        .attr("cy", (d) => emission_scale(d.emission))
        .attr("r", 5)
        .attr("opaicty", 0.8)
        .attr("fill", "red");
    },
    (update)=>{
      update.attr("cx", (d) => iteration_scale(d.iteration))
      .attr("cy", (d) => emission_scale(d.emission))
    });
}

function update_carbon_chart_histogram() {
  carbon_emission_data = get_emission_data(carbon_stats);

  carbon_range = d3.extent(carbon_emission_data.map((d) => d.emission));
  emission_scale = d3.scaleLinear(carbon_range, [carbon_height, 0]);
  histo = d3.histogram()
  .value(d=>d)
  .domain(carbon_range)
  .thresholds(100)
  for (i = 0; i < carbon_stats.length; i++){
    data = carbon_stats[i]

    bins = histo(data)
    size_scale = d3.scaleLinear(d3.extent(bins, (d)=>d.length),[0,10])

  carbon_chart
    .selectAll(`circle.carbon_dot_${i}`)
    .data(bins)
    .join((enter) => {
      enter
        .append("circle")
        .attr("class", `carbon_dot_${i}`)
        .attr("cx", iteration_scale(i))
        .attr("cy", (d) => emission_scale(d.x0))
        .attr("r", (d)=>size_scale(d.length))
        .attr("opaicty", 0.5)
        .attr("fill", "red");
    },
    (update)=>{
      update.attr("cx", iteration_scale(i))
      .attr("cy", (d) => emission_scale(d.x0))
      .attr("r", (d)=>size_scale(d.length))
    });
  }
}

update_carbon_chart_histogram();