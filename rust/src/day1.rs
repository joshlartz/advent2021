use std::num::ParseIntError;

use aoc_runner_derive::{aoc, aoc_generator};

#[aoc_generator(day1)]
pub fn generator(input: &str) -> Result<Vec<u32>, ParseIntError> {
    input.lines().map(str::parse).collect()
}

pub fn reduce(input: &Vec<u32>) -> u32 {
    return input.iter().enumerate().fold(0, |acc, (index, depth)| {
        acc + (depth > &input[if index == 0 { 0 } else { index - 1 }]) as u32
    });
}

#[aoc(day1, part1)]
pub fn part1(input: &Vec<u32>) -> u32 {
    reduce(input)
}

#[aoc(day1, part2)]
pub fn part2(input: &Vec<u32>) -> u32 {
    let three_sums = input
        .iter()
        .enumerate()
        .map(|(index, depth)| {
            if index + 2 < input.len() - 1 {
                depth + input[index + 1] + input[index + 2]
            } else {
                0
            }
        })
        .filter(|x| x > &0)
        .collect();

    reduce(&three_sums)
}

#[cfg(test)]
mod tests {
    use super::*;

    const SAMPLE: &str = "199
200
208
210
200
207
240
269
260
263";

    #[test]
    fn sample1() {
        assert_eq!(part1(&generator(SAMPLE).unwrap()), 7);
    }

    #[test]
    fn sample2() {
        assert_eq!(part2(&generator(SAMPLE).unwrap()), 5);
    }
}
