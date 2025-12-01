# Workerless
Provides a simple async-based api for multithreading in node or web,
simmilar to serverless functions.

# Usage
```js
import workerless from 'workerless'

const result=await workerless.run(()=>cpuIntensiveoperation())

workerless.terminate() // this is required for node programs to exit gracefully
```

Workerless spawns one dedicated web worker (or `worker_thread` in nodejs via `web-workers`)
for every host cpu thread (as indicated by `navigator.hardwareConcurrency` or `node:os.cpus().length`, with a fallback to one worker)
and assigns jobs to them in a round-robin fashion.
This allows you to use multithreading via the familiar async/promises interface,
but beware that debugging is more difficult since stack traces don't show the error line in your file.