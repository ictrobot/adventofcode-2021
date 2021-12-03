import {readFileSync} from "fs";

const input = readFileSync('day3.input', 'utf-8').split("\n").map(x => x.trim()).filter(x => x);

// part 1
function frequency(l: string[]): Map<string, number> {
    const freq = new Map<string, number>();
    l.forEach(x => freq.set(x, (freq.get(x) ?? 0) + 1));
    return freq;
}

let [gammaBits, epsilonBits] = ["", ""];
for (let i = 0; i < input[0].length; i++) {
    const freq = frequency(input.map(x => x[i]));
    let [gammaBit, epsilonBit] = freq.get('1')! > freq.get('0')! ? ['1', '0'] : ['0', '1'];
    gammaBits += gammaBit;
    epsilonBits += epsilonBit;
}
let [gamma, epsilon] = [parseInt(gammaBits, 2), parseInt(epsilonBits, 2)];
console.log(gamma * epsilon);

// part 2
function findValue(filter: (freq: Map<string, number>) => string) {
    let remaining = input.slice();
    for (let i = 0; i < input[0].length && remaining.length > 1; i++) {
        const targetBit = filter(frequency(remaining.map(x => x[i])));
        remaining = remaining.filter(x => x[i] === targetBit);
    }
    return parseInt(remaining[0], 2);
}

const oxygen = findValue(freq => freq.get('1')! >= freq.get('0')! ? '1' : '0');
const co2 = findValue(freq => freq.get('0')! <= freq.get('1')! ? '0' : '1');
console.log(oxygen * co2);
