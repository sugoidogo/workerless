import WorkerlessPool from "../src/workerless.ts";

const workerless = new WorkerlessPool()
console.log(await workerless.run(() => "Hello Workerless!"))
console.log(await workerless.run(async () => "Hello Async Workerless!"))
await workerless.run(async function () {
    throw new Error('Hello Workerless Error!')
}).catch(error => console.log(error.message))
console.log(await workerless.run((text) => {
    return text
}, "Hello Workerless Args!"))
workerless.terminate()
console.log('test passed')