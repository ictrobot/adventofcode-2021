import {readFileSync} from 'fs';

type Instr = [op: string, reg: number, v?: Operand];
type Operand = {value: number, reg: undefined} | {reg: number, value: undefined};
type Cache = {[pc: number]: {[w: number]: {[x: number]: {[y: number]: {[z: number]: number[] | null}}}}};

const REGISTERS = ['w', 'x', 'y', 'z'];

const input: Instr[] = readFileSync('day24.input', 'utf-8').split(/\r?\n/).filter(x => x).map(l => {
    const [ins, reg, v] = l.trim().split(' ')

    let operand = undefined;
    if (Number(v).toString() === v) {
        operand = {value: Number(v)};
    } else if (v) {
        operand = {reg: REGISTERS.indexOf(v)}
    }

    return [ins, REGISTERS.indexOf(reg), operand];
});

function exec([op, reg, v]: Instr, registers: number[], input: number) {
    if (op === 'inp') {
        registers[reg] = input;
        return;
    }

    let value: number = v!.value ?? registers[v!.reg!];

    if (op === 'add') {
        registers[reg] += value
    } else if (op === 'mul') {
        registers[reg] *= value
    } else if (op === 'div') {
        registers[reg] = Math.floor(registers[reg] / value);
    } else if (op === 'mod') {
        registers[reg] %= value;
    } else if (op === 'eql') {
        registers[reg] = registers[reg] === value ? 1 : 0;
    }
}

function setCache(cache: Cache, pc: number, reg: number[], value: number[] | null) {
    cache[pc] ??= {};
    cache[pc][reg[0]] ??= {};
    cache[pc][reg[0]][reg[1]] ??= {};
    cache[pc][reg[0]][reg[1]][reg[2]] ??= {};
    cache[pc][reg[0]][reg[1]][reg[2]][reg[3]] = value;
    return value;
}

function tryInputs(program: Instr[], pc: number, reg: number[], cache: Cache, inputs: number[]): number[] | null {
    const cachedValue = cache[pc]?.[reg[0]]?.[reg[1]]?.[reg[2]]?.[reg[3]];
    if (cachedValue !== undefined) {
        return cachedValue;
    }

    for (const input of inputs) {
        const inputReg = reg.slice();
        let inputPC = pc;

        do {
            exec(program[inputPC++], inputReg, input);
        } while (inputPC < program.length && program[inputPC][0] !== 'inp');

        if (inputPC >= program.length) {
            if (inputReg[3] !== 0) continue; // solution not valid
            return setCache(cache, pc, reg, [input]); // solution valid
        }

        const result = tryInputs(program, inputPC, inputReg, cache, inputs);
        if (result) return setCache(cache, pc, reg, [input, ...result]);
    }

    return setCache(cache, pc, reg, null);
}

function modelNumber(program: Instr[], inputOrder: number[]) {
    const r = tryInputs(program, 0, [0, 0, 0, 0], {}, inputOrder);
    return r ? r.join('') : r;
}

console.log(modelNumber(input, [9, 8, 7, 6, 5, 4, 3, 2, 1])); // part 1
console.log(modelNumber(input, [1, 2, 3, 4, 5, 6, 7, 8, 9])); // part 2
