import * as fs from 'fs';
const data = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, M] = data.shift().split(' ').map(Number);
const monstarsData = data.splice(0, Number(N)).map((v) => v.split(' ').map(Number));
const helperData = data.map((v) => v.split(' ').map(Number));

const isMatched = (base: number): boolean => {
  const monstars = monstarsData.map(([a, b]) => b - a * base);
  const helpers = helperData.map(([a, b]) => b - a * base).sort((a, b) => b - a);

  monstars.push(helpers.shift());
  monstars.sort((a, b) => b - a);

  return monstars.slice(0, 5).reduce((prev, cur) => prev + cur) >= 0;
};

let min = 0;
let max = 1000 * 100000 * 5; // Max value of M * Max value of A/B * Max count of mixed monster

// Binary search
for (let i = 0; i < 100; i++) {
  const mid = (min + max) / 2;
  if (isMatched(mid)) {
    min = mid;
  } else {
    max = mid;
  }
}

console.log(min.toFixed(12));
