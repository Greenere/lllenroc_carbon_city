const green_block_carbon = -10;
const com_block_carbon = 20;
const res_block_carbon = 10;

const walk_unit_carbon = 1;
const pub_unit_carbon = 2;
const car_unit_carbon = 3;

const bus_threshold = 2;
const car_threshold = 4;

function get_commutation_carbon(distance){
    if (distance > 5) {
        return car_unit_carbon * distance;
    } else if (distance > 2) {
        return pub_unit_carbon * distance;
    }
    return walk_unit_carbon * distance;
}

function random_choose(blocks){
    let index = Math.floor(Math.random()*blocks.length);
    return blocks[index];
}

function get_distance(block1, block2){
    return Math.abs(block1.x - block2.x) + Math.abs(block1.y - block2.y);
}

function get_statistics(blocks){
    let res_blocks = blocks.filter((b)=>b.value == 1).length;
    let com_blocks = blocks.filter((b)=>b.value == 2).length;
    let green_blocks = blocks.filter((b)=>b.value == 3).length;
    let empty_blocks = blocks.length - res_blocks - com_blocks - green_blocks;
    return {
        "residence": res_blocks,
        "commercial": com_blocks,
        "green": green_blocks,
        "empty":empty_blocks
    };
}

function calculate_carbon_emissions(blocks){
    let block_carbon = 0;
    blocks.forEach(b => {
        if (b.value == 1) block_carbon += res_block_carbon;
        if (b.value == 2) block_carbon += com_block_carbon;
        if (b.value == 3) block_carbon += green_block_carbon;
    });

    let commute_carbon = 0;
    blocks.forEach(b=>{
        if (b.value == 1) {
            // A resident is going to
            // randomly choose a commercial space
            // and a green space to go and then go home
            let com_target = random_choose(blocks.filter((b)=>b.value == 2));
            let green_target = random_choose(blocks.filter((b)=>b.value == 3));
            let distance1 = com_target?get_distance(b, com_target):0;
            let distance2 = green_target & com_target?get_distance(com_target, green_target):0;
            let distance3 = green_target?get_distance(green_target, b):0;
            if (green_target & !com_target) {
                distance3 = distance3 * 2;
            }
            commute_carbon += get_commutation_carbon(distance1);
            commute_carbon += get_commutation_carbon(distance2);
            commute_carbon += get_commutation_carbon(distance3);
        }
    })

    return commute_carbon + block_carbon;
}

function get_carbons(blocks, times){
    let ret = new Array();
    for (i = 0; i < times; i++){
        ret.push(calculate_carbon_emissions(blocks));
    }
    return ret;
}