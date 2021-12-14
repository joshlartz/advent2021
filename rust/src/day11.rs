// use std::num::ParseIntError;

use aoc_runner_derive::{aoc, aoc_generator};

type Grid = Vec<Vec<usize>>;

#[aoc_generator(day11)]
pub fn generator(input: &str) -> Grid {
    input
        .lines()
        .map(|line| {
            line.chars()
                .map(|char| char.to_digit(10).unwrap() as usize)
                .collect()
        }).collect()
}

fn create_grid(size: usize) -> Grid {
    vec![vec![0; size]; size]
}

fn increment_octopi(grid: &mut Grid) {
    for y in 0..grid.len() {
        for x in 0..grid[0].len() {
            grid[y][x] += 1;
        }
    }
}

fn increment_neighbors(grid: &mut Grid, y: usize, x: usize) {
    let y_end = grid.len() - 1;
    let x_end = grid[0].len() - 1;
    if y > 0 && x > 0 { grid[y - 1][x - 1] += 1; } // top left
    if y < y_end && x < x_end { grid[y + 1][x + 1] += 1; } // bottom right
    if y > 0 {
        grid[y - 1][x] += 1; // top
        if x < x_end { grid[y - 1][x + 1] += 1; } // top right
    }
    if x > 0 {
        grid[y][x - 1] += 1; // left
        if y < y_end { grid[y + 1][x - 1] += 1; } // bottom left
    }
    if x < x_end { grid[y][x + 1] += 1; } // right
    if y < y_end { grid[y + 1][x] += 1; } // bottom
}

fn check_flashes(grid: &mut Grid, flashes: &mut Grid, flash_count: &mut usize) {
    for y in 0..grid.len() {
        for x in 0..grid[0].len() {
            if grid[y][x] > 9 && flashes[y][x] == 0 {
                flashes[y][x] += 1;
                *flash_count += 1;
                increment_neighbors(grid, y, x);
                check_flashes(grid, flashes, flash_count);
            }
        }
    }
}

fn reset_flashes(grid: &mut Grid, flashes: &Grid) {
    for y in 0..grid.len() {
        for x in 0..grid[0].len() {
            if flashes[y][x] == 1 { grid[y][x] = 0; }
        }
    }
  }

#[aoc(day11, part1)]
pub fn part1(input: &Grid) -> usize {
    let mut grid = input.to_owned();
    let mut flash_count = 0;
    
    for _s in 0..100 {
        let mut flashes = create_grid(10);

        increment_octopi(&mut grid);

        check_flashes(&mut grid, &mut flashes, &mut flash_count);
        reset_flashes(&mut grid, &flashes);
    }
    flash_count
}

#[aoc(day11, part2)]
pub fn part2(input: &Grid) -> usize {
    let mut grid = input.to_owned();
    let mut step = 0;

    loop {
        step += 1;
        let mut flashes = create_grid(10);
        let mut flash_count = 0;

        increment_octopi(&mut grid);

        check_flashes(&mut grid, &mut flashes, &mut flash_count);
        if flash_count == (grid.len() * grid[0].len()) { return step; }
        reset_flashes(&mut grid, &flashes);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const SAMPLE: &str = "5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526
";

    #[test]
    fn sample1() {
        assert_eq!(part1(&generator(SAMPLE)), 1656);
    }

    #[test]
    fn sample2() {
        assert_eq!(part2(&generator(SAMPLE)), 195);
    }
}
