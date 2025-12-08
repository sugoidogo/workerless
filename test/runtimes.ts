import { execSync } from "node:child_process";

console.log('testing with node')
execSync('node test/test.ts', { 'stdio': 'inherit' })
console.log('\ntesting with deno')
execSync('deno run --allow-sys=cpus --allow-read=dist/worker.js test/test.ts', { 'stdio': 'inherit' })
console.log('\ntesting with bun')
execSync('bun run test/test.ts', { 'stdio': 'inherit' })