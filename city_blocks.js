const random_walk_num = 100;
const histo_bin_num = 20;

var target_residence = 30;

var current_best_blocks = null;
var current_best_carbon = 1000000000;

// Generate basic blocks
const block_num = 10;
function get_coordinates(index) {
  return {
    x: index % block_num,
    y: (index - (index % block_num)) / block_num,
  };
}

var blocks = new Array();
for (i = 0; i < block_num * block_num; i++) {
  coords = get_coordinates(i);
  blocks.push({
    value: 0,
    x: coords.x,
    y: coords.y,
  });
}

function get_index(x, y) {
  return x + y * block_num;
}

var current_placement = 0;

function changePlacement0() {
  current_placement = 0;
  document.getElementById('placement_value').innerHTML = "Remove";
  // change icon buttons active status
  document.getElementById("residence_button").classList.remove('active');
  document.getElementById("commercial_button").classList.remove('active');
  document.getElementById("park_button").classList.remove('active');
  document.getElementById("remove_button").classList.add('active');
}

function changePlacement1() {
  current_placement = 1;
  document.getElementById('placement_value').innerHTML = "Residence";
  // change icon buttons active status
  document.getElementById("residence_button").classList.add('active');
  document.getElementById("commercial_button").classList.remove('active');
  document.getElementById("park_button").classList.remove('active');
  document.getElementById("remove_button").classList.remove('active');
}
function changePlacement2() {
  current_placement = 2;
  document.getElementById('placement_value').innerHTML = "Commercial";
  // change icon buttons active status
  document.getElementById("residence_button").classList.remove('active');
  document.getElementById("commercial_button").classList.add('active');
  document.getElementById("park_button").classList.remove('active');
  document.getElementById("remove_button").classList.remove('active');
}
function changePlacement3() {
  current_placement = 3;
  document.getElementById('placement_value').innerHTML = "Park";
  // change icon buttons active status
  document.getElementById("residence_button").classList.remove('active');
  document.getElementById("commercial_button").classList.remove('active');
  document.getElementById("park_button").classList.add('active');
  document.getElementById("remove_button").classList.remove('active');
}
function remove() {
  document.getElementById('placement_value').innerHTML = "";
// change icon buttons active status
  document.getElementById("residence_button").classList.remove('active');
  document.getElementById("commercial_button").classList.remove('active');
  document.getElementById("park_button").classList.remove('active');
  document.getElementById("remove_button").classList.add('active');

  
}
function random() {
  document.getElementById('placement_value').innerHTML = "";
// remove icon buttons active status
  document.getElementById("residence_button").classList.remove('active');
  document.getElementById("commercial_button").classList.remove('active');
  document.getElementById("park_button").classList.remove('active');
  document.getElementById("remove_button").classList.remove('active');

  cur_residence = 0
  blocks.forEach(d=>{
    if (cur_residence < target_residence){
    nex = Math.round(Math.random()*3);
    } else {
      nex = 2 + Math.round(Math.random()*4);
      if (nex == 4){
        nex = 0;
      }
    }
    if (nex  == 1){
      cur_residence += 1;
    }
    d.value = nex;
  })
  update_blocks();
  update_card_texts();
  update_counts_and_carbon();
  update_carbon_chart_histogram();
}


function reset() {
  document.getElementById('placement_value').innerHTML = "";
// remove icon buttons active status
  document.getElementById("residence_button").classList.remove('active');
  document.getElementById("commercial_button").classList.remove('active');
  document.getElementById("park_button").classList.remove('active');
  document.getElementById("remove_button").classList.remove('active');
  blocks.forEach(d=>{
    d.value = 0;
  })
  update_blocks();
  update_card_texts();
  update_counts_and_carbon();
  update_carbon_chart_histogram();
}

function loadBest() {
  document.getElementById('placement_value').innerHTML = "";
  document.getElementById("residence_button").classList.remove('active');
  document.getElementById("commercial_button").classList.remove('active');
  document.getElementById("park_button").classList.remove('active');
  document.getElementById("remove_button").classList.remove('active');

  if (current_best_blocks != null){
    blocks = JSON.parse(JSON.stringify(current_best_blocks));
  }
  update_blocks();
  update_card_texts();
  update_counts_and_carbon();
  update_carbon_chart_histogram();
}

