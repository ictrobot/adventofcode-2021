import {readFileSync} from "fs";

const input = readFileSync('day22.input', 'utf-8').split('\n')
    .map(x => x.match(/(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/))
    .filter(x => x).map(x => ({
        type: x![1] as 'on' | 'off',
        x1: Number(x![2]), x2: Number(x![3]),
        y1: Number(x![4]), y2: Number(x![5]),
        z1: Number(x![6]), z2: Number(x![7])
    }));

class Cuboid {
    constructor(readonly x1: number, readonly x2: number,
                readonly y1: number, readonly y2: number,
                readonly z1: number, readonly z2: number) {
        if (x2 <= x1 || y2 <= y1 || z2 <= z1) throw new Error();
    }

    overlaps(other: Cuboid) {
        return this.x1 <= other.x2 && this.x2 >= other.x1
            && this.y1 <= other.y2 && this.y2 >= other.y1
            && this.z1 <= other.z2 && this.z2 >= other.z1;
    }

    inside(other: Cuboid) {
        return this.x1 >= other.x1 && this.x2 <= other.x2
            && this.y1 >= other.y1 && this.y2 <= other.y2
            && this.z1 >= other.z1 && this.z2 <= other.z2;
    }

    removeOverlapping(other: Cuboid) {
        if (this.inside(other)) return [];
        if (!this.overlaps(other)) return [this];

        const xs = [this.x1, this.x2];
        if (other.x1 > this.x1 && other.x1 < this.x2) xs.splice(-1, 0, other.x1);
        if (other.x2 > this.x1 && other.x2 < this.x2) xs.splice(-1, 0, other.x2);

        const ys = [this.y1, this.y2];
        if (other.y1 > this.y1 && other.y1 < this.y2) ys.splice(-1, 0, other.y1);
        if (other.y2 > this.y1 && other.y2 < this.y2) ys.splice(-1, 0, other.y2);

        const zs = [this.z1, this.z2];
        if (other.z1 > this.z1 && other.z1 < this.z2) zs.splice(-1, 0, other.z1);
        if (other.z2 > this.z1 && other.z2 < this.z2) zs.splice(-1, 0, other.z2);

        const results = [];
        for (let xi = 0; xi < xs.length - 1; xi++) {
            for (let yi = 0; yi < ys.length - 1; yi++) {
                for (let zi = 0; zi < zs.length - 1; zi++) {
                    const c = new Cuboid(xs[xi], xs[xi + 1], ys[yi], ys[yi + 1], zs[zi], zs[zi + 1]);
                    if (!c.inside(other)) results.push(c);
                }
            }
        }
        return results;
    }

    get volume() {
        return (this.x2 - this.x1) * (this.y2 - this.y1) * (this.z2 - this.z1);
    }
}

function numOn(steps: typeof input) {
    let cuboids: Cuboid[] = [];

    for (const step of steps) {
        // easier if the maximum coordinates are exclusive
        const cuboid = new Cuboid(step.x1, step.x2 + 1, step.y1, step.y2 + 1, step.z1, step.z2 + 1);

        cuboids = cuboids.flatMap(c => c.removeOverlapping(cuboid));
        if (step.type == 'on') cuboids.push(cuboid);
    }

    return cuboids.reduce((total, c) => total + c.volume, 0);
}

// part 1
const inside50 = input.filter(x => Object.values(x).every(v => typeof v !== 'number' || Math.abs(v) <= 50));
console.log(numOn(inside50));

// part 2
console.log(numOn(input));
