import * as fs from 'fs';
const inputs = fs
  .readFileSync('/dev/stdin', 'utf8')
  .trim()
  .split(' ')
  .map((val) => Number(val));
inputs.sort((a, b) => b - a);
console.log(inputs[2]);
