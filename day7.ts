import {readFileSync} from "fs";

const input = readFileSync('day7.input', 'utf-8').split(",").map(Number);

function alignCost(pos: number, costFn = (diff: number) => diff) {
    return input.reduce((total, x) => total + costFn(Math.abs(x - pos)), 0);
}

function findMinCost(costFn?: (diff: number) => number) {
    let minCost = Infinity;
    for (let pos = Math.min(...input); pos <= Math.max(...input); pos++) {
        if (alignCost(pos, costFn) < minCost) minCost = alignCost(pos, costFn);
    }
    return minCost;
}

console.log(findMinCost()); // part 1
console.log(findMinCost(n => n * (n + 1) / 2)); // part 2
