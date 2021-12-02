import {readFileSync} from "fs";

const input = readFileSync('day2.input', 'utf-8').split("\n").map(x => {
    const [direction, amount] = x.split(' ');
    return {direction, amount: Number(amount)};
});

// part 1
{
    let [horizontal, depth] = [0, 0];
    for (const {direction, amount} of input) {
        if (direction == 'forward') horizontal += amount;
        else if (direction == 'down') depth += amount;
        else if (direction == 'up') depth -= amount;
    }
    console.log(horizontal * depth);
}

// part 2
{
    let [horizontal, depth, aim] = [0, 0, 0];
    for (const {direction, amount} of input) {
        if (direction == 'forward') {
            horizontal += amount;
            depth += aim * amount;
        } else if (direction == 'down') {
            aim += amount;
        } else if (direction == 'up') {
            aim -= amount;
        }
    }
    console.log(horizontal * depth);
}