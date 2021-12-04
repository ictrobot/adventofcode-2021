import {readFileSync} from "fs";

const input = readFileSync('day4.input', 'utf-8').split("\n").map(x => x.trim()).filter(x => x);
const numOrder = input.shift()!.split(',').map(Number);

type Board = {number: number, called: boolean, row: number, column: number}[];

let boards: Board[] = [];
while (input.length) {
    boards.push(input.splice(0, 5).flatMap((row, i) => row.split(/ +/).map((x, j) => ({
        number: Number(x),
        called: false,
        row: i,
        column: j
    }))));
}

const winOrder: [number, Board][] = [];
for (let calledNumber of numOrder) {
    for (let board of boards) {
        for (let entry of board) {
            entry.called ||= entry.number == calledNumber;
        }

        for (let i = 0; i < 5; i++) {
            if (board.every(x => x.called || x.row !== i) || board.every(x => x.called || x.column !== i)) {
                winOrder.push([calledNumber, board]);
                boards = boards.filter(x => x != board);
            }
        }
    }
}

function boardScore(calledNumber: number, board: Board) {
    return calledNumber * board.reduce((v, x) => v + (x.called ? 0 : x.number), 0);
}

console.log(boardScore(...winOrder[0])); // part 1
console.log(boardScore(...winOrder[winOrder.length - 1])); // part 2
