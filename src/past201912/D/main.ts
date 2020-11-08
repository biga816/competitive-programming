import * as fs from 'fs';
const inputs = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n').map(Number);

const N = inputs.shift();
const list = new Array(N).fill(0);

inputs.forEach((input) => list[input - 1]++);
const lack = list.indexOf(0) + 1;
const dup = list.indexOf(2) + 1;

console.log(dup && lack ? `${dup} ${lack}` : 'Correct');