var block_counts = new Array();
var carbon_stats = new Array();
const stat_size = 20;

const svg_city = d3.select("svg#city");
const city_margin = { left: 50, right: 50, top: 50, bottom: 50 };
const city_width = svg_city.attr("width") - city_margin.left - city_margin.right;
const city_height = svg_city.attr("height") - city_margin.top - city_margin.bottom;

const block_size = (city_width / block_num) * 0.85;
const block_gap = (city_width / block_num) * 0.15;

const block_group = svg_city
  .append("g")
  .attr("id", "block_group")
  .attr("transform", `translate(${city_margin.left}, ${city_margin.top})`);

const color_scale = (x) => {
  if (x == 1) { // residence
    return "#fcf6bd";
  } else if (x == 2) {
    return "#4cc9f0"; // commercial
  } else if (x == 3) {
    return "#94bfa7"; // green
  } else if (x == 4) {
    return "gray";
  }
  return "white";
};

function update_counts_and_carbon(){
  block_counts.push(get_statistics(blocks));
  carbon_stats.push(get_carbons(blocks, random_walk_num));
  if (block_counts.length > stat_size){
      block_counts.shift();
  }
  if (carbon_stats.length > stat_size){
      carbon_stats.shift();
  }
}

function update_card_texts(){
  cur = get_statistics(blocks);
  if (carbon_stats.length > 0) {
    cur_stat = carbon_stats[carbon_stats.length -1];
  } else {
    cur_stat = get_carbons(blocks, random_walk_num);
  }
  const average = array => array.reduce((a, b) => a + b) / array.length;
  const cur_carbon = average(cur_stat);
  const unemployment = cur.commercial > cur.residence? 0: cur.residence - cur.commercial;
  document.getElementById("res_block_stat").innerText = "Residence:" + cur.residence;
  document.getElementById("com_block_stat").innerText = "Commercial:" + cur.commercial;
  document.getElementById("park_block_stat").innerText = "Park:" + cur.green;
  document.getElementById("carbon_per_stat").innerText = "Avg Carbon:\n" + cur_carbon;
  document.getElementById("unemployment_stat").innerText = "Unemployment:\n" + unemployment;

  if (unemployment < 1 && cur.residence > target_residence - 1) {
    if (cur_carbon < current_best_carbon){
      current_best_carbon = cur_carbon;
      current_best_blocks = JSON.parse(JSON.stringify(blocks));
    }
  }

}

function update_blocks() {
  block_group
    .selectAll("rect.block")
    .data(blocks)
    .join(
      (enter) => {
        enter
          .append("rect")
          .attr("class", "block")
          .attr("x", (d) => (block_size + block_gap) * d.x)
          .attr("y", (d) => (block_size + block_gap) * d.y)
          .attr("width", block_size)
          .attr("height", block_size)
          .attr("stroke", "lightgrey")
          .attr("fill", (d) => color_scale(d.value))
          .attr("rx", block_gap)
          .attr('stroke-width', 2)
          .on('mouseover', function(event){
              let target = d3.select(this);
              target.attr('stroke-width', 4)
              .attr("stroke", "black")
              .attr("fill", color_scale(current_placement))
          })
          .on('mouseout', function(event){
            let target = d3.select(this);
            target.attr('stroke-width', 2)
            .attr("stroke", "lightgrey")
            .attr("fill", (d) => color_scale(d.value))
           })
           .on('mousedown', function(event){
            let target = d3.select(this);
            let index = get_index(target.datum().x, target.datum().y);
            blocks[index].value = current_placement;
            update_blocks();
            update_card_texts();
            update_counts_and_carbon();
            update_carbon_chart_histogram();
           })
      },
      (update) => {
        update.attr("fill", (d) => color_scale(d.value));
      }
    );
}

update_blocks();
update_card_texts();

// console.log(get_carbons(blocks, 10));
// console.log(get_statistics(blocks));
// console.log(block_counts);
// console.log(carbon_stats);