import { spawn } from 'child_process';

spawn('ts-node', [`src/day${process.argv[2]}.ts`], { stdio: "inherit" });
