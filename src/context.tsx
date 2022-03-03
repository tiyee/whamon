/** @format */

import {IncomingMessage, ServerResponse} from 'http'
import {buffer} from 'stream/consumers'
const ctxPool = new Array<Context>()
export const getCtx = (request: IncomingMessage, response: ServerResponse): Context => {
    if (ctxPool.length > 0) {
        return ctxPool.pop()?.reset(request, response) ?? new Context(request, response)
    } else {
        return new Context(request, response)
    }
}
export const setCtx = (ctx: Context) => {
    ctxPool.push(ctx)
}
export interface IContext {
    request: IncomingMessage
    response: ServerResponse
}
class Context implements IContext {
    request: IncomingMessage
    response: ServerResponse
    private traceId: string = ''
    constructor(request: IncomingMessage, response: ServerResponse) {
        this.request = request
        this.response = response
    }
    public reset(request: IncomingMessage, response: ServerResponse) {
        this.request = request
        this.response = response
    }
    public setTarceId(tid: string) {
        if (tid === '') {
            this.traceId = 'xxx'
        }
    }
}
