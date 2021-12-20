import {readFileSync} from "fs";

const input = readFileSync('day20.input', 'utf-8').split("\n").map(x => x.trim()).filter(x => x);

const iea = input.shift()!;

function apply(image: string[], pad: string): [string[], number] {
    const out = [];

    let lit = 0;
    for (let y = -1; y <= image.length; y++) {
        let row = "";
        for (let x = -1; x <= image[0].length; x++) {
            const square =
                   (image[y - 1]?.[x - 1] ?? pad)   + (image[y - 1]?.[x] ?? pad)    + (image[y - 1]?.[x + 1] ?? pad)
                +  (image[y]?.[x - 1] ?? pad)       + (image[y]?.[x] ?? pad)        + (image[y]?.[x + 1] ?? pad)
                +  (image[y + 1]?.[x - 1] ?? pad)   + (image[y + 1]?.[x] ?? pad)    + (image[y + 1]?.[x + 1] ?? pad);

            let idx = parseInt(square.replace(/\./g, '0').replace(/#/g, '1'), 2);
            let outputPixel = iea[idx];
            if (outputPixel === '#') lit++;
            row += outputPixel;
        }
        out.push(row);
    }

    return [out, lit];
}

function enhance(imageIn: string[], n: number) {
    let image = imageIn, lit = 0;
    for (let i = 0; i < n; i++) {
        [image, lit] = apply(image, i % 2 === 0 ? "." : iea[0]);
    }
    return lit;
}

console.log(enhance(input, 2)); // part 1
console.log(enhance(input, 50)); // part 2
