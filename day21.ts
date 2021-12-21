import {readFileSync} from "fs";

const input = readFileSync('day21.input', 'utf-8')
    .split("\n")
    .map(x => Number(x.match(/Player \d+ starting position: (\d+)/)?.[1]))
    .filter(Number.isFinite)

// part 1
let rollNext = 0, rolls = 0;
function roll() {
    rolls++;
    rollNext %= 100;
    return 1 + rollNext++;
}

const positions = input.slice();
const scores = input.slice().fill(0);
iteration: while (true) {
    for (const i of positions.keys()) {
        const sum = roll() + roll() + roll();
        positions[i] = ((positions[i] + sum - 1) % 10) + 1;
        scores[i] += positions[i];

        if (scores[i] >= 1000) break iteration;
    }
}

console.log(Math.min(...scores) * rolls);

// part 2
type State = [pos1: number, pos2: number, score1: number, score2: number];
const state2str = (s: State) => s.join(",");
const str2state = (s: string) => s.split(",").map(Number) as State;

function quantumIteration(inMap: Map<string, number>): [outMap: Map<string, number>, wins1: number, wins2: number] {
    const outMap = new Map<string, number>();
    let wins1 = 0, wins2 = 0;

    for (const [stateString, count] of inMap.entries()) {
        const [pos1, pos2, score1, score2] = str2state(stateString);

        for (const p1r1 of [1, 2, 3]) for (const p1r2 of [1, 2, 3]) for (const p1r3 of [1, 2, 3]) {
            let p1 = ((pos1 + p1r1 + p1r2 + p1r3 - 1) % 10) + 1;
            let s1 = score1 + p1;
            if (s1 >= 21) {
                wins1 += count;
                continue;
            }

            for (const p2r1 of [1, 2, 3]) for (const p2r2 of [1, 2, 3]) for (const p2r3 of [1, 2, 3]) {
                let p2 = ((pos2 + p2r1 + p2r2 + p2r3 - 1) % 10) + 1;
                let s2 = score2 + p2;
                if (s2 >= 21) {
                    wins2 += count;
                    continue;
                }

                const stateString = state2str([p1, p2, s1, s2]);
                outMap.set(stateString, (outMap.get(stateString) ?? 0) + count);
            }
        }
    }

    return [outMap, wins1, wins2];
}

let stateMap = new Map<string, number>();
stateMap.set(state2str([input[0], input[1], 0, 0]), 1);

let totalWins1 = 0, totalWins2 = 0;
while (stateMap.size) {
    let [newMap, wins1, wins2] = quantumIteration(stateMap);
    stateMap = newMap;
    totalWins1 += wins1;
    totalWins2 += wins2;
}

console.log(Math.max(totalWins1, totalWins2));
