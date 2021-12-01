import {readFileSync} from "fs";

const input = readFileSync('day1.input', 'utf-8').split("\n").map(Number);

// part 1
console.log(input.filter((x, i, a) => x > a[i - 1]).length);

// part 2
console.log(input.map((x, i, a) => x + a[i + 1] + a[i + 2]).filter((x, i, a) => x > a[i - 1]).length);
