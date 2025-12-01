# Workerless
Provides a simple async-based api for multithreading in node or web,
simmilar to serverless functions.

# Usage
```js
import WorkerlessPool from 'workerless'

const workerless=new WorkerlessPool()
const results=[]
for(const bigData of dataSet){
    // keep in mind that your function will run in a fresh new scope,
    // so any data you want it to use must me passed as an argument.
    workerless.run((data)=>{
        // any libraries will need to be imported in the new scope
        const analyze=(await import('analyze')).default
        return analyze(data)
    },bigData).then((result)=>results.push(result))
}
workerless.terminate() // free the resources used by workerless, node scripts may not exit without this
```

Workerless spawns one dedicated web worker (or `worker_thread` in nodejs via `web-workers`)
for every host cpu thread (as indicated by `navigator.hardwareConcurrency` or `node:os.cpus().length`, with a fallback to one worker)
and assigns jobs to them in a round-robin fashion.
This allows you to use multithreading via the familiar async/promises interface,
but beware that debugging is more difficult since stack traces don't show the error line in your file.