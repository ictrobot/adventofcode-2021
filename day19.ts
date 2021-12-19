import {readFileSync} from "fs";

const input = readFileSync('day19.input', 'utf-8').split(/\r?\n\r?\n/).map(x => x.trim());
const scanners = input.map(x => x.split(/\r?\n/).slice(1).map(p => p.split(",").map(Number))) as Point[][];

type Point = [number, number, number];

function* transformations(points: Point[]) {
    for (const flip0 of [false, true]) for (const flip1 of [false, true]) for (const flip2 of [false, true]) {
        for (const index0 of [0, 1, 2]) for (const index1 of [0, 1]) {
            yield points.map((p) => {
                const f = [flip0 ? -p[0] : p[0], flip1 ? -p[1] : p[1], flip2 ? -p[2] : p[2]];
                return [f.splice(index0, 1)[0], f.splice(index1, 1)[0], f[0]];
            });
        }
    }
}

function findMapping(existingPoints: Point[], extraPoints: Point[]): [offset: Point, points: Point[]] | undefined {
    for (const transformedPoints of transformations(extraPoints)) {
        for (const [x1, y1, z1] of transformedPoints) {
            for (const [x2, y2, z2] of existingPoints) {
                const oX = x2 - x1, oY = y2 - y1, oZ = z2 - z1;

                let count = 0;
                for (const [x, y, z] of transformedPoints) {
                    if (pointTree[i2n(x + oX)]?.[i2n(y + oY)]?.[i2n(z + oZ)]) count++;
                }

                if (count >= 12) {
                    return [[oX, oY, oZ], transformedPoints.map(([x, y, z]) => [x + oX, y + oY, z + oZ])];
                }
            }
        }
    }
}

const pointTree: {[x: number]: {[y: number]: {[z: number]: true | undefined}}} = {}; // for quick point contains check

function addToPointTree([x, y, z]: Point) {
    pointTree[i2n(x)] ??= {};
    pointTree[i2n(x)][i2n(y)] ??= {};
    pointTree[i2n(x)][i2n(y)][i2n(z)] = true;
}

function i2n(i: number) { // integer to natural number, much faster than using negative keys on an object
    return i > 0 ? (i * 2) - 1 : (-i * 2);
}

const allBeacons = scanners[0].slice(), thisIteration = allBeacons.slice();
for (const p of allBeacons) addToPointTree(p);

const scannerOffsets = new Array(scanners.length).fill(undefined);
scannerOffsets[0] = [0, 0, 0];

while (scannerOffsets.some(o => o === undefined)) {
    const prevIteration = thisIteration.splice(0, thisIteration.length); // empties thisIteration into prevIteration

    for (let [i, scanner] of scanners.entries()) {
        if (scannerOffsets[i] !== undefined) continue;

        const result = findMapping(prevIteration, scanner);
        if (result !== undefined) {
            scannerOffsets[i] = result[0];

            for (const p of result[1]) {
                if (!pointTree[i2n(p[0])]?.[i2n(p[1])]?.[i2n(p[2])]) {
                    addToPointTree(p);
                    allBeacons.push(p);
                    thisIteration.push(p);
                }
            }
        }
    }
}

// part 1
console.log(allBeacons.length);

// part 2
let max = -Infinity;
for (let [x1, y1, z1] of scannerOffsets) {
    for (let [x2, y2, z2] of scannerOffsets) {
        max = Math.max(max, Math.abs(x2 - x1) + Math.abs(y2 - y1) + Math.abs(z2 - z1));
    }
}
console.log(max);
