import * as fs from 'fs';
const [data, ...inputs] = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, M] = data.split(' ').map(Number);

const priceList: { [key: number]: number } = {};
priceList[0] = 0;

inputs.forEach((input) => {
  const [S, C] = input.split(' ');
  const price = Number(C);
  const selection = parseInt(S.replace(/Y/g, '1').replace(/N/g, '0'), 2);
  Object.keys(priceList).forEach((key: string) => {
    const target = Number(key) | selection;
    if (priceList[target] === undefined || priceList[target] > priceList[key] + price) {
      priceList[target] = priceList[key] + price;
    }
  });
});

console.log(priceList[2 ** N - 1] || -1);
