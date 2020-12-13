import * as fs from 'fs';
const inputs = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const N = Number(inputs.shift());

let scoreLists = inputs.map((input) => {
  const scoreList = input.split(' ').map(Number);
  scoreList.unshift(0);
  return scoreList;
});

scoreLists.push([0]);

scoreLists = scoreLists.map((scoreList, idx) => {
  if (idx !== 0) {
    for (let i = 0; i < idx; i++) {
      scoreList.unshift(scoreLists[idx - 1 - i][idx]);
    }
  }
  return scoreList;
});

const product = (iterables: any[], repeat: number): any[] => {
  const copies = [];
  for (let i = 0; i < repeat; i++) {
    copies.push(iterables.slice());
  }
  let argv = copies;
  return argv.reduce(
    (accumulator, value) => {
      const tmp = [];
      accumulator.forEach((a0) => {
        value.forEach((a1) => {
          tmp.push(a0.concat(a1));
        });
      });
      return tmp;
    },
    [[]]
  );
};

let result = 0;
product([0, 1, 2], N).forEach((conditionList, idx) => {
  const groups = [[], [], []];
  conditionList.forEach((value, i) => {
    groups[value].push(i);
  });

  let totalScore = 0;
  groups.forEach((group) => {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        totalScore += scoreLists[group[i]][group[j]];
      }
    }
  });
  if (idx === 0) {
    result = totalScore;
  } else {
    result = Math.max(result, totalScore);
  }
});

console.log(result);
