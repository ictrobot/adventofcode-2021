import {readFileSync} from "fs";

const input = readFileSync('day12.input', 'utf-8')
    .split("\n")
    .filter(x => x)
    .map(line => line.trim().split('-'));

const connections: {[k: string]: string[]} = {};
for (const [a, b] of input) {
    connections[a] ??= []
    connections[a].push(b)
    connections[b] ??= []
    connections[b].push(a)
}

const smallCaves = Object.keys(connections).filter(x => x === x.toLowerCase());

// part 1
function part1(node: string, visited: string[]): string[][] {
    const smallCave = node.toLowerCase() === node;
    if (smallCave && visited.indexOf(node) >= 0) return [];

    visited = visited.slice();
    visited.push(node);

    if (node === 'end') return [visited];

    return connections[node].flatMap(next => part1(next, visited));
}

console.log(part1('start', []).length);

// part 2
function part2(node: string, visited: string[]): string[][] {
    if (node === 'start' && visited.indexOf('start') >= 0) {
        return [];
    } else if (node === node.toLowerCase()) {
        const count = visited.filter(x => x === node).length;
        const existing2Small = smallCaves.some(cave => visited.filter(x => x === cave).length > 1);

        if (existing2Small) {
            if (count > 0) return [];
        } else {
            if (count > 1) return [];
        }
    }

    visited = visited.slice();
    visited.push(node);

    if (node === 'end') return [visited];

    return connections[node].flatMap(next => part2(next, visited));
}

console.log(part2('start', []).length);
