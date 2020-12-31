import * as fs from 'fs';
const [N, textCList, Q, ...inputs] = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');

enum OrderType {
  SINGLE = 1,
  SET = 2,
  ALL = 3,
}

const allCList = textCList.split(' ').map(Number);
const oddCList = allCList.filter((_, i) => i % 2 === 0);
const allListLength = allCList.length;
const oddListLength = oddCList.length;

const min = (values: number[]) => values.reduce((a, b) => (a < b ? a : b));
let allMin = min(allCList);
let oddMin = min(oddCList);
let setAllOrderTotal = 0;
let setOddOrderTotal = 0;

const getSingleOrderAmount = (index: number, amount: number) => {
  if (index % 2 === 0 && allCList[index] >= amount + setOddOrderTotal) {
    allCList[index] -= amount;
    oddMin = Math.min(oddMin, allCList[index] - setOddOrderTotal);
    allMin = Math.min(oddMin, allMin);
    return amount;
  } else if (index % 2 !== 0 && allCList[index] >= amount + setAllOrderTotal) {
    allCList[index] -= amount;
    allMin = Math.min(allMin, allCList[index] - setAllOrderTotal);
    return amount;
  } else {
    return 0;
  }
};

const getOddSetOrderAmount = (amount: number) => {
  let total = 0;
  if (oddMin >= amount) {
    setOddOrderTotal += amount;
    oddMin -= amount;
    allMin = Math.min(oddMin, allMin);
    total = oddListLength * amount;
  }
  return total;
};

const getAllSetOrderAmount = (amount: number) => {
  let total = 0;
  if (allMin >= amount) {
    setAllOrderTotal += amount;
    setOddOrderTotal += amount;
    oddMin -= amount;
    allMin -= amount;
    total = allListLength * amount;
  }
  return total;
};

let total = 0;
inputs.forEach((input) => {
  const [order, ...values] = input.split(' ').map(Number);
  let amount = 0;
  switch (order) {
    case OrderType.SINGLE:
      const cIndex = values[0] - 1;
      amount = getSingleOrderAmount(cIndex, values[1]);
      break;
    case OrderType.SET:
      amount = getOddSetOrderAmount(values[0]);
      break;
    case OrderType.ALL:
      amount = getAllSetOrderAmount(values[0]);
      break;
    default:
      break;
  }

  if (amount > 0) {
    total += amount;
  }
});

console.log(total);
