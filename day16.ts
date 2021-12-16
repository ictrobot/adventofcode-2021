import {readFileSync} from "fs";

const input = readFileSync('day16.input', 'utf-8').trim();

const hexMap: {[hex: string]: string} = {
    '0': '0000',
    '1': '0001',
    '2': '0010',
    '3': '0011',
    '4': '0100',
    '5': '0101',
    '6': '0110',
    '7': '0111',
    '8': '1000',
    '9': '1001',
    'A': '1010',
    'B': '1011',
    'C': '1100',
    'D': '1101',
    'E': '1110',
    'F': '1111',
};

const bits = input.split("").map(x => hexMap[x]).join('');

type Packet = 
    | {version: number, type: 4, value: number}
    | {version: number, type: 0 | 1 | 2 | 3 | 5 | 6 | 7, children: Packet[]};

function decode(x: string): [p: Packet, remaining: string] {
    const version = parseInt(x.substr(0, 3), 2);
    const type = parseInt(x.substr(3, 3), 2);
    x = x.substr(6);

    if (type === 4) {
        // literal
        let lastSection = false;
        let bits = '';
        
        while (!lastSection) {
            lastSection = x.substr(0, 1) === '0';
            bits += x.substr(1, 4);
            x = x.substr(5);
        }

        return [{version, type, value: parseInt(bits, 2)}, x];
    } else {
        // operator
        const lengthBit = x.substr(0, 1);
        x = x.substr(1);

        let totalLength = Infinity, numPackets = Infinity;
        if (lengthBit === '0') {
            totalLength = parseInt(x.substr(0, 15), 2);
            x = x.substr(15);
        } else {
            numPackets = parseInt(x.substr(0, 11), 2);
            x = x.substr(11);
        }

        const children = [];
        for (let i = 0; i < numPackets && totalLength > 0; i++) {
            const [child, remaining] = decode(x);
            children.push(child);

            totalLength -= x.length - remaining.length;
            x = remaining;
        }
        return [{version, type: type as 0 | 1 | 2 | 3 | 5 | 6 | 7, children}, x];
    }
    throw new Error("Unknown packet type");
}

// part 1
function sumVersions(p: Packet): number {
    if (p.type === 4) return p.version;
    return p.version + p.children.reduce((total, child) => total + sumVersions(child), 0);
}

const rootPacket = decode(bits)[0];
console.log(sumVersions(rootPacket));

// part 2
function evaluate(p: Packet): number {
    if (p.type === 4) return p.value; // literal

    const children = p.children.map(evaluate);
    if (p.type === 0) { // sum
        return children.reduce((total, x) => total + x, 0)
    } else if (p.type === 1) { // product
        return children.reduce((total, x) => total * x, 1)
    } else if (p.type === 2) { // minimum
        return children.reduce((prev, x) => x < prev ? x : prev, Infinity)
    } else if (p.type === 3) { // maximum
        return children.reduce((prev, x) => x > prev ? x : prev, -Infinity)
    } else if (p.type === 5) { // greater than
        return children[0] > children[1] ? 1 : 0
    } else if (p.type === 6) { // less than
        return children[0] < children[1] ? 1 : 0
    } else {// p.type === 7, equal to
        return children[0] == children[1] ? 1 : 0
    }
}

console.log(evaluate(rootPacket));
