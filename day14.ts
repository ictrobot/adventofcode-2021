import {readFileSync} from "fs";

const input = readFileSync('day14.input', 'utf-8').split("\n").filter(x => x).map(x => x.trim());

const template = input.shift()!;

const ruleMap = new Map<string, string>();
for (const l of input) {
    const [pair, inserted] = l.split(" -> ");
    ruleMap.set(pair, inserted);
}

function add<K>(map: Map<K, bigint>, k: K, num: bigint) {
    map.set(k, (map.get(k) ?? 0n) + num);
}

function letterCountsAfter(iterations: number): Map<string, bigint> {
    let pairCounts = new Map<string, bigint>();
    for (let p = 0; p < template.length - 1; p++) add(pairCounts, template.substring(p, p + 2), 1n);

    const letterCounts = new Map<string, bigint>();
    template.split('').forEach(l => add(letterCounts, l, 1n));

    for (let i = 1; i <= iterations; i++) {
        let newPairs = new Map<string, bigint>();

        for (let [p, c] of pairCounts.entries()) {
            const middle = ruleMap.get(p)!;
            add(letterCounts, middle, c);

            const pair1 = p[0] + middle, pair2 = middle + p[1];
            add(newPairs, pair1, c);
            add(newPairs, pair2, c);
        }

        pairCounts = newPairs;
    }

    return letterCounts;
}

function answer(letterCounts: Map<string, bigint>) {
    const sorted = [...letterCounts.values()].sort((x, y) => Number(x - y));
    return sorted[sorted.length - 1] - sorted[0];
}

console.log(answer(letterCountsAfter(10))); // part 1
console.log(answer(letterCountsAfter(40))); // part 2
