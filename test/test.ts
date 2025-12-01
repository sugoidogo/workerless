import workerless from "../src/workerless.ts";

console.log(await workerless.run(() => "Hello Workerless!"))
console.log(await workerless.run(async () => "Hello Async Workerless!"))
await workerless.run(async function () {
    throw new Error('Hello Workerless Error!')
}).catch(error => console.log(error.message))
workerless.terminate()
console.log('test passed')