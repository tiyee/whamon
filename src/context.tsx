/** @format */

import {IncomingMessage, ServerResponse} from 'http'
import {URL, URLSearchParams} from 'url'
import {OutgoingHttpHeader, OutgoingHttpHeaders} from 'http'
import {TimeoutCtr} from './helper'
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
}
export interface IContext {
    request: IncomingMessage
    response: ServerResponse
    reset(request: IncomingMessage, response: ServerResponse): void
    getQuery(key: string, de: string): string
    getFormPost(key: string, de?: string): Promise<string | null>
    getFormPostAll(): Promise<IterableIterator<[string, string]>>
    getBody(): Promise<Buffer>
    Status(httpStatus: number): Promise<IContext>

    Success(msg: string, data: any): Promise<IContext>
    Error(errorCode: number, msg: string, data: any): Promise<IContext>
    Render(statusCode: number, s: string, headers?: OutgoingHttpHeaders | OutgoingHttpHeader[]): Promise<IContext>
    Html(s: string): Promise<IContext>
    End(s?: string): Promise<IContext>
}
class Context implements IContext {
    request: IncomingMessage
    response: ServerResponse
    private urlObj?: URL
    private traceId: string = ''
    private isEnd = false
    private body: Buffer | null = null
    private formData: URLSearchParams | null = null

    private transferDone: boolean = false
    constructor(request: IncomingMessage, response: ServerResponse) {
        this.request = request
        this.response = response
    }
    public reset(request: IncomingMessage, response: ServerResponse) {
         this.isEnd = false
        this.request = request
        this.response = response
    }
    public setTarceId(tid: string) {
        if (tid === '') {
            this.traceId = 'xxxlk'
        }
    }
    private parseUrl() {
        const {host} = this.request.headers
        this.urlObj = new URL(this.request.url ?? '', `http://${host}`)
    }
    private getURL(): URL {
        if (this.urlObj === undefined) {
            const {host} = this.request.headers
            this.urlObj = new URL(this.request.url ?? '', `http://${host}`)
        }
        return this.urlObj
    }
    public getQuery(key: string, de: string): string {
        if (this.urlObj === null) {
            this.parseUrl()
        }
        if (this.urlObj !== undefined) {
            return this.urlObj.searchParams.get(key) ?? de
        }
        const value = this.getURL().searchParams.get(key)
        return value === null ? de : value
    }
    async getBody(timeout: number = 3000, length: number = 1024): Promise<Buffer> {
        if (this.body === null) {
            const fn: Promise<Buffer> = new Promise(resolve => {
                this.request.setTimeout(timeout)
                const arr = Array<Buffer>()
                this.request.on('data', (chunk: Buffer) => {
                    arr.push(chunk)
                })

                this.request.on('end', () => {
                    this.body = Buffer.concat(arr)
                    return resolve(this.body)
                })
            })

            return TimeoutCtr(fn, Buffer.allocUnsafe(0), 3000)
        } else {
            return this.body
        }
    }

    async getFormPost(key: string, defaultValue: string = ''): Promise<string> {
        if (this.formData === null) {
            const body = await this.getBody()
            this.formData = new URLSearchParams(body.toString())
            console.log('build body')
        }
        console.log('return body')
        return this.formData.get(key) ?? defaultValue
    }
    async getFormPostAll(): Promise<IterableIterator<[string, string]>> {
        if (this.formData === null) {
            const body = await this.getBody()
            this.formData = new URLSearchParams(body.toString())
        }

        return this.formData.entries()
    }
    async Status(httpStatus: number): Promise<IContext> {
        this.response.writeHead(httpStatus)
        return this
    }

    async Json(data: object) {
        this.response.writeHead(200, {'Content-Type': 'application/json'})
        this.response.write(JSON.stringify(data))
        this.response.end()
        return this
    }
    async Success(msg: string, data: any) {
        const body = {error: 0, message: msg, data}
        return this.Json(body)
    }
    async Error(errorCode: number, msg: string, data: any) {
        const body = new Map<string, any>([
            ['error', errorCode],
            ['message', msg],
            ['data', data],
        ])
        return this.Json(body)
    }
    async Render(
        statusCode: number,
        s: string,
        headers?: OutgoingHttpHeaders | OutgoingHttpHeader[],
    ): Promise<IContext> {
        this.runIfNotEnd(() => {
            this.response.writeHead(statusCode, headers)
            this.response.write(s)
            this.response.end()
        })

        return this
    }
    async Html(s: string): Promise<IContext> {
        this.runIfNotEnd(() => {
            this.response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            this.response.write(s)
            this.response.end()
        })

        return this
    }
    async End(s?: string): Promise<IContext> {
        this.runIfNotEnd(() => {
            this.response.end(s)
            this.isEnd = true
        })

        return this
    }
    async runIfNotEnd(fn: CallableFunction): Promise<IContext> {
        if (!this.isEnd) {
            fn()
            return this
        }
        return this
    }
    IsEnd = (): boolean => {
        return this.isEnd
    }
}
