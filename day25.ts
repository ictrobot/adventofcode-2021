import {readFileSync} from 'fs';

const input = readFileSync('day25.input', 'utf-8')
    .split("\n")
    .map(x => x.trim().split(''))
    .filter(x => x.length);

const WIDTH = input[0].length;
const HEIGHT = input.length;

type MoveFn = (c: string, x: number, y: number) => ([x: number, y: number] | undefined);

function move(gridIn: string[][], moveFn: MoveFn): [gridOut: string[][], moved: number] {
    const gridOut: string[][] = Array(HEIGHT).fill(undefined).map(_ => []);
    let moved = 0;

    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            const newLocation = moveFn(gridIn[y][x], x, y);

            if (newLocation && gridIn[newLocation[1]][newLocation[0]] ===  '.') {
                gridOut[newLocation[1]][newLocation[0]] = grid[y][x];
                gridOut[y][x] ??= '.';

                moved++;
                continue;
            }

            gridOut[y][x] ??= gridIn[y][x];
        }
    }

    return [gridOut, moved];
}

let grid = input;
let movedEast = Infinity, movedSouth = Infinity;
let steps = 0;

while (movedEast + movedSouth > 0) {
    [grid, movedEast] = move(grid, (c, x, y) => c === ">" ? [(x + 1) % WIDTH, y] : undefined);
    [grid, movedSouth] = move(grid, (c, x, y) => c === "v" ? [x, (y + 1) % HEIGHT] : undefined);
    steps++;
}

console.log(steps); // part 1

// part 2 is just completing all the puzzles
