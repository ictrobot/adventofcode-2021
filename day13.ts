import {readFileSync} from "fs";

const input = readFileSync('day13.input', 'utf-8');
const [input1, input2] = input.split(/\r?\n\r?\n/).map(x => x.trim());

const coords = input1.split("\n").map(x => x.trim());

const instructions: [axis: 'x' | 'y', pos: number][] = input2.split("\n").map(line => {
    const match = line.match(/fold along ([xy])=(\d+)/)!;
    return [match[1] as 'x' | 'y', Number(match[2])];
});

function foldX(coords: Set<string>, xPos: number) {
    return new Set(Array.from(coords, coord => {
        let [x, y] = coord.split(',').map(Number);
        if (x > xPos) x = xPos - (x - xPos);
        return `${x},${y}`;
    }));
}

function foldY(coords: Set<string>, yPos: number) {
    return new Set(Array.from(coords, coord => {
        let [x, y] = coord.split(',').map(Number);
        if (y > yPos) y = yPos - (y - yPos);
        return `${x},${y}`;
    }));
}

function fold(coords: Set<string>, axis: 'x' | 'y', pos: number) {
    return axis === 'x' ? foldX(coords, Number(pos)) : foldY(coords, Number(pos));
}

// part 1
console.log(fold(new Set(coords), ...instructions[0]).size);

// part 2
function print(coords: Set<string>) {
    const numbers = Array.from(coords, l => l.split(',').map(Number));
    const maxX = Math.max(...numbers.map(x => x[0]));
    const maxY = Math.max(...numbers.map(x => x[1]));

    for (let y = 0; y <= maxY; y++) {
        let line = '';
        for (let x = 0; x <= maxX; x++) {
            line += coords.has(`${x},${y}`) ? '#' : '.';
        }
        console.log(line);
    }
}

let c = new Set(coords);
for (const instruction of instructions) {
    c = fold(c, ...instruction);
}
print(c);
