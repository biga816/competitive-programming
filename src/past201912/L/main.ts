import * as fs from 'fs';
const data = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, M] = data.shift().split(' ').map(Number);
const lgTowerData = data.splice(0, Number(N)).map((v) => v.split(' ').map(Number));
const smTowerData = data.map((v) => v.split(' ').map(Number));

enum TowerType {
  'lg',
  'sm',
}

interface Tower {
  key: number;
  type: TowerType;
  x: number;
  y: number;
  color: number;
}

interface Edge {
  fromKey: number;
  toKey: number;
  cost: number;
}

class UnionFind<T> {
  parentMap: Map<T, T> = new Map();

  find(value: T): T {
    if (!this.parentMap.has(value)) {
      return value;
    } else {
      this.parentMap.set(value, this.find(this.parentMap.get(value)));
      return this.parentMap.get(value);
    }
  }

  same(value1: T, value2: T): boolean {
    return this.find(value1) == this.find(value2);
  }

  union(parent: T, child: T): void {
    const x = this.find(parent);
    const y = this.find(child);
    if (x !== y) {
      this.parentMap.set(y, x);
    }
  }
}

const uf = new UnionFind<number>();
const getTowerDataList = (type: TowerType, data: number[][], offset: number = 0) =>
  data.reduce((obj, cur, idx) => {
    obj.push({ key: idx + offset, type: type, x: cur[0], y: cur[1], color: cur[2] });
    return obj;
  }, [] as Tower[]);

const calcCost = (from: Tower, to: Tower) => {
  const dx = from.x - to.x;
  const dy = from.y - to.y;
  const mag = from.color === to.color ? 1 : 10;
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * mag;
};

const allTowerData = [
  ...getTowerDataList(TowerType.lg, lgTowerData),
  ...getTowerDataList(TowerType.sm, smTowerData, lgTowerData.length),
];

const allEdgeList = allTowerData
  .reduce((allList, from) => {
    const edges = allTowerData.reduce((fromList, to) => {
      if (from.key !== to.key) {
        fromList.push({
          fromKey: from.key,
          toKey: to.key,
          cost: calcCost(from, to),
        });
      }
      return fromList;
    }, [] as Edge[]);

    allList.push(...edges);
    return allList;
  }, [] as Edge[])
  .sort((a, b) => a.cost - b.cost);

let totalCost = 0;
const lgUsedTowerSet = new Set<number>();

for (const edge of allEdgeList) {
  const fromKey = edge.fromKey;
  const toKey = edge.toKey;

  if (!uf.same(fromKey, toKey)) {
    totalCost += edge.cost;
    uf.union(fromKey, toKey);

    if (fromKey < lgTowerData.length) {
      lgUsedTowerSet.add(fromKey);
    }
    if (toKey < lgTowerData.length) {
      lgUsedTowerSet.add(toKey);
    }

    if (lgUsedTowerSet.size >= lgTowerData.length) {
      break;
    }
  }
}

console.log(totalCost.toFixed(12));
