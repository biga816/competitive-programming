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
const dijkstra = (start: ICoordinates, goal: ICoordinates, matrix: number[][]) => {
  // console.log('matrix:', matrix);

  let current = Object.assign({}, start);
  // const key = current.x + current.y;
  const fixedMap: Map<number, number> = new Map();
  const minRoutesMap: Map<number, number[]> = new Map();
  const calculatedMap: Map<number, number> = new Map();
  // const calculatedMap: Set<number> = new Set();

  const startKey = getKey(start);
  minRoutesMap.set(startKey, [startKey]);
  calculatedMap.set(startKey, matrix[start.y][start.x]);

  while (current) {
    const currentKey = getKey(current);
    // console.log('======= current:', current, 'currentKey:', currentKey, 'calculatedMap:', calculatedMap.get(currentKey));
    fixedMap.set(currentKey, calculatedMap.get(currentKey));
    calculatedMap.delete(currentKey);

    edges.forEach((edge) => {
      const x = current.x + edge.dx;
      const y = current.y + edge.dy;
      if (W > x && x >= 0 && H > y && y >= 0) {
        const targetCost = matrix[y][x] + (fixedMap.get(currentKey) || 0);
        const targetKey = getKey({ x, y });

        if (!fixedMap.has(targetKey) && (!calculatedMap.has(targetKey) || calculatedMap.get(currentKey) > targetCost)) {
          const route = minRoutesMap.get(currentKey) || [];
          minRoutesMap.set(targetKey, [...route, targetKey]);
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

  const resultKey = getKey(goal);
  const routes = minRoutesMap.get(resultKey);
  const cost = fixedMap.get(resultKey);
  return { routes, cost };
};

const start: ICoordinates = { x: 0, y: H - 1 };
const viaPoint: ICoordinates = { x: W - 1, y: H - 1 };
const goal: ICoordinates = { x: W - 1, y: 0 };

// calculate cost from start to via poinnt
const { routes, cost: cost1 } = dijkstra(start, viaPoint, priceMatrix);
// update matrix
routes.forEach((key) => {
  const { x, y } = getCoordinates(key);
  priceMatrix[y][x] = 0;
});

// calculate cost from via poinnt to goal
const { cost: cost2 } = dijkstra(viaPoint, goal, priceMatrix);
console.log(cost1 + cost2);
