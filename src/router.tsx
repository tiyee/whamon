/** @format */

import {IContext} from './context'
import {defaultHanle, postHandle} from './handles'
export type Route = (url: string) => undefined | RoutLink
export type RouteHandle = (ctx: IContext) => Promise<IContext>
export type RoutLink = Array<RouteHandle>
const rs: Map<string, RoutLink> = new Map([
    ['/', [defaultHanle]],
    ['/post', [postHandle]],
])
export const routers: Route = (pathname: string): undefined | RoutLink => {
    return rs.get(pathname)
}
