/** @format */

import {IncomingMessage, ServerResponse} from 'http'
const ctxPool = new Array<IContext>()
export const getCtx = (request: IncomingMessage, response: ServerResponse): IContext => {
    if (ctxPool.length > 0) {
        return ctxPool.pop()?.reset(request, response) ?? new Context(request, response)
    } else {
        return new Context(request, response)
    }
}
export const setCtx = (ctx: IContext) => {
    ctxPool.push(ctx)
    console.log(ctxPool.length)
}
export interface IContext {
    request: IncomingMessage
    response: ServerResponse
    reset(request: IncomingMessage, response: ServerResponse): void
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
