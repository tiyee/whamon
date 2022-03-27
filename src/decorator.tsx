/** @format */
import {IContext} from './context'
import {RouteHandle} from './router'
import 'http'
export class router {
    public static rs: Map<string, Array<RouteHandle>> = new Map([])

    static GET(path: string, before?: RouteHandle[], after?: RouteHandle[]) {
        return router.route('GET', path, before, after)
    }
    static POST(path: string, before?: RouteHandle[], after?: RouteHandle[]) {
        return router.route('POST', path, before, after)
    }
    static route(method: string, path: string, before?: RouteHandle[], after?: RouteHandle[]) {
        return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
            const link = Array<RouteHandle>()

            if (before) {
                link.push(...before)
            }

            link.push(descriptor.value)
            if (after) {
                link.push(...after)
            }
            router.rs.set(path, link)

            return descriptor
        }
    }
    static Prefix(path: string) {
        return function (target: any) {
            target.prefix = path
        }
    }
}
