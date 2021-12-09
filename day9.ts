import {readFileSync} from "fs";

const input = readFileSync('day9.input', 'utf-8')
    .split("\n")
    .filter(x => x)
    .map(line => line.trim().split('').map(Number));

const lowPoints: [number, number][] = [];

// part 1
let sum = 0;
for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
        if (input[y][x] < (input[y]?.[x + 1] ?? Infinity)
            && input[y][x] < (input[y]?.[x - 1] ?? Infinity)
            && input[y][x] < (input[y + 1]?.[x] ?? Infinity)
            && input[y][x] < (input[y - 1]?.[x] ?? Infinity)) {

            sum += (1 + input[y][x]);
            lowPoints.push([x, y]);
        }
    }
}
console.log(sum);

// part 2
const basins: number[][] = Array(input.length).fill(0).map(_ => Array(input[0].length));
const basinSize = Array(lowPoints.length).fill(1); // basin size includes low point

for (let [i, [x, y]] of lowPoints.entries()) basins[y][x] = i;

let changed = true;
while (changed) {
    changed = false;

    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            if (input[y][x] >= 9 || basins[y][x] !== undefined) continue;

            const neighbours = [];
            neighbours.push([x, y + 1], [x, y - 1], [x + 1, y], [x - 1, y]); // [[x1, y1], ...]
            neighbours.map(arr => arr.unshift(input[arr[1]]?.[arr[0]] ?? Infinity)); // [[h1, x1, y1], ...]
            neighbours.sort(([h1], [h2]) => h1 - h2);

            let [_, flowX, flowY] = neighbours.shift()!; // get neighbour with the lowest height
            const basin = basins[flowY][flowX];
            if (basin !== undefined) {
                basins[y][x] = basin;
                basinSize[basin]++;
                changed = true;
            }
        }
    }
}

console.log(basinSize.sort((x, y) => y - x).slice(0, 3).reduce((t, x) => t * x, 1));
