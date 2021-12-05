import {readFileSync} from "fs";

const input = readFileSync('day5.input', 'utf-8').split("\n").map(x => x.trim()).filter(x => x);

const axial = []; // ['x1,y1', 'x2,y2', 'x3,y3', ...]
const diagonal = [];

for (const l of input) {
    let [x1, y1, x2, y2] = l.split(/[^\d]+/).map(Number);

    let [xDiff, yDiff] = [x2 - x1, y2 - y1];
    let [xSign, ySign] = [Math.sign(xDiff), Math.sign(yDiff)];
    let length = 1 + Math.max(Math.abs(xDiff), Math.abs(yDiff));
    let covered = Array.from({length}, (_, i) => `${x1 + (i * xSign)},${y1 + (i * ySign)}`)

    if ((xSign !== 0) !== (ySign !== 0)) {
        axial.push(...covered);
    } else {
        diagonal.push(...covered);
    }
}

function overlappingPositions(positions: string[]) {
    let map = new Map<string, number>();
    for (const x of positions) map.set(x, (map.get(x) ?? 0) + 1);
    return [...map.values()].filter(v => v >= 2).length;
}

console.log(overlappingPositions([...axial])); // part 1
console.log(overlappingPositions([...axial, ...diagonal])); // part 2
