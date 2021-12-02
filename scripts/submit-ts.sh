day=$1
level=$2

cd ~/git/joshlartz/advent2021/typescript

pnpm -s day $day $level | xargs aoc -y 2021 -d $day s $level
