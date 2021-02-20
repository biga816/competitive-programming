import * as fs from 'fs';
const data = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, M] = data.shift().split(' ').map(Number);
const lgTowerData = data.splice(0, Number(N)).map((v) => v.split(' ').map(Number));
const smTowerData = data.map((v) => v.split(' ').map(Number));

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
  rankMap: Map<T, number> = new Map();

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

  union(value1: T, value2: T): void {
    const x = this.find(value1);
    const y = this.find(value2);

    if (x === y) return;

    const rank1 = this.rankMap.get(x) || 0;
    const rank2 = this.rankMap.get(y) || 0;
    const [parent, child] = rank1 > rank2 ? [x, y] : [y, x];

    this.parentMap.set(child, parent);
    this.rankMap.set(parent, this.rankMap.get(parent) + 1);
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
    const rate = from.color === to.color ? 1 : 10;
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * rate;
  }
}

// Get all patterns of small tower conbinations
const bits = parseInt(Array(smTowerData.length).fill(1).join(''), 2);
const smTowerPatterns = Array.from(new Array(bits + 1)).map((_, i) => i.toString(2));

let minTotalCost = 0;

// Check all pattern cost
smTowerPatterns.forEach((pattern) => {
  // Get target small towers
  const smTowerIdxList = pattern
    .split('')
    .map((v, i) => (v === '1' ? i : NaN))
    .filter((v) => !isNaN(v));
  const targetSmTowerData = smTowerIdxList.map((smTowerIdx) => smTowerData[smTowerIdx]);
  const allTowerData = lgTowerData.concat(targetSmTowerData);
  const towers = Util.convertTowerData(allTowerData);

  // Use Kruskal's algorithm
  const edges: Edge[] = [];
  towers.map((from, i) => {
    towers.map((to, j) => {
      if (i < j) {
        edges.push({
          fromKey: from.key,
          toKey: to.key,
          cost: Util.calcCost(from, to),
        });
      }
    });
  });
  edges.sort((a, b) => a.cost - b.cost);

  const uf = new UnionFind<number>();
  let totalCost = 0;

  for (const edge of edges) {
    const fromKey = edge.fromKey;
    const toKey = edge.toKey;

    if (!uf.same(fromKey, toKey)) {
      totalCost += edge.cost;
      uf.union(fromKey, toKey);
    }
  }

  minTotalCost = minTotalCost ? Math.min(totalCost, minTotalCost) : totalCost;
});

console.log(minTotalCost.toFixed(12));
