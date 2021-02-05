import * as fs from 'fs';
const [N, ...data] = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const bossNoList = data.splice(0, Number(N)).map(Number);
const [Q, ...inputs] = data;
const pairList = inputs.map((pair) => pair.split(' ').map(Number));
const memberNoListMap: Map<number, number[]> = new Map();

enum QueueType {
  In = 'in',
  Out = 'out',
}

interface Queue {
  type: QueueType;
  memberNo: number;
}

// create tree
let rootNo: number;
bossNoList.forEach((bossNo, i) => {
  const memberNo = i + 1;
  if (bossNo === -1) {
    rootNo = memberNo;
  } else {
    const memberNoList = memberNoListMap.get(bossNo) || [];
    memberNoList.push(memberNo);
    memberNoListMap.set(bossNo, memberNoList);
  }
});

let queueList: Queue[] = [
  {
    type: QueueType.In,
    memberNo: rootNo,
  },
];
let idx = 0;
const dfsIndexObj: { [key: number]: { in: number; out?: number } } = {};

// search tree from root (dfs)
while (queueList.length > 0) {
  const { type, memberNo: targetNo } = queueList.pop();
  if (type === QueueType.In) {
    // save route (the way there)
    dfsIndexObj[targetNo] = { in: idx };

    // add index to queue list for the way back
    queueList.push({ type: QueueType.Out, memberNo: targetNo });

    // add members to queue list for the way there
    if (memberNoListMap.get(targetNo) && memberNoListMap.get(targetNo).length > 0) {
      const memberQueueList = memberNoListMap.get(targetNo).map((memberNo) => ({ type: QueueType.In, memberNo }));
      queueList.push(...memberQueueList);
    }
  } else {
    // save route (the way back)
    dfsIndexObj[targetNo].out = idx;
  }
  idx++;
}

pairList.forEach(([memberNo, bossNo]) => {
  if (dfsIndexObj[bossNo].in <= dfsIndexObj[memberNo].in && dfsIndexObj[memberNo].in < dfsIndexObj[bossNo].out) {
    console.log('Yes');
  } else {
    console.log('No');
  }
});
