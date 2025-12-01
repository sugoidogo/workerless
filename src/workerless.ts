if (!globalThis.Worker) {
    globalThis.Worker = await import('web-worker').then(module => module.default)
}

let threads = await import('node:os').then(module=>module.cpus().length).catch(()=>1)
if (navigator && navigator.hardwareConcurrency) {
    threads=navigator.hardwareConcurrency
}

function onWorkerMessage(messageEvent: MessageEvent) {
    const { resolve, reject } = callbacks[messageEvent.data.id]
    if (messageEvent.data.reason !== undefined) {
        const reason = messageEvent.data.reason
        if (reason.name && reason.message) {
            const error = new globalThis[reason.name]
            Object.assign(error, reason)
            reject(error)
        } else {
            reject(reason)
        }
    } else {
        resolve(messageEvent.data.value)
    }
    delete callbacks[messageEvent.data.id]
}

const workers: Worker[] = []
for (let i = 0; i < threads; i++){
    const worker = new Worker(new URL('worker.js', import.meta.url),{'type':'module'})
    worker.onmessage = onWorkerMessage
    workers[i]=worker
}

const callbacks: { [key: number]: { resolve(value: any):void, reject(reason: any):void } } = {}
let id=0

export default {
    run:async function<T>(func: () => T): Promise<T> {
        return new Promise(function (resolve, reject) {
            callbacks[id] = { resolve, reject }
            workers[id % threads].postMessage({ id, func: func.toString() })
            id++
        })
    },
    terminate:function() {
    for (const worker of workers) {
        worker.terminate()
        }
    }
}