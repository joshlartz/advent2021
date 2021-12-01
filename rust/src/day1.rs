use std::iter;
use std::num::ParseIntError;

use itertools::izip;

#[aoc_generator(day1)]
pub fn generator(input: &str) -> Result<Vec<u32>, ParseIntError> {
    input.lines().map(str::parse).collect()
}
