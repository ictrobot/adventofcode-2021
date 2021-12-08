import {readFileSync} from "fs";

const input = readFileSync('day8.input', 'utf-8')
    .split("\n")
    .filter(x => x)
    .map(line => line.trim().split(" | ")
        .map(part => part.split(" ")
            .map(letters => [...letters].sort().join('')) // needed for part 2 as letters can be in a random order
        )
    );

// part 1
let count = 0;
for (const [_, output] of input) {
    for (const s of output) {
        if (s.length === 2) count += 1; // 1
        if (s.length === 4) count += 1; // 4
        if (s.length === 3) count += 1; // 7
        if (s.length === 7) count += 1; // 8
    }
}
console.log(count);

// part 2
function remove(patterns: string[], matching: (x: string) => boolean): string {
    let matchingIndices: number[] = [];
    for (let [i, v] of patterns.entries()) {
        if (matching(v)) matchingIndices.push(i);
    }

    if (matchingIndices.length !== 1) {
        throw new Error(`Expected 1 match, got ${matchingIndices.length} matches`);
    }

    return patterns.splice(matchingIndices[0], 1)[0];
}

function determineMapping(patterns: string[]) {
    const values: string[] = [];
    values[1] = remove(patterns, x => x.length === 2);
    values[4] = remove(patterns, x => x.length === 4);
    values[7] = remove(patterns, x => x.length === 3);
    values[8] = remove(patterns, x => x.length === 7);

    const length5 = patterns.filter(x => x.length === 5); // 2, 3, 5
    const length6 = patterns.filter(x => x.length === 6); // 0, 6, 9

    values[3] = remove(length5, x => [...values[7]].every(c => x.indexOf(c) >= 0)); // every part of 7 is in 3
    values[9] = remove(length6, x => [...values[4]].every(c => x.indexOf(c) >= 0)); // every part of 4 is in 9
    values[5] = remove(length5, x => [...x].every(c => values[9].indexOf(c) >= 0)); // every part of 5 is in 9
    values[6] = remove(length6, x => [...values[5]].every(c => x.indexOf(c) >= 0)); // every part of 5 is in 6
    values[2] = length5[0]; // only one length 5 remaining
    values[0] = length6[0]; // only one length 6 remaining

    const mapping: {[k: string]: number} = {};
    for (const [i, v] of values.entries()) mapping[v] = i;
    return mapping;
}

const outputValues = input.map(([patterns, output]) => {
    const mapping = determineMapping(patterns);
    return Number(output.map(x => mapping[x]).join(''));
});

console.log(outputValues.reduce((total, x) => total + x, 0));

//   0:      1:      2:      3:      4:
//  aaaa    ....    aaaa    aaaa    ....
// b    c  .    c  .    c  .    c  b    c
// b    c  .    c  .    c  .    c  b    c
//  ....    ....    dddd    dddd    dddd
// e    f  .    f  e    .  .    f  .    f
// e    f  .    f  e    .  .    f  .    f
//  gggg    ....    gggg    gggg    ....
//
//   5:      6:      7:      8:      9:
//  aaaa    aaaa    aaaa    aaaa    aaaa
// b    .  b    .  .    c  b    c  b    c
// b    .  b    .  .    c  b    c  b    c
//  dddd    dddd    ....    dddd    dddd
// .    f  e    f  .    f  e    f  .    f
// .    f  e    f  .    f  e    f  .    f
//  gggg    gggg    ....    gggg    gggg
