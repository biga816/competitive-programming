import * as fs from 'fs';
const inputs = fs
  .readFileSync('/dev/stdin', 'utf8')
  .trim()
  .split('\n')
  .map((val) => Number(val));
const N = inputs.shift();
const A1 = inputs.shift();

inputs.forEach((input, idx) => {
  const pre = idx > 0 ? inputs[idx - 1] : A1;
  let text = 'stay';
  if (input < pre) {
    text = `down ${pre - input}`;
  } else if (input > pre) {
    text = `up ${input - pre}`;
  }
  console.log(text);
});
