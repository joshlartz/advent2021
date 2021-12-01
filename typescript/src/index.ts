import { spawn } from 'child_process';

spawn('ts-node', [`src/day${process.argv[2]}.ts`, process.argv[3]], { stdio: "inherit" });
