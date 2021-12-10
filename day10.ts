import {readFileSync} from "fs";

const input = readFileSync('day10.input', 'utf-8').split("\n").filter(x => x).map(x => x.trim());

// part 1
function corrupted(l: string): number {
    const opening = [];

    for (const c of l) {
        if (c === "(" || c === "[" || c === "{" || c === "<") {
            opening.push(c);
        } else if (c === ")" && opening.pop() !== "(") {
            return 3;
        }  else if (c === "]" && opening.pop() !== "[") {
            return 57;
        }  else if (c === "}" && opening.pop() !== "{") {
            return 1197;
        }  else if (c === ">" && opening.pop() !== "<") {
            return 25137;
        }
    }

    return 0;
}

console.log(input.map(corrupted).reduce((t, x) => t + x, 0));

// part 2
function incomplete(l: string): number {
    const opening = [];

    for (const c of l) {
        if (c === "(" || c === "[" || c === "{" || c === "<") {
            opening.push(c);
        } else if (c === ")" || c === "]" || c === "}" || c === ">") {
            opening.pop();
        }
    }

    return opening.reverse().map(c => {
        if (c === "(") return 1;
        if (c === "[") return 2;
        if (c === "{") return 3;
        if (c === "<") return 4;
    }).reduce((score, x) => (score * 5) + x!, 0);
}

const scores = input.filter(l => !corrupted(l)).map(incomplete).sort((x, y) => x - y);
console.log(scores[(scores.length - 1) / 2]);
