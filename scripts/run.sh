#!/bin/sh

oj test -c "sh -c 'npx ts-node $1main.ts'" -d "$1/test"