if (!globalThis.Worker) {
    globalThis.Worker = await import('web-worker').then(module => module.default)
}
// @ts-expect-error
const defaultThreads = await import('node:os').then(module => module.cpus().length).catch(() => {
    if (navigator && navigator.hardwareConcurrency) {
        return navigator.hardwareConcurrency
    } else {
        return 1
    }
})

export default class WorkerlessPool {
    #workers: Worker[] = []
    #callbacks: { [key: number]: { resolve(value: any): void, reject(reason: any): void } } = {}
    #id = 0
    #onWorkerMessage(messageEvent: MessageEvent) {
        const { resolve, reject } = this.#callbacks[messageEvent.data.id]
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
        delete this.#callbacks[messageEvent.data.id]
    }
    /** allocates a number of workers for this pool, defaulting to the cpu thread count */
    constructor(threads = defaultThreads) {
        for (let i = 0; i < threads; i++) {
            const worker = new Worker(new URL('worker.js', import.meta.url), { 'type': 'module' })
            worker.onmessage = (messageEvent) => this.#onWorkerMessage(messageEvent)
            this.#workers[i] = worker
        }
    }
    /** run a function in a worker thread */
    async run<T>(func: (...args: any[]) => T, ...args: any[]): Promise<T> {
        return new Promise((resolve, reject) => {
            this.#callbacks[this.#id] = { resolve, reject }
            this.#workers[this.#id % this.#workers.length].postMessage({ id: this.#id, func: func.toString(), args })
            this.#id++
        })
    }
    /** terminate this worker pool, allowing a node program to exit gracefully */
    terminate() {
        for (const worker of this.#workers) {
            worker.terminate()
        }
    }
}