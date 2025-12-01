addEventListener('message', async function (messageEvent) {
    const response:any={id:messageEvent.data.id}
    try {
        response.value = await new Function(`return ${messageEvent.data.func}`)()(...messageEvent.data.args)
    } catch (reason) {
        if (reason instanceof Error) {
            reason = {
                name: reason.name,
                message: reason.message,
                stack: reason.stack,
                cause: reason.cause
            }
        }
        response.reason=reason
    } finally {
        postMessage(response)
    }
})