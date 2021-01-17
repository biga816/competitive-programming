import * as fs from 'fs';
const [N, ...data] = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const bossList = data.splice(0, Number(N)).map(Number);
const [Q, ...inputs] = data;
const pairList = inputs.map((pair) => pair.split(' ').map(Number));

const myBossListMap: Map<number, number[]> = new Map();
bossList.forEach((boss, i) => {
  const myBosses: number[] = [];
  let currentBoss = boss;
  while (currentBoss !== -1) {
    myBosses.push(currentBoss);
    currentBoss = bossList.find((_, j) => {
      const employee = j + 1;
      return employee === currentBoss;
    });
  }

  const employee = i + 1;
  myBossListMap.set(employee, myBosses);
  return myBosses;
});

pairList.forEach(([employee, boss]) => {
  const res = myBossListMap.get(employee).includes(boss) ? 'Yes' : 'No';
  console.log(res);
});
