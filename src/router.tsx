/** @format */

import {IContext} from './context'
import {defaultHanle, postHandle, demoMid, tagHandle} from './handles'
export type Route = (url: string) => undefined | RoutLink
export type RouteHandle = (ctx: IContext) => Promise<IContext>
export type RoutLink = Array<RouteHandle>
const rs: Map<string, RoutLink> = new Map([
    ['/', [demoMid, defaultHanle, demoMid]],
    ['/post', [postHandle]],
    ['/tag', [tagHandle]],
])
export const routers: Route = (pathname: string): undefined | RoutLink => {
    return rs.get(pathname)
}
