import * as fs from 'fs';
const records = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, Q] = records.shift().split(' ').map(Number);

enum FollowType {
  Follow = 1,
  AllFollow = 2,
  FollowFollow = 3,
}

const data: string[][] = new Array(N).fill('N').map(() => new Array(N).fill('N'));
records.forEach((record) => {
  const [action, userA, userB] = record.split(' ').map(Number);
  const userIdxA = userA - 1;
  const userIdxB = userB - 1;

  if (action === FollowType.Follow) {
    data[userIdxA][userIdxB] = 'Y';
  } else if (action === FollowType.AllFollow) {
    data.forEach((v, idx) => {
      if (v[userIdxA] === 'Y') data[userIdxA][idx] = 'Y';
    });
  } else if (action === FollowType.FollowFollow) {
    const followerIndexList = data[userIdxA].map((v, idx) => (v === 'Y' ? idx : null)).filter((v) => v !== null);
    followerIndexList.forEach((followerIdx) => {
      data[followerIdx].forEach((v, targetIdx) => {
        if (v === 'Y' && userIdxA !== targetIdx) {
          data[userIdxA][targetIdx] = 'Y';
        }
      });
    });
  }
});

data.forEach((v) => {
  console.log(v.join(''));
});
