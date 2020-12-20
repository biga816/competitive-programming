import * as fs from 'fs';
const [N, textCList, Q, ...inputs] = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const CList = textCList.split(' ').map(BigInt);

enum OrderType {
  SINGLE = 1,
  SET = 2,
  ALL = 3,
}

const getSingleOrderAmount = (index: number, amount: bigint) => {
  if (CList[index] >= amount) {
    CList[index] -= amount;
    return amount;
  } else {
    return BigInt(0);
  }
};

const getSetOrderAmount = (amount: bigint, quotient: number, remainder: number) => {
  let total = BigInt(0);
  let items = [];

  for (let i = 0; i < CList.length; i = i + 1) {
    const c = CList[i];
    const cIndex = i + 1;
    if (cIndex % quotient === remainder) {
      if (c >= amount) {
        total = total + BigInt(amount);
        items.push({ index: i, amount });
      } else {
        // items = [];
        return BigInt(0);
      }
    }
  }

  let i = items.length - 1;
  while (-1 < i) {
    CList[items[i].index] = CList[items[i].index] - items[i].amount;
    i--;
  }
  // items.forEach((item) => {
  //   CList[item.index] = CList[item.index] - item.amount;
  // });
  items = [];
  return total;
};

let total = BigInt(0);
inputs.forEach((input, idx) => {
  const [order, ...values] = input.split(' ').map(Number);
  let amount = BigInt(0);
  switch (order) {
    case OrderType.SINGLE:
      const cIndex = values[0] - 1;
      amount = getSingleOrderAmount(cIndex, BigInt(values[1]));
      break;
    case OrderType.SET:
      amount = getSetOrderAmount(BigInt(values[0]), 2, 1);
      break;
    case OrderType.ALL:
      amount = getSetOrderAmount(BigInt(values[0]), 1, 0);
      break;
    default:
      break;
  }
  if (amount > BigInt(0)) {
    total += amount;
  }
});

console.log(total.toString());
