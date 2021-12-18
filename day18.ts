import {readFileSync} from "fs";

type Snailfish = [Snailfish | number, Snailfish | number];

const input = readFileSync('day18.input', 'utf-8').split("\n").filter(x => x).map(x => JSON.parse(x) as Snailfish);

function doExplode(x: Snailfish, position = 0, depth = 1): [position: number, exploded?: [number, number]] {
    for (let [i, child] of x.entries()) {
        if (Array.isArray(child)) {
            if (depth >= 4) {
                x[i] = 0;
                return [position, child as [number, number]]; // told exploding pairs will always be two numbers
            }

            let result;
            [position, result] = doExplode(child, position, depth + 1);
            if (result) return [position, result];
        } else {
            position++;
        }
    }
    return [position];
}

function doSplit(x: Snailfish): boolean {
    for (let [i, child] of x.entries()) {
        if (Array.isArray(child)) {
            if (doSplit(child)) return true;
        } else if (child >= 10) {
            x[i] = [Math.floor(child / 2), Math.ceil(child / 2)];
            return true;
        }
    }
    return false;
}

function addValue(x: Snailfish, value: number, targetPos: number): number {
    for (let [i, child] of x.entries()) {
        if (Array.isArray(child)) {
            targetPos = addValue(child, value, targetPos);
        } else if (--targetPos == 0) {
            x[i] = child + value;
        }
        if (targetPos <= 0) break;
    }
    return targetPos;
}

function reduce(x: Snailfish) {
    let changed = true;
    while (changed) {
        changed = false;

        const [position, pair] = doExplode(x);
        if (pair) {
            changed = true;
            addValue(x, pair[0], position);
            addValue(x, pair[1], position + 2);
            continue;
        }

        changed ||= doSplit(x)
    }
    return x;
}

function clone(s: Snailfish): Snailfish {
    return s.map(v => typeof v === "number" ? v : clone(v)) as Snailfish;
}

function add(x: Snailfish, y: Snailfish) {
    return reduce([clone(x), clone(y)]); // clone inputs to avoid modifying them
}

function magnitude(x: Snailfish | number): number {
    if (typeof x == "number") return x;
    return (3 * magnitude(x[0])) + (2 * magnitude(x[1]));
}

// part 1
let sum = input[0];
for (let i = 1; i < input.length; i++) {
    sum = add(sum, input[i]);
}
console.log(magnitude(sum));

// part 2
let largest = -Infinity;
for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input.length; j++) {
        if (i === j) continue;
        largest = Math.max(largest, magnitude(add(input[i], input[j])));
    }
}
console.log(largest);
