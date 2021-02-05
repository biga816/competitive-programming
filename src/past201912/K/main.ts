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

interface DfsRoute {
  [key: number]: { in: number; out?: number };
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

const dfsRoute: DfsRoute = {};
let queueList: Queue[] = [{ type: QueueType.In, memberNo: rootNo }];
let idx = 0;

// search tree from root (dfs)
while (queueList.length > 0) {
  const { type, memberNo: targetNo } = queueList.pop();
  if (type === QueueType.In) {
    // save route (the way there)
    dfsRoute[targetNo] = { in: idx };

    // add index to queue list for the way back
    queueList.push({ type: QueueType.Out, memberNo: targetNo });

    // add members to queue list for the way there
    const memberNoList = memberNoListMap.get(targetNo);
    if (memberNoList && memberNoList.length > 0) {
      const memberQueueList = memberNoList.map((memberNo) => ({ type: QueueType.In, memberNo }));
      queueList.push(...memberQueueList);
    }
  } else {
    // save route (the way back)
    dfsRoute[targetNo].out = idx;
  }
  idx++;
}

pairList.forEach(([memberNo, bossNo]) => {
  if (dfsRoute[bossNo].in <= dfsRoute[memberNo].in && dfsRoute[memberNo].in < dfsRoute[bossNo].out) {
    console.log('Yes');
  } else {
    console.log('No');
  }
});
