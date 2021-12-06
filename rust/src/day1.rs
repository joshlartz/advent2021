// use std::iter;
use std::num::ParseIntError;

use aoc_runner_derive::{aoc, aoc_generator};
// use itertools::izip;

#[aoc_generator(day1)]
pub fn generator(input: &str) -> Result<Vec<u32>, ParseIntError> {
    input.lines().map(str::parse).collect()
}

#[aoc(day1, part1)]
pub fn part1(input: &[u32]) -> i32 {
    return input.iter().enumerate().fold(0, |acc, (index, depth)| {
        acc + (depth > &input[if index == 0 { 0 } else { index - 1 }]) as i32
    });
}

// #[aoc(day1, part2)]
// pub fn part2(input: Vec<u32>) {}

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

    // #[test]
    // fn sample2() {
    //     assert_eq!(part2(&read_input(SAMPLE).unwrap()), 5);
    // }
}
