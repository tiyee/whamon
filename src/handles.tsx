/** @format */

import {IContext} from './context'
import {RouteHandle} from './router'
import {URL} from 'url'
export const defaultHanle: RouteHandle = (ctx: IContext): void => {
    ctx.response.writeHead(200, {'Content-Type': 'text/plain'})
    ctx.response.write('Hello World')
    ctx.response.end()
}

export const postHandle: RouteHandle = (ctx: IContext): void => {
    const {host} = ctx.request.headers
    const oUrl = new URL(ctx.request.url ?? '', `http://${host}`)
    console.log(oUrl)
    ctx.response.writeHead(200, {'Content-Type': 'text/plain'})
    ctx.response.write('Hello World')
    ctx.response.end()
}
