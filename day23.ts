import {readFileSync} from 'fs';

const input = readFileSync('day23.input', 'utf-8').split(/\r?\n/).filter(x => x);

const costs: {[type: string]: number} = {'A': 1, 'B': 10, 'C': 100, 'D': 1000}

const hallwayXs = [1, 2, 4, 6, 8, 10, 11];
const hallwayY = 1;

const roomXs = [3, 5, 7, 9];
const roomTargets = ['A', 'B', 'C', 'D'];

function solve(input: string[], roomYs: number[]) {
    // all the positions we are interested in and their index in the state string
    const positions: {x: number, y: number, i: number}[] = [];

    let targetState = '';
    for (const [i, x] of hallwayXs.entries()) {
        positions.push({x, y: hallwayY, i});
        targetState += '.';
    }
    for (const [xi, x] of roomXs.entries()) for (const [yi, y] of roomYs.entries()) {
        positions.push({x, y, i: idx(xi, yi)});
        targetState += roomTargets[xi];
    }

    // convert xi (index into roomXs) and yi (index into roomYs) into index in state string
    function idx(xi: number, yi: number): number {
        return hallwayXs.length + (xi * roomYs.length) + yi;
    }

    // swap position i and j in string
    function swapAt(string: string, i: number, j: number): string {
        const l = string.split('');
        [l[i], l[j]] = [l[j], l[i]];
        return l.join('');
    }

    // check if path from roomX to hallwayX is blocked
    function pathBlocked(state: string, roomX: number, hallwayX: number): boolean {
        const minX = Math.min(hallwayX, roomX), maxX = Math.max(hallwayX, roomX);
        for (const [i, x] of hallwayXs.entries()) {
            if (x !== hallwayX && x >= minX && x <= maxX && state[i] !== '.') return true;
        }
        return false;
    }

    // calculate minimum extra cost to reach target state
    function minExtraCost(state: string) {
        return positions.reduce((total, {x, y, i}) => {
            if (state[i] === '.') return total;

            const roomX = roomXs[roomTargets.indexOf(state[i])]; // get target room
            if (roomX === x) return total; // already in the right room

            // + 1 is moving from hallway to top of room
            return total + (costs[state[i]] * (Math.abs(roomX - x) + Math.abs(hallwayY - y) + 1));
        }, 0);
    }

    // find all the possible moves from the current position
    function possibleMoves(state: string, cost: number) {
        const results: [state: string, cost: number, minCost: number][] = [];

        // try moving amphipods from rooms into the hallway
        for (const [xi, roomX] of roomXs.entries()) {
            // check if room done
            if (roomYs.every((y, yi) => state[idx(xi, yi)] === roomTargets[xi])) continue;

            // get top y
            let roomY = undefined, roomIdx = 0;
            for (let yi = 0; yi < roomYs.length; yi++) {
                if (state[roomIdx = idx(xi, yi)] !== '.') {
                    roomY = roomYs[yi];
                    break;
                }
            }
            if (roomY === undefined) continue; // room empty

            for (const [hallwayIdx, hallwayX] of hallwayXs.entries()) {
                if (state[hallwayIdx] !== '.') continue; // hallwayX in use
                if (pathBlocked(state, roomX, hallwayX)) continue; // can't reach hallwayX

                // found reachable and empty hallway space
                const s = swapAt(state, roomIdx, hallwayIdx);
                const c = cost + (costs[state[roomIdx]] * (Math.abs(roomY - hallwayY) + Math.abs(roomX - hallwayX)));
                results.push([s, c, c + minExtraCost(s)]);
            }
        }

        // try moving amphipods out of the hallway into their target rooms
        for (const [hallwayIdx, hallwayX] of hallwayXs.entries()) {
            if (state[hallwayIdx] === '.') continue; // hallway free

            const xi = roomTargets.indexOf(state[hallwayIdx]); // get target room
            const roomX = roomXs[xi];

            // check room only contains same letter or blanks
            if (roomYs.some((y, yi) => state[idx(xi, yi)] !== '.' && state[idx(xi, yi)] !== state[hallwayIdx])) continue;

            // find the deepest free space
            let roomY = undefined, roomIdx = 0;
            for (let yi = roomYs.length - 1; yi >= 0; yi--) {
                if (state[roomIdx = idx(xi, yi)] === '.') {
                    roomY = roomYs[yi];
                    break;
                }
            }
            if (roomY === undefined) continue; // room full

            if (pathBlocked(state, roomX, hallwayX)) continue; // can't reach roomX

            // found valid move to target room
            const s = swapAt(state, roomIdx, hallwayIdx);
            const c = cost + (costs[state[hallwayIdx]] * (Math.abs(roomY - hallwayY) + Math.abs(roomX - hallwayX)));
            results.push([s, c, c + minExtraCost(s)]);
        }

        return results;
    }

    const queue: [state: string, cost: number, minCost: number][] = [[positions.map(p => input[p.y][p.x]).join(''), 0, 0]];
    const stateMinCostMap = new Map<string, number>();

    while (queue.length) {
        const [s, c] = queue.shift()!;

        // keep track of min cost for each state, and continue if we have previously been in this state at a lower cost
        if (stateMinCostMap.get(s) ?? Infinity <= c) continue;
        stateMinCostMap.set(s, c);

        if (s === targetState) return c; // must be the lowest cost solution due to sorting

        queue.push(...possibleMoves(s, c));
        queue.sort((x, y) => x[2] - y[2]); // sort by min possible cost
    }

}

// part 1
console.log(solve(input, [2, 3]));

// part 2
const input2 = input.slice();
input2.splice(3, 0, '  #D#C#B#A#', '  #D#B#A#C#');
console.log(solve(input2, [2, 3, 4, 5]));
