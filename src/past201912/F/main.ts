import * as fs from 'fs';
const S = fs.readFileSync('/dev/stdin', 'utf8').trim();

let startPoint = NaN;
const list: string[] = [];
for (let i = 0; i < S.length; i++) {
  const code = S.charCodeAt(i);
  if (65 /* A */ <= code && code <= 90 /* Z */) {
    if (isNaN(startPoint)) {
      startPoint = i;
    } else {
      list.push(S.slice(startPoint, i + 1));
      startPoint = NaN;
    }
  }
}

const res = list.sort((a, b) => (a.toUpperCase() < b.toUpperCase() ? -1 : 1)).join('');
console.log(res);
