import {readFileSync} from "fs";

const input = readFileSync('day6.input', 'utf-8').split("\n").map(x => x.trim()).filter(x => x);

let fish = input[0].split(",").map(Number);

function growth(days: number) {
    // store [numberOfFishWithTimer0, numberOfFishWithTimer1, ..., numberOfFishWithTimer8]
    let fishCounts = Array(9).fill(0).map((v, i) => fish.filter(x => x === i).length);

    for (let i = 0; i < days; i++) {
        // pop the first element from the list, the number of fish with timer=0, decrementing all the other timer values
        const num0s = fishCounts.shift() ?? 0;
        // add the number of 0s onto the number of 6s to reset the fish
        fishCounts[6] += num0s;
        // create the new fish
        fishCounts[8] = num0s;
    }

    return fishCounts.reduce((total, x) => total + x, 0);
}

console.log(growth(80));
console.log(growth(256));
