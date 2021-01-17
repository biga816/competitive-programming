import * as fs from 'fs';
const [data, ...inputs] = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [H, W] = data.split(' ').map(Number);
const priceMatrix = inputs.map((input) => input.split(' ').map(Number));

interface ICoordinates {
  x: number;
  y: number;
}

const getKey = ({ x, y }: ICoordinates) => x + y * W;
const getCoordinates = (key: number): ICoordinates => {
  const x = key % W;
  const y = Math.floor(key / W);
  return { x, y };
};
const edges = [
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 },
];

// Dijkstra's algorithm
const dijkstra = (start: ICoordinates, matrix: number[][]) => {
  let current = Object.assign({}, start);
  const fixedMap: Map<number, number> = new Map();
  const calculatedMap: Map<number, number> = new Map();
  const startKey = getKey(start);
  calculatedMap.set(startKey, matrix[start.y][start.x]);

  while (current) {
    const currentKey = getKey(current);
    fixedMap.set(currentKey, calculatedMap.get(currentKey));
    calculatedMap.delete(currentKey);

    edges.forEach((edge) => {
      const x = current.x + edge.dx;
      const y = current.y + edge.dy;
      if (W > x && x >= 0 && H > y && y >= 0) {
        const targetCost = matrix[y][x] + (fixedMap.get(currentKey) || 0);
        const targetKey = getKey({ x, y });

        if (!fixedMap.has(targetKey) && (!calculatedMap.has(targetKey) || calculatedMap.get(currentKey) > targetCost)) {
          calculatedMap.set(targetKey, targetCost);
        }
      }
    });

    current = null;

    let minKey: number;
    calculatedMap.forEach((value, key) => {
      if (minKey === undefined || calculatedMap.get(minKey) > value) {
        minKey = key;
        current = getCoordinates(key);
      }
    });
  }

  return fixedMap;
};

const start: ICoordinates = { x: 0, y: H - 1 };
const viaPoint: ICoordinates = { x: W - 1, y: H - 1 };
const goal: ICoordinates = { x: W - 1, y: 0 };

// calculate cost from start to via poinnt
const startCostMap = dijkstra(start, priceMatrix);
const viaPointCostMap = dijkstra(viaPoint, priceMatrix);
const goalCostMap = dijkstra(goal, priceMatrix);

let minCost = NaN;
priceMatrix.forEach((priceRow, y) => {
  priceRow.forEach((price, x) => {
    const resultKey = getKey({ x, y });
    const duplicatedCost = price * 2;
    const cost = startCostMap.get(resultKey) + viaPointCostMap.get(resultKey) + goalCostMap.get(resultKey) - duplicatedCost;
    minCost = isNaN(minCost) ? cost : Math.min(minCost, cost);
  });
});

console.log(minCost);
