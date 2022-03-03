/** @format */

import {IContext} from './context'
import {RouteHandle} from './router'
import {URL} from 'url'
import {resolve} from 'path/posix'
import {rejects} from 'assert'

export const postHandle: RouteHandle = async (ctx: IContext): Promise<IContext> => {
    const {host} = ctx.request.headers
    const oUrl = new URL(ctx.request.url ?? '', `http://${host}`)
    console.log(oUrl)
    ctx.response.writeHead(200, {'Content-Type': 'text/plain'})
    ctx.response.write('Hello World')
    ctx.response.end()
    return ctx
}
export const defaultHanle: RouteHandle = async (ctx: IContext): Promise<IContext> => {
    ctx.response.writeHead(200, {'Content-Type': 'text/plain'})
    ctx.response.write('Hello World')
    ctx.response.end()
    return ctx
}
