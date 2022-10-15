const svg_carbon = d3.select("svg#carbon_chart");
const margin = { left: 50, right: 50, top: 50, bottom: 50 };
const carbon_width = svg_carbon.attr("width") - margin.left - margin.right;
const carbon_height = svg_carbon.attr("height") - margin.top - margin.bottom;


// scale
// let x = d3.scaleBand().domain([1, 2, 3, 4, 5, 6,7,8,9,10,11,12,13,14,15,16,17,18,19]).range([10,chartWidth2-10])
// console.log(x);
// let y1 = d3.scaleLinear()
//       .domain([0, d3.max(block_counts_data, d => d["Adolescent birth rate"])])
//       .range([chartHeight2, 0]);
// let y2 = d3.scaleLinear()
//       .domain([0, d3.max(carbon_stats_data, d => d)])
//       .range([chartHeight2, 0]);

//     chartArea2.append("g")
//       .call(d3.axisLeft(y2))
//       .call(g => {
//         g.selectAll("line")
//           .attr("x", chartWidth2)
//           .attr("stroke", "#ccc")
//       })

    // let line = d3.line()
    //   .x(carbon_stats_data => x(d) + x.bandwidth() / 2)
    //   .y(carbon_stats_data => y(d[1]));

    // chartArea2.append("g")
    //   .attr("transform", `translate(0,${chartHeight2})`)
    //   .call(d3.axisBottom(x))
    //   .call(g => {
    //     g.selectAll("text")
    //     .attr("dx", "-0.5em")
    //     .attr("dy", "-0.5em")
    //     // .attr("transform", "rotate(-65)")
    //     .style("text-anchor", "end")
    //     .text(function () {
    //         if(d.length > 10) { return d.substring(0,14)+'...'; } 
    //         else { return d; }
    //     });  
    
    for (j = 0; j < 10; j++) {
      carbon_stats_data.forEach( (d, i) => {
          svg2.append("circle")
            .attr("cx",i*30)
            .attr("cy",d[j]*30)
            .attr("r",2) 
            .attr("fill", "#1f77b4");    
        })
    }

    //   //  labels
    // chartArea2.append("text") 
    //   .attr("x", chartWidth2 / 2)
    //   .attr("y", chartHeight2 + 25)
    //   .attr("text-anchor","middle")
    //   .text("Time");
    // chartArea2.append("text") 
    //   .attr("x", -30)
    //   .attr("y", chartHeight2 / 2)
    //   .attr("transform",`rotate(-90, -30 ${chartHeight2 / 2})`)
    //   .attr("text-anchor","middle")
    //   .text("Carbon Emission")