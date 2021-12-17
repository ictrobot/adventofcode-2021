import {readFileSync} from "fs";

const [x1, x2, y1, y2] = readFileSync('day17.input', 'utf-8').match(/-?\d+/g)!.map(Number);

function reachesTarget(xVelocity: number, yVelocity: number): [success: boolean, maxY: number] {
    let x = 0, y = 0, maxY = 0;

    while (x <= x2 && y >= y1) {
        x += xVelocity;
        y += yVelocity;
        xVelocity = xVelocity > 0 ? xVelocity - 1 : (xVelocity < 0 ? xVelocity + 1 : 0);
        yVelocity--;

        maxY = Math.max(y, maxY);
        if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
            return [true, maxY];
        }
    }
    return [false, maxY];
}

let maxY = 0, solutions = 0;
for (let xVelocity = 1; xVelocity <= x2; xVelocity++) {
    for (let yVelocity = y1; yVelocity <= 100; yVelocity++) {
        let [success, attemptMaxY] = reachesTarget(xVelocity, yVelocity);
        if (!success) continue;

        maxY = Math.max(maxY, attemptMaxY);
        solutions++;
    }
}

console.log(maxY); // part 1
console.log(solutions); // part 2
