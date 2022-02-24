/** @format */

import {IContext} from './context'
import {defaultHanle, postHandle} from './handles'
export type Route = (url: string) => undefined | RouteHandle
export type RouteHandle = (ctx: IContext) => void
const rs: Map<string, RouteHandle> = new Map([
    ['/', defaultHanle],
    ['/post', postHandle],
])
export const routers: Route = (pathname: string): undefined | RouteHandle => {
    return rs.get(pathname)
}
