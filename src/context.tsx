/** @format */

import {IncomingMessage, ServerResponse} from 'http'
import {URL, URLSearchParams} from 'url'
import {TimeoutCtr} from './helper'
import ejs from 'ejs'
// refferrer: github.com/node-formidable/formidable
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
    Success(msg: string, data: any): Promise<IContext>
    Error(errorCode: number, msg: string, data: any): Promise<IContext>
    Render(fileName: string, obj: object): Promise<IContext>
}
class Context implements IContext {
    request: IncomingMessage
    response: ServerResponse
    private urlObj?: URL
    private traceId: string = ''
    private body: Buffer | null = null
    private formData: URLSearchParams | null = null

    private transferDone: boolean = false
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
    async Json(data: Object | Map<string, any>) {
        this.response.writeHead(200, {'Content-Type': 'application/json'})
        this.response.write(JSON.stringify(data))
        this.response.end()
        return this
    }
    async Success(msg: string, data: any) {
        const body = new Map<string, any>([
            ['error', 0],
            ['message', msg],
            ['data', data],
        ])
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
    async Render(fileName: string, obj: object): Promise<IContext> {
        const html = ejs.render('<%= people.join(", "); %>', obj)
        this.response.writeHead(200, {'Content-Type': 'text/plain'})
        this.response.write(html)
        this.response.end()
        return this
    }
}
