import {readFileSync} from "fs";

const input = readFileSync('day15.input', 'utf-8')
    .split("\n")
    .filter(x => x)
    .map(x => x.trim().split('').map(Number));

function bestPath(map: number[][]) {
    let queue: [cost: number, path: string[]][] = [];
    queue.push([0, [`0,0`]]);

    const seen = Array(map.length).fill(0).map(_ => Array(map[0].length).fill(false));

    while (queue.length) {
        queue.sort(([c1], [c2]) => c1 - c2);

        const [cost, path] = queue.shift()!;
        const [x, y] = path[path.length - 1].split(",").map(Number);

        if (x === map[0].length - 1 && y === map.length - 1) {
            return cost;
        }

        if (seen[y][x]) continue;
        seen[y][x] = true;

        if (map[y]?.[x + 1] !== undefined && !seen[y][x + 1] && path.indexOf(`${x + 1},${y}`) < 0) {
            queue.push([cost + map[y][x + 1], [...path, `${x + 1},${y}`]])
        }
        if (map[y]?.[x - 1] !== undefined && !seen[y][x-1] && path.indexOf(`${x-1},${y}`) < 0) {
            queue.push([cost + map[y][x - 1], [...path, `${x-1},${y}`]])
        }
        if (map[y + 1]?.[x] !== undefined && !seen[y + 1][x] && path.indexOf(`${x},${y + 1}`) < 0) {
            queue.push([cost + map[y + 1][x], [...path, `${x},${y + 1}`]])
        }
        if (map[y - 1]?.[x] !== undefined && !seen[y-1][x] && path.indexOf(`${x},${y-1}`) < 0) {
            queue.push([cost + map[y - 1][x], [...path, `${x},${y-1}`]])
        }
    }
}

console.log(bestPath(input)); // part 1

// part 2
const biggerMap = Array(input.length * 5).fill(0).map(x => Array(input[0].length * 5).fill(0));
for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
        for (let yCopy = 0; yCopy < 5; yCopy++) {
            for (let xCopy = 0; xCopy < 5; xCopy++) {
                biggerMap[y + (yCopy * 100)][x + (xCopy * 100)] = (((input[y][x] + yCopy + xCopy) - 1) % 9) + 1;
            }
        }
    }
}

console.log(bestPath(biggerMap));
