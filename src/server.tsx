/** @format */

import http from 'http'
import {routers} from 'router'
import {getCtx, IContext, setCtx} from 'context'
import {resolve} from 'path/posix'

export const start = (hostname: string, port: number) => {
    const onRequest = (request: http.IncomingMessage, response: http.ServerResponse) => {
        let uri = request.url ?? ''
        const pos = uri.indexOf('?')
        if (pos !== -1) {
            uri = uri.slice(0, pos)
        }
        console.log('Request for ' + uri + ' received.')
        const lk = routers(uri)
        if (lk !== undefined) {
            const ctx = getCtx(request, response)
            let head = (async () => {
                return ctx
            })()
            lk.forEach(fn => {
                head = head.then(fn)
            })
            head.catch(e => {
                console.log(e)
                return e
            }).finally(() => {
                setCtx(ctx)
            })
        } else {
            response.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})
            response.write('<html><body><center><h1>404 Not Found</h1></center></body></html>')
            response.end()
        }
    }

    http.createServer(onRequest).listen(port, hostname, 511, () => {
        console.log('Server has started.', `${hostname}:${port}`)
    })
}
