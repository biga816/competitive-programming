#!/bin/sh

oj download $1
mkdir -p $2
mv ./test/ $2

echo "import * as fs from 'fs';\nconst S = fs.readFileSync('/dev/stdin', 'utf8').trim();" > $2/main.ts