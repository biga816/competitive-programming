import * as fs from 'fs';
const data = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, M] = data.shift().split(' ').map(Number);
const towerData = data.map((v) => v.split(' ').map(Number));

interface Tower {
  key: number;
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

class Util {
  static convertTowerData(data: number[][]): Tower[] {
    return data.reduce((obj, cur, idx) => {
      obj.push({ key: idx, x: cur[0], y: cur[1], color: cur[2] });
      return obj;
    }, [] as Tower[]);
  }

  static calcCost(from: Tower, to: Tower): number {
    const dx = from.x - to.x;
    const dy = from.y - to.y;
    const mag = from.color === to.color ? 1 : 10;
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * mag;
  }
}

const uf = new UnionFind<number>();
const towers = Util.convertTowerData(towerData);

const edges = towers
  .reduce((allList, from) => {
    const edges = towers.reduce((list, to) => {
      if (from.key !== to.key) {
        list.push({
          fromKey: from.key,
          toKey: to.key,
          cost: Util.calcCost(from, to),
        });
      }
      return list;
    }, [] as Edge[]);

    allList.push(...edges);
    return allList;
  }, [] as Edge[])
  .sort((a, b) => a.cost - b.cost);

let totalCost = 0;
const lgUsedTowerSet = new Set<number>();

for (const edge of edges) {
  const fromKey = edge.fromKey;
  const toKey = edge.toKey;

  if (!uf.same(fromKey, toKey)) {
    totalCost += edge.cost;
    uf.union(fromKey, toKey);

    if (fromKey < N) {
      lgUsedTowerSet.add(fromKey);
    }
    if (toKey < N) {
      lgUsedTowerSet.add(toKey);
    }

    if (lgUsedTowerSet.size >= N) {
      break;
    }
  }
}

console.log(totalCost.toFixed(12));
