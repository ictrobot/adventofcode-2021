import {readFileSync} from "fs";

const input = readFileSync('day11.input', 'utf-8')
    .split("\n")
    .filter(x => x)
    .map(line => line.trim().split('').map(Number));

function increase(octopus: number[][], x: number, y: number) {
    if (octopus[y]?.[x] !== undefined) {
        // don't increase an octopus that's at zero (it's already flashed!)
        octopus[y][x] = octopus[y][x] === 0 ? 0 : octopus[y][x] + 1;
    }
}

function iteration(octopus: number[][]) {
    for (let y = 0; y < octopus.length; y++) {
        for (let x = 0; x < octopus[y].length; x++) {
            octopus[y][x]++;
        }
    }

    let thisFlashes = 0;
    while (octopus.some(arr => arr.some(x => x > 9))) {
        for (let y = 0; y < octopus.length; y++) {
            for (let x = 0; x < octopus[y].length; x++) {
                if (octopus[y][x] <= 9) continue;

                thisFlashes += 1;
                octopus[y][x] = 0;

                increase(octopus, x + 1, y + 1);
                increase(octopus, x, y + 1);
                increase(octopus, x - 1, y + 1);
                increase(octopus, x + 1, y);
                increase(octopus, x - 1, y);
                increase(octopus, x + 1, y - 1);
                increase(octopus, x, y - 1);
                increase(octopus, x - 1, y - 1);
            }
        }
    }

    return thisFlashes;
}

// part 1
let flashes = 0;
let part1Octopus = input.map(x => x.map(y => y));
for (let i = 1; i <= 100; i++) {
    flashes += iteration(part1Octopus);
}
console.log(flashes);

// part 2
let part2Octopus = input.map(x => x.map(y => y));
for (let i = 1; true; i++) {
    if (iteration(part2Octopus) === 100) {
        console.log(i);
        break;
    }
}
