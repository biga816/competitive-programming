import * as fs from 'fs';
const [s] = fs.readFileSync('/dev/stdin', 'utf8').split('\n');
console.log(s.match(/^\d*$/) ? Number(s) * 2 : 'error');
